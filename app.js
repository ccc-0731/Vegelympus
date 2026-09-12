const STORAGE_KEY = "vegelympus-save-v1";
const MAX_PLOTS = 10;
const GROW_MS = 30_000;

const vegetables = {
  cabbage: { name: "白菜", emoji: "🥬", desc: "清白且百搭" },
  bokchoy: { name: "小白菜", emoji: "🌱", desc: "小而精神" },
  roundcabbage: { name: "卷心菜", emoji: "🟢", desc: "心事很多层" },
  spinach: { name: "菠菜", emoji: "🍃", desc: "力量的错觉" },
  shepherd: { name: "荠菜", emoji: "🌿", desc: "山野隐藏款" },
  cilantro: { name: "香菜", emoji: "☘️", desc: "立场鲜明" },
  radish: { name: "萝卜", emoji: "🫜", desc: "拔出一个真相" },
  eggplant: { name: "茄子", emoji: "🍆", desc: "紫气东来" },
  carrot: { name: "胡萝卜", emoji: "🥕", desc: "目光长远" },
  chili: { name: "辣椒", emoji: "🌶️", desc: "发言有力度" }
};

const gods = [
  { id:"baicai", name:"百财真君", title:"掌管余额与清白", symbol:"🥬", pos:[56,20], temple:"百财殿", quote:"愿你的余额，像白菜叶一样层层叠叠。", wants:"cabbage", gives:"radish" },
  { id:"juanxin", name:"卷心上神", title:"掌管心事与群聊", symbol:"🟢", pos:[48,31], temple:"千层心宫", quote:"别猜了。没回消息，大概只是在睡觉。", wants:"roundcabbage", gives:"cilantro" },
  { id:"bocai", name:"菠菜大力仙", title:"掌管体测与临时抱佛脚", symbol:"🍃", pos:[65,35], temple:"力叶神庙", quote:"真正的力量，是截止前一晚突然涌现。", wants:"spinach", gives:"carrot" },
  { id:"jicai", name:"荠野隐士", title:"掌管答案与失物", symbol:"🌿", pos:[41,45], temple:"寻常观", quote:"你找的东西，多半就在你刚看过的地方。", wants:"shepherd", gives:"spinach" },
  { id:"xiangcai", name:"香菜判官", title:"掌管爱憎分明", symbol:"☘️", pos:[72,51], temple:"香断两仪殿", quote:"世间没有中间派，只有还没想好的香菜派。", wants:"cilantro", gives:"chili" },
  { id:"luobo", name:"萝卜地母", title:"掌管扎根与远行", symbol:"🫜", pos:[35,57], temple:"白玉根祠", quote:"向下扎根，是为了有一天被连根拔起去旅行。", wants:"radish", gives:"eggplant" }
];

const fortunes = [
  "上上签 · 今日发言，必有表情包回应。",
  "上签 · 宜约饭，忌说“下次一定”。",
  "中签 · 群聊虽静，友情仍在后台运行。",
  "中签 · 迟到七分钟，可解释为仙缘未到。",
  "吉签 · 会遇到一棵理解你的菜。",
  "菜签 · 不宜内耗，宜吃火锅。",
  "秘签 · 你以为没人记得的事，大家都记得。",
  "平签 · 今天没有大事，这本身就是好事。"
];

const guideNames = ["小白菜","大白菜","小卷心菜","大卷心菜","小菠菜","大菠菜","小荠菜","大荠菜","小香菜","大香菜"];

function defaultState(){
  return {
    seeds:{cabbage:3,bokchoy:2,roundcabbage:2,spinach:2,shepherd:1,cilantro:1,radish:0,eggplant:0,carrot:0,chili:0},
    harvest:{}, plots:Array(MAX_PLOTS).fill(null), discovered:["cabbage","bokchoy"], history:[], wishes:{}, nickname:"无名菜客", selectedSeed:"cabbage"
  };
}

function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(!saved) return defaultState();
    return {...defaultState(),...saved,seeds:{...defaultState().seeds,...saved.seeds},harvest:{...saved.harvest},plots:[...saved.plots,...Array(MAX_PLOTS).fill(null)].slice(0,MAX_PLOTS)};
  }catch{return defaultState()}
}

let state = loadState();
let activeGod = gods[0];
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value).replace(/[&<>'"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));updateGlobalUI()}
function totalSeeds(){return Object.values(state.seeds).reduce((a,b)=>a+b,0)}
function addHistory(text){state.history.unshift({text,time:Date.now()});state.history=state.history.slice(0,60);save()}
function toast(message,gold=false){
  const node=document.createElement("div");node.className=`toast${gold?" gold":""}`;node.textContent=message;$("#toastRegion").append(node);setTimeout(()=>node.remove(),3200);
}
function formatTime(ts){return new Intl.DateTimeFormat("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(ts)}

function route(name, options={}){
  $$(".view").forEach(v=>v.classList.toggle("active",v.dataset.view===name));
  $$(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.route===name || (name==="temple"&&b.dataset.route==="map")));
  if(name==="farm") renderFarm();
  if(name==="market") renderMarket();
  if(name==="codex") renderCodex();
  if(name==="temple"){activeGod=options.god||activeGod;renderTemple()}
  window.scrollTo({top:0,behavior:"smooth"});
}

function renderHotspots(){
  $("#templeHotspots").innerHTML=gods.map(g=>`<button class="hotspot" data-god="${g.id}" style="left:${g.pos[0]}%;top:${g.pos[1]}%" aria-label="进入${g.temple}"><span class="hotspot-dot">${g.symbol}</span><label>${g.temple} · ${g.name}</label></button>`).join("");
  $$(".hotspot").forEach(btn=>btn.addEventListener("click",()=>route("temple",{god:gods.find(g=>g.id===btn.dataset.god)})));
}

function updateGlobalUI(){
  $("#seedCount").textContent=totalSeeds();
  $("#profileAvatar").textContent=(state.nickname||"游").slice(0,1);
}

function renderSeedChoices(){
  $("#seedChoices").innerHTML=Object.entries(vegetables).map(([id,v])=>`<button class="seed-choice ${state.selectedSeed===id?"selected":""}" data-seed="${id}" ${state.seeds[id]<=0?"disabled":""}><span class="emoji">${v.emoji}</span><span><b>${v.name}</b><small>${v.desc}</small></span><strong>× ${state.seeds[id]||0}</strong></button>`).join("");
  $$(".seed-choice").forEach(btn=>btn.addEventListener("click",()=>{state.selectedSeed=btn.dataset.seed;save();renderSeedChoices()}));
}

function renderFarm(){
  const occupied=state.plots.filter(Boolean).length;
  $("#plotCapacity").textContent=`${occupied} / ${MAX_PLOTS} 畦`;
  renderSeedChoices();
  const now=Date.now();
  $("#farmPlots").innerHTML=state.plots.map((plot,i)=>{
    if(!plot)return `<button class="plot empty" data-plot="${i}"><span class="plus">＋</span><small>播种</small></button>`;
    const v=vegetables[plot.type],elapsed=now-plot.plantedAt,ready=elapsed>=GROW_MS,remain=Math.max(0,Math.ceil((GROW_MS-elapsed)/1000)),progress=Math.min(100,elapsed/GROW_MS*100);
    return `<button class="plot ${ready?"ready":"growing"}" data-plot="${i}"><span class="plant">${ready?v.emoji:(elapsed>15000?"🌿":"🌱")}</span><b>${v.name}</b><small>${ready?"点击收菜":`${remain} 秒后成熟`}</small><i class="progress" style="width:${progress}%"></i></button>`;
  }).join("");
  $$(".plot").forEach(btn=>btn.addEventListener("click",()=>handlePlot(Number(btn.dataset.plot))));
}

function handlePlot(index){
  const plot=state.plots[index];
  if(!plot){
    const seed=state.selectedSeed;
    if(!seed || !state.seeds[seed]){toast("菜种匣里没有这种种子了");return}
    state.seeds[seed]--;state.plots[index]={type:seed,plantedAt:Date.now()};addHistory(`在第 ${index+1} 畦种下了${vegetables[seed].name}`);renderFarm();toast(`${vegetables[seed].name}已入土，30 秒后见`);return;
  }
  if(Date.now()-plot.plantedAt<GROW_MS){toast("莫急，拔苗只会得到一脸土");return}
  const id=plot.type;state.harvest[id]=(state.harvest[id]||0)+1;state.plots[index]=null;
  if(!state.discovered.includes(id))state.discovered.push(id);
  addHistory(`收获了一棵${vegetables[id].name}`);renderFarm();toast(`收菜成功：${vegetables[id].emoji} ${vegetables[id].name} +1`,true);
}

function inventoryText(){
  const items=Object.entries(state.harvest).filter(([,n])=>n>0).map(([id,n])=>`${vegetables[id].emoji} ${vegetables[id].name} ×${n}`);
  return items.join("　")||"空空如也，先去山脚种菜吧";
}
function renderMarket(){
  $("#inventorySummary").textContent=inventoryText();
  $("#marketStalls").innerHTML=gods.map(g=>`<button class="stall-card" data-stall="${g.id}"><span class="god-symbol">${g.symbol}</span><h3>${g.name}</h3><p>${g.title}</p><div class="trade-line">${vegetables[g.wants].emoji} ${vegetables[g.wants].name} ×1 <span>换</span> ${vegetables[g.gives].emoji} ${vegetables[g.gives].name}种 ×2</div></button>`).join("");
  $$(".stall-card").forEach(btn=>btn.addEventListener("click",()=>openTrade(gods.find(g=>g.id===btn.dataset.stall))));
}

function openTrade(g){
  const owned=state.harvest[g.wants]||0,dialog=$("#tradeDialog");
  $("#tradeContent").innerHTML=`<p class="eyebrow">${g.temple} · 山腰摊位</p><h2>${g.name}</h2><p>“${g.quote}”</p><div class="trade-offer">交出 ${vegetables[g.wants].emoji} ${vegetables[g.wants].name} ×1<br>换取 ${vegetables[g.gives].emoji} ${vegetables[g.gives].name}种 ×2</div><p>你现有：${vegetables[g.wants].name} ×${owned}</p><button class="primary-btn" id="confirmTrade" ${owned<1?"disabled":""}>${owned<1?"菜不够，暂且告辞":"成交，击掌为誓"}</button>`;
  $("#confirmTrade").addEventListener("click",()=>{
    if((state.harvest[g.wants]||0)<1)return;
    state.harvest[g.wants]--;state.seeds[g.gives]=(state.seeds[g.gives]||0)+2;
    addHistory(`与${g.name}交易，获得两枚${vegetables[g.gives].name}种`);dialog.close();renderMarket();toast("交易完成，菜货两讫",true);
  });dialog.showModal();
}

function renderTemple(){
  const g=activeGod,wishes=state.wishes[g.id]||[];
  $("#templeContent").innerHTML=`
    <div class="temple-banner"><p class="eyebrow">${g.temple} · 神域</p><h2>${g.name}</h2><p>${g.title}。${g.quote}</p><span class="temple-symbol">${g.symbol}</span></div>
    <div class="temple-grid">
      <article class="panel"><div class="panel-title"><span>神坛 · 烧香祈福</span><small>香火不收费</small></div><div class="altar-actions"><button data-incense="清香">🕯️ 一炷清香</button><button data-incense="菜香">🥬 一缕菜香</button></div><form class="wish-form" id="wishForm"><textarea maxlength="120" placeholder="写下一句想对${g.name}说的话……" required></textarea><button class="primary-btn" type="submit">敬呈神明</button></form><div class="wish-list">${wishes.length?wishes.map(w=>`<div class="wish">${escapeHTML(w.text)}<small>${escapeHTML(w.author)} · ${formatTime(w.time)} · 本机祈愿</small></div>`).join(""):'<div class="empty-state">尚无祈愿，神明正在假装忙碌。</div>'}</div></article>
      <article class="panel"><div class="panel-title"><span>灵签筒</span><small>每日可无限迷信</small></div><div class="fortune-box"><div class="fortune-stick" id="fortuneStick">🎋</div><div class="fortune-result" id="fortuneResult">心诚则灵，手快也灵</div><button class="primary-btn" id="drawFortune">摇一支菜签</button></div><p class="hint">本殿自留菜地：${vegetables[g.wants].emoji} ${vegetables[g.wants].name}。到山腰摊位可与神明交换作物。</p><button class="text-btn" id="visitStall">前往${g.name}的摊位 →</button></article>
    </div>`;
  $$('[data-incense]').forEach(b=>b.addEventListener("click",()=>toast(`${b.dataset.incense}已燃，神明闻到了`)));
  $("#wishForm").addEventListener("submit",e=>{e.preventDefault();submitWish(e.currentTarget.querySelector("textarea").value.trim())});
  $("#drawFortune").addEventListener("click",drawFortune);
  $("#fortuneStick").addEventListener("click",drawFortune);
  $("#visitStall").addEventListener("click",()=>{route("market");setTimeout(()=>openTrade(g),120)});
}

function submitWish(text){
  if(!text)return;
  state.wishes[activeGod.id]=[{text,author:state.nickname,time:Date.now()},...(state.wishes[activeGod.id]||[])].slice(0,20);
  let reward="";
  if(Math.random()<.36){const pool=Object.keys(vegetables),seed=pool[Math.floor(Math.random()*pool.length)];state.seeds[seed]=(state.seeds[seed]||0)+1;reward=`；神坛后滚出一枚${vegetables[seed].name}种`}
  addHistory(`向${activeGod.name}呈上祈愿${reward}`);renderTemple();toast(reward?reward.slice(1):"祈愿已被神明郑重收进抽屉",Boolean(reward));
}

function drawFortune(){
  const result=fortunes[Math.floor(Math.random()*fortunes.length)];$("#fortuneResult").textContent=result;addHistory(`在${activeGod.temple}抽得：${result}`);toast("签落了。别太当真。",true);
}

function renderCodex(){
  $("#codexProgress").textContent=`${state.discovered.length} / ${Object.keys(vegetables).length} 已见`;
  $("#collectionGrid").innerHTML=Object.entries(vegetables).map(([id,v])=>`<div class="collection-item ${state.discovered.includes(id)?"":"locked"}"><span>${state.discovered.includes(id)?v.emoji:"❔"}</span><b>${state.discovered.includes(id)?v.name:"未得此菜"}</b></div>`).join("");
  $("#historyList").innerHTML=state.history.length?state.history.map(h=>`<div class="history-item">${escapeHTML(h.text)}<time>${formatTime(h.time)}</time></div>`).join(""):'<div class="empty-state">尚无神迹。去种第一棵菜吧。</div>';
}

function setupDialogs(){
  $$('[data-close-dialog]').forEach(b=>b.addEventListener("click",()=>b.closest("dialog").close()));
  $("#profileBtn").addEventListener("click",()=>{$("#nicknameInput").value=state.nickname==="无名菜客"?"":state.nickname;$("#profileDialog").showModal()});
  $("#profileForm").addEventListener("submit",e=>{e.preventDefault();state.nickname=$("#nicknameInput").value.trim()||"无名菜客";save();$("#profileDialog").close();toast(`山门记住了：${state.nickname}`)});
  $("#seedPurse").addEventListener("click",()=>route("farm"));
  const skipped=Number(localStorage.getItem("vegelympus-welcome-skip")||0)>Date.now();
  if(!sessionStorage.getItem("vegelympus-welcomed")&&!skipped){
    $("#guideName").textContent=guideNames[Math.floor(Math.random()*guideNames.length)];
    setTimeout(()=>$("#welcomeDialog").showModal(),350);sessionStorage.setItem("vegelympus-welcomed","1");
  }
  $("#welcomeDialog").addEventListener("close",()=>{if($("#skipWelcome").checked)localStorage.setItem("vegelympus-welcome-skip",String(Date.now()+7*86400000))});
}

function init(){
  renderHotspots();updateGlobalUI();setupDialogs();
  $$('[data-route]').forEach(btn=>btn.addEventListener("click",()=>route(btn.dataset.route)));
  $("#clearHistory").addEventListener("click",()=>{state.history=[];save();renderCodex();toast("显灵记录已随风散去")});
  setInterval(()=>{if($("#farmView").classList.contains("active"))renderFarm()},1000);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden){state=loadState();updateGlobalUI();if($("#farmView").classList.contains("active"))renderFarm()}});
}

init();
