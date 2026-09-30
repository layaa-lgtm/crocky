const assert=require('node:assert/strict');
const demo=require('../readiness_demo.js');
const one=demo.schedule({},1,5,()=>0);
assert.equal(one.slots.length,1);
const store={};const plan=demo.schedule(store,1,5,()=>.99);
assert.equal(plan.slots.length,2);
assert.equal(new Set(plan.slots).size,2);
const recovered=JSON.parse(JSON.stringify(store));
assert.deepEqual(demo.schedule(recovered,1,5,()=>{throw Error('Must not rerandomize');}),plan);
let shown=0;
for(let day=1;day<=7;day++) {
  if(demo.visit(plan,day) && demo.canShow(plan,day)) {
    demo.markShown(plan,day);shown++;
    assert.equal(demo.canShow(plan,day),false);
  }
}
assert.equal(shown,2);
demo.markShown(plan,99);assert.equal(plan.shownDays.length,2);
assert.equal(demo.schedule({},1,1,()=>.99).slots.length,1);
const fresh=demo.schedule(store,2,3,()=>.99);
assert.equal(fresh.shownDays.length,0);
const kept=demo.schedule({},1,2,()=>.99);kept.decisions[1]='kept';
assert.equal(demo.canShow(kept,1),false);
console.log('Demo schedule: one/two appearances, unique slots, persistence, cap, decisions, and new-week reset passed.');
