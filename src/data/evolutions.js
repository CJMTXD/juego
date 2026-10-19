// Cambios acumulativos sobre el arma base. damageFactor es absoluto, no se multiplica al recalcular.
export const forms={
 needle:[{}, {pierce:1}, {count:3,spread:0.16,damageFactor:1,sideFactor:0.18}, {pierce:3,finalEffect:'split'}],
 scatter:[{}, {count:7,damageFactor:0.78}, {projectileMode:'bounce',bounces:1}, {finalEffect:'backfan'}],
 burst:[{}, {count:4,damageFactor:0.8}, {pierce:1}, {projectileMode:'homing',turn:2.5}],
 ricochet:[{}, {bounces:3}, {count:2,spread:0.25,damageFactor:1,sideFactor:0.3}, {finalEffect:'return'}],
 homing:[{}, {count:2,spread:0.16,damageFactor:0.6}, {pierce:1,turn:4}, {finalEffect:'chain'}],
 beam:[{}, {range:480}, {count:3,spread:0.12,damageFactor:1,sideFactor:0.15}, {finalEffect:'frost'}],
 orbit:[{}, {count:4,damageFactor:0.82}, {orbitRadius:62,duration:2}, {finalEffect:'reflect'}],
 area:[{}, {radius:54,damageFactor:0.9}, {delay:0.4}, {finalEffect:'quake',damageFactor:0.45}],
 charge:[{}, {interval:0.95,damageFactor:0.9}, {count:3,spread:0.16,damageFactor:1,sideFactor:0.18}, {finalEffect:'sunfall'}],
 boomerang:[{}, {pierce:3}, {count:2,spread:0.35,damageFactor:1,sideFactor:0.3}, {finalEffect:'moon'}],
};
