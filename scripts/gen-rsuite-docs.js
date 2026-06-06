const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const RSUITE_DIR = path.join(process.cwd(), 'node_modules/rsuite/esm');
const OUR_DIR = path.join(process.cwd(), 'components/ui/RSuite');
const CATEGORY_LABELS = {
  Buttons: 'Buttons',
  DataDisplay: 'Data Display',
  DataEntry: 'Data Entry',
  DataPickers: 'Data Pickers',
  DateAndTime: 'Date and Time',
  Form: 'Form',
  Layout: 'Layout',
  Navigation: 'Navigation',
  Overlays: 'Overlays',
  Status: 'Status',
  Misc: 'Miscellaneous',
};

// ─── Cache parsed source files ──────────────────────────────────
const parsedCache = new Map();

function parseFile(filePath) {
  if (parsedCache.has(filePath)) return parsedCache.get(filePath);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  const sf = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  parsedCache.set(filePath, sf);
  return sf;
}

function formatType(typeNode) {
  if (!typeNode) return '—';
  return typeNode.getText().replace(/\s+/g, ' ')
    .replace(/ \| /g, ' \\| ')
    .replace(/</g, '\\<')
    .replace(/>/g, '\\>')
    .replace(/,/g, ', ');
}

function extractJsDoc(node) {
  const tags = ts.getJSDocTags(node);
  if (tags.length > 0) return tags.map(t => String(t.comment || '')).join(' ');
  const comment = ts.getJSDocCommentsAndTags(node);
  if (comment.length > 0) return comment.map(c => c.text || '').join(' ').trim();
  return '';
}

function getInterface(sf, name) {
  if (!sf) return null;
  function findIn(stmts) {
    for (const stmt of stmts) {
      if (ts.isInterfaceDeclaration(stmt) && stmt.name.text === name) return stmt;
      if (ts.isModuleDeclaration(stmt) && stmt.body) {
        const found = findIn(Array.from(stmt.body.statements));
        if (found) return found;
      }
    }
    return null;
  }
  return findIn(Array.from(sf.statements));
}

function getTypeAlias(sf, name) {
  if (!sf) return null;
  for (const stmt of sf.statements) {
    if (ts.isTypeAliasDeclaration(stmt) && stmt.name.text === name) return stmt;
  }
  return null;
}

// ─── Heritage walking ───────────────────────────────────────────

function resolveHeritageClauses(iface, compName, filePath) {
  const results = [];
  if (!iface.heritageClauses) return results;
  for (const clause of iface.heritageClauses) {
    for (const t of clause.types) {
      const expr = t.expression.getText();
      if (expr === 'React') continue;
      const typeArgs = t.typeArguments ? t.typeArguments.map(a => a.getText()) : [];
      results.push({ baseName: expr, typeArgs, fullText: t.getText() });
    }
  }
  return results;
}

// Split top-level comma-separated args respecting angle brackets
function splitArgs(text) {
  const result = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '<') depth++;
    else if (ch === '>') depth--;
    else if (ch === ',' && depth === 0) {
      result.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) result.push(current.trim());
  return result;
}

// Extract just the base type name, stripping generic parameters
function stripGenerics(text) {
  const m = text.match(/^(\w+)/);
  return m ? m[1] : text;
}

function parseOmit(fullText) {
  const m = fullText.match(/^Omit<(.*)>$/s);
  if (!m) return null;
  const args = splitArgs(m[1]);
  if (args.length < 2) return null;
  const base = stripGenerics(args[0]);
  const omit = args.slice(1).join(', ').replace(/'/g, '').split(/\s*\|\s*/).map(s => s.trim());
  return { base, omit };
}

function parsePick(fullText) {
  const m = fullText.match(/^Pick<(.*)>$/s);
  if (!m) return null;
  const args = splitArgs(m[1]);
  if (args.length < 2) return null;
  const base = stripGenerics(args[0]);
  const pick = args.slice(1).join(', ').replace(/'/g, '').split(/\s*\|\s*/).map(s => s.trim());
  return { base, pick };
}

// Build a map of all type definitions in rsuite for fast lookup
let typeMap = null;

function buildTypeMap() {
  if (typeMap) return typeMap;
  typeMap = new Map();

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, entry);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (entry.endsWith('.d.ts') && entry !== 'index.d.ts') {
        const sf = parseFile(fullPath);
        if (!sf) continue;
        ts.forEachChild(sf, (node) => {
          if (ts.isInterfaceDeclaration(node)) {
            typeMap.set(node.name.text, { iface: node, filePath: fullPath });
          }
          if (ts.isTypeAliasDeclaration(node)) {
            typeMap.set(node.name.text, { iface: node, filePath: fullPath, isAlias: true });
          }
        });
      }
    }
  }

  // Walk the entire esm directory for type definitions
  walk(RSUITE_DIR);
  return typeMap;
}

function findInterfaceInRsuite(name) {
  const map = buildTypeMap();
  return map.get(name) || null;
}

function extractTypeMembers(typeNode, inheritedFrom, visited) {
  const result = [];
  if (!typeNode) return result;

  // Object type literal: { prop: type; ... }
  if (ts.isTypeLiteralNode(typeNode)) {
    for (const member of typeNode.members) {
      if (ts.isPropertySignature(member) || ts.isMethodSignature(member)) {
        result.push({
          name: member.name.getText(),
          type: formatType(member.type),
          desc: extractJsDoc(member),
          optional: !!member.questionToken,
          inheritedFrom,
        });
      }
    }
    return result;
  }

  // Intersection type: A & B
  if (ts.isIntersectionTypeNode(typeNode)) {
    for (const t of typeNode.types) {
      const sub = extractTypeMembers(t, inheritedFrom, visited);
      for (const s of sub) {
        if (!result.find(r => r.name === s.name)) result.push(s);
      }
    }
    return result;
  }

  // Named type reference: SomeType<...>
  if (ts.isTypeReferenceNode(typeNode)) {
    const refName = typeNode.typeName.getText();
    const refInfo = findInterfaceInRsuite(refName);
    if (refInfo) {
      const sub = extractAllProps(refInfo, refName, visited);
      for (const s of sub) {
        s.inheritedFrom = refName;
        if (!result.find(r => r.name === s.name)) result.push(s);
      }
    }
    return result;
  }

  return result;
}

function extractAllProps(wrapper, name, visited = new Set()) {
  const result = [];
  if (visited.has(name)) return result;
  visited.add(name);
  if (!wrapper || !wrapper.iface) return result;

  const filePath = wrapper.filePath || '';

  // Handle type aliases
  if (wrapper.isAlias) {
    const sub = extractTypeMembers(wrapper.iface.type, name, visited);
    result.push(...sub);
    return result;
  }

  // Direct props from interface
  for (const member of wrapper.iface.members) {
    if (ts.isPropertySignature(member) || ts.isMethodSignature(member)) {
      const propName = member.name.getText();
      const propType = formatType(member.type);
      const desc = extractJsDoc(member);
      const optional = member.questionToken ? true : false;
      result.push({ name: propName, type: propType, optional, desc, inheritedFrom: name });
    }
  }

  // Walk heritage clauses
  const heritageList = resolveHeritageClauses(wrapper.iface, name, filePath);
  for (const h of heritageList) {
    const inheritedProps = extractPropsFromTypeRef(h, visited);
    for (const p of inheritedProps) {
      if (!result.find(r => r.name === p.name)) {
        result.push(p);
      }
    }
  }

  return result;
}

function extractPropsFromTypeRef(typeRef, visited = new Set()) {
  const props = [];

  // Handle Omit
  const omit = parseOmit(typeRef.fullText);
  if (omit) {
    const baseInfo = findInterfaceInRsuite(omit.base);
    if (baseInfo) {
      const all = extractAllProps(baseInfo, omit.base, visited);
      const omitSet = new Set(omit.omit.map(s => s.trim()));
      for (const p of all) {
        if (!omitSet.has(p.name)) {
          p.inheritedFrom = omit.base;
          props.push(p);
        }
      }
    }
    return props;
  }

  // Handle Pick
  const pick = parsePick(typeRef.fullText);
  if (pick) {
    const baseInfo = findInterfaceInRsuite(pick.base);
    if (baseInfo) {
      const all = extractAllProps(baseInfo, pick.base, visited);
      const pickSet = new Set(pick.pick.map(s => s.trim()));
      for (const p of all) {
        if (pickSet.has(p.name)) {
          p.inheritedFrom = pick.base;
          props.push(p);
        }
      }
    }
    return props;
  }

  // Handle generic reference like PickerBaseProps<...>
  const baseInfo = findInterfaceInRsuite(typeRef.baseName);
  if (baseInfo) {
    const all = extractAllProps(baseInfo, typeRef.baseName, visited);
    for (const p of all) {
      p.inheritedFrom = typeRef.baseName;
      props.push(p);
    }
  }

  return props;
}

function extractProps(compName) {
  // Try both lowercase component name (as in our folders) and potential different casing
  const candidates = [compName];
  const indexDts = path.join(RSUITE_DIR, 'index.d.ts');
  if (fs.existsSync(indexDts)) {
    const barrel = fs.readFileSync(indexDts, 'utf-8');
    const comps = [...barrel.matchAll(/export \* from '\.\/(\w+)'/g)].map(m => m[1]);
    const compsLC = comps.map(c => c.toLowerCase());
    const idx = compsLC.indexOf(compName.toLowerCase());
    if (idx !== -1 && comps[idx] !== compName) candidates.push(comps[idx]);
  }

  let typeFile = null;
  let actualCompName = compName;
  for (const c of candidates) {
    const tf = path.join(RSUITE_DIR, c, `${c}.d.ts`);
    if (fs.existsSync(tf)) {
      typeFile = tf;
      actualCompName = c;
      break;
    }
  }
  if (!typeFile) return { props: [], note: 'Type definition not found' };

  const sf = parseFile(typeFile);
  if (!sf) return { props: [], note: 'Could not parse type definition' };

  const propsName = `${actualCompName}Props`;
  let iface = getInterface(sf, propsName);

  if (!iface) {
    const alt = [propsName, `${actualCompName}Locale`, `Option`];
    for (const a of alt) {
      iface = getInterface(sf, a);
      if (iface) break;
    }
  }

  if (!iface) return { props: [], note: `Interface ${propsName} not found` };

  // Wrap raw node in the expected format
  const wrapper = { iface, filePath: typeFile };
  const allProps = extractAllProps(wrapper, propsName);

  // Deduplicate by name (first wins = most specific)
  const seen = new Set();
  const deduped = [];
  for (const p of allProps) {
    if (!seen.has(p.name)) {
      seen.add(p.name);
      deduped.push(p);
    }
  }

  return { props: deduped, baseProps: null };
}

// ─── Build category cache ───────────────────────────────────────
const categoryCache = {};
for (const cat of fs.readdirSync(OUR_DIR)) {
  const catPath = path.join(OUR_DIR, cat);
  if (fs.statSync(catPath).isDirectory()) {
    categoryCache[cat] = new Set();
    for (const entry of fs.readdirSync(catPath)) {
      const entryPath = path.join(catPath, entry);
      if (fs.statSync(entryPath).isDirectory()) {
        categoryCache[cat].add(entry);
      }
    }
  }
}

// ─── Generate consolidated docs with deduplicated shared props ──
let total = 0;
let success = 0;

// Collect per-component data
const compEntries = [];

for (const [cat, comps] of Object.entries(categoryCache)) {
  for (const comp of comps) {
    total++;
    const { props, note } = extractProps(comp);

    const ownPropsName = `${comp}Props`;
    const ownProps = props.filter(p => p.inheritedFrom === ownPropsName || !p.inheritedFrom);
    if (ownProps.length === 0) continue;

    // Collect inherited-from names (shared base interfaces)
    const inheritedFrom = new Set(
      props.map(p => p.inheritedFrom).filter(Boolean)
    );
    inheritedFrom.delete(ownPropsName);

    compEntries.push({
      comp,
      cat: CATEGORY_LABELS[cat] || cat,
      ownProps,
      inheritedFrom: [...inheritedFrom].sort(),
    });
    success++;
    console.log(`✓ ${comp} (${ownProps.length} own, ${inheritedFrom.size} inherited)`);
  }
}

// Build output
let fullMd = `# RSuite Component Props\n\n`;
fullMd += `Auto-generated from rsuite type definitions. For each component, only its **own unique props** are listed.\n`;
fullMd += `Props inherited from shared base interfaces (BoxProps, WithAsProps, etc.) are documented once below.\n\n`;
fullMd += `---\n\n`;

// ─── Shared Interfaces Section ────────────────────────────────────
// Collect all unique inherited base interfaces and their props
const sharedInterfaces = new Map();
for (const entry of compEntries) {
  for (const baseName of entry.inheritedFrom) {
    if (!sharedInterfaces.has(baseName)) {
      // Re-extract props for this base interface
      const map = buildTypeMap();
      const wrapper = map.get(baseName);
      if (wrapper) {
        const baseProps = extractAllProps(wrapper, baseName, new Set());
        const directBaseProps = baseProps.filter(p => p.inheritedFrom === baseName || !p.inheritedFrom);
        sharedInterfaces.set(baseName, {
          props: directBaseProps,
          usedBy: [entry.comp],
        });
      }
    } else {
      sharedInterfaces.get(baseName).usedBy.push(entry.comp);
    }
  }
}

if (sharedInterfaces.size > 0) {
  fullMd += `## Shared / Inherited Interfaces\n\n`;
  fullMd += `These base interfaces are inherited by multiple components. Their props are documented here once.\n\n`;

  const sortedShared = [...sharedInterfaces.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  for (const [name, data] of sortedShared) {
    fullMd += `### ${name}\n\n`;
    fullMd += `**Used by:** ${data.usedBy.join(', ')}\n\n`;

    if (data.props.length === 0) {
      fullMd += `No direct props.\n\n`;
    } else {
      data.props.sort((a, b) => {
        if (a.optional !== b.optional) return a.optional ? 1 : -1;
        return a.name.localeCompare(b.name);
      });

      fullMd += `| Prop | Type | Required | Description |\n`;
      fullMd += `|------|------|----------|-------------|\n`;
      for (const p of data.props) {
        const required = p.optional ? '' : '✓';
        const desc = p.desc ? p.desc.replace(/\n/g, ' ') : '';
        fullMd += `| \`${p.name}\` | \`${p.type}\` | ${required} | ${desc} |\n`;
      }
    }
    fullMd += `\n`;
  }
  fullMd += `---\n\n`;
}

// ─── Components Section ───────────────────────────────────────────
fullMd += `## Components (own props only)\n\n`;
fullMd += `Only the unique props for each component. Shared props are documented above.\n\n`;

compEntries.sort((a, b) => {
  if (a.cat !== b.cat) return a.cat.localeCompare(b.cat);
  return a.comp.localeCompare(b.comp);
});

let currentCat = '';
for (const entry of compEntries) {
  if (entry.cat !== currentCat) {
    currentCat = entry.cat;
    fullMd += `### ${currentCat}\n\n`;
  }

  fullMd += `**${entry.comp}**  \n`;
  fullMd += `\`@/components/ui/RSuite/${entry.comp}\`  \n`;
  if (entry.inheritedFrom.length > 0) {
    fullMd += `Inherits: ${entry.inheritedFrom.join(', ')}  \n`;
  }
  fullMd += `\n`;

  entry.ownProps.sort((a, b) => {
    if (a.optional !== b.optional) return a.optional ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  fullMd += `| Prop | Type | Required | Description |\n`;
  fullMd += `|------|------|----------|-------------|\n`;
  for (const p of entry.ownProps) {
    const required = p.optional ? '' : '✓';
    const desc = p.desc ? p.desc.replace(/\n/g, ' ') : '';
    fullMd += `| \`${p.name}\` | \`${p.type}\` | ${required} | ${desc} |\n`;
  }
  fullMd += `\n`;
}

fullMd += `---\n`;
fullMd += `*Auto-generated by \`scripts/gen-rsuite-docs.js\`. Refer to [rsuite documentation](https://rsuitejs.com/components) for full details.*\n`;

const outputPath = path.join(OUR_DIR, 'PROPS.md');
fs.writeFileSync(outputPath, fullMd);
console.log(`\nWritten: ${outputPath}`);
console.log(`Done: ${success}/${total} components with own props. ${sharedInterfaces.size} shared interfaces documented.`);
