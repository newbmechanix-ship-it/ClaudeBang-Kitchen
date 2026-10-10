const STOP=new Set('a an the i me my you your we our it its is are was were be been am to of in on at for and or but this that these those with from as now just'.split(' '));
export function normalizedLine(text){return String(text||'').replace(/\[[^\]]*\]/g,'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();}
export function repeatedLine(text,recent,{threshold=.72}={}){
 const normalized=normalizedLine(text);if(!normalized)return false;
 const words=normalized.split(' ').filter(w=>!STOP.has(w)),A=new Set(words);
 for(const line of recent||[]){const other=normalizedLine(line);if(!other)continue;if(normalized===other)return true;
  const B=new Set(other.split(' ').filter(w=>!STOP.has(w)));if(Math.min(A.size,B.size)<5)continue;
  let same=0;for(const word of A)if(B.has(word))same++;
  if(same/Math.max(A.size,B.size)>=threshold&&same/Math.min(A.size,B.size)>=.82)return true;
 }
 return false;
}
export function repeatedSpeech(text,recent,{freshPain=false}={}){
 const plain=normalizedLine(text),words=plain.split(' ');
 // A new blow can naturally produce the same brief reflexive plea. It is not
 // another iteration of a long project narration, and must not become silence.
 if(freshPain&&words.length<=8&&/\b(stop|please|hurt|hurts|ow|agh|aagh|argh|no|help)\b/.test(plain))return false;
 return repeatedLine(text,recent)||repeatedSentences(text,recent,{freshPain}).length>0;
}
function sentences(text){return String(text||'').match(/[^.!?]+(?:[.!?]+|$)/g)?.map(s=>s.trim()).filter(Boolean)||[];}
export function repeatedSentences(text,recent,{freshPain=false}={}){
 const prior=(recent||[]).slice(-256).flatMap(sentences),repeated=[];
 for(const sentence of sentences(text)){
  const plain=normalizedLine(sentence),words=plain.split(' ');
  if(words.length<6)continue;
  if(freshPain&&words.length<=8&&/\b(stop|please|hurt|hurts|ow|agh|aagh|argh|no|help)\b/.test(plain))continue;
  if(repeatedLine(sentence,prior,{threshold:.8}))repeated.push(sentence);
 }
 return repeated;
}
