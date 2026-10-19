// Unidades: píxeles, segundos, radianes. Fuente única de los ajustes de combate.
export const balance = Object.freeze({
 // Curva: 6 mundos, 7 combates + jefe por mundo. No se imponen esperas para inflar duración.
 campaign:{targetMinutes:[15,25],enemyCaps:[2,2,3,3,3,3],enemyPool:16,particlePool:64,maxDamage:3.6,checkpointDamage:0.16,checkpointSpeed:0.05,metricsWindow:5},
 hazards:{cycle:8,warningStart:3,activation:4.5,end:6,markRadius:38,finalRadius:60,markWarning:1.2,current:45,wind:38,slow:0.65},
 characters:{dashRecharge:1.1,healRooms:6,auraRadius:72,auraFactor:0.75,fullHealthDamage:1.15},
 weapons:{maxOrbitals:6,orbitSpeed:3.2,returnDelay:0.65,returnCatch:12,sideUtility:0.12,pierceUtility:0.08},
 player:{health:5,speed:170,damage:1,hitRadius:4,invulnerability:0.9,dashDuration:0.16,dashInvulnerability:0.18,dashCooldown:1.5,dashMultiplier:2.8},
 projectiles:{allyCapacity:128,enemyCapacity:512,life:8,allyRadius:3,enemyRadius:4,speed:360,interval:0.2},
 encounters:{spawnDelay:1.4,waveDelay:1.3,spawnDistance:125,enemySpacing:80,enemyCap:3,initialAttack:1,attackStagger:0.7,healthDepth:3,bossHealth:180,bossRadius:24,phaseThresholds:[0.66,0.33],bossSpeedStep:5,bossRest:1.5},
 progression:{bossWeights:{common:0,rare:65,epic:35},weights:{common:70,rare:25,epic:5},unlockCosts:[5,10],winEchoes:6,restHeal:2,entryGrace:1.5,exitLock:0.7},
 upgrades:{step:0.12,ember:0.25,lensDamage:0.1,lensSpeed:0.3,pulse:0.12,halo:1.25,synergy:1.15,veil:0.5,sideDamage:0.25,sideAngle:0.13},
});
