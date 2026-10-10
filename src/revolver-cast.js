import {createDeepSeekActor} from './deepseek-actor.js';
export function createArenaRobot(scene){const bot=createDeepSeekActor(scene);bot.rigKind='compact';bot.baseY=0;bot.robotId='deepseek';return bot;}
