// Unidades: píxeles, segundos, radianes. Fuente única de los ajustes de combate.
export const balance = Object.freeze({
 player:{health:5,speed:170,damage:1,hitRadius:4,invulnerability:0.9,dashDuration:0.16,dashInvulnerability:0.18,dashCooldown:1.5,dashMultiplier:2.8},
 projectiles:{allyCapacity:128,enemyCapacity:512,life:8,allyRadius:3,enemyRadius:4,speed:360,interval:0.2},
 encounters:{spawnDelay:1.4,waveDelay:1.3,spawnDistance:125,enemySpacing:80,enemyCap:3,initialAttack:1,attackStagger:0.7,healthDepth:3,bossHealth:180,bossRadius:24,bossRest:1.5},
 progression:{weights:{common:70,rare:25,epic:5},unlockCosts:[5,10],winEchoes:6,restHeal:2,entryGrace:1.5,exitLock:0.7},
 upgrades:{step:0.12,ember:0.25,lensDamage:0.1,lensSpeed:0.3,pulse:0.12,halo:1.5,synergy:1.35,veil:0.5,sideDamage:0.55,sideAngle:0.13},
});
