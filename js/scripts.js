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

function Wings(count) {
  this.count = count;
  this.cost = this.getCost();
}

Wings.prototype.getCost = function() {
  let basePrice = 6;
  if (this.count === 12) basePrice += 5.5;
  this.cost = basePrice;
  return basePrice;
};


const order = new Order();
const pizza1 = new Pizza(14, [["spinach"],["ham", "bacon"]]);
pizza1.addTopping(0,["olives","onions"]);
const pizza2 = new Pizza(18, [["olives","green peppers"],["chicken"]]);
const wings1 = new Wings(6);
const wings2 = new Wings(12);


order.addItem(pizza1);
order.addItem(pizza2);
order.addItem(wings1);
order.addItem(wings2);
console.log(pizza1);
console.log(pizza2);
console.log(order.getOrderTotal());
order.removeItem(1);
console.log(order.getOrderTotal());
console.log(order);













$(document).ready(function() {

  function hideCards() {
    $("#welcome").hide();
    $("#item-selection").hide();
    $("#pizza-builder").hide();
    $("#wing-builder").hide();
    $("#shopping-cart").hide();
  }

  $("#add-pizza").click(function() {
    const pizzaSizeInput = parseInt($("#pizza-size input:checked").val());
    const vegInputs = $("#veggie-selections input:checked");
    const meatInputs = $("#meat-selections input:checked");
    const veggiesSelected = [];
    const meatsSelected = [];
    for (let i = 0; i < vegInputs.length; i++) {
      veggiesSelected.push(vegInputs[i].id);
    }
    for (let i = 0; i < meatInputs.length; i++) {
      meatsSelected.push(meatInputs[i].id);
    }
    const pizza = new Pizza(pizzaSizeInput, [veggiesSelected, meatsSelected]);
    console.log(pizza);
  });

});
