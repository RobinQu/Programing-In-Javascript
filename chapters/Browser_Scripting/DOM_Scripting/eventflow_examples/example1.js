// http://www.quirksmode.org/js/events_order.html

var $ = function(selector, root) {
  root = root || document;
  return root.querySelectorAll(selector);
};

$.on = function(elem, name, handler) {
  if(window.addEventListener) {
    elem.addEventListener(name, handler, false);
  } else if(window.attachEvent) {
    elem.attachEvent(name, handler);
  }
};


window.onload = function() {
  var level1 = $("#level1")[0],
      level2 = $("#level2")[0],
      level3 = $("#level3")[0];
  
  $.on(level1, "click", function() {
    console.log("click on level1");
  });
  
  $.on(level2, "click", function(e) {
    console.log("click on level2");
    e.stopImmediatePropagation();
    // e.stopPropagation();
  });
  
  $.on(level2, "click", function(e) {
    console.log("click on level2, second");
  });
  
  $.on(level3, "click", function() {
    console.log("click on level3");
  });
};