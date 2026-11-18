'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(__dirname+'/app.js','utf8');const ctx={Math,console};vm.createContext(ctx);
vm.runInContext(src.slice(0,src.indexOf('const lewisDiagrams='))+';globalThis.audit12={db,extra,cat,an,ionicFormula,raw};',ctx);
const {db,extra,cat,an,ionicFormula,raw}=ctx.audit12;
const checks={atomic:0,oxidation:0,polyion:0,manual:0};
const bySymbol=new Map(db.filter(x=>x.group==='element').map((e,i)=>[e.formula,i+1]));
for(const q of extra){
 assert(q.options.includes(q.correct),'Correct option missing '+q.id);
 if(q.id.startsWith('atomic-')){
  const number=Number(q.id.slice(7));const e=db.filter(x=>x.group==='element')[number-1];
  assert(e&&q.prompt===e.name+' elementinin atom numarası kaçtır?'&&q.correct===String(number),'Atomic number mismatch '+q.id);checks.atomic++;
 }else if(q.id.startsWith('ox-')){
  const formula=q.id.slice(3);const pair=cat.flatMap(c=>an.filter(a=>a[0]==='O'||a[0]==='Cl').map(a=>({c,a}))).find(({c,a})=>ionicFormula(c,a)===formula);
  assert(pair&&q.correct==='+'+pair.c[1],'Oxidation mismatch '+q.id);
  assert(q.explanation.includes('−'+pair.a[1]),'Anion explanation mismatch '+q.id);checks.oxidation++;
 }else if(q.id.startsWith('polycharge-')){
  const formula=q.id.slice(11);const row=raw.split('\n').map(x=>x.split('|')).find(x=>x[0]===formula&&x[3]==='poly');
  assert(row,'Unknown polyatomic ion '+q.id);
  const value=Number(row[2]);assert(q.correct===(value>0?'+':'−')+Math.abs(value),'Ion charge mismatch '+q.id);checks.polyion++;
 }else checks.manual++;
}
const generated=db.filter(x=>x.cation);
assert(generated.length===708);
console.log(JSON.stringify({status:'PASS',checks,reviewedByRules:checks.atomic+checks.oxidation+checks.polyion,manualQuestionsStillRequireIndependentScientificReview:checks.manual,generatedIonicFormulasRequireRealWorldExistenceReview:generated.length},null,2));
