import {giftCodes} from './data/codes.js';
import {depth as D} from './data/depth.js';
// Guarda recompensa y registro juntos; un fallo de escritura permite volver a intentarlo.
export function redeemCode(save,text,store=()=>true){
 const code=typeof text==='string'?text.trim().toUpperCase():'';
 if(!Object.hasOwn(giftCodes,code))return {ok:false,message:'Código no válido. Revisa cómo lo escribiste.'};
 if(save.meta.redeemedCodes.includes(code))return {ok:false,message:'Ya canjeaste este código en este guardado.'};
 const amount=giftCodes[code];
 if(save.progress.echoes>D.economy.maxCurrency-amount)return {ok:false,message:'Gasta algunos ecos antes de canjear para recibir la recompensa completa.'};
 const next={...save,meta:{...save.meta,redeemedCodes:[...save.meta.redeemedCodes,code]},progress:{...save.progress,echoes:save.progress.echoes+amount,totalEchoes:Math.min(D.economy.maxCurrency,save.progress.totalEchoes+amount)}};
 if(!store(next))return {ok:false,message:'No se pudo guardar. No se ha gastado el código; vuelve a intentarlo.'};
 Object.assign(save,next);
 return {ok:true,message:`¡Código canjeado! Has recibido ${amount} ecos. Tienes ${save.progress.echoes} ecos.`};
}
