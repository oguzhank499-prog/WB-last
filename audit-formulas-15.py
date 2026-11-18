"""Validate syntax and atom symbols for all curated WB formula entries. Not proof of chemical existence."""
import json,subprocess,re,collections,sys
from rdkit import Chem
from pathlib import Path
base=Path(__file__).parent
script=r'''const fs=require('fs'),vm=require('vm');const s=fs.readFileSync('app.js','utf8'),c={Math};vm.createContext(c);vm.runInContext(s.slice(0,s.indexOf('const lewisDiagrams='))+';globalThis.out=db.filter(x=>!x.cation).map(x=>({formula:x.formula,name:x.name,group:x.group}));',c);console.log(JSON.stringify(c.out));'''
items=json.loads(subprocess.check_output(['node','-e',script],cwd=base,text=True))
subtrans=str.maketrans('₀₁₂₃₄₅₆₇₈₉','0123456789')
suptrans=str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹','0123456789')
periodic=Chem.GetPeriodicTable()
errors=[];groups=collections.Counter()
def parse(formula):
    f=formula.translate(subtrans)
    # Strip ionic charge BEFORE converting superscript digits to avoid reading charge magnitude as atom count.
    f=re.sub(r'[⁰¹²³⁴⁵⁶⁷⁸⁹]*[⁺⁻]|[⁺⁻][⁰¹²³⁴⁵⁶⁷⁸⁹]*|[+−-]$', '', f)
    f=f.translate(suptrans)
    f=f.replace('·','.')
    for part in f.split('.'):
        if not part: raise ValueError('empty hydrate part')
        part=re.sub(r'^\d+(?=[A-Z(])','',part)
        stack=[collections.Counter()];i=0
        while i<len(part):
            ch=part[i]
            if ch=='(':
                stack.append(collections.Counter());i+=1
            elif ch==')':
                if len(stack)==1:raise ValueError('unmatched )')
                i+=1;m=re.match(r'\d+',part[i:]);mult=int(m.group()) if m else 1;i+=len(m.group()) if m else 0
                if mult<1:raise ValueError('zero multiplier')
                for sym,n in stack.pop().items():stack[-1][sym]+=n*mult
            elif ch.isupper():
                m=re.match(r'[A-Z][a-z]?',part[i:]);sym=m.group();i+=len(sym)
                if periodic.GetAtomicNumber(sym)==0:raise ValueError('unknown atom '+sym)
                n=re.match(r'\d+',part[i:]);mult=int(n.group()) if n else 1;i+=len(n.group()) if n else 0
                if mult<1:raise ValueError('zero subscript')
                stack[-1][sym]+=mult
            else:raise ValueError('unexpected character '+repr(ch))
        if len(stack)!=1:raise ValueError('unclosed parenthesis')
        if not stack[0]:raise ValueError('no atoms')
for item in items:
    groups[item['group']]+=1
    try:parse(item['formula'])
    except Exception as exc:errors.append({'formula':item['formula'],'reason':str(exc)})
report={'curatedRecords':len(items),'groupCounts':dict(groups),'syntaxAndAtomSymbolFailures':errors,'scope':'Validates chemical formula syntax and element symbols against RDKit; does NOT verify nomenclature, chemical stability, oxidation states, existence or independent scholarly accuracy.'}
(base/'formula-audit-15.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
if errors:sys.exit(1)
