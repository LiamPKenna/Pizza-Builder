function Order() {
  this.items = []
  this.orderTotal = 0.0;
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
const wings1 = new Wings(6);


order.addItem(pizza1);
order.addItem(wings1);
console.log(order);



// TEMPLATING
function buildCartItem(item) {
  if (item.size) {
    const vegToppingsHtml = item.toppings[0].map(topping => {
      return `
        <li class="list-group-item"><button type="button" class="btn btn-danger btn-sm" item="${item.id}" value="${topping}">X</button> ${topping}</li>
      `
    });
    const meatToppingsHtml = item.toppings[0].map(topping => {
      return `
        <li class="list-group-item"><button type="button" class="btn btn-danger btn-sm" item="${item.id}" value="${topping}">X</button> ${topping}</li>
      `
    });
    const allToppingsHtml = vegToppingsHtml.join('') + meatToppingsHtml.join('');
    return `
    <div class="card">
      <div class="order-item-heading card-grid">
        <h5 class="item-name"><button type="button" class="btn btn-danger btn-sm" value="${item.id}">X</button> ${item.size}" Pizza</h5>
        <h5 class="item-price">$${item.cost.toFixed(2)}</h5>
      </div>
      <div class="order-item-details">
        <ul class="list-group">
          ${allToppingsHtml}
        </ul>
      </div>
    </div>
    `
  } else {
    return `
    <div class="card">
      <div class="order-item-heading card-grid">
        <h5 class="item-name"><button type="button" class="btn btn-danger btn-sm" value="${item.id}">X</button> ${item.count} Count Wings</h5>
        <h5 class="item-price">$${item.cost.toFixed(2)}</h5>
      </div>
    </div>
    `
  }
}







// UI
$(document).ready(function() {

  function hideCards() {
    $("#welcome").hide();
    $("#item-selection").hide();
    $("#pizza-builder").hide();
    $("#wing-builder").hide();
    $("#shopping-cart").hide();
  }

  function updateCart() {
    const currentTotal = order.getOrderTotal();
    const cartItems = order.items;
    $("#cart-total").text(currentTotal.toFixed(2));
    cartItems.forEach(item => {
      const thisItem = buildCartItem(item);
      $(".cart-items").append(thisItem);
    });
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
    order.addItem(pizza);
    updateCart()
    // hideCards();
    // $("#item-selection").fadeIn();
  });

  $(".cart-items").on("click", ".btn-danger", function(event) {
    if (isNaN(parseInt(this.value))) {
      const thisItem = $(this).attr("item");
      thisItem.removeTopping($(this).val());
    } else {
      order.removeItem(parseInt(this.value));
    }
    updateCart();
  });

  updateCart();

});
