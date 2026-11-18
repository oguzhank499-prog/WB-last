'use strict';
const assert=require('node:assert/strict');
const {phStrongWithWater}=require('./wb42-core.js');
const close=(actual,expected,tol=1e-9)=>assert(Math.abs(actual-expected)<tol,`${actual} != ${expected}`);
// Independent charge/mass balance reference for acid/base solutions at 25 C.
for(const c of [0,1e-12,1e-10,1e-8,1e-7,1e-6,1e-4,1e-2,1]){
 for(const type of ['acid','base']){
  const ph=phStrongWithWater(c,type),h=10**(-ph),oh=1e-14/h;
  close(h*oh,1e-14,1e-20);
  close(type==='acid'?h-oh:oh-h,c,Math.max(1e-10*c,1e-13));
  if(c===0)close(ph,7);
 }
}
close(phStrongWithWater(1e-2,'acid'),2,1e-8);
close(phStrongWithWater(1e-2,'base'),12,1e-8);
assert(phStrongWithWater(1e-8,'acid')<7);
assert(phStrongWithWater(1e-8,'base')>7);
assert.throws(()=>phStrongWithWater(-1,'acid'));
assert.throws(()=>phStrongWithWater(1,'salt'));
console.log('PASS: 18 concentration/type cases; water ion product, electroneutrality, dilute and concentrated limits, invalid inputs');
