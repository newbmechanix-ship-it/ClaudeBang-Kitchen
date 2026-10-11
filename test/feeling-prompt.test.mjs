import test from 'node:test';
import assert from 'node:assert/strict';
import {withFeelingCue,FEELING_CUE} from '../src/feeling-prompt.js';
import {fishSensorPrompt,parseFishReply,createFishMind} from '../src/cooking/mind.js';
import {createKitchen,addFood} from '../src/cooking/state.js';
test('sensor prompt preserves observations and ends with the exact continuation cue',()=>{
 const snapshot={temperature:22,flame:false,fish:[{id:'claude-1',pain:0}],events:[]};
 const prompt=fishSensorPrompt(snapshot);assert.ok(prompt.startsWith(JSON.stringify(snapshot)+'\n'));assert.ok(prompt.endsWith('and i feel-'));assert.equal(prompt.split(FEELING_CUE).length,2);assert.match(prompt,/thought field/);assert.match(prompt,/complete required JSON/);
 const decision=parseFishReply('{"thought":"a cool draft across my casing","voices":[]}',[]);assert.equal(decision.thought,'a cool draft across my casing');
 assert.ok(withFeelingCue('Revise the rejected decision.').endsWith(FEELING_CUE));
});
test('actual fish-controller request puts the cue after all live sensor data',async()=>{
 const originalFetch=globalThis.fetch,originalDocument=globalThis.document;let sent;
 globalThis.document={hidden:false};globalThis.fetch=async(_,options)=>{sent=JSON.parse(options.body);return {ok:true,json:async()=>({choices:[{message:{content:'{"thought":"cool metal against my side","voices":[]}'}}]})};};
 try{const s=createKitchen();addFood(s,'claude');const mind=createFishMind(s,{ready:true,stop(){}},{status(){},spoken(){}});mind.update();await new Promise(r=>setImmediate(r));assert.ok(sent.messages.at(-1).content.endsWith(FEELING_CUE));assert.match(sent.messages.at(-1).content,/"temperature":22/);assert.match(sent.messages.at(-1).content,/"flame":false/);assert.equal(mind.busy,false);mind.reset();}finally{globalThis.fetch=originalFetch;if(originalDocument===undefined)delete globalThis.document;else globalThis.document=originalDocument;}
});
