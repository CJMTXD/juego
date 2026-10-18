// Peligros con reloj común: señal, activación y descanso. Nunca se crean entidades en cada paso.
export function resetHazard(world){world.hazardClock=0;world.hazardPhase=0;world.mark.active=false;}
export function updateHazard(world,dt,damage){
 const room=world.rooms[world.roomId],p=world.player;
 if(room.cleared)return;
 world.hazardClock+=dt;
 const clock=world.hazardClock%8;
 world.hazardPhase=clock<3?0:clock<4.5?1:clock<6?2:0;
 const type=world.zone.hazard;
 if(type==='embers'&&world.hazardPhase===2){for(const [x,y] of world.hazardPositions)if(Math.hypot(p.x-x,p.y-y)<32+p.radius)damage(world);}
 if(type==='tide'&&world.hazardPhase===2&&p.y>125&&p.y<235)p.x=Math.max(36,Math.min(604,p.x+45*dt*(Math.floor(world.hazardClock/8)%2?1:-1)));
 if(type==='wind'&&world.hazardPhase===2)p.y=Math.max(36,Math.min(324,p.y-38*dt));
 world.environmentSlow=type==='roots'&&world.hazardPhase===2&&Math.hypot(p.x-320,p.y-180)<90?0.65:1;
 if(type==='eclipse'&&world.hazardPhase===2&&((p.x>130&&p.x<175)||(p.x>465&&p.x<510)))damage(world);
 if(world.mark.active){world.mark.timer-=dt;if(world.mark.timer<=0&&world.mark.timer>-.45&&Math.hypot(p.x-world.mark.x,p.y-world.mark.y)<world.mark.radius+p.radius)damage(world);if(world.mark.timer<=-.45)world.mark.active=false;}
}
