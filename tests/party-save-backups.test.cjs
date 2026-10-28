const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
for(const script of scripts)new vm.Script(script);
const source=scripts.join('\n');
// Evaluate production function declarations rather than test-only reimplementations.
function fn(name){
 const start=source.indexOf('function '+name+'(');
 assert(start>=0,'Missing production function: '+name);
 let end=source.indexOf('\n',start);
 while(end>=0){
  const candidate=source.slice(start,end);
  try{new vm.Script('('+candidate+')');return candidate;}catch{}
  end=source.indexOf('\n',end+1);
 }
 throw Error('Cannot extract '+name);
}
const work=new Uint8Array(6000),groups=[
 {sectors:new Map([[1,{base:100}]])},
 {sectors:new Map([[1,{base:1100}]])}
];
const party=[25,33,41,52,60,70];
work[100+0x34]=6;work[1100+0x34]=3; // the previous backup legitimately differs
for(let i=0;i<6;i++){
 for(const base of [100+0x38,3000,3800])work[base+i*100]=party[i];
 work[1100+0x38+i*100]=99;
}
const context={
 Uint8Array,Map,Set,Error,work,loaded:true,snapshotSafe:true,
 monLocations:{groups,partyRAM:[3000],gameplayParty:[3800],pcRAM:[]},
 monIdentity:m=>m?m.pid+':'+m.ot+':'+m.sp:'',
 decodeMon:bytes=>bytes&&bytes[0]?{pid:bytes[0],ot:7,sp:bytes[0]}:null,
 getFlashGroups:()=>groups,
 getPartyFrom:(g,i)=>work.slice(g.sectors.get(1).base+0x38+i*100,g.sectors.get(1).base+0x38+(i+1)*100),
 getPCFrom:()=>new Uint8Array(80),pcRosterSnapshot:()=>[],
 u32:(data,at)=>(data[at]|data[at+1]<<8|data[at+2]<<16|data[at+3]<<24)>>>0,
 isProtected:m=>!!(m&&m.sp===25)
};
context.verifyLivePartyMirrors=()=>{
 const count=work[100+0x34];
 for(let i=0;i<count;i++)if(work[100+0x38+i*100]!==work[3000+i*100]||work[100+0x38+i*100]!==work[3800+i*100])
  throw Error('Verified live/current party mismatch');
 return {groups,mirrors:[3000,3800],count};
};
const sandbox=vm.createContext(context);
vm.runInContext(fn('gymCoachOwned')+'\n'+fn('teamRoster'),sandbox);
function run(expression){return vm.runInContext(expression,sandbox)}
// Older cartridge FLASH group can have old levels, counts, Pokémon or PC data.
// Current FLASH and the LIVE RAM party match, so Coach and Switcher should work.
assert.equal(run('gymCoachOwned().length'),6);
assert.equal(run('teamRoster().party.length'),6);
assert.equal(run('teamRoster().anchor.index'),0);
work[100+0x34]=5;
assert.equal(run('gymCoachOwned().length'),5,'Coach should advise partial parties');
assert.throws(()=>run('teamRoster()'),/needs six Pokémon/,'manual switch needs six party members');
work[100+0x34]=6;
// If live data really disagree with current FLASH, BOTH entry points must block.
work[3000+2*100]=111;
assert.throws(()=>run('gymCoachOwned()'),/live\/current party mismatch/);
assert.throws(()=>run('teamRoster()'),/live\/current party mismatch/);
work[3000+2*100]=party[2];
// Keep protection checks, user confirmation and transaction rollback intact.
assert.match(fn('gymCoachBuildSwapPlan'),/verifyLivePartyMirrors\(\)/);
assert.match(fn('gymCoachBuildSwapPlan'),/repairBytesEqual\(full\[follower.index\],activeParty\[follower.index\]\)/);
assert.doesNotMatch(fn('gymCoachBuildSwapPlan'),/Cartridge save backup identifies a different Pokémon/);
assert.doesNotMatch(fn('gymCoachBuildSwapPlan'),/Cartridge-save PC copies disagree/);
assert.match(fn('gymCoachBuildAndSwap'),/if\(u32\(work,section.base\+0x34\)!==6\)/);
assert.match(fn('gymCoachBuildAndSwap'),/confirm\(gymCoachBuildSwapPreview\(plan\)\)/);
assert.match(fn('gymCoachBuildAndSwap'),/work.set\(changes\[i\].old,changes\[i\].offset\)/);
assert.match(fn('applyPartyPlan'),/if\(u32\(work,section.base\+0x34\)!==6\)/);
console.log('PASS: Gym Coach and manual Party Switcher trust verified current save rather than older backups; safety and rollback retained.');
