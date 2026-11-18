'use strict';
// Independently specified answer key for the 71 hand-authored questions.
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/app.js','utf8');
const context={Math};vm.createContext(context);
vm.runInContext(source.slice(0,source.indexOf('const lewisDiagrams='))+';globalThis.auditQuestions=extra;',context);
const questions=context.auditQuestions.filter(q=>/^(?:x|c|a)\d+$/.test(q.id));
const key={
 x:['+3','+7','+6','+6','1','sp³','1','Doğrusal','Açısal','+1','11','17','3','Soy gaz','+3'],
 c:['sp','2','7','2','+1','+1','Üçgen düzlem','Üçgen çift piramit','Oktahedral','3','Alkol','Aldehit','Keton','Karboksilik asit','Eter','Ester','Amin','Propan','Propen','2-Metilpropan','Propan-1-ol','Propan-2-ol','Propanoik asit','Benzen','NO₂⁺','Katılma'],
 a:['Bütan','Büt-2-en','Propin','Bütanal','Bütan-2-on','Ester','Bütanoik asit','Bromoetan','2-Kloropropan','2-Metilbütan','2,3-Dimetilbütan','Aldehit','Keton','Hidrojenasyon','Nitril','Amid','Nitrobenzen','Eliminasyon','Br₂ katılması','2-Bromo-2-metilpropan','2','2','3','2','3','Tetrahedral','180°','109,5°','sp²','sp³']
};
let count=0;
for(const [prefix,answers] of Object.entries(key))for(let i=0;i<answers.length;i++){
 const id=prefix+i, q=questions.find(q=>q.id===id);
 assert(q,`Missing ${id}`);assert.equal(q.correct,answers[i],`Chemistry answer mismatch: ${id}: ${q.prompt}`);
 assert.equal(q.options.filter(o=>o===answers[i]).length,1,`Expected exactly one correct option: ${id}`);
 assert.equal(new Set(q.options).size,q.options.length,`Duplicate options: ${id}`);
 assert(q.explanation&&q.explanation.length>=20,`Missing/short explanation: ${id}`);
 count++;
}
assert.equal(count,71);assert.equal(questions.length,count);
console.log(JSON.stringify({status:'PASS',handAuthoredQuestionsChecked:count,method:'Explicit independent answer-key cross-check + option uniqueness + explanation presence',limitation:'Explanations checked for presence, not individually verified against external scholarly sources'},null,2));
