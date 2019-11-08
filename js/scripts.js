function Order() {
  this.sizeOptions = {s:10, m:12, l:14, x:18};

}

function Pizza(size, toppings) {
  this.size = size;
  this.toppings = toppings;
  this.cost = 0;
}

Pizza.prototype.methodName = function () {
  if (this.size === 10) {

  } else if (this.size === 12) {

  } else if (this.size === 14) {

  } else if (this.size === 18) {

  } else {
    console.log("ERROR!");
  }
};














$(document).ready(function() {


});
