'use strict';const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');const core=require('./wb42-core');let tests=0;function test(name,fn){fn();tests++;console.log('PASS',name)}function near(a,b){assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`)}
test('H2 + O2 -> H2O, 3 mol H2 + 2 mol O2',()=>{const r=core.limitingReagent(3,2,2,1,2);assert.equal(r.limiting,'A');near(r.productMoles,3);near(r.remainingB,.5)});
test('exact stoichiometric mixture',()=>{const r=core.limitingReagent(4,2,2,1,2);assert.equal(r.limiting,'both');near(r.remainingA,0);near(r.remainingB,0)});
test('zero reactant gives zero product',()=>near(core.limitingReagent(0,2,2,1,2).productMoles,0));
test('reject fractional coefficient',()=>assert.throws(()=>core.limitingReagent(2,1.5,2,1,1)));
test('dilution C1V1=C2V2',()=>near(core.dilution(.2,50,100),.1));
test('acid pH 0.01 M',()=>near(core.phStrongAcid(.01),2));
test('base pH 0.01 M at 25 C',()=>near(core.phStrongBase(.01),12));
test('reject dilute strong acid approximation',()=>assert.throws(()=>core.phStrongAcid(1e-8)));
test('CH4 tetrahedral',()=>assert.equal(core.electronGeometry(4,0).molecularGeometry,'Dörtyüzlü'));
test('NH3 trigonal pyramidal',()=>assert.equal(core.electronGeometry(4,1).molecularGeometry,'Üçgen piramit'));
test('H2O bent',()=>assert.equal(core.electronGeometry(4,2).molecularGeometry,'Açısal'));
test('CO2 linear',()=>assert.equal(core.electronGeometry(2,0).molecularGeometry,'Doğrusal'));
test('SF6 octahedral',()=>assert.equal(core.electronGeometry(6,0).molecularGeometry,'Sekizyüzlü'));
test('XeF4 square planar',()=>assert.equal(core.electronGeometry(6,2).molecularGeometry,'Kare düzlem'));
test('reject invalid electron regions',()=>assert.throws(()=>core.electronGeometry(4,4)));
test('script syntax',()=>{for(const file of fs.readdirSync(__dirname).filter(f=>f.endsWith('.js')&&f!=='sw.js'&&f!=='verify.js'))new vm.Script(fs.readFileSync(path.join(__dirname,file),'utf8'),{filename:file})});
test('service worker contains all script assets',()=>{const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');const sw=fs.readFileSync(path.join(__dirname,'sw.js'),'utf8');for(const match of html.matchAll(/<script src="([^"]+)"/g)){assert.ok(fs.existsSync(path.join(__dirname,match[1])));assert.ok(sw.includes("'./"+match[1]+"'"),match[1]+' not precached')}});
console.log(`TOTAL ${tests} tests passed`);
