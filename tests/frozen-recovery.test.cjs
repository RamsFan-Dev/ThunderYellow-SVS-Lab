const test=require('node:test'),assert=require('node:assert/strict');
const engine=require('../frozen-recovery.js');
const sizes=[0xf24,0xf80,0xf80,0xf80,0xee8,...Array(8).fill(0xf80),0x7d0];
function set16(d,p,n){d[p]=n&255;d[p+1]=n>>>8}
function set32(d,p,n){for(let j=0;j<4;j++)d[p+j]=(n>>>(j*8))&255}
function fixture(){
 const save=new Uint8Array(131072),raw=new Uint8Array(2102280),base=561692,sections=[];
 for(let side=0;side<2;side++)for(let id=0;id<14;id++){
  const p=(side*14+id)*4096;
  set16(save,p+0xff4,id);set32(save,p+0xff8,0x08012025);set32(save,p+0xffc,160+side);
  set16(save,p+0xff6,0);
  sections.push({base:base+p,id,size:sizes[id]});
 }
 raw.set(save,base);return {save,raw,sections};
}
test('recognizes both FLASH slots and offers exact fallback without live memory',()=>{
 const {raw,sections,save}=fixture();
 assert.equal(engine.validateFlash(save),true);
 const result=engine.build(raw,sections);
 assert.equal(result.latest,null);
 assert.ok(result.error.includes('trainer'));
 assert.deepEqual(result.fallback,save);
});
test('blocks malformed sectors and does not silently export a corrupt save',()=>{
 const {raw,sections,save}=fixture();
 save[20]^=1;assert.equal(engine.validateFlash(save),false);
 raw[sections[0].base+10]=77;
 assert.throws(()=>engine.build(raw,sections),/checksum-valid|128 KiB/);
});
test('requires decompressed SVS bytes, not a SAV or compressed file',()=>{
 assert.throws(()=>engine.build(new Uint8Array(128*1024),[]),/decompressed/);
});