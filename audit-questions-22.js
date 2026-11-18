 'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(__dirname+'/app.js','utf8');
const begin=src.indexOf('const curatedConcepts = [');
const end=src.indexOf('const lewisDiagrams=',begin);
assert(begin>=0&&end>begin);
const fragment=src.slice(begin,end).replace(/extra\.push\(\.\.\.(?:curatedConcepts|advancedConcepts)\.map\([^\n]+\);/g,'');
const ctx={};vm.createContext(ctx);
vm.runInContext(fragment+'\nglobalThis.data=[...curatedConcepts,...advancedConcepts];',ctx);
const data=ctx.data;assert.equal(data.length,56);
for(const [group,prompt,correct,options,explanation] of data){
 assert(group&&prompt&&correct&&explanation,'Missing question fields');
 assert.equal(options.length,4,`Option count: ${prompt}`);
 assert.equal(new Set(options).size,4,`Repeated options: ${prompt}`);
 assert.equal(options.filter(x=>x===correct).length,1,`Answer mismatch: ${prompt}`);
 assert(explanation.length>=18,`Short explanation: ${prompt}`);
}
const find=t=>{const r=data.find(x=>x[1].includes(t));assert(r,`Missing ${t}`);return r};
assert.equal(find('NH₄⁺ iyonunda')[2],'+1');
assert.equal(find('H₃O⁺ iyonunda')[2],'+1');
assert.equal(find('NO₃⁻ iyonunun')[2],'3');
assert.equal(find('CO₃²⁻ iyonunun')[2],'3');
assert.equal(find('Benzenin nitrasyonunda')[2],'NO₂⁺');
assert(find('bromlu suyun rengini').at(-1).includes('bromohidrin'));
assert(find('2-Bromopropan + alkollü KOH').at(-1).includes('E2'));
assert(find('2-Metilpropen + HBr').at(-1).includes('tersiyer'));
console.log('PASS: '+data.length+' hand-authored questions have 4 unique choices, one answer, nonempty explanation; 8 chemistry spot checks.');
console.log('LIMITATION: Structural checks do not independently prove all chemical explanations correct.');
