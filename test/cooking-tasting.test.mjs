import test from 'node:test';
import assert from 'node:assert/strict';
import {createKitchen,addFood} from '../src/cooking/state.js';
import {beginTasting,recordTastingBite} from '../src/cooking/tasting.js';

test('tasting remembers the actual bite after its physical portion is eaten',()=>{
 const s=createKitchen(),carrot=addFood(s,'carrot','pan');carrot.cook=1;carrot.burn=.05;carrot.wet=.7;
 beginTasting(s,[carrot],92);recordTastingBite(s,carrot,{bite:1,bites:4});s.items=[];
 assert.equal(s.tasting.bites[0].food,'Carrot');assert.equal(s.tasting.bites[0].doneness,'cooked through');
 assert.equal(s.tasting.bites[0].wetness,70);assert.equal(s.tasting.biteCount,1);assert.equal(s.tasting.score,92);
});
test('a new dish cannot inherit the previous dish tasting or verdict',()=>{
 const s=createKitchen(),pasta=addFood(s,'pasta','pan');beginTasting(s,[pasta],0);
 for(let n=1;n<=12;n++)recordTastingBite(s,pasta,{bite:n,bites:12});
 assert.equal(s.tasting.biteCount,12);assert.equal(s.tasting.bites.length,8);assert.equal(s.tasting.bites[0].doneness,'raw');
 s.tasting.completed=true;const carrot=addFood(s,'carrot','pan');carrot.burn=.8;beginTasting(s,[carrot],10);
 assert.equal(s.tasting.dish[0].doneness,'burnt');assert.equal(s.tasting.biteCount,0);assert.equal(s.tasting.completed,false);
});
