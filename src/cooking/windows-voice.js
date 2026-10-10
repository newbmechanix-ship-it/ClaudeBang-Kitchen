// The same local Microsoft David voice used by Claude in the Windows scenes.
export function createWindowsVoice({synth=globalThis.speechSynthesis,Utterance=globalThis.SpeechSynthesisUtterance,language='en-US'}={}){
 let current=null,serial=0,finishCurrent=null,selected='Microsoft David';
 function stop(){serial++;if(current)synth?.cancel();current=null;finishCurrent?.();finishCurrent=null;}
 function speak(text,{shouldPlay=()=>true,onStart,onDone,onError}={}){
  stop();if(!shouldPlay()){onDone?.();return;}
  if(!synth||!Utterance){onError?.(Error('Windows speech is unavailable.'));return;}
  const token=serial,u=new Utterance(text);let done=false,timer;
  const finish=()=>{if(done)return;done=true;clearTimeout(timer);if(current===u){current=null;finishCurrent=null;}onDone?.();};
  finishCurrent=finish;current=u;
  const voices=synth.getVoices(),voice=language==='zh-CN'?voices.find(v=>/^zh[-_]CN/i.test(v.lang)&&v.localService):voices.find(v=>/Microsoft David/i.test(v.name)&&/^en/i.test(v.lang))||voices.find(v=>v.localService&&/Microsoft/i.test(v.name)&&/^en-US/i.test(v.lang));
  if(!voice){current=null;finishCurrent=null;onError?.(Error('Requested Windows speech voice not installed; subtitles remain available.'));return;}
  selected=voice.name;u.voice=voice;u.lang=language;u.rate=language==='zh-CN'?1:.95;u.pitch=language==='zh-CN'?1:.85;u.volume=.9;
  u.onstart=()=>{if(token!==serial||!shouldPlay()){stop();return;}onStart?.();};
  u.onend=finish;u.onerror=e=>{if(token===serial&&e.error!=='canceled'&&e.error!=='interrupted')onError?.(Error(e.error));finish();};
  timer=setTimeout(()=>{if(token===serial)stop();},60000);synth.resume();synth.speak(u);
 }
 // Start loading the native voice list before the first model response arrives.
 synth?.getVoices();
 return {speak,stop,get selected(){return selected;}};
}
