function Order() {
  this.sizeOptions = {s:10, m:12, l:14, x:18};

}

function Pizza(size, toppings) {
  this.size = size;
  this.toppings = toppings;
  this.cost = 0;
}

Pizza.prototype.getCost = function () {
  const toppingCost = (toppingIndex, pricePerTopping) => {
    return this.toppings[toppingIndex].length * pricePerTopping;
  }
  let basePrice = 9
  if (this.size === 18) {
    basePrice = 16
  } else if (this.size) {
    basePrice = this.size - 1;
  } else {
    console.log("ERROR!");
  }
  const veggieCost = toppingCost(0,1.25);
  const meatCost = toppingCost(1,2);
  const totalCost = basePrice + veggieCost + meatCost;
  this.cost = totalCost;
  return totalCost;
};



const pizza1 = new Pizza(14, [["spinach"],["ham", "bacon","chicken"]]);
console.log(pizza1.getCost());










$(document).ready(function() {


});
