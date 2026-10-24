const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
for(const script of scripts)new vm.Script(script);
const source=scripts.join('\n');
// Read real production function declarations, not test copies of algorithms.
function fn(name){
 let start=source.indexOf('function '+name+'(');assert(start>=0,name);if(source.slice(start-6,start)==='async ')start-=6;
 let end=source.indexOf('\n',start);
 while(end>=0){const candidate=source.slice(start,end);try{new vm.Script('('+candidate+')');return candidate;}catch{}end=source.indexOf('\n',end+1);}
 throw Error('Cannot extract '+name);
}
const elements=new Map();
const c=vm.createContext({console,Uint8Array,Map,Set,Error,Date,alert:()=>{},
 $:id=>{if(!elements.has(id))elements.set(id,{textContent:'',disabled:false});return elements.get(id)},
 sync:()=>{},hexView:()=>{},note:()=>{},getFlashGroups:()=>[],name:id=>String(id),msg:(el,text)=>el.textContent=text});
vm.runInContext(`
const u16=(d,x)=>d[x]|d[x+1]<<8,u32=(d,x)=>(d[x]|d[x+1]<<8|d[x+2]<<16|d[x+3]<<24)>>>0;
const sectionLengths=[0xF24,0xF80,0xF80,0xF80,0xEE8,0xF80,0xF80,0xF80,0xF80,0xF80,0xF80,0xF80,0xF80,0x7D0];
const pockets=[['Items',42],['Key Items',30],['Balls',13],['TMs',58],['Berries',43]],offsets=[0,168,288,340,572];
let work,original,loaded=true,snapshotSafe=false,unsavedInventory=null,copies=[],flashSectors=[],undoStack=[],monDirty=false,badgeDirty=false,nameDirty=false;
${['checksum','inspectCartridgeSave','patch','patch16','getItems','unsavedValidBagPocket','detectUnsavedLiveBag','refreshChecksums','snapshot','quickAddBalls','undo'].map(fn).join('\n')}
`,c);
const evaluate=s=>vm.runInContext(s,c);
function w16(d,o,v){d[o]=v&255;d[o+1]=v>>>8&255;}
function w32(d,o,v){for(let i=0;i<4;i++)d[o+i]=v>>>(i*8)&255;}
function fixture(){const d=new Uint8Array(0x20000).fill(255);for(let bank=0;bank<2;bank++)for(let slot=0;slot<14;slot++){
const base=(bank*14+slot)*4096,id=(slot+5)%14;d.fill(0,base,base+4096);d[base]=slot+1;
w16(d,base+0xff4,id);w32(d,base+0xff8,0x08012025);w32(d,base+0xffc,bank+7);
c.input=d;c.base=base;c.id=id;w16(d,base+0xff6,evaluate('checksum(input,base,sectionLengths[id])'));}return d;}
const good=fixture(),before=good.slice();c.input=good;
assert.equal(evaluate('inspectCartridgeSave(input).banks.length'),2);assert.deepEqual(good,before);
const inspect=d=>{c.input=d;return evaluate('inspectCartridgeSave(input)')};
for(const size of [0,65536,131071,131073,2102280])assert.throws(()=>inspect(new Uint8Array(size)),/128 KiB/);
const corrupt=good.slice();corrupt[0]^=1;assert.equal(inspect(corrupt).banks.length,1);corrupt[14*4096]^=1;assert.throws(()=>inspect(corrupt),/No complete/);
const mixed=good.slice();w32(mixed,0xffc,42);w32(mixed,14*4096+0xffc,42);assert.throws(()=>inspect(mixed),/No complete/);
const duplicate=good.slice();w16(duplicate,4096+0xff4,5);w16(duplicate,15*4096+0xff4,5);assert.throws(()=>inspect(duplicate),/No complete/);
const signature=good.slice();signature[0xff8]=0;signature[14*4096+0xff8]=0;assert.throws(()=>inspect(signature),/No complete/);
// Real RAM bag detector + transaction; no saved FLASH and no Pokemon writes.
evaluate(`work=new Uint8Array(2102280);const bag=0x2de27,key=0x54f4;
for(let p=0;p<5;p++)for(let i=0;i<pockets[p][1];i++){const o=bag+offsets[p]+i*4;work[o+2]=key&255;work[o+3]=key>>>8;}
function item(o,id,q){work[o]=id&255;work[o+1]=id>>>8;work[o+2]=(q^key)&255;work[o+3]=(q^key)>>>8;}
item(bag,13,1);item(bag+168,364,1);item(bag+172,365,1);work[bag-0x7c]=key&255;work[bag-0x7b]=key>>>8;
original=work.slice();unsavedInventory=detectUnsavedLiveBag();copies=[unsavedInventory];`);
assert.equal(evaluate('unsavedInventory.start'),0x2de27);
assert.throws(()=>evaluate('patch(0,Uint8Array.of(1),[])'),/only permits/);
assert.throws(()=>evaluate('patch(unsavedInventory.start-1,Uint8Array.of(1,2),[])'),/only permits/);
assert.throws(()=>evaluate('patch(unsavedInventory.start+743,Uint8Array.of(1,2),[])'),/only permits/);
evaluate('quickAddBalls()');
assert.equal(evaluate('undoStack.length'),1);
assert.equal(evaluate('getItems(work,copies[0],2).find(x=>x.id===4).qty'),15);
assert.equal(evaluate('getItems(work,copies[0],2).find(x=>x.id===3).qty'),15);
assert(evaluate('work.every((v,i)=>v===original[i]||(i>=unsavedInventory.start+288&&i<unsavedInventory.start+340))'));
evaluate('undo()');assert(evaluate('work.every((v,i)=>v===original[i])'));assert.equal(evaluate('undoStack.length'),0);
// Critical pre-existing Coach guards remain on the exact transaction path.
const plan=fn('gymCoachBuildSwapPlan'),swap=fn('gymCoachBuildAndSwap');
assert.match(plan,/repairBytesEqual\(full\[follower.index\],activeParty\[follower.index\]\)/);
assert.match(swap,/confirm\(gymCoachBuildSwapPreview\(plan\)\)/);
assert.match(swap,/work.set\(changes\[i\].old,changes\[i\].offset\)/);
console.log('PASS: inline syntax, SAV banks and errors, non-mutating inspection, RAM-only patch bounds, live detector, +15 ball transaction, Undo and Coach guard checks.');

vm.runInContext('let savReadSequence=0; '+fn('inspectSAVFile'),c);
(async()=>{
 const inspectFile=vm.runInContext('inspectSAVFile',c);
 await inspectFile({name:'good.sav',size:good.length,arrayBuffer:async()=>good.buffer});
 assert.match(elements.get('savStatus').textContent,/2 complete/);assert.equal(elements.get('savGuide').open,true);
 await inspectFile({name:'bad.sav',size:10,arrayBuffer:async()=>new ArrayBuffer(10)});
 assert.match(elements.get('savStatus').textContent,/128 KiB/);assert.equal(elements.get('savGuide').open,false);
 let release;const old=inspectFile({name:'old.sav',size:good.length,arrayBuffer:()=>new Promise(r=>release=r)});
 await inspectFile({name:'latest.sav',size:1});release(good.buffer);await old;
 assert.match(elements.get('savStatus').textContent,/128 KiB/);assert.equal(elements.get('savGuide').open,false);
 assert(evaluate('work.every((v,i)=>v===original[i])'));
 console.log('PASS: async upload success/error/reset, stale read suppression and unchanged editor.');
})().catch(e=>{console.error(e);process.exitCode=1;});
