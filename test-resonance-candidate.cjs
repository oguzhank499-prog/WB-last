const assert=require('node:assert/strict');const {step,resonanceCandidate}=require('./wb-electron-step.js');
const carbox={atoms:[{el:'O',lp:2},{el:'C',lp:0},{el:'O',lp:3}],bonds:[{a:0,b:1,order:2},{a:1,b:2,order:1}],arrows:[['a2','b1'],['b0','a0']]};
const r=step(carbox);assert.equal(r.ok,true);assert.equal(resonanceCandidate(carbox,r.product).candidate,true);
const cleavage=step({atoms:[{el:'H',lp:0},{el:'Cl',lp:3}],bonds:[{a:0,b:1,order:1}],arrows:[['b0','a1']]});assert.equal(cleavage.ok,true);assert.equal(resonanceCandidate({atoms:[{el:'H',lp:0},{el:'Cl',lp:3}],bonds:[{a:0,b:1,order:1}]},cleavage.product).candidate,false);
assert.equal(resonanceCandidate(carbox,carbox).candidate,false);
assert.equal(resonanceCandidate(carbox,{atoms:carbox.atoms.slice(1),bonds:[]}).candidate,false);
assert.equal(resonanceCandidate(null,carbox).candidate,false);
console.log('5 resonance classification checks passed');
