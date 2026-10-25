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
const c=vm.createContext({console,Uint8Array,Map,Set,Error,Date,alert:()=>{},fmt:n=>String(n),
 $:id=>{if(!elements.has(id))elements.set(id,{textContent:'',disabled:false});return elements.get(id)},
 sync:()=>{},hexView:()=>{},note:()=>{},getFlashGroups:()=>[],name:id=>String(id),msg:(el,text)=>el.textContent=text});
vm.runInContext(`
const u16=(d,x)=>d[x]|d[x+1]<<8,u32=(d,x)=>(d[x]|d[x+1]<<8|d[x+2]<<16|d[x+3]<<24)>>>0;
const sectionLengths=[0xF24,0xF80,0xF80,0xF80,0xEE8,0xF80,0xF80,0xF80,0xF80,0xF80,0xF80,0xF80,0xF80,0x7D0];
const pockets=[['Items',42],['Key Items',30],['Balls',13],['TMs',58],['Berries',43]],offsets=[0,168,288,340,572];
let work,original,loaded=true,snapshotSafe=false,unsavedInventory=null,copies=[],flashSectors=[],undoStack=[],monDirty=false,badgeDirty=false,nameDirty=false;
${['checksum','patch','patch16','getItems','unsavedValidBagPocket','detectUnsavedLiveBag','refreshChecksums','snapshot','validateInt','applyItem','undo'].map(fn).join('\n')}
`,c);
const evaluate=s=>vm.runInContext(s,c);
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
evaluate('applyItem(4,2,15)');
evaluate('applyItem(3,2,15)');
assert.equal(evaluate('undoStack.length'),2);
assert.equal(evaluate('getItems(work,copies[0],2).find(x=>x.id===4).qty'),15);
assert.equal(evaluate('getItems(work,copies[0],2).find(x=>x.id===3).qty'),15);
assert(evaluate('work.every((v,i)=>v===original[i]||(i>=unsavedInventory.start+288&&i<unsavedInventory.start+340))'));
evaluate('undo()');evaluate('undo()');assert(evaluate('work.every((v,i)=>v===original[i])'));assert.equal(evaluate('undoStack.length'),0);
// Normal quantity editing stays available; export must not be blocked by an unrelated recovery draft.
assert(!html.includes('id="quickAddBalls"'));
assert.doesNotMatch(fn('exportSVS'),/Unapplied recovered Pokémon builds must be applied/);
assert.match(fn('exportSVS'),/was NOT included in this download/);
// Critical pre-existing Coach guards remain on the exact transaction path.
const plan=fn('gymCoachBuildSwapPlan'),swap=fn('gymCoachBuildAndSwap');
assert.match(plan,/repairBytesEqual\(full\[follower.index\],activeParty\[follower.index\]\)/);
assert.match(swap,/confirm\(gymCoachBuildSwapPreview\(plan\)\)/);
assert.match(swap,/work.set\(changes\[i\].old,changes\[i\].offset\)/);
console.log('PASS: inline syntax, RAM-only patch bounds, live detector, normal item quantity edits, Undo, export-draft and Coach guard checks.');
