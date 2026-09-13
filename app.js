const STORAGE_KEY = "vegelympus-save-v1";
const MAX_PLOTS = 10;
const GROW_MS = 30_000;
const MAX_MERIT = 888;

const vegetables = {
  cabbage:{name:"白菜",emoji:"🥬",desc:"295号硬通货"},bokchoy:{name:"小白菜",emoji:"🌱",desc:"小而精神"},
  roundcabbage:{name:"卷心菜",emoji:"🟢",desc:"心事很多层"},spinach:{name:"菠菜",emoji:"🍃",desc:"力量的错觉"},
  shepherd:{name:"荠菜",emoji:"🌿",desc:"山野隐藏款"},cilantro:{name:"香菜",emoji:"☘️",desc:"立场鲜明"},
  radish:{name:"萝卜",emoji:"🫜",desc:"拔出一个真相"},eggplant:{name:"茄子",emoji:"🍆",desc:"紫气东来"},
  carrot:{name:"胡萝卜",emoji:"🥕",desc:"目光长远"},chili:{name:"辣椒",emoji:"🌶️",desc:"发言有力度"}
};

const gods = [
  {id:"yu",name:"于神",title:"潇洒の🐟",symbol:"🐟",temple:"于神庙",quote:"何意味",feature:"功德、烧菜、烧试卷与召唤",pos:[50,10],icon:1,wants:"cabbage",gives:"radish"},
  {id:"ma",name:"妈神",title:"掌管人间烟火",symbol:"🍳",temple:"妈祖庙",quote:"先吃饭，吃完再说。",feature:"会馈赠做饭秘籍",pos:[41,20],icon:2,wants:"carrot",gives:"cabbage"},
  {id:"lll",name:"lll神",title:"lll的庙",symbol:"😊",temple:"lll的庙",quote:"此处正在等待神谕。",feature:"互动逻辑待菜市场议会补全",pos:[58,22],icon:3,wants:"spinach",gives:"shepherd"},
  {id:"ccc",name:"ccc",title:"又菜又爱玩",symbol:"🥏",temple:"ccc的小屋",quote:"小心头顶。",feature:"会随机投掷飞盘",pos:[34,32],icon:3,wants:"bokchoy",gives:"chili"},
  {id:"cao",name:"曹神",title:"花露水味儿的",symbol:"🧴",temple:"曹神殿",quote:"为什么这里有一股花露水的味道。",feature:"庙内常年保持驱蚊结界",pos:[49,34],icon:1,wants:"cilantro",gives:"spinach"},
  {id:"jin",name:"金巨佬",title:"巨佬中的巨佬",symbol:"🪙",temple:"金巨佬神殿",quote:"巨佬没有解释，只有结果。",feature:"互动逻辑待定",pos:[65,34],icon:2,wants:"radish",gives:"carrot"},
  {id:"zuo",name:"左佬",title:"Somerset",symbol:"🌍",temple:"图寻神庙",quote:"不如玩儿图寻。",feature:"掌管经纬度与路边电线杆",pos:[27,44],icon:2,wants:"eggplant",gives:"roundcabbage"},
  {id:"lie",name:"躺平神",title:"此刻不宜起身",symbol:"🛌",temple:"躺平神榻",quote:"能躺着解决的事情，不必站着焦虑。",feature:"互动逻辑待定",pos:[43,47],icon:3,wants:"roundcabbage",gives:"bokchoy"},
  {id:"six",name:"小六神",title:"又名六神",symbol:"6️⃣",temple:"六神小殿",quote:"上善若水",feature:"互动逻辑待定",pos:[61,48],icon:1,wants:"chili",gives:"cilantro"},
  {id:"ao",name:"傲神",title:"不是哥们儿",symbol:"😤",temple:"傲神台",quote:"对不起我不会",feature:"互动逻辑待定",pos:[74,49],icon:3,wants:"cabbage",gives:"eggplant"},
  {id:"nuo",name:"诺神",title:"一诺菜重",symbol:"🤝",temple:"诺神祠",quote:"答应的菜，一棵都不能少。",feature:"互动逻辑待定",pos:[37,60],icon:1,wants:"shepherd",gives:"radish"},
  {id:"xie",name:"谢神",title:"谢天谢地谢神",symbol:"🙏",temple:"谢神庙",quote:"不谢也行，下次带菜。",feature:"互动逻辑待定",pos:[55,62],icon:2,wants:"spinach",gives:"chili"},
  {id:"liang",name:"良神",title:"⚽️ 绿茵神迹",symbol:"⚽️",temple:"良神球场",quote:"球到，神到。",feature:"掌管足球与临门一脚",pos:[69,65],icon:3,wants:"carrot",gives:"spinach"},
  {id:"feng",name:"枫神",title:"逻辑审判者",symbol:"🔥",temple:"枫神逻辑殿",quote:"你的逻辑是错误的",feature:"掌管论证、反驳与逻辑纠错",pos:[81,59],icon:1,wants:"chili",gives:"cabbage"}
];

const memes = [
  ...Array.from({length:7},(_,i)=>({id:`nailong-${i+1}`,name:`感化奶龙·${i+1}`,src:`assets/nailongs/nailong${i+1}.jpg`})),
  {id:"yu-ai",name:"于神·云中显灵",src:"assets/memes/yushen-appears.jpg"},
  ...Array.from({length:7},(_,i)=>({id:`yu-${i+1}`,name:`于神显灵·${i+1}`,src:`assets/yxr${i+1}.jpg`}))
];
const subjects=["数学","物理","化学","语文","地理","英语","生物","历史","政治"];
const fortunes=["上上签 · 今日发言，必有表情包回应。","上签 · 宜约饭，忌说“下次一定”。","中签 · 群聊虽静，友情仍在后台运行。","中签 · 迟到七分钟，可解释为仙缘未到。","吉签 · 会遇到一棵理解你的菜。","菜签 · 不宜内耗，宜吃火锅。","秘签 · 你以为没人记得的事，大家都记得。","平签 · 今天没有大事，这本身就是好事。"];
const recipes=["妈神秘籍：番茄炒蛋先炒蛋，人生也要先照顾好自己。","妈神秘籍：炒青菜要大火快炒，犹豫就会出水。","妈神秘籍：盐可以少放，朋友可以多叫几个。","妈神秘籍：剩饭进冰箱，剩下的话下次见面再说。","妈神秘籍：火锅底料解决不了的问题，蘸料也许可以。"];
const henNames=["咯咯一号","白羽接引使","斑点报晓官"];

function defaultState(){return {seeds:{cabbage:3,bokchoy:2,roundcabbage:2,spinach:2,shepherd:1,cilantro:1,radish:0,eggplant:0,carrot:0,chili:0},harvest:{},plots:Array(MAX_PLOTS).fill(null),discovered:["cabbage","bokchoy"],history:[],wishes:{},nickname:"无名菜客",selectedSeed:"cabbage",merit:0,cooldowns:{food:0,paper:0,summon:0},yuBanUntil:0,collectedMemes:[],wheelMode:"vegetable"}}
function loadState(){try{const s=JSON.parse(localStorage.getItem(STORAGE_KEY));if(!s)return defaultState();const d=defaultState();return {...d,...s,seeds:{...d.seeds,...s.seeds},harvest:{...s.harvest},plots:[...(s.plots||[]),...Array(MAX_PLOTS).fill(null)].slice(0,MAX_PLOTS),cooldowns:{...d.cooldowns,...s.cooldowns},collectedMemes:s.collectedMemes||[]}}catch{return defaultState()}}

let state=loadState(),activeGod=gods[0],wheelRotation=0;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const escapeHTML=v=>String(v).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
const randomItem=a=>a[Math.floor(Math.random()*a.length)];
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));updateGlobalUI()}
function totalSeeds(){return Object.values(state.seeds).reduce((a,b)=>a+b,0)}
function addHistory(text){state.history.unshift({text,time:Date.now()});state.history=state.history.slice(0,80);save()}
function addMerit(n,reason){const before=state.merit;state.merit=clamp(state.merit+n,0,MAX_MERIT);const actual=state.merit-before;addHistory(`${reason}，功德${actual>=0?"+":""}${actual}`);return actual}
function toast(message,gold=false){const n=document.createElement("div");n.className=`toast${gold?" gold":""}`;n.textContent=message;$("#toastRegion").append(n);setTimeout(()=>n.remove(),3400)}
function formatTime(ts){return new Intl.DateTimeFormat("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(ts)}
function cooldownLeft(key){return Math.max(0,Math.ceil(((state.cooldowns[key]||0)-Date.now())/1000))}

function route(name,options={}){
  if(name==="temple"&&options.god?.id==="yu"&&state.yuBanUntil>Date.now()){const left=Math.ceil((state.yuBanUntil-Date.now())/1000);toast(`你仍被逐出于神庙，还需等待 ${left} 秒`);showEvent({emoji:"🚫",title:"于神庙拒绝入内",text:`庙门纹丝不动。${left} 秒后再来。`});return}
  $$(".view").forEach(v=>v.classList.toggle("active",v.dataset.view===name));
  $$(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.route===name||(name==="temple"&&b.dataset.route==="map")));
  if(name==="farm")renderFarm();if(name==="market")renderMarket();if(name==="codex")renderCodex();
  if(name==="temple"){activeGod=options.god||activeGod;renderTemple();if(activeGod.id==="ccc")maybeFrisbee()}
  window.scrollTo({top:0,behavior:"smooth"});
}

function renderHotspots(){
  $("#templeHotspots").innerHTML=gods.map(g=>`<button class="hotspot temple-hotspot" data-god="${g.id}" style="left:${g.pos[0]}%;top:${g.pos[1]}%" aria-label="进入${g.temple}"><img src="assets/temples/temple-${g.icon}.png" alt=""><label>${g.temple}<small>${g.name} · ${g.title}</small></label></button>`).join("");
  $$(".hotspot").forEach(b=>b.addEventListener("click",()=>route("temple",{god:gods.find(g=>g.id===b.dataset.god)})));
}
function updateGlobalUI(){$("#seedCount").textContent=totalSeeds();$("#meritCount").textContent=state.merit;$("#profileAvatar").textContent=(state.nickname||"游").slice(0,1)}

function renderSeedChoices(){$("#seedChoices").innerHTML=Object.entries(vegetables).map(([id,v])=>`<button class="seed-choice ${state.selectedSeed===id?"selected":""}" data-seed="${id}" ${state.seeds[id]<=0?"disabled":""}><span class="emoji">${v.emoji}</span><span><b>${v.name}</b><small>${v.desc}</small></span><strong>× ${state.seeds[id]||0}</strong></button>`).join("");$$(".seed-choice").forEach(b=>b.addEventListener("click",()=>{state.selectedSeed=b.dataset.seed;save();renderSeedChoices()}))}
function renderFarm(){const occupied=state.plots.filter(Boolean).length;$("#plotCapacity").textContent=`${occupied} / ${MAX_PLOTS} 畦`;renderSeedChoices();const now=Date.now();$("#farmPlots").innerHTML=state.plots.map((p,i)=>{if(!p)return`<button class="plot empty" data-plot="${i}"><span class="plus">＋</span><small>播种</small></button>`;const v=vegetables[p.type],elapsed=now-p.plantedAt,ready=elapsed>=GROW_MS,remain=Math.max(0,Math.ceil((GROW_MS-elapsed)/1000)),progress=Math.min(100,elapsed/GROW_MS*100);return`<button class="plot ${ready?"ready":"growing"}" data-plot="${i}"><span class="plant">${ready?v.emoji:(elapsed>15000?"🌿":"🌱")}</span><b>${v.name}</b><small>${ready?"点击收菜":`${remain} 秒后成熟`}</small><i class="progress" style="width:${progress}%"></i></button>`}).join("");$$(".plot").forEach(b=>b.addEventListener("click",()=>handlePlot(Number(b.dataset.plot))))}
function handlePlot(i){const p=state.plots[i];if(!p){const seed=state.selectedSeed;if(!seed||!state.seeds[seed])return toast("菜种匣里没有这种种子了");state.seeds[seed]--;state.plots[i]={type:seed,plantedAt:Date.now()};addHistory(`在第 ${i+1} 畦种下了${vegetables[seed].name}`);renderFarm();toast(`${vegetables[seed].name}已入土，30 秒后见`);return}if(Date.now()-p.plantedAt<GROW_MS)return toast("莫急，拔苗只会得到一脸土");const id=p.type;state.harvest[id]=(state.harvest[id]||0)+1;state.plots[i]=null;if(!state.discovered.includes(id))state.discovered.push(id);addHistory(`收获了一棵${vegetables[id].name}`);renderFarm();toast(`收菜成功：${vegetables[id].emoji} ${vegetables[id].name} +1`,true)}

function inventoryText(){const a=Object.entries(state.harvest).filter(([,n])=>n>0).map(([id,n])=>`${vegetables[id].emoji} ${vegetables[id].name} ×${n}`);return a.join("　")||"空空如也，先去山脚种菜吧"}
function renderMarket(){$("#inventorySummary").textContent=inventoryText();$("#marketStalls").innerHTML=gods.map(g=>`<button class="stall-card" data-stall="${g.id}"><span class="god-symbol">${g.symbol}</span><h3>${g.name}</h3><p>${g.title}</p><div class="trade-line">${vegetables[g.wants].emoji} ${vegetables[g.wants].name} ×1 <span>换</span> ${vegetables[g.gives].emoji} ${vegetables[g.gives].name}种 ×2</div></button>`).join("");$$(".stall-card").forEach(b=>b.addEventListener("click",()=>openTrade(gods.find(g=>g.id===b.dataset.stall))))}
function openTrade(g){const owned=state.harvest[g.wants]||0,d=$("#tradeDialog");$("#tradeContent").innerHTML=`<p class="eyebrow">${g.temple} · 山腰摊位</p><h2>${g.name}</h2><p>“${g.quote}”</p><div class="trade-offer">交出 ${vegetables[g.wants].emoji} ${vegetables[g.wants].name} ×1<br>换取 ${vegetables[g.gives].emoji} ${vegetables[g.gives].name}种 ×2</div><p>你现有：${vegetables[g.wants].name} ×${owned}</p><button class="primary-btn" id="confirmTrade" ${owned<1?"disabled":""}>${owned<1?"菜不够，暂且告辞":"成交，击掌为誓"}</button>`;$("#confirmTrade").addEventListener("click",()=>{if((state.harvest[g.wants]||0)<1)return;state.harvest[g.wants]--;state.seeds[g.gives]=(state.seeds[g.gives]||0)+2;addHistory(`与${g.name}交易，获得两枚${vegetables[g.gives].name}种`);d.close();renderMarket();toast("交易完成，菜货两讫",true)});d.showModal()}

function renderTemple(){activeGod.id==="yu"?renderYuTemple():renderGenericTemple()}
function templeBanner(g){return`<div class="temple-banner"><p class="eyebrow">${g.temple} · 神域</p><h2>${g.name}</h2><p>${g.title}。${g.quote}</p><span class="temple-symbol">${g.symbol}</span></div>`}
function renderGenericTemple(){const g=activeGod,w=state.wishes[g.id]||[];$("#templeContent").innerHTML=`${templeBanner(g)}<div class="temple-grid"><article class="panel"><div class="panel-title"><span>神坛 · 烧香祈福</span><small>${g.feature}</small></div><div class="altar-actions"><button data-incense="清香">🕯️ 一炷清香</button><button data-incense="菜香">🥬 一缕菜香</button></div><form class="wish-form" id="wishForm"><textarea maxlength="120" placeholder="写下一句想对${g.name}说的话……" required></textarea><button class="primary-btn" type="submit">敬呈神明</button></form><div class="wish-list">${w.length?w.map(x=>`<div class="wish">${escapeHTML(x.text)}<small>${escapeHTML(x.author)} · ${formatTime(x.time)} · 本机祈愿</small></div>`).join(""):'<div class="empty-state">尚无祈愿，神明正在假装忙碌。</div>'}</div></article><article class="panel"><div class="panel-title"><span>${g.id==="ma"?"妈神的灶台":"灵签筒"}</span><small>仅供娱乐</small></div>${g.id==="ma"?'<div class="fortune-box"><div class="fortune-stick">🍲</div><div class="fortune-result" id="fortuneResult">灶火正旺，秘方将成</div><button class="primary-btn" id="specialAction">求一份做饭秘籍</button></div>':'<div class="fortune-box"><div class="fortune-stick" id="fortuneStick">🎋</div><div class="fortune-result" id="fortuneResult">心诚则灵，手快也灵</div><button class="primary-btn" id="drawFortune">摇一支菜签</button></div>'}<p class="god-feature">${g.feature}</p><button class="text-btn" id="visitStall">前往${g.name}的摊位 →</button></article></div>`;
  $$('[data-incense]').forEach(b=>b.addEventListener("click",()=>toast(`${b.dataset.incense}已燃，${g.name}闻到了`)));$("#wishForm").addEventListener("submit",e=>{e.preventDefault();submitWish(e.currentTarget.querySelector("textarea").value.trim())});
  if(g.id==="ma")$("#specialAction").addEventListener("click",()=>{const r=randomItem(recipes);$("#fortuneResult").textContent=r;addHistory(`妈神馈赠做饭秘籍：${r.replace("妈神秘籍：","")}`);toast("秘籍已收入显灵记录",true)});else{$("#drawFortune").addEventListener("click",drawFortune);$("#fortuneStick").addEventListener("click",drawFortune)}$("#visitStall").addEventListener("click",()=>{route("market");setTimeout(()=>openTrade(g),100)})}

function renderYuTemple(){
  const foodLeft=cooldownLeft("food"),paperLeft=cooldownLeft("paper"),canSummon=state.merit>=66;
  const dishes=Object.entries(state.harvest).filter(([,n])=>n>0);
  $("#templeContent").innerHTML=`${templeBanner(activeGod)}<div class="merit-meter"><div><span>当前功德</span><b>${state.merit}</b><small>/ ${MAX_MERIT}</small></div><div class="merit-track"><i style="width:${state.merit/MAX_MERIT*100}%"></i></div><span>${canSummon?"召唤法阵已亮":"还需积攒功德至 66"}</span></div><div class="yu-grid">
  <article class="panel yu-action-card"><div class="panel-title"><span>烧香</span><small>无冷却 · 连点有效</small></div><p>每炷香随机增加 2–5 功德。</p><button class="ritual-btn" id="burnIncense"><span>🕯️</span><b>连续烧香</b><small>香火 +1</small></button></article>
  <article class="panel yu-action-card"><div class="panel-title"><span>烧菜</span><small>${foodLeft?`冷却 ${foodLeft}s`:"5 秒冷却"}</small></div><p>好吃 +30 功德，不好吃 −30 功德。会消耗一棵成熟的菜。</p><div class="burn-grid">${dishes.length?dishes.map(([id,n])=>`<button data-burn-food="${id}" ${foodLeft?"disabled":""}>${vegetables[id].emoji}<small>${vegetables[id].name} ×${n}</small></button>`).join(""):'<div class="empty-state">菜篮是空的，不能烧空气。</div>'}</div></article>
  <article class="panel yu-action-card"><div class="panel-title"><span>烧试卷</span><small>${paperLeft?`冷却 ${paperLeft}s`:"10 秒冷却"}</small></div><p>每份试卷 +30 功德。于神有概率留下：“何意味”。</p><div class="subject-grid">${subjects.map(s=>`<button data-paper="${s}" ${paperLeft?"disabled":""}>${s}</button>`).join("")}</div></article>
  <article class="panel summon-card"><div class="panel-title"><span>召唤于神</span><small>🪝🦶🫅</small></div><div class="summon-seal">于</div><p>功德满 66 可启动一次召唤；每次消耗 66 功德。</p><button class="primary-btn" id="summonYu" ${canSummon?"":"disabled"}>${canSummon?"天灵灵，地灵灵":"功德不足"}</button><div class="odds"><span>30% 奶龙</span><span>40% 显灵</span><span>10% 狗叫</span><span>10% 卖菜</span><span>10% 逐出</span></div></article></div>`;
  $("#burnIncense").addEventListener("click",()=>{const gain=2+Math.floor(Math.random()*4);addMerit(gain,"向于神烧香");toast(`香烟袅袅，功德 +${gain}`,true);renderYuTemple()});
  $$('[data-burn-food]').forEach(b=>b.addEventListener("click",()=>burnFood(b.dataset.burnFood)));$$('[data-paper]').forEach(b=>b.addEventListener("click",()=>burnPaper(b.dataset.paper)));$("#summonYu").addEventListener("click",summonYu)
}
function burnFood(id){const left=cooldownLeft("food");if(left)return toast(`炉火还要冷却 ${left} 秒`);if(!(state.harvest[id]>0))return toast("这棵菜已经不在篮子里了");state.harvest[id]--;state.cooldowns.food=Date.now()+5000;if(id==="cilantro"){state.yuBanUntil=Date.now()+180000;addHistory("给于神烧了香菜，被当场逐出于神庙，禁入三分钟");showEvent({emoji:"☘️🚪💨",title:"香菜？！逐出去！",text:"香菜刚碰到炉火，庙门便轰然打开。你被直接逐出了于神庙，3 分钟内不得重新进入。"});route("map");return}const tasty=Math.random()<.5;const delta=addMerit(tasty?30:-30,`烧给于神的${vegetables[id].name}${tasty?"很好吃":"不好吃"}`);showEvent({emoji:tasty?"😋":"😶",title:tasty?"这菜好吃！":"于神陷入沉默",text:`${vegetables[id].name}化作青烟，功德${delta>=0?"+":""}${delta}。`});renderYuTemple()}
function burnPaper(subject){const left=cooldownLeft("paper");if(left)return toast(`试卷焚化炉还要冷却 ${left} 秒`);state.cooldowns.paper=Date.now()+10000;addMerit(30,`烧掉一份${subject}试卷`);const meaning=Math.random()<.35;showEvent({emoji:"📜🔥",title:`${subject}试卷已烧`,text:meaning?'灰烬里浮出于神的一条消息：“何意味”':'于神收下了试卷，没有追问得分。'});renderYuTemple()}
function summonYu(){if(state.merit<66)return toast("至少需要 66 功德");state.merit-=66;save();const roll=Math.random();if(roll<.30){const m=randomItem(memes.filter(x=>x.id.startsWith("nailong-")));collectMeme(m.id);showEvent({image:m.src,title:"于神没有显灵",text:"但是，你感化了奶龙。表情包已收入收藏。"});addHistory(`召唤于神失败，但是感化了奶龙，获得「${m.name}」`)}else if(roll<.70){const m=randomItem(memes.filter(x=>x.id.startsWith("yu-")));collectMeme(m.id);showEvent({image:m.src,title:"天灵灵地灵灵",text:"于神竟然显灵了！表情包已收入收藏。"});addHistory(`于神显灵，获得表情包「${m.name}」`)}else if(roll<.80){const mood=randomItem(["愤怒","悲伤","快乐"]);showEvent({emoji:mood==="愤怒"?"🐕💢":mood==="悲伤"?"🐕💧":"🐕🎶",title:"于神没有显灵",text:`远处传来几声${mood}的狗叫。汪。`});addHistory(`召唤于神失败，听见${mood}的狗叫`)}else if(roll<.90){showYuSale()}else{state.yuBanUntil=Date.now()+180000;save();showEvent({emoji:"🚪💨",title:"你被逐出了于神庙！",text:"庙门砰然关闭。3 分钟内不得重新进入。"});addHistory("被逐出了于神庙，禁入三分钟");route("map")}if($("#templeView").classList.contains("active"))renderYuTemple()}
function showYuSale(){showEvent({emoji:"🥬🫅",title:"于神向你卖菜",text:"只收 10 功德，一棵成熟白菜。要不要？",action:{label:"买，支持神仙创业",run:()=>{if(state.merit<10)return toast("功德不够，神仙也不赊账");state.merit-=10;state.harvest.cabbage=(state.harvest.cabbage||0)+1;if(!state.discovered.includes("cabbage"))state.discovered.push("cabbage");addHistory("花 10 功德向于神买了一棵白菜");toast("白菜已放进菜篮",true)}}})}
function collectMeme(id){if(!state.collectedMemes.includes(id)){state.collectedMemes.push(id);save();toast("新表情包已收入「收集到的」",true)}}
function maybeFrisbee(){if(Math.random()<.42)setTimeout(()=>{showEvent({emoji:"🥏💥",title:"咚！",text:"你被 ccc 的飞盘击中了脑袋，发出了“咚”的声音！"});addHistory("在ccc的小屋被飞盘击中，发出了“咚”")},450)}
function submitWish(text){if(!text)return;state.wishes[activeGod.id]=[{text,author:state.nickname,time:Date.now()},...(state.wishes[activeGod.id]||[])].slice(0,20);let reward="";if(Math.random()<.36){const seed=randomItem(Object.keys(vegetables));state.seeds[seed]=(state.seeds[seed]||0)+1;reward=`；神坛后滚出一枚${vegetables[seed].name}种`}addHistory(`向${activeGod.name}呈上祈愿${reward}`);renderTemple();toast(reward?reward.slice(1):"祈愿已被神明郑重收进抽屉",Boolean(reward))}
function drawFortune(){const r=randomItem(fortunes);$("#fortuneResult").textContent=r;addHistory(`在${activeGod.temple}抽得：${r}`);toast("签落了。别太当真。",true)}

function showEvent({image,emoji,title,text,action}){const d=$("#eventDialog");$("#eventContent").innerHTML=`${image?`<img src="${image}" alt="${escapeHTML(title)}" class="event-image">`:`<div class="event-emoji">${emoji||"✨"}</div>`}<p class="eyebrow">菜市场突发事件</p><h2>${escapeHTML(title)}</h2><p>${escapeHTML(text)}</p>${action?`<button class="primary-btn" id="eventAction">${escapeHTML(action.label)}</button>`:""}`;if(action)$("#eventAction").addEventListener("click",()=>{action.run();d.close()});d.showModal()}

function renderCodex(){$("#codexProgress").textContent=`${state.discovered.length} / ${Object.keys(vegetables).length} 已见`;$("#collectionGrid").innerHTML=Object.entries(vegetables).map(([id,v])=>`<div class="collection-item ${state.discovered.includes(id)?"":"locked"}"><span>${state.discovered.includes(id)?v.emoji:"❔"}</span><b>${state.discovered.includes(id)?v.name:"未得此菜"}</b></div>`).join("");$("#historyList").innerHTML=state.history.length?state.history.map(h=>`<div class="history-item">${escapeHTML(h.text)}<time>${formatTime(h.time)}</time></div>`).join(""):'<div class="empty-state">尚无神迹。去种第一棵菜吧。</div>';$("#memeProgress").textContent=`${state.collectedMemes.length} / ${memes.length} 张`;$("#memeCollection").innerHTML=memes.map(m=>state.collectedMemes.includes(m.id)?`<button class="meme-card" data-meme="${m.id}"><img src="${m.src}" alt="${m.name}"><span>${m.name}</span></button>`:`<div class="meme-card locked"><span class="meme-lock">?</span><span>尚未收集</span></div>`).join("");$$('[data-meme]').forEach(b=>b.addEventListener("click",()=>{const m=memes.find(x=>x.id===b.dataset.meme);showEvent({image:m.src,title:m.name,text:"已收集的于神庙表情包。"})}))}

function setupWheel(){const wheel=$("#kingWheel");wheel.style.background=`conic-gradient(${gods.map((_,i)=>`${i%2?"#d9c893":"#6f9367"} ${i/gods.length*100}% ${(i+1)/gods.length*100}%`).join(",")})`;$("#spinWheel").addEventListener("click",()=>{const winner=Math.floor(Math.random()*gods.length),slice=360/gods.length,current=wheelRotation%360,target=360-winner*slice-slice/2;wheelRotation+=1440+((target-current+360)%360);wheel.style.transform=`rotate(${wheelRotation}deg)`;const mode=state.wheelMode==="vegetable"?"卖菜大王":"狗叫大王";setTimeout(()=>{$("#wheelResult").innerHTML=`本轮<strong>${mode}</strong>：${gods[winner].name}！`;addHistory(`${gods[winner].name}被转轮选为${mode}`)},2600)});$("#wheelMode").addEventListener("click",()=>{state.wheelMode=state.wheelMode==="vegetable"?"bark":"vegetable";save();updateWheelMode()});updateWheelMode()}
function updateWheelMode(){const veg=state.wheelMode==="vegetable";$("#wheelQuestion").textContent=veg?"谁是卖菜大王？":"谁是狗叫大王？";$("#wheelMode").textContent=veg?"切换：狗叫大王":"切换：卖菜大王"}

function setupDialogs(){$$('[data-close-dialog]').forEach(b=>b.addEventListener("click",()=>b.closest("dialog").close()));$("#profileBtn").addEventListener("click",()=>{$("#nicknameInput").value=state.nickname==="无名菜客"?"":state.nickname;$("#profileDialog").showModal()});$("#profileForm").addEventListener("submit",e=>{e.preventDefault();state.nickname=$("#nicknameInput").value.trim()||"无名菜客";save();$("#profileDialog").close();toast(`山门记住了：${state.nickname}`)});$("#seedPurse").addEventListener("click",()=>route("farm"));const skipped=Number(localStorage.getItem("vegelympus-welcome-skip")||0)>Date.now();if(!sessionStorage.getItem("vegelympus-welcomed")&&!skipped){const i=Math.floor(Math.random()*3);$("#guideMascot").src=`assets/hens/hen-${i+1}.png`;$("#guideName").textContent=henNames[i];setTimeout(()=>$("#welcomeDialog").showModal(),350);sessionStorage.setItem("vegelympus-welcomed","1")}$("#welcomeDialog").addEventListener("close",()=>{if($("#skipWelcome").checked)localStorage.setItem("vegelympus-welcome-skip",String(Date.now()+7*86400000))})}
function init(){renderHotspots();updateGlobalUI();setupDialogs();setupWheel();$$('[data-route]').forEach(b=>b.addEventListener("click",()=>route(b.dataset.route)));$("#clearHistory").addEventListener("click",()=>{state.history=[];save();renderCodex();toast("显灵记录已随风散去")});setInterval(()=>{if($("#farmView").classList.contains("active"))renderFarm();if($("#templeView").classList.contains("active")&&activeGod.id==="yu")renderYuTemple()},1000);document.addEventListener("visibilitychange",()=>{if(!document.hidden){state=loadState();updateGlobalUI();if($("#farmView").classList.contains("active"))renderFarm()}})}
init();
