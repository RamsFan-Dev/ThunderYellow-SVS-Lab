const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const src=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
function extract(name){
 const start=src.indexOf('function '+name+'(');
 assert.ok(start>=0,'Missing production function '+name);
 let end=src.indexOf('\n',start);
 while(end>=0){
  const candidate=src.slice(start,end);
  try{new vm.Script('('+candidate+')');return candidate;}catch{}
  end=src.indexOf('\n',end+1);
 }
 throw Error('Could not parse '+name);
}
const mapStart=src.indexOf('const gen3NameMap={}'),mapEnd=src.indexOf('let nameDirty=',mapStart);
assert.ok(mapStart>=0&&mapEnd>mapStart);
const context=vm.createContext({Uint8Array,Error,Array,Object,String});
const funcs=['textMon','encodePokemonNickname','withPokemonNickname'];
vm.runInContext(src.slice(mapStart,mapEnd)+'\n'+funcs.map(extract).join('\n')+
 '\nglobalThis.nicknameAPI={textMon,encodePokemonNickname,withPokemonNickname};',context);
const api=context.nicknameAPI;
test('encodes English Generation III names and pads with 0xFF',()=>{
 const bytes=api.encodePokemonNickname('Sparky');
 assert.deepEqual(Array.from(bytes),[0xCD,0xE4,0xD5,0xE6,0xDF,0xED,255,255,255,255]);
 assert.equal(api.textMon(bytes),'Sparky');
});
test('handles all ten characters and special gender and accent glyphs',()=>{
 const ten=api.encodePokemonNickname('1234567890');
 assert.equal(ten.length,10);assert.equal(ten.includes(255),false);
 const accented=api.encodePokemonNickname("Étoile♀");
 assert.equal(accented[0],0x06);
 assert.equal(accented[6],0xB6);
 assert.equal(api.textMon(accented),'Étoile♀');
 assert.equal(api.textMon(api.encodePokemonNickname("Farfetch'd")),"Farfetch'd");
});
test('invalid, unsupported, and overlength names are rejected',()=>{
 for(const name of ['', '   ', 'ABCDEFGHIJK', '⚡Pika', 'Pika🐭']){
  assert.throws(()=>api.encodePokemonNickname(name),/Nickname|Unsupported/);
 }
});
test('renaming changes only nickname bytes, keeps party stats, PID, OT and encrypted checksum',()=>{
 const record=new Uint8Array(100);
 for(let j=0;j<100;j++)record[j]=(j*17+11)&255;
 const before=record.slice(),renamed=api.withPokemonNickname(record,'Buddy');
 assert.equal(renamed.length,100);
 assert.deepEqual(Array.from(renamed.slice(0,8)),Array.from(before.slice(0,8)));
 assert.deepEqual(Array.from(renamed.slice(18)),Array.from(before.slice(18)));
 assert.equal(api.textMon(renamed.subarray(8,18)),'Buddy');
 assert.deepEqual(Array.from(record),Array.from(before),'Input must not be changed');
});
test('nickname controls save through existing Pokémon editing flow',()=>{
 for(const id of ['monNickname','monNicknameSpecies','monNicknameHelp'])assert.ok(html.includes('id="'+id+'"'));
 assert.ok(src.includes('if(nicknameEdited)next=withPokemonNickname(next,requestedNickname)'));
 assert.ok(src.includes("applySlot(next,patches);refreshChecksums(patches);"));
 assert.ok(src.includes("if(nicknameEdited&&checkMon?.name!==requestedNickname.normalize('NFC').trim())"));
});
