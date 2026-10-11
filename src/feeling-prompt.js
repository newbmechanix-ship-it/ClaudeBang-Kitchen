export const FEELING_CUE='and i feel-';
// Keep this as the final user-prompt text, not an incomplete assistant JSON prefill.
export function withFeelingCue(observations){
 return String(observations)+'\n\nContinue the unfinished first-person cue below in the thought field, using the current observations. Do not invent sensations or events. Return the complete required JSON object, with no prose outside it.\n'+FEELING_CUE;
}
