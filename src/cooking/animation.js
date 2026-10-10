// Restarted scene clocks must never amplify an old animation.
export function gestureEnvelope(time,started,duration){const age=time-started;return age<0?0:Math.max(0,Math.min(1,1-age/duration));}
