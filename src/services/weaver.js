
(function() {

  'use strict';
  
  // sumItems
  // returns the total sum of all items in all arrays
  var sumItems = function(tot, cur) {
    return ((tot instanceof Array) ? tot.length : tot) + cur.length;
  };

  // toWeighted list
  // constructs an object with information needed for weighted selection from array
  var toWeightedList = function(list) {
    var items = list.slice();
    var len = items.length +1;
    var val = 1/len;
    return { items: items, t: 1, n: len, v: val };
  };

  // sortByVal
  // returns sorting based on .v property
  var sortByVal = function(w1, w2) {
    return w1.v - w2.v;
  };

  // weave
  // takes an array of arrays of possibly different lengths and interweaves them evenly
  var weave = function(lists, total) {

    if(!total) {
      total = lists.reduce(sumItems);
    }
    var weighted = lists.map(toWeightedList);
    var result = [];

    for(var i=0; i<total; i++) {
      var cur = weighted.sort(sortByVal)[0];

      cur.t++;
      cur.v = cur.t/cur.n;
      result.push(cur.items.shift());
    }

    return result;
  };

  // register as an angular service
  angular
    .module('soApp')
    .factory('weave', function() { return weave; });

})();