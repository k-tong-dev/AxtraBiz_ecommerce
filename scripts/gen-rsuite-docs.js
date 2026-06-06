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

// ─── Generate consolidated PROPS.md ──────────────────────────────
let total = 0;
let md = `# RSuite Components — Props Reference\n\n`;
md += `Auto-generated from rsuite type definitions. Each component links to its official rsuite documentation.\n\n`;
md += `---\n\n`;

const allComponents = [];

for (const [cat, comps] of Object.entries(categoryCache)) {
  md += `## ${CATEGORY_LABELS[cat] || cat}\n\n`;

  for (const comp of [...comps].sort()) {
    total++;
    const { props, note } = extractProps(comp);
    const compUrl = `https://rsuitejs.com/components/${comp.toLowerCase()}/#props`;

    md += `### ${comp}\n\n`;
    md += `**Source:** \`@/components/ui/RSuite/${cat}/${comp}\` | [rsuite docs](${compUrl})\n\n`;

    if (note) {
      md += `> **Note:** ${note}\n\n`;
    }

    md += `| Prop | Type | Required | Inherited From |\n`;
    md += `|------|------|----------|----------------|\n`;

    if (props.length === 0) {
      md += `| — | — | — | — |\n`;
    } else {
      props.sort((a, b) => {
        if (a.required !== b.required) return a.required ? -1 : 1;
        if (a.inheritedFrom !== b.inheritedFrom) {
          if (a.inheritedFrom === `${comp}Props`) return -1;
          if (b.inheritedFrom === `${comp}Props`) return 1;
        }
        return a.name.localeCompare(b.name);
      });

      for (const p of props) {
        const required = p.optional ? '' : '✓';
        const source = p.inheritedFrom || '—';
        md += `| \`${p.name}\` | \`${p.type}\` | ${required} | \`${source}\` |\n`;
      }
    }

    md += `\n`;
    allComponents.push({ cat, comp, props: props.length });
    console.log(`✓ ${comp} (${props.length} props)`);
  }
}

// Write consolidated file
fs.writeFileSync(path.join(OUR_DIR, 'PROPS.md'), md);

// Summary
console.log(`\nDone: ${total} components documented in PROPS.md`);
