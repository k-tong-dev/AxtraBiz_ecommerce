const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const RSUITE_DIR = path.join(process.cwd(), 'node_modules/rsuite/esm');
const OUR_DIR = path.join(process.cwd(), 'components/ui/RSuite');

// Shared internal interfaces that rsuite doesn't document on their website
const SHARED_INTERFACES = [
  'BoxProps',
  'WithAsProps',
  'StandardProps',
  'CSSSystemProps',
  'StandardCSSProps',
  'AnimationEventProps',
  'PickerBaseProps',
  'FormControlBaseProps',
  'FormControlPickerProps',
  'PopupProps',
  'PickerToggleProps',
  'DataProps',
];

// ─── Parsing ────────────────────────────────────────────────────
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

// Build type map
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
            if (!typeMap.has(node.name.text)) typeMap.set(node.name.text, { iface: node, filePath: fullPath });
          }
          if (ts.isTypeAliasDeclaration(node)) {
            if (!typeMap.has(node.name.text)) typeMap.set(node.name.text, { iface: node, filePath: fullPath, isAlias: true });
          }
        });
      }
    }
  }

  walk(RSUITE_DIR);
  return typeMap;
}

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

function resolveHeritageClauses(iface) {
  const results = [];
  if (!iface.heritageClauses) return results;
  for (const clause of iface.heritageClauses) {
    for (const t of clause.types) {
      const expr = t.expression.getText();
      if (expr === 'React') continue;
      results.push({ baseName: expr, fullText: t.getText() });
    }
  }
  return results;
}

function extractTypeMembers(typeNode, inheritedFrom, visited) {
  const result = [];
  if (!typeNode) return result;

  if (ts.isTypeLiteralNode(typeNode)) {
    for (const member of typeNode.members) {
      if (ts.isPropertySignature(member) || ts.isMethodSignature(member)) {
        result.push({
          name: member.name.getText(),
          type: formatType(member.type),
          desc: extractJsDoc(member),
          optional: !!member.questionToken,
        });
      }
    }
    return result;
  }

  if (ts.isIntersectionTypeNode(typeNode)) {
    for (const t of typeNode.types) {
      const sub = extractTypeMembers(t, inheritedFrom, visited);
      for (const s of sub) {
        if (!result.find(r => r.name === s.name)) result.push(s);
      }
    }
    return result;
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    const refName = typeNode.typeName.getText();
    const refInfo = buildTypeMap().get(refName);
    if (refInfo) {
      const sub = extractAllProps(refInfo, refName, visited);
      for (const s of sub) {
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

  if (wrapper.isAlias) {
    const sub = extractTypeMembers(wrapper.iface.type, name, visited);
    result.push(...sub);
    return result;
  }

  for (const member of wrapper.iface.members) {
    if (ts.isPropertySignature(member) || ts.isMethodSignature(member)) {
      result.push({
        name: member.name.getText(),
        type: formatType(member.type),
        desc: extractJsDoc(member),
        optional: !!member.questionToken,
      });
    }
  }

  const heritageList = resolveHeritageClauses(wrapper.iface);
  for (const h of heritageList) {
    const omit = parseOmit(h.fullText);
    if (omit) {
      const baseInfo = buildTypeMap().get(omit.base);
      if (baseInfo) {
        const inherited = extractAllProps(baseInfo, omit.base, visited);
        for (const p of inherited) {
          if (!omit.omit.includes(p.name) && !result.find(r => r.name === p.name)) {
            result.push(p);
          }
        }
      }
      continue;
    }

    const baseInfo = buildTypeMap().get(h.baseName);
    if (baseInfo) {
      const inherited = extractAllProps(baseInfo, h.baseName, visited);
      for (const p of inherited) {
        if (!result.find(r => r.name === p.name)) result.push(p);
      }
    }
  }

  return result;
}

// ─── Generate PROPS.md ──────────────────────────────────────────
buildTypeMap();

let md = `# Undocumented rsuite Shared Props\n\n`;
md += `These props come from internal base interfaces that rsuite does not document on their component pages.\n`;
md += `They are inherited by many components automatically. Only **direct** props of each interface are listed here.\n\n`;
md += `---\n\n`;

for (const name of SHARED_INTERFACES) {
  const wrapper = buildTypeMap().get(name);
  if (!wrapper) {
    md += `## ${name}\n\n*Not found in rsuite types.*\n\n`;
    continue;
  }

  const allProps = extractAllProps(wrapper, name, new Set());
  const directProps = allProps.filter(p => !p.inheritedFrom);

  md += `## ${name}\n\n`;
  if (directProps.length === 0) {
    md += `No direct props (type alias or re-export only).\n\n`;
  } else {
    directProps.sort((a, b) => {
      if (a.optional !== b.optional) return a.optional ? 1 : -1;
      return a.name.localeCompare(b.name);
    });

    md += `| Prop | Type | Required | Description |\n`;
    md += `|------|------|----------|-------------|\n`;
    for (const p of directProps) {
      const required = p.optional ? '' : '✓';
      const desc = p.desc ? p.desc.replace(/\n/g, ' ') : '';
      md += `| \`${p.name}\` | \`${p.type}\` | ${required} | ${desc} |\n`;
    }
  }
  md += `\n`;
}

md += `---\n`;
md += `*Auto-generated by \`scripts/gen-rsuite-docs.js\`.*\n`;

const outputPath = path.join(OUR_DIR, 'PROPS.md');
fs.writeFileSync(outputPath, md);
console.log(`Written: ${outputPath}`);
