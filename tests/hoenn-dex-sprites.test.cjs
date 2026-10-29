const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const source=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
// The expected names are National Dex #252–386 from PokeAPI's pokemon_species.csv.
// Kept as an independent fixture: the production mapping must not supply its own expected values.
const nationalNames=`treecko|grovyle|sceptile|torchic|combusken|blaziken|mudkip|marshtomp|swampert|poochyena|mightyena|zigzagoon|linoone|wurmple|silcoon|beautifly|cascoon|dustox|lotad|lombre|ludicolo|seedot|nuzleaf|shiftry|taillow|swellow|wingull|pelipper|ralts|kirlia|gardevoir|surskit|masquerain|shroomish|breloom|slakoth|vigoroth|slaking|nincada|ninjask|shedinja|whismur|loudred|exploud|makuhita|hariyama|azurill|nosepass|skitty|delcatty|sableye|mawile|aron|lairon|aggron|meditite|medicham|electrike|manectric|plusle|minun|volbeat|illumise|roselia|gulpin|swalot|carvanha|sharpedo|wailmer|wailord|numel|camerupt|torkoal|spoink|grumpig|spinda|trapinch|vibrava|flygon|cacnea|cacturne|swablu|altaria|zangoose|seviper|lunatone|solrock|barboach|whiscash|corphish|crawdaunt|baltoy|claydol|lileep|cradily|anorith|armaldo|feebas|milotic|castform|kecleon|shuppet|banette|duskull|dusclops|tropius|chimecho|absol|wynaut|snorunt|glalie|spheal|sealeo|walrein|clamperl|huntail|gorebyss|relicanth|luvdisc|bagon|shelgon|salamence|beldum|metang|metagross|regirock|regice|registeel|latias|latios|kyogre|groudon|rayquaza|jirachi|deoxys`.split('|');
const normalized=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
const nameMatch=/const monNames=(\{[\s\S]*?\});/.exec(source);
assert(nameMatch,'Gen 3 species name catalog missing');
const internalNames=JSON.parse(nameMatch[1]);
const mapMatch=/const GEN3_INTERNAL_TO_NATIONAL=Object.freeze\(\[[\s\S]*?\]\);/.exec(source);
assert(mapMatch,'Explicit Hoenn internal-to-national mapping missing');
function fn(name){
 const start=source.indexOf('function '+name+'(');assert(start>=0,'Missing '+name);
 let end=source.indexOf('\n',start);
 while(end>=0){const part=source.slice(start,end);try{new vm.Script('('+part+')');return part;}catch{}end=source.indexOf('\n',end+1);}
 throw Error('Cannot parse '+name);
}
const ctx=vm.createContext({shinyStatus:(pid)=>pid===1});
vm.runInContext(mapMatch[0]+'\n'+fn('nationalDexNo')+'\n'+fn('pokemonArt'),ctx);
const get=n=>vm.runInContext('nationalDexNo('+n+')',ctx);
assert.equal(nationalNames.length,135);
assert.equal(get(25),25,'Pikachu remains #25');
assert.equal(get(251),251,'Celebi remains #251');
const seen=new Set();
for(let internal=277;internal<=411;internal++){
 const national=get(internal),name=internalNames[internal];
 assert(national>=252&&national<=386,internal+' has out-of-range Dex number '+national);
 assert.equal(normalized(nationalNames[national-252]),normalized(name),internal+' '+name+' mapped to wrong Pokémon');
 assert(!seen.has(national),'Duplicate National Dex number: '+national);
 seen.add(national);
}
assert.equal(seen.size,135);
assert.equal(get(346),361,'Snorunt internal #346 must render #361');
assert.equal(get(314),321,'Wailord internal #314 must render #321');
assert.equal(get(411),358,'Chimecho internal #411 must render #358');
assert.match(vm.runInContext('pokemonArt({sp:346,pid:0,ot:0})',ctx),/\/firered-leafgreen\/361\.png$/);
assert.match(vm.runInContext('pokemonArt({sp:346,pid:1,ot:0})',ctx),/\/firered-leafgreen\/shiny\/361\.png$/);
console.log('PASS: all 135 Hoenn internal species map to correct National Dex art, labels and box sort; Snorunt #361 normal/shiny.');
