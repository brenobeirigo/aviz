const STATUS_CARRYING = "carrying";
let a = [...Array(4).keys()];
let carryingStatuses = [...Array(4).keys()].map(v => STATUS_CARRYING + (v + 1));
carryingStatuses.forEach(v=>console.log(v));
console.log(a, carryingStatuses);