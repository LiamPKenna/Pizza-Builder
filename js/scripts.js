// MAIN LOGIC
function Order() {
  this.items = []
  this.orderTotal = 0.0;
  this.idCounter = 0;
};

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
};

Order.prototype.getOrderTotal = function() {
  let newTotal = 0;
  this.items.forEach(item => newTotal += item.cost);
  this.orderTotal = newTotal;
  return this.orderTotal;
};

Order.prototype.findItem = function(id) {
  for (var i = 0; i < this.items.length; i++) {
    if (this.items[i].id === id) {
      return this.items[i];
    };
  }
};

function Pizza(size, toppings) {
  this.size = size;
  this.toppings = toppings;
  this.cost = this.getCost();
};

Pizza.prototype.getCost = function() {
  const toppingCost = (toppingIndex, pricePerTopping) => {
    return this.toppings[toppingIndex].length * pricePerTopping;
  };
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

Pizza.prototype.removeTopping = function (topping) {
  const vegToppings = this.toppings[0].filter(t => t != topping);
  const meatToppings = this.toppings[1].filter(t => t != topping);
  this.toppings = [vegToppings, meatToppings];
  return this.getCost();
};

function Wings(count) {
  this.count = count;
  this.cost = this.getCost();
};

Wings.prototype.getCost = function() {
  let basePrice = 6;
  if (this.count === 12) basePrice += 5.5;
  this.cost = basePrice;
  return basePrice;
};


// GLOBAL VARIABLE
const order = new Order();


// TEMPLATING
function buildCartItem(item) {
  if (item.size) {
    const vegToppingsHtml = item.toppings[0].map(topping => {
      return `
        <li class="list-group-item"><button type="button" class="btn btn-danger btn-sm" item="${item.id}" value="${topping}">X</button> ${topping}</li>
      `
    });
    const meatToppingsHtml = item.toppings[1].map(topping => {
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
        <ul class="list-group details${item.id}">
          ${allToppingsHtml}
        </ul>
      </div>
      <div class="details-add-topping">
        <span class="show-details" id="show-details${item.id}" value="${item.id}">SHOW DETAILS</span>
        <span class="show-topping-modal" id="show-topping-modal${item.id}" value="${item.id}">ADD TOPPINGS</span>
        <span class="hide-details" id="hide-details${item.id}" value="${item.id}">HIDE DETAILS</span>
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
};


// UI
$(document).ready(function() {

  function hideCards() {
    $("#welcome").hide();
    $("#item-selection").hide();
    $("#pizza-builder").hide();
    $("#wing-builder").hide();
    $("#shopping-cart").hide();
  };

  function updateCart() {
    const currentTotal = order.getOrderTotal().toFixed(2);
    const cartItems = order.items;
    $("#cart-total").text(currentTotal);
    $("#nav-total").text(currentTotal);
    $(".cart-items").text('');
    $(".nav-wrap").fadeIn();
    cartItems.forEach(item => {
      const thisItem = buildCartItem(item);
      $(".cart-items").append(thisItem);
    });
  };

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
    $("input:checkbox").prop('checked', false);
    hideCards();
    $("#item-selection").fadeIn();
  });

  $("#add-wings").click(function() {
    const sixCountInput = parseInt($("#wings-count-6").text());
    const twelveCountInput = parseInt($("#wings-count-12").text());
    for (var i = 0; i < sixCountInput; i++) {
      const wings6 = new Wings(6);
      order.addItem(wings6);
    }
    for (var i = 0; i < twelveCountInput; i++) {
      const wings12 = new Wings(12);
      order.addItem(wings12);
    }
    $("#wings-count-6").text('0');
    $("#wings-count-12").text('0');
    updateCart();
    hideCards();
    $("#item-selection").fadeIn();
  });

  $("#wing-6").click(function() {
    let currentCount6 = parseInt($("#wings-count-6").text());
    currentCount6++;
    $("#wings-count-6").text(currentCount6);
  });

  $("#wing-12").click(function() {
    let currentCount12 = parseInt($("#wings-count-12").text());
    currentCount12++;
    $("#wings-count-12").text(currentCount12);
  });

  $(".cart-items").on("click", ".btn-danger", function(event) {
    if (isNaN(parseInt(this.value))) {
      const thisItemId = parseInt($(this).attr("item"));
      const thisItem = order.findItem(thisItemId);
      thisItem.removeTopping($(this).val());
      updateCart();
      $(`.details${thisItemId}`).show();
      $(`#show-details${thisItemId}`).hide();
      $(`#hide-details${thisItemId}`).show();
      $(`#show-topping-modal${thisItemId}`).show();
    } else {
      order.removeItem(parseInt(this.value));
      updateCart();
    }
  });

  $("#pizza-time").click(function() {
    hideCards();
    $("#pizza-builder").fadeIn();
  });

  $("#wing-time").click(function() {
    hideCards();
    $("#wing-builder").fadeIn();
  });

  $("#cart-time").click(function() {
    hideCards();
    $("#shopping-cart").fadeIn();
  });

  $(".go-time").click(function() {
    hideCards();
    $("#item-selection").fadeIn();
  });

  $(".logo").click(function() {
    hideCards();
    $("#welcome").fadeIn();
  });

  $("#payment-button").click(function() {
    const currentTotal = order.getOrderTotal().toFixed(2);
    $("#final-price").text(currentTotal);
    $(".payment-modal").modal("show")
  });

  $("#start-over").click(function() {
    location.reload();
  });

  $(".cart-wrap").on("click", ".show-details", function() {
    const itemId = $(this).attr("value");
    $(`.details${itemId}`).slideDown();
    $(`#show-details${itemId}`).hide();
    $(`#hide-details${itemId}`).fadeIn();
    $(`#show-topping-modal${itemId}`).fadeIn();
  });

  $(".cart-wrap").on("click", ".hide-details", function() {
    const itemId = $(this).attr("value");
    $(`.details${itemId}`).slideUp();
    $(`#show-details${itemId}`).fadeIn();
    $(`#hide-details${itemId}`).hide();
    $(`#show-topping-modal${itemId}`).hide();
  });

  $(".cart-wrap").on("click", ".show-topping-modal", function() {
    $("#hidden-id").text($(this).attr("value"));
    $(".topping-modal").modal("show");
  });

  $("#add-toppings").click(function() {
    const vegInputs = $("#veggie-toppings input:checked");
    const meatInputs = $("#meat-toppings input:checked");
    const veggiesSelected = [];
    const meatsSelected = [];
    for (let i = 0; i < vegInputs.length; i++) {
      veggiesSelected.push(vegInputs[i].value);
    }
    for (let i = 0; i < meatInputs.length; i++) {
      meatsSelected.push(meatInputs[i].value);
    }
    const itemId = parseInt($("#hidden-id").text());
    const thisItem = order.findItem(itemId);
    thisItem.addTopping(0, veggiesSelected);
    thisItem.addTopping(1, meatsSelected);
    updateCart();
    $("input:checkbox").prop('checked', false);
    $(".topping-modal").modal("hide");
    $(`.details${itemId}`).show();
    $(`#show-details${itemId}`).hide();
    $(`#hide-details${itemId}`).show();
    $(`#show-topping-modal${itemId}`).show();
  });

  hideCards();
  $("#welcome").fadeIn();

});
