function Order() {
  this.items = []
  this.orderTotal = 0;
  this.idCounter = 0;
}

Order.prototype.addItem = function(item) {
  item.id = this.idCounter;
  this.idCounter++;
  this.items.push(item);
  return this.items;
};

Order.prototype.removeItem = function(id) {
  const newItemsList = this.items.filter(item => item.id != id);
  this.items = newItemsList;
  return this.items;
}

Order.prototype.getOrderTotal = function() {
  let newTotal = 0;
  this.items.forEach(item => newTotal += item.cost);
  this.orderTotal = newTotal;
  return this.orderTotal;
};

function Pizza(size, toppings) {
  this.size = size;
  this.toppings = toppings;
  this.cost = this.getCost();
}

Pizza.prototype.getCost = function() {
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

Pizza.prototype.addTopping = function(vegOrMeatIndex, toppingArray) {
  const existingToppings = this.toppings[vegOrMeatIndex];
  this.toppings[vegOrMeatIndex] = existingToppings.concat(toppingArray);
  return this.getCost();
};

Pizza.prototype.removeTopping = function (vegOrMeatIndex, topping) {
  const existingToppings = this.toppings[vegOrMeatIndex];
  const newToppings = existingToppings.filter(t => t != topping);
  this.toppings[vegOrMeatIndex] = newToppings;
  return this.getCost();
};



const pizza1 = new Pizza(14, [["spinach"],["ham", "bacon","chicken"]]);
console.log(pizza1);
console.log(pizza1.getCost());
pizza1.addTopping(0,["olives","green peppers"]);
console.log(pizza1);
pizza1.removeTopping(1,"chicken");
console.log(pizza1);











$(document).ready(function() {


});
