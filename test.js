query = { price: { gte: "3" }, address: { regex: "2" } };
let condition = {};

for (let [key, childObj] of Object.entries(query)) {
  //console.log(childObj);
  for (let [k, v] of Object.entries(childObj)) {
    //console.log(k, v);
    if (k != "regex") {
      k = "$" + k;
      tempObj = {};
      tempObj[k] = v;
      condition[key] = tempObj;
    } else {
      v = new RegExp(v, "i");
      condition[key] = v;
    }
  }
}
console.log(condition);
