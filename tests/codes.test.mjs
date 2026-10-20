import test from 'node:test';
import assert from 'node:assert/strict';
import {freshSave,validateSave} from '../src/storage.js';
import {redeemCode} from '../src/codes.js';
test('El regalo concede 1000 ecos una vez, persiste y migra guardados anteriores',()=>{
 const save=freshSave();save.progress.echoes=23;save.progress.totalEchoes=50;
 assert.equal(redeemCode(save,'incorrecto').ok,false);assert.equal(save.progress.echoes,23);
 let written;assert.equal(redeemCode(save,' cjmtxd ',next=>{written=JSON.parse(JSON.stringify(next));return true;}).ok,true);
 assert.equal(save.progress.echoes,1023);assert.equal(save.progress.totalEchoes,1050);
 const restored=validateSave(written);assert.equal(redeemCode(restored,'CJMTXD').ok,false);assert.equal(restored.progress.echoes,1023);
 delete written.meta.redeemedCodes;assert.deepEqual(validateSave(written).meta.redeemedCodes,[]);
 written.meta.redeemedCodes=['CJMTXD','CJMTXD','invalid',null];assert.deepEqual(validateSave(written).meta.redeemedCodes,['CJMTXD']);
});
test('Un fallo de guardado o el límite de ecos no consume el código',()=>{
 const save=freshSave();assert.equal(redeemCode(save,'CJMTXD',()=>false).ok,false);assert.equal(save.progress.echoes,0);assert.deepEqual(save.meta.redeemedCodes,[]);
 save.progress.echoes=999001;assert.equal(redeemCode(save,'CJMTXD').ok,false);assert.deepEqual(save.meta.redeemedCodes,[]);
 save.progress.echoes=999000;assert.equal(redeemCode(save,'CJMTXD').ok,true);assert.equal(save.progress.echoes,1000000);
});
