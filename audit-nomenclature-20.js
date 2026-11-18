'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/app.js','utf8');
const ctx={Math};vm.createContext(ctx);
vm.runInContext(source.slice(0,source.indexOf('const lewisDiagrams='))+';globalThis.rows=db;',ctx);
const rows=ctx.rows;
const expected={
'NaCl':'Sodyum klorür','KBr':'Potasyum bromür','MgO':'Magnezyum oksit',
'CaCl₂':'Kalsiyum klorür','Al₂O₃':'Alüminyum oksit',
'FeCl₂':'Demir(II) klorür','FeCl₃':'Demir(III) klorür',
'CuCl':'Bakır(I) klorür','CuCl₂':'Bakır(II) klorür',
'FeO':'Demir(II) oksit','Fe₂O₃':'Demir(III) oksit',
'Cu₂O':'Bakır(I) oksit','CuO':'Bakır(II) oksit',
'Na₂SO₄':'Sodyum sülfat','Na₂SO₃':'Sodyum sülfit',
'NaNO₃':'Sodyum nitrat','NaNO₂':'Sodyum nitrit',
'CaCO₃':'Kalsiyum karbonat','NaHCO₃':'Sodyum hidrojen karbonat',
'Al₂(SO₄)₃':'Alüminyum sülfat','Fe₂(SO₄)₃':'Demir(III) sülfat',
'FeSO₄':'Demir(II) sülfat','CuSO₄':'Bakır(II) sülfat',
'CuSO₃':'Bakır(II) sülfit','Ca₃(PO₄)₂':'Kalsiyum fosfat',
'(NH₄)₂SO₄':'Amonyum sülfat','NH₄NO₃':'Amonyum nitrat',
'KMnO₄':'Potasyum permanganat','K₂Cr₂O₇':'Potasyum dikromat',
'NaOH':'Sodyum hidroksit','KOH':'Potasyum hidroksit',
'Ca(OH)₂':'Kalsiyum hidroksit','Ba(OH)₂':'Baryum hidroksit',
'CuSO₄·5H₂O':'Bakır(II) sülfat pentahidrat',
'CoCl₂·6H₂O':'Kobalt(II) klorür hekzahidrat',
'Na₂CO₃·10H₂O':'Sodyum karbonat dekahidrat'
};
for(const [formula,name] of Object.entries(expected)){
 const matches=rows.filter(x=>!x.cation&&x.formula===formula);
 assert.equal(matches.length,1,`Missing or duplicate ${formula}`);
 assert.equal(matches[0].name,name,`Name mismatch ${formula}`);
}
const ions={'H⁺':1,'Na⁺':1,'K⁺':1,'Mg²⁺':2,'Ca²⁺':2,'Al³⁺':3,'Fe²⁺':2,'Fe³⁺':3,'Cu⁺':1,'Cu²⁺':2,'Cl⁻':-1,'O²⁻':-2,'SO₄²⁻':-2,'SO₃²⁻':-2,'NO₃⁻':-1,'NO₂⁻':-1,'CO₃²⁻':-2,'HCO₃⁻':-1,'PO₄³⁻':-3,'NH₄⁺':1,'OH⁻':-1,'MnO₄⁻':-1,'Cr₂O₇²⁻':-2};
for(const [formula,charge] of Object.entries(ions)){
 const r=rows.find(x=>x.formula===formula&&!x.cation);
 assert(r,`Missing ion ${formula}`);assert.equal(r.charge,charge,`Wrong charge ${formula}`);
}
console.log(JSON.stringify({status:'PASS',manuallySpecifiedCompoundFormulaNamePairs:Object.keys(expected).length,ionChargeChecks:Object.keys(ions).length,limitations:'Curated rule/reference cross-check, not external literature verification or proof of chemical stability.'},null,2));
