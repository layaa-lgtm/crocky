/* Stable demo scheduling. Randomize appearances, never model predictions. */
(function(root) {
  'use strict';
  function schedule(store, week, goalDays, random = Math.random) {
    const key = String(week);
    if (!store[key]) {
      const count = Math.max(1, Math.min(7, Number(goalDays) || 1));
      const slots = Array.from({length:count}, (_,i)=>i+1);
      for (let i=slots.length-1;i>0;i--) {
        const j=Math.floor(random()*(i+1)); [slots[i],slots[j]]=[slots[j],slots[i]];
      }
      const appearances = count===1 ? 1 : 1+Math.floor(random()*2);
      store[key]={slots:slots.slice(0,appearances).sort((a,b)=>a-b), eligibleDays:[], shownDays:[], decisions:{}};
    }
    return store[key];
  }
  function visit(plan, day) {
    if (!plan.eligibleDays.includes(day)) plan.eligibleDays.push(day);
    return plan.slots.includes(plan.eligibleDays.indexOf(day)+1);
  }
  function canShow(plan, day) {
    return plan.shownDays.length<2 && !plan.shownDays.includes(day) && !plan.decisions[day];
  }
  function markShown(plan, day) {
    if (!plan.shownDays.includes(day) && plan.shownDays.length<2) plan.shownDays.push(day);
  }
  const api={schedule,visit,canShow,markShown};
  if (typeof module==='object' && module.exports) module.exports=api;
  else root.CrockyReadinessDemo=api;
})(typeof window==='undefined' ? globalThis : window);
