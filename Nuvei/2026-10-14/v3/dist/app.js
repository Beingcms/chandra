const families = [
  {id:'acceptance',name:'Payment Acceptance',short:'Acceptance'},
  {id:'payouts',name:'Payouts',short:'Payouts'},
  {id:'risk',name:'Fraud & Risk',short:'Fraud & Risk'},
  {id:'issuing',name:'Card Issuing',short:'Issuing'},
  {id:'recon',name:'Reconciliation',short:'Reconciliation'},
  {id:'orchestration',name:'Payment Orchestration',short:'Orchestration'}
];
// Capability-level demo products: these are not verified commercial SKUs or packaging.
const catalogue = [
  {id:'acquiring',family:'acceptance',name:'Global acquiring',short:'Acquiring',benefit:'Collect payments through the acquiring capability',question:'Which checkout markets or payment channels need support?'},
  {id:'apm',family:'acceptance',name:'Alternative payment methods',short:'APMs',benefit:'Offer relevant local payment methods alongside existing acquiring',question:'Which local methods are customers asking to use?'},
  {id:'payoutsCore',family:'payouts',name:'Payouts',short:'Payouts',benefit:'Simplify outbound payments to suppliers, sellers or customers',question:'Who needs to be paid, and in which markets?'},
  {id:'payoutsRealtime',family:'payouts',name:'Real-time payouts',short:'Real-time',benefit:'Add a faster payout option within the existing Payouts family',question:'Where would faster funds availability improve the recipient experience?'},
  {id:'fraud',family:'risk',name:'Fraud prevention',short:'Fraud prevention',benefit:'Strengthen transaction risk controls',question:'Which fraud patterns are creating the greatest loss or friction?'},
  {id:'chargeback',family:'risk',name:'Chargeback resolution',short:'Chargebacks',benefit:'Add dispute and chargeback support alongside existing fraud controls',question:'How much time and revenue are disputes consuming?'},
  {id:'issuingVirtual',family:'issuing',name:'Virtual card issuing',short:'Virtual cards',benefit:'Support a relevant supplier or customer payment workflow with virtual cards',question:'Which payment workflow would benefit from virtual cards?'},
  {id:'issuingPhysical',family:'issuing',name:'Physical card issuing',short:'Physical cards',benefit:'Explore physical cards alongside an existing virtual-card programme',question:'Is there an in-person payment use case for programme participants?'},
  {id:'reconAutomation',family:'recon',name:'Automated reconciliation',short:'Automated',benefit:'Reduce manual matching and settlement reporting',question:'Which matching or settlement tasks create the most manual work?'},
  {id:'reconManaged',family:'recon',name:'Managed reconciliation',short:'Managed',benefit:'Explore managed support for an existing reconciliation workflow',question:'Would managed setup, updates and reporting remove an operational burden?'},
  {id:'orchestrationHub',family:'orchestration',name:'Payment orchestration hub',short:'Hub',benefit:'Coordinate a multi-provider payment setup',question:'How are payment providers and routing rules managed today?'},
  {id:'orchestrationRouting',family:'orchestration',name:'Smart transaction routing',short:'Smart routing',benefit:'Explore routing optimisation within an existing orchestration setup',question:'Where do declines or provider routing create avoidable friction?'}
];
const rawMerchants = [
  ['Northstar Travel','Travel','Europe',true,'Positive','Expansion',['acceptance','payouts','recon','orchestration']],
  ['Atlas Market','Marketplace','North America',true,'Positive','Growing',['acceptance','payouts','risk','recon']],
  ['Ember Games','Gaming','Europe',true,'Neutral','Launch',['acceptance','risk','orchestration']],
  ['Solace Retail','Retail','Europe',false,'Positive','Stable',['acceptance','payouts','recon']],
  ['Mosaic Cloud','SaaS','North America',true,'Positive','Growing',['acceptance','risk','issuing','recon']],
  ['Harbor Mobility','Travel','APAC',true,'Neutral','Expansion',['acceptance','payouts','recon','orchestration']],
  ['Juniper Pay','Financial Services','Europe',true,'Positive','Launch',['acceptance','risk','issuing','recon','orchestration']],
  ['Lumen Home','Retail','North America',false,'Neutral','Stable',['acceptance','payouts','recon']],
  ['Aster Tickets','Travel','Europe',true,'Positive','Expansion',['acceptance','payouts','risk','orchestration']],
  ['Orbit Bazaar','Marketplace','APAC',true,'Neutral','Growing',['acceptance','payouts','recon']],
  ['Pinecone Labs','SaaS','Europe',false,'Negative','Stable',['acceptance','issuing']],
  ['Velora Sports','Retail','North America',true,'Positive','Expansion',['acceptance','payouts','recon','orchestration']],
  ['Nova Arcade','Gaming','APAC',true,'Neutral','Growing',['acceptance','risk','issuing']],
  ['Willow Works','SaaS','Europe',false,'Positive','Stable',['acceptance','recon']],
  ['Drift Commerce','Retail','North America',true,'Positive','Growing',['acceptance','issuing','recon']],
  ['Cobalt Exchange','Financial Services','APAC',true,'Neutral','Launch',['acceptance','risk','issuing','orchestration']],
  ['Terra Supply','Marketplace','Europe',false,'Negative','Stable',['acceptance','recon']],
  ['Crest Payments','Financial Services','Europe',true,'Positive','Growing',['payouts','risk','recon']],
  ['Meadow Studios','Gaming','North America',false,'Neutral','Stable',['issuing','orchestration','recon']],
  ['Summit Services','Marketplace','APAC',true,'Positive','Expansion',['payouts','recon']]
];
const primaryProduct = {acceptance:'acquiring',payouts:'payoutsCore',risk:'fraud',issuing:'issuingVirtual',recon:'reconAutomation',orchestration:'orchestrationHub'};
const extraProductHolders = {
  apm:[2,3,4,7,9,12,13,16],payoutsRealtime:[2,4,8,12,18,20],chargeback:[2,3,7,9,18],
  issuingPhysical:[5,7,13,19],reconManaged:[2,4,5,7,8,12,14,18],orchestrationRouting:[1,3,7,9,19]
};
const countryGroups = {Europe:['UK','France','Germany'],'North America':['US','Canada','Mexico'],APAC:['Australia','Singapore','Japan']};
const nextMarketGroups = {Europe:['Spain','Italy'],'North America':['Brazil','Colombia'],APAC:['Malaysia','Thailand']};
const merchants = rawMerchants.map((m,i)=>{
  const heldProducts=m[6].map(f=>primaryProduct[f]);
  for(const [id,holders] of Object.entries(extraProductHolders)) if(holders.includes(i+1)) heldProducts.push(id);
  return {id:`m${i+1}`,name:m[0],vertical:m[1],region:m[2],multi:m[3],sentiment:m[4],market:m[5],
    productHoldings:heldProducts,holdings:[...new Set(heldProducts.map(id=>catalogue.find(p=>p.id===id).family))],
    countries:m[3]?countryGroups[m[2]]:[countryGroups[m[2]][0]],
    nextMarkets:m[5]==='Expansion'?nextMarketGroups[m[2]]:[],callId:`CALL-${String(i+1).padStart(3,'0')}`,marketId:`MKT-${String(i+1).padStart(3,'0')}`};
});
const minBase=5;
const state={view:'overview',source:'acceptance',crossThreshold:40,upThreshold:40,region:'All',vertical:'All',multi:false,company:'m1',selectedCross:null,selectedUp:null};
const titles={overview:'Overview',matrix:'Who buys what',crosssell:'Cross-sell: new family',upsell:'Upsell: same family',company:'Customer details',walkthrough:'Demo steps',method:'How it works'};
const familyById=id=>families.find(f=>f.id===id);
const productById=id=>catalogue.find(p=>p.id===id);
const rateText=n=>`${n.toFixed(1)}%`;
const initials=name=>name.split(' ').map(w=>w[0]).join('');
const $=selector=>document.querySelector(selector);
function filteredMerchants(){return merchants.filter(m=>(state.region==='All'||m.region===state.region)&&(state.vertical==='All'||m.vertical===state.vertical)&&(!state.multi||m.multi));}
function attachRate(source,target,kind='family'){
  const field=kind==='family'?'holdings':'productHoldings';
  const base=merchants.filter(m=>m[field].includes(source)),both=base.filter(m=>m[field].includes(target));
  return {numerator:both.length,denominator:base.length,rate:base.length?both.length/base.length*100:0};
}
function priority(m,rate){return Math.min(99,Math.round(rate+(m.multi?9:0)+(m.sentiment==='Positive'?5:m.sentiment==='Negative'?-5:0)+(['Growing','Expansion'].includes(m.market)?5:0)));}
function readiness(m){return m.sentiment==='Negative'?'Resolve concerns first':m.sentiment==='Positive'&&['Growing','Expansion'].includes(m.market)?'Prioritise conversation':'Validate interest';}
function sortRecommendations(list){return list.sort((a,b)=>(a.merchant.sentiment==='Negative')-(b.merchant.sentiment==='Negative')||b.priority-a.priority||a.merchant.name.localeCompare(b.merchant.name)||a.target.name.localeCompare(b.target.name));}
function crossCandidates(m,sourceIds=[state.source]){
  const byTarget=new Map();
  for(const source of families.filter(f=>sourceIds.includes(f.id)&&m.holdings.includes(f.id))){
    for(const target of families.filter(f=>f.id!==source.id&&!m.holdings.includes(f.id))){
      const rate=attachRate(source.id,target.id);
      if(rate.denominator<minBase||rate.rate<state.crossThreshold)continue;
      const o={kind:'crosssell',merchant:m,source,target,family:target,...rate,priority:priority(m,rate.rate),key:`${m.id}:cross:${target.id}`};
      const old=byTarget.get(target.id);
      if(!old||o.rate>old.rate||(o.rate===old.rate&&source.name.localeCompare(old.source.name)<0))byTarget.set(target.id,o);
    }
  }
  return sortRecommendations([...byTarget.values()]);
}
function upCandidates(m,familyIds=[state.source]){
  const byTarget=new Map();
  for(const family of families.filter(f=>familyIds.includes(f.id)&&m.holdings.includes(f.id))){
    const options=catalogue.filter(p=>p.family===family.id);
    for(const source of options.filter(p=>m.productHoldings.includes(p.id)))for(const target of options.filter(p=>!m.productHoldings.includes(p.id))){
      const rate=attachRate(source.id,target.id,'product');
      if(rate.denominator<minBase||rate.rate<state.upThreshold)continue;
      const o={kind:'upsell',merchant:m,source,target,family,...rate,priority:priority(m,rate.rate),key:`${m.id}:up:${target.id}`};
      const old=byTarget.get(target.id);
      if(!old||o.rate>old.rate||(o.rate===old.rate&&source.name.localeCompare(old.source.name)<0))byTarget.set(target.id,o);
    }
  }
  return sortRecommendations([...byTarget.values()]);
}
function recommendations(kind){return sortRecommendations(filteredMerchants().flatMap(m=>kind==='crosssell'?crossCandidates(m):upCandidates(m)));}
function companyRecommendations(m){return sortRecommendations([...crossCandidates(m,m.holdings),...upCandidates(m,m.holdings)]);}
const familyBenefits={acceptance:'Expand payment collection with Payment Acceptance',payouts:'Add Payouts for outbound payments',risk:'Add Fraud & Risk to strengthen transaction and dispute controls',issuing:'Explore Card Issuing for supplier or customer payment workflows',recon:'Add Reconciliation to reduce manual matching and settlement reporting',orchestration:'Add Payment Orchestration to coordinate payment providers and routing'};
function recommendationTitle(o){return o.kind==='crosssell'?familyBenefits[o.target.id]:`Add ${o.target.name} within ${o.family.name}`;}
function recommendationBenefit(o){return o.kind==='crosssell'?familyBenefits[o.target.id]:o.target.benefit;}
function callExcerpt(m){return m.sentiment==='Negative'?'Settlement reporting remains a concern. We need this resolved before discussing additional products.':m.nextMarkets.length?`We are planning to enter ${m.nextMarkets.join(' and ')} and want fewer manual steps in our payment operations.`:m.multi?'We operate across several markets and want fewer manual steps in our payment operations.':'We are reviewing our payment setup. Show us the operational benefit before we add another service.';}
function marketExcerpt(m){return m.nextMarkets.length?`Illustrative expansion plan: ${m.nextMarkets.join(' and ')}.`:m.market==='Growing'?'Illustrative growth in transaction volumes and payment complexity.':m.market==='Launch'?'Illustrative service launch with a payment-workflow review.':'No specific expansion event in this synthetic snapshot.';}
function accountSignal(m){return m.sentiment==='Negative'?'The call raises an unresolved service concern. Resolve it before product outreach.':m.nextMarkets.length?`The mock call identifies planned expansion into ${m.nextMarkets.join(' and ')} and a need for simpler operations.`:m.multi?'The mock call describes multi-country operations and manual payment work.':m.market==='Growing'?'The mock market signal suggests growing payment volumes.':'The mock call asks for an operational benefit before adding a capability.';}
function rationale(o){
  const m=o.merchant;
  if(m.sentiment==='Negative')return 'Keep this recommendation for after the settlement-reporting concern is resolved.';
  if(o.kind==='upsell'&&o.target.id==='payoutsRealtime')return 'Faster payouts are a relevant discovery topic alongside their existing outbound payment workflow.';
  if(o.target.id==='recon'||o.target.family==='recon')return 'Their request for fewer manual steps makes payment reconciliation a focused discussion.';
  if(m.nextMarkets.length)return `Use the planned ${m.nextMarkets.join(' / ')} expansion to discuss the merchant’s requirements for this capability.`;
  if(m.market==='Growing')return 'Growing volumes provide a reason to discuss operational benefit now.';
  return 'The holdings pattern supports a discovery conversation; validate the merchant’s specific use case.';
}
function action(o){return o.merchant.sentiment==='Negative'?`Resolve the service concern first; then revisit ${o.target.name}.`:`${recommendationBenefit(o)}. ${o.kind==='upsell'?o.target.question:'Discuss the merchant’s specific use case and operational benefit.'} Confirm entitlements, country availability and commercial terms before a proposal.`;}
function rateExplanation(o){return `${o.numerator} of ${o.denominator} merchants holding ${o.source.name} also hold ${o.target.name}: ${rateText(o.rate)}`;}
function thresholdFor(o){return o.kind==='crosssell'?state.crossThreshold:state.upThreshold;}
function kindLabel(o){return o.kind==='crosssell'?'Cross-sell':'Upsell';}
function populateFilters(){
  $('#source-filter').innerHTML=families.map(f=>`<option value="${f.id}">${f.name}</option>`).join('');
  for(const field of ['region','vertical'])[...new Set(merchants.map(m=>m[field]))].forEach(v=>$(`#${field}-filter`).insertAdjacentHTML('beforeend',`<option>${v}</option>`));
  $('#company-filter').innerHTML=merchants.map(m=>`<option value="${m.id}">${m.name}</option>`).join('');
  $('#taxonomy-table').tBodies[0].innerHTML=families.map(f=>`<tr><th scope="row">${f.name}</th><td>${catalogue.filter(p=>p.family===f.id).map(p=>p.name).join(' · ')}</td></tr>`).join('');
}
function topList(selector,list){
  const container=$(selector);
  container.innerHTML=list.length?list.slice(0,4).map((o,i)=>`<button class="alert-row" data-top="${i}"><div class="merchant-icon">${initials(o.merchant.name)}</div><div><strong>${o.merchant.name}</strong><small>${o.target.name} · ${kindLabel(o)}</small><small>${rateText(o.rate)} attach · ${readiness(o.merchant)}</small></div><div class="alert-value"><b>${o.priority}</b><span>Priority</span></div></button>`).join(''):'<div class="empty">No recommendations meet the current comparison and threshold.</div>';
  container.querySelectorAll('[data-top]').forEach(el=>el.onclick=()=>openRecommendation(list[+el.dataset.top]));
}
function renderOverview(){
  const cross=recommendations('crosssell'),up=recommendations('upsell');
  $('#merchant-count').textContent=filteredMerchants().length;$('#cross-count').textContent=cross.length;$('#up-count').textContent=up.length;
  $('#account-count').textContent=new Set([...cross,...up].map(o=>o.merchant.id)).size;
  topList('#top-cross',cross);topList('#top-up',up);
}
function matrixCell(source,target,kind,threshold){
  const a=attachRate(source.id,target.id,kind),self=source.id===target.id,pass=!self&&a.denominator>=minBase&&a.rate>=threshold;
  return `<td class="${self?'association-self':''}" title="${a.numerator} of ${a.denominator} holders of ${source.name} also hold ${target.name}"><strong class="${pass?'meets-threshold':''}">${a.denominator?rateText(a.rate):'N/A'}</strong><br><small>${a.numerator} / ${a.denominator}${self?' · Same item':a.denominator<minBase?' · Small base':''}</small></td>`;
}
function renderMatrix(){
  const table=$('#association-table');
  table.tHead.innerHTML=`<tr><th>Already holds (row A)<br><small>Read across →</small></th>${families.map(f=>`<th>Also holds (column B)<br>${f.short}</th>`).join('')}</tr>`;
  table.tBodies[0].innerHTML=families.map(f=>`<tr class="${f.id===state.source?'selected-source':''}"><th scope="row"><button class="text-btn" data-source="${f.id}">${f.name}</button><br><small>${merchants.filter(m=>m.holdings.includes(f.id)).length} source merchants</small></th>${families.map(t=>matrixCell(f,t,'family',state.crossThreshold)).join('')}</tr>`).join('');
  table.querySelectorAll('[data-source]').forEach(el=>el.onclick=()=>changeSource(el.dataset.source));
  const forward=attachRate('acceptance','risk'),reverse=attachRate('risk','acceptance');
  $('#association-example').textContent=`Acceptance → Fraud & Risk: ${forward.numerator}/${forward.denominator} = ${rateText(forward.rate)}. Reverse direction: ${reverse.numerator}/${reverse.denominator} = ${rateText(reverse.rate)}. 3 of the 20 merchants do not hold Acceptance.`;
  const footprint=$('#matrix-table');
  footprint.tHead.innerHTML=`<tr><th>Merchant</th>${families.map(f=>`<th>${f.short}</th>`).join('')}</tr>`;
  footprint.tBodies[0].innerHTML=filteredMerchants().map(m=>`<tr><td><button class="text-btn" data-company="${m.id}">${m.name}</button><br><small>${m.countries.length} ${m.multi?'countries':'country'}</small></td>${families.map(f=>{
    if(m.holdings.includes(f.id))return '<td><span class="matrix-cell held" title="Already purchased">Held</span></td>';
    const o=crossCandidates(m).find(o=>o.target.id===f.id);
    return o?`<td><button class="matrix-cell qualified" data-gap="${o.key}" title="Open cross-sell recommendation">Add ↗</button></td>`:'<td><span class="matrix-cell gap" title="Missing family; current rule not met">—</span></td>';
  }).join('')}</tr>`).join('');
  footprint.querySelectorAll('[data-company]').forEach(el=>el.onclick=()=>openCompany(el.dataset.company));
  footprint.querySelectorAll('[data-gap]').forEach(el=>el.onclick=()=>{const o=recommendations('crosssell').find(o=>o.key===el.dataset.gap);if(o)openRecommendation(o);});
}
function renderProductMatrix(){
  const options=catalogue.filter(p=>p.family===state.source),table=$('#product-table');
  $('#product-matrix-title').textContent=`Within ${familyById(state.source).name}`;
  table.tHead.innerHTML=`<tr><th>Already holds (product A)</th>${options.map(p=>`<th>Also holds (product B)<br>${p.name}</th>`).join('')}</tr>`;
  table.tBodies[0].innerHTML=options.map(p=>`<tr><th scope="row">${p.name}<br><small>${merchants.filter(m=>m.productHoldings.includes(p.id)).length} source merchants</small></th>${options.map(t=>matrixCell(p,t,'product',state.upThreshold)).join('')}</tr>`).join('');
}
function renderList(kind){
  const isCross=kind==='crosssell',prefix=isCross?'cross':'up',list=recommendations(kind),key=isCross?'selectedCross':'selectedUp';
  $(`#${prefix}-total`).textContent=`${list.length} recommendations`;
  const current=list.find(o=>o.key===state[key]);state[key]=current?current.key:list[0]?.key||null;
  $(`#${prefix}-list`).innerHTML=list.length?list.map(o=>`<button class="opp-row ${o.key===state[key]?'selected':''}" data-key="${o.key}"><div class="merchant-icon">${initials(o.merchant.name)}</div><div><h4>${o.merchant.name} → ${o.target.name}</h4><p>${isCross?'Missing family':`Within ${o.family.name}`} · already holds ${o.source.name}</p><div class="tags"><span class="tag hot">${rateText(o.rate)} attach rate</span><span class="tag">${o.merchant.countries.length} ${o.merchant.countries.length===1?'country':'countries'}</span><span class="tag">${readiness(o.merchant)}</span></div></div><div class="priority"><strong>${o.priority}</strong><span>Demo priority</span></div></button>`).join(''):`<div class="empty">No ${isCross?'cross-sell':'upsell'} recommendations meet the current rules. Change the comparison family, threshold or filters.</div>`;
  $(`#${prefix}-list`).querySelectorAll('[data-key]').forEach(el=>el.onclick=()=>{state[key]=el.dataset.key;renderList(kind);});
  renderDetail(list.find(o=>o.key===state[key]),prefix);
  if(!isCross)renderProductMatrix();
}
function renderDetail(o,prefix){
  const panel=$(`#${prefix}-detail`);
  if(!o){panel.innerHTML='<div class="detail-empty"><strong>No recommendation selected</strong><p>Evidence appears when the current rules identify a gap.</p></div>';return;}
  const m=o.merchant;
  panel.innerHTML=`<div class="detail-merchant"><div class="merchant-icon">${initials(m.name)}</div><div><h3>${m.name}</h3><p>${m.vertical} · ${m.region}</p></div></div><div class="detail-callout"><span>${kindLabel(o)} · ${m.sentiment==='Negative'?'After recovery':'Recommended account action'}</span><strong>${recommendationTitle(o)}</strong></div><div class="next-action"><span>${readiness(m)}</span><p>${action(o)}</p></div><div class="evidence"><div class="evidence-row"><span>Existing holding</span><strong>${o.source.name}</strong></div><div class="evidence-row"><span>Missing ${o.kind==='crosssell'?'family':'product'}</span><strong>${o.target.name}</strong></div><div class="evidence-row"><span>Minimum attach rule</span><strong>${rateText(o.rate)} ≥ ${thresholdFor(o)}%</strong></div><div class="evidence-row"><span>Comparison base</span><strong>${o.numerator} of ${o.denominator} source holders</strong></div><div class="evidence-row"><span>Countries</span><strong>${m.countries.join(', ')}</strong></div><div class="evidence-row"><span>Why now</span><strong>${m.sentiment} call · ${m.market} context</strong></div></div><p class="detail-rationale">${rationale(o)}</p><button class="primary-btn purple" data-detail-company="${m.id}">Customer details →</button><button class="text-btn" data-download-key="${o.key}">Download account brief</button><p class="subtext">Synthetic evidence. Attach rate is not buying probability.</p>`;
  panel.querySelectorAll('[data-detail-company]').forEach(el=>el.onclick=()=>openCompany(el.dataset.detailCompany));
  panel.querySelectorAll('[data-download-key]').forEach(el=>el.onclick=()=>downloadBrief(o));
}
function recommendationCard(o,index){return `<article class="recommendation-card ${index===0&&o.merchant.sentiment!=='Negative'?'top-recommendation':''}"><span class="recommendation-rank">${String(index+1).padStart(2,'0')}</span><div class="recommendation-copy"><div class="recommendation-heading"><h3>${o.target.name}</h3><span class="recommendation-priority">${kindLabel(o)} · ${o.priority} priority</span></div><p class="recommendation-pitch">${recommendationBenefit(o)}</p><p><strong>Why now:</strong> ${rationale(o)}</p><p class="recommendation-gap">Already buys ${o.source.name} · ${o.target.name} missing${o.kind==='upsell'?` · same family: ${o.family.name}`:''}</p><details class="recommendation-support"><summary>Why this recommendation?</summary><p>${rateExplanation(o)}. Minimum attach rate: ${thresholdFor(o)}%; minimum source base: ${minBase}.</p><p>${o.merchant.sentiment} call (${o.merchant.callId}) · ${o.merchant.market} market context (${o.merchant.marketId}) · ${o.merchant.countries.length} ${o.merchant.countries.length===1?'country':'countries'}.</p><p>Priority is a demo sorting rule, not buying probability. Confirm need, entitlements and availability.</p></details></div></article>`;}
function renderCompany(){
  const m=merchants.find(m=>m.id===state.company),all=companyRecommendations(m),cross=all.filter(o=>o.kind==='crosssell'),up=all.filter(o=>o.kind==='upsell');
  const lead=all[0],negative=m.sentiment==='Negative';
  const title=negative?'Resolve the settlement-reporting concern':lead?recommendationTitle(lead):'Confirm the next payment need';
  const leadAction=negative?'Agree a service-recovery plan before proposing additional capabilities. Recommendations below remain visible for a later conversation.':lead?action(lead):'No product gap passes the current policies. Discuss the merchant’s goals before changing the comparison rules.';
  const rolloutFamily=m.holdings.includes('payouts')?familyById('payouts'):familyById(m.holdings[0]);
  $('#company-content').innerHTML=`<article class="panel company-header"><div><p class="eyebrow">SYNTHETIC MERCHANT PROFILE</p><h2>${m.name}</h2><p>${m.vertical} · current markets: ${m.countries.join(' / ')}</p></div><button class="text-btn" id="download-plan">Download account plan ↓</button></article><article class="company-lead ${negative?'service-recovery':''}"><div><p class="eyebrow">${negative?'SERVICE RECOVERY FIRST':'RECOMMENDED NEXT SALE'}</p><h3>${title}</h3><p>${leadAction}</p>${lead?`<span class="lead-type">${kindLabel(lead)} · ${lead.source.name} → ${lead.target.name}</span>`:''}</div><div class="lead-evidence"><strong>Why now</strong><p>${accountSignal(m)}</p>${lead?`<small>${rateExplanation(lead)}<br>${lead.priority} demo priority · ${readiness(m)}</small>`:''}</div></article>
  ${m.nextMarkets.length?`<article class="panel rollout-card"><p class="eyebrow">ADDITIONAL ACCOUNT ACTION · MARKET EXPANSION</p><h3>${negative?'After recovery: explore':'Explore'} existing ${rolloutFamily.name} in ${m.nextMarkets.join(' and ')}</h3><p>The mock call names these next markets. Validate rollout needs, entitlements and local availability. This is separate from missing-product qualification and is not included in recommendation counts.</p></article>`:''}
  <div class="content-grid account-opportunity-columns"><article class="panel company-recommendations"><div class="panel-head"><div><p class="eyebrow">DIFFERENT FAMILY</p><h3>Cross-sell · ${cross.length}</h3><p class="subtext">${negative?'After recovery':'Missing families, strongest first'}</p></div></div><div class="recommendation-list">${cross.length?cross.map(recommendationCard).join(''):'<div class="empty">No missing family meets the current cross-sell policy.</div>'}</div></article><article class="panel company-recommendations"><div class="panel-head"><div><p class="eyebrow">EXISTING FAMILY</p><h3>Upsell · ${up.length}</h3><p class="subtext">${negative?'After recovery':'Missing products, strongest first'}</p></div></div><div class="recommendation-list">${up.length?up.map(recommendationCard).join(''):'<div class="empty">No missing product meets the current upsell policy.</div>'}</div></article></div>
  <div class="content-grid company-evidence"><article class="panel"><p class="eyebrow">WHAT THEY ALREADY BUY</p><h3>Actual demo product holdings</h3><div class="product-stack">${m.holdings.map(id=>`<div><button class="text-btn" data-account-source="${id}">${familyById(id).name}</button><p>${m.productHoldings.filter(pid=>productById(pid).family===id).map(pid=>productById(pid).name).join(' · ')}</p></div>`).join('')}</div><p class="subtext">Select a family to explore its portfolio comparison.</p></article><article class="panel evidence-card"><p class="eyebrow">CALL EVIDENCE · SIMULATED</p><h3>${m.sentiment} relationship</h3><blockquote>${callExcerpt(m)}</blockquote><p class="subtext">${m.callId} · mock call · 10 Oct 2026</p></article><article class="panel evidence-card"><p class="eyebrow">MARKET EVIDENCE · SIMULATED</p><h3>${m.market}</h3><blockquote>${marketExcerpt(m)}</blockquote><p class="subtext">${m.marketId} · mock event · 12 Oct 2026</p></article><article class="panel"><p class="eyebrow">CONVERSATION PLAN</p><h3>Move the discussion forward</h3><ol class="account-questions">${negative?'<li>What outcome would resolve the settlement-reporting concern?</li><li>Who will own the resolution and the follow-up?</li>':`${lead?`<li>${lead.kind==='upsell'?lead.target.question:`Where could ${lead.target.name} provide the greatest operational benefit?`}</li>`:''}${m.nextMarkets.length?`<li>What is the launch plan for ${m.nextMarkets.join(' and ')}?</li>`:''}<li>Is the capability already included in an existing entitlement?</li><li>Which availability and commercial requirements need confirmation?</li>`}</ol></article></div><p class="company-boundary">Illustrative product recommendations and evidence. Confirm merchant fit and commercial packaging during discovery.</p>`;
  $('#download-plan').onclick=()=>downloadCompanyPlan(m,all,title,leadAction);
  $('#company-content').querySelectorAll('[data-account-source]').forEach(el=>el.onclick=()=>{changeSource(el.dataset.accountSource);setView('matrix');});
}
function saveText(name,content){const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);showToast('Account brief downloaded · no CRM write');}
function briefText(o){return `${kindLabel(o)}: ${o.target.name}\nExisting holding: ${o.source.name}\nFamily: ${o.family.name}\n${rateExplanation(o)}\nMinimum attach: ${thresholdFor(o)}%; comparison base: ${minBase}+\nDemo priority: ${o.priority}/99 (not a purchase probability)\nWhy now: ${rationale(o)}\nNext action: ${action(o)}\n`;}
function downloadBrief(o){saveText(`${o.merchant.name.replaceAll(' ','_')}_${kindLabel(o)}_Brief.txt`,`NUVEI CONCEPT DEMO — SYNTHETIC EVIDENCE\n\n${o.merchant.name}\n${briefText(o)}\nCALL ${o.merchant.callId}: ${callExcerpt(o.merchant)}\nMARKET ${o.merchant.marketId}: ${marketExcerpt(o.merchant)}\n\nNo CRM record or outreach created.\n`);}
function downloadCompanyPlan(m,all,title,leadAction){saveText(`${m.name.replaceAll(' ','_')}_Account_Plan.txt`,`NUVEI ACCOUNT PLAN — SYNTHETIC DEMO\n\n${m.name}\nCurrent countries: ${m.countries.join(', ')}\nHeld products: ${m.productHoldings.map(id=>productById(id).name).join(', ')}\n\nLEAD ACTION: ${title}\n${leadAction}\n\n${all.map(briefText).join('\n')}\n${m.nextMarkets.length?`Separate market rollout discussion: ${m.nextMarkets.join(', ')}. Validate scope and availability.\n`:''}CALL ${m.callId}: ${callExcerpt(m)}\nMARKET ${m.marketId}: ${marketExcerpt(m)}\n\nAll product groupings and signals are illustrative. No revenue forecast, CRM write or message sent.\n`);}
function openCompany(id){state.company=id;$('#company-filter').value=id;setView('company');}
function openRecommendation(o){state[o.kind==='crosssell'?'selectedCross':'selectedUp']=o.key;setView(o.kind);}
function changeSource(id){state.source=id;state.selectedCross=null;state.selectedUp=null;$('#source-filter').value=id;renderAll();}
function setView(view){state.view=view;document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el.id===`${view}-view`));document.querySelectorAll('[data-view]').forEach(el=>{el.classList.toggle('active',el.dataset.view===view);el.setAttribute('aria-current',el.dataset.view===view?'page':'false');});$('#page-title').textContent=titles[view];renderAll();window.scrollTo({top:0,behavior:'instant'});}
const storySteps=[
  {title:'01 Start with the portfolio',say:'We know what merchants already buy. Whitespace means the next relevant capability: a missing family or a missing product within an existing family.',button:'Open overview',setup:'overview'},
  {title:'02 Explain one cross-sell pattern',say:'Seven of seventeen Acceptance merchants also hold Fraud & Risk: 41.2%. At a 40% minimum, Acceptance merchants missing Risk get a recommendation. At 42%, that pairing stops qualifying.',button:'Show the 7-of-17 example',setup:'matrix'},
  {title:'03 Show the missing upsell',say:'Northstar already buys Payouts but lacks Real-time payouts. Six of ten Payouts holders also have Real-time payouts: 60%. This supports adding a product inside the same family.',button:'Open Payouts opportunities',setup:'upsell'},
  {title:'04 Turn signals into an account action',say:'Open Northstar. We lead with the next product, show the existing holding and evidence, and discuss a possible rollout into Spain and Italy. These are synthetic planning signals; availability remains to be checked.',button:'Open Northstar’s details',setup:'company'},
  {title:'05 Handle concerns before selling',say:'Pinecone has negative relationship sentiment. It stays visible, but its lead action is service recovery. Product recommendations are saved for after that concern is resolved.',button:'Open recovery example',setup:'recovery'}
];
function renderStory(){
  $('#story-cards').innerHTML=storySteps.map((s,i)=>`<article class="panel story-card"><h3>${s.title}</h3><p>${s.say}</p><button class="primary-btn purple" data-story="${i}">${s.button} →</button></article>`).join('');
  $('#story-cards').querySelectorAll('[data-story]').forEach(el=>el.onclick=()=>runStory(+el.dataset.story));
}
function runStory(index){resetDemo(false);const setup=storySteps[index].setup;if(setup==='upsell'){state.source='payouts';$('#source-filter').value='payouts';state.selectedUp=upCandidates(merchants[0],['payouts'])[0]?.key||null;setView('upsell');}else if(setup==='recovery'){openCompany('m11');}else if(setup==='company'){openCompany('m1');}else setView(setup);}
function resetDemo(toast=true){Object.assign(state,{view:'overview',source:'acceptance',crossThreshold:40,upThreshold:40,region:'All',vertical:'All',multi:false,company:'m1',selectedCross:null,selectedUp:null});$('#source-filter').value='acceptance';$('#cross-threshold').value=40;$('#up-threshold').value=40;$('#company-filter').value='m1';$('#region-filter').value='All';$('#vertical-filter').value='All';$('#multi-filter').checked=false;setView('overview');if(toast)showToast('Demo reset · both thresholds 40%');}
function renderAll(){
  $('#cross-label').textContent=`${state.crossThreshold}%`;$('#up-label').textContent=`${state.upThreshold}%`;
  const sourceCount=merchants.filter(m=>m.holdings.includes(state.source)).length;
  $('#scope-note').textContent=`20 synthetic merchants · ${sourceCount} hold ${familyById(state.source).name}. Filters change displayed accounts; attach rates use the full portfolio. Minimum comparison base: ${minBase}. Thresholds are illustrative.`;
  renderOverview();if(state.view==='matrix')renderMatrix();if(state.view==='crosssell'||state.view==='upsell')renderList(state.view);if(state.view==='company')renderCompany();
}
function showToast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800);}
populateFilters();renderStory();
document.querySelectorAll('[data-view],[data-view-jump]').forEach(el=>el.onclick=()=>setView(el.dataset.view||el.dataset.viewJump));
for(const [id,field] of [['cross-threshold','crossThreshold'],['up-threshold','upThreshold']])$(`#${id}`).oninput=e=>{state[field]=+e.target.value;state.selectedCross=null;state.selectedUp=null;renderAll();};
$('#source-filter').onchange=e=>changeSource(e.target.value);
for(const field of ['region','vertical'])$(`#${field}-filter`).onchange=e=>{state[field]=e.target.value;state.selectedCross=null;state.selectedUp=null;renderAll();};
$('#multi-filter').onchange=e=>{state.multi=e.target.checked;state.selectedCross=null;state.selectedUp=null;renderAll();};
$('#company-filter').onchange=e=>{state.company=e.target.value;renderCompany();};
$('#refresh-btn').onclick=()=>resetDemo();renderAll();
