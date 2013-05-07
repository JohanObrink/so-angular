
(function() {

  'use strict';
  
  var sumItems = function(tot, cur) {
    return ((tot instanceof Array) ? tot.length : tot) + cur.length;
  };

  var toWeightedList = function(list) {
    var items = list.slice();
    var len = items.length +1;
    var val = 1/len;
    return { items: items, t: 1, n: len, v: val };
  };

  var sortByVal = function(w1, w2) {
    return w1.v - w2.v;
  };

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

  angular
    .module('soApp')
    .factory('weave', function() { return weave; });

})();