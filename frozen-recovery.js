/* ThunderYellow SVS Lab: frozen-state rescue to a .sav cartridge file. */
(function(root) {
 'use strict';
 const SIZES=[0xF24,0xF80,0xF80,0xF80,0xEE8,0xF80,0xF80,0xF80,0xF80,0xF80,0xF80,0xF80,0xF80,0x7D0],SECTOR=4096,FLASH=131072;
 const u16=(d,p)=>d[p]|(d[p+1]<<8),u32=(d,p)=>(d[p]|(d[p+1]<<8)|(d[p+2]<<16)|(d[p+3]<<24))>>>0;
 const same=(a,p,b,q,n)=>{for(let i=0;i<n;i++)if(a[p+i]!==b[q+i])return false;return true};
 const fail=reason=>{throw new Error(reason)};
 function checksum(d,p,size){let sum=0;for(let j=0;j<size;j+=4)sum=(sum+u32(d,p+j))>>>0;return ((sum>>>16)+(sum&0xffff))&0xffff}
 function mon(d,p){
  if(p<0||p+80>d.length)return null;
  const pid=u32(d,p),ot=u32(d,p+4);
  if(!pid||!ot||pid===0xffffffff||ot===0xffffffff||(d[p+19]&1))return null;
  const key=pid^ot,words=[];
  for(let i=0;i<12;i++)words.push(u32(d,p+32+i*4)^key);
  let total=0;for(let i=0;i<12;i++)total=(total+(words[i]&65535)+(words[i]>>>16))&65535;
  if(total!==u16(d,p+28))return null;
  const perms=['GAEM','GAME','GEAM','GEMA','GMAE','GMEA','AGEM','AGME','AEGM','AEMG','AMGE','AMEG','EGAM','EGMA','EAGM','EAMG','EMGA','EMAG','MGAE','MGEA','MAGE','MAEG','MEGA','MEAG'];
  const species=words[perms[pid%24].indexOf('G')*3]&65535;
  return species>0&&species<=1400?{pid,ot,species}:null;
 }
 function sourceSectors(raw,provided){
  const sectors=(provided||[]).filter(s=>s.base>=0&&s.id>=0&&s.id<14&&s.base+SECTOR<=raw.length&&u32(raw,s.base+0xff8)===0x08012025&&u16(raw,s.base+0xff4)===s.id&&u16(raw,s.base+0xff6)===checksum(raw,s.base,SIZES[s.id]));
  if(sectors.length<28)fail('Both complete, checksum-valid cartridge save slots are required.');
  const byBase=new Map(sectors.map(s=>[s.base,s]));
  for(const entry of sectors)for(let idx=0;idx<28;idx++){
   const base=entry.base-idx*SECTOR;
   if(base<0||base+FLASH>raw.length)continue;
   const slots=[];let valid=true;
   for(let side=0;side<2;side++){
    const ids=new Set(),byId=new Map();let count=null;
    for(let j=0;j<14;j++){
     const sec=byBase.get(base+(side*14+j)*SECTOR);
     if(!sec||ids.has(sec.id)){valid=false;break}
     const ctr=u32(raw,sec.base+0xffc);
     if(count!==null&&count!==ctr){valid=false;break}
     count=ctr;ids.add(sec.id);byId.set(sec.id,sec);
    }
    if(!valid||ids.size!==14){valid=false;break}
    slots.push({count,byId});
   }
   if(valid&&slots.length===2&&slots[0].count!==slots[1].count)return {base,slots,latest:slots[0].count>slots[1].count?0:1};
  }
  fail('No complete, consistently numbered 128 KiB cartridge FLASH image found.');
 }
 function locateTrainer(raw,ref){
  const matches=[];
  for(let p=0x20000;p+0xf24<=Math.min(raw.length,0x90000);p++){
   if(raw[p]===ref[0]&&same(raw,p,ref,0,10)&&u32(raw,p+10)===u32(ref,10)&&u32(raw,p+0xf20))matches.push(p);
  }
  if(matches.length!==1)fail('Live trainer memory is missing or ambiguous ('+matches.length+' matches).');
  return matches[0];
 }
 function locateSaveBlock1(raw,flashParty,ref,key){
  const matches=[];
  for(let p=0x20038;p+0x3d68-0x38<=Math.min(raw.length,0x90000);p++){
   if(u32(raw,p)!==flashParty.pid||u32(raw,p+4)!==flashParty.ot)continue;
   const base=p-0x38,count=u32(raw,base+0x34);
   if(count<1||count>6||!mon(raw,p))continue;
   let ids=0,used=0,plausible=true;
   for(let j=0;j<12;j++){
    const off=0x310+j*4,id=u16(raw,base+off),qty=u16(raw,base+off+2)^key;
    if(qty>999){plausible=false;break}
    if(id){used++;if(id===u16(ref,off))ids++}
   }
   if(plausible&&used>=2&&ids>=6)matches.push(base);
  }
  if(matches.length!==1)fail('Live game SaveBlock1 could not be identified safely ('+matches.length+' matches).');
  return matches[0];
 }
 function locateParty(raw,sb1){
  const first=mon(raw,sb1+0x38),count=u32(raw,sb1+0x34);
  if(!first||count<1||count>6)fail('Live party anchor is invalid.');
  const matches=[];
  for(let pos=0x20000+0x25b;pos+600<=Math.min(raw.length,0x90000);pos++){
   if(u32(raw,pos)!==first.pid||u32(raw,pos+4)!==first.ot||raw[pos-0x25b]!==count)continue;
   let valid=true;
   for(let i=0;i<count;i++){
    const a=mon(raw,pos+i*100),b=mon(raw,sb1+0x38+i*100);
    // Evolution can change species in gameplay RAM before the next save.
    if(!a||!b||a.pid!==b.pid||a.ot!==b.ot){valid=false;break}
   }
   if(valid)matches.push(pos);
  }
  if(matches.length!==1)fail('Current gameplay party could not be verified ('+matches.length+' matches).');
  return {pos:matches[0],count};
 }
 function storageRecord(raw,group,slot){
  const start=4+slot*80,out=new Uint8Array(80);
  for(let j=0;j<80;j++){
   const off=start+j,id=5+Math.floor(off/0xf80),sec=group.byId.get(id);
   if(!sec)fail('Cartridge PC sector missing.');
   out[j]=raw[sec.base+off%0xf80];
  }
  return out;
 }
 function locatePc(raw,group){
  const tokens=[];
  for(let slot=0;slot<420&&tokens.length<5;slot++){
   const bytes=storageRecord(raw,group,slot);
   if(mon(bytes,0))tokens.push({slot,bytes});
  }
  if(tokens.length<3)fail('Too few saved boxed Pokémon to identify live PC storage.');
  const candidates=[];
  for(let p=0x20000;p+33744<=Math.min(raw.length,0x90000);p++){
   if(u32(raw,p)!==u32(tokens[0].bytes,0))continue;
   const base=p-4-tokens[0].slot*80;
   if(base<0x20000||base+33744>Math.min(raw.length,0x90000)||u32(raw,base)>13)continue;
   if(tokens.every(t=>same(raw,base+4+t.slot*80,t.bytes,0,80))){candidates.push(base);p+=79}
  }
  if(candidates.length!==1)fail('Live Bill’s PC storage could not be identified ('+candidates.length+' matches).');
  return candidates[0];
 }
 function validateFlash(save){
  if(save.length!==FLASH)return false;
  for(let side=0;side<2;side++){
   const ids=new Set();let ctr=null;
   for(let j=0;j<14;j++){
    const b=(side*14+j)*SECTOR,id=u16(save,b+0xff4),c=u32(save,b+0xffc);
    if(id>13||ids.has(id)||u32(save,b+0xff8)!==0x08012025||u16(save,b+0xff6)!==checksum(save,b,SIZES[id]))return false;
    if(ctr!==null&&ctr!==c)return false;
    ctr=c;ids.add(id);
   }
   if(ids.size!==14)return false;
  }
  return true;
 }
 function build(raw,sections){
  if(!(raw instanceof Uint8Array)||raw.length<800000)fail('Import a decompressed GBA SVS state first.');
  const image=sourceSectors(raw,sections),latest=image.slots[image.latest],ref0=raw.slice(latest.byId.get(0).base,latest.byId.get(0).base+SIZES[0]);
  const older=raw.slice(image.base,image.base+FLASH);
  if(!validateFlash(older))fail('The original cartridge backup did not pass FLASH verification.');
  const safe={fallback:older,latest:null,error:null,report:null};
  try{
   const trainer=locateTrainer(raw,ref0),key=u16(raw,trainer+0xf20),party=mon(raw,latest.byId.get(1).base+0x38);
   if(!party)fail('The last saved party contains an invalid lead Pokémon.');
   const sb1=locateSaveBlock1(raw,party,raw.subarray(latest.byId.get(1).base,latest.byId.get(1).base+SIZES[1]),key);
   const liveParty=locateParty(raw,sb1),pc=locatePc(raw,latest);
   if(!same(raw,trainer,ref0,0,8)||u32(raw,trainer+10)!==u32(ref0,10))fail('The live trainer does not match the cartridge save.');
   const result=older.slice();
   for(let id=0;id<14;id++){
    const sec=latest.byId.get(id),relative=sec.base-image.base;
    const source=id===0?trainer:id<5?sb1+(id-1)*0xf80:pc+(id-5)*0xf80;
    if(source<0||source+SIZES[id]>raw.length)fail('Recovery data extends past the state memory.');
    result.set(raw.subarray(source,source+SIZES[id]),relative);
    if(id===1)for(let i=0;i<liveParty.count;i++)
     result.set(raw.subarray(liveParty.pos+i*100,liveParty.pos+(i+1)*100),relative+0x38+i*100);
    const sum=checksum(result,relative,SIZES[id]);
    result[relative+0xff6]=sum&255;result[relative+0xff7]=sum>>>8;
   }
   if(!validateFlash(result))fail('Rebuilt cartridge failed independent 28-sector checksum verification.');
   const known=mon(result,latest.byId.get(1).base-image.base+0x38);
   if(!known||known.pid!==party.pid||known.ot!==party.ot)fail('Recovered starter identity does not match.');
   safe.latest=result;
   safe.report={partyCount:liveParty.count,currentBox:u32(raw,pc)+1,source:'verified live trainer, party and PC storage',checksumSectors:28};
  }catch(e){safe.error=e.message}
  return safe;
 }
 root.ThunderYellowFrozenRecovery={build,validateFlash};
 if(typeof module!=='undefined'&&module.exports)module.exports=root.ThunderYellowFrozenRecovery;
})(typeof window!=='undefined'?window:globalThis);
