

angular.module('ng').filter('numbere', function () {

  var postfix = ['P', 'T', 'G', 'M', 'k', '', 'm', 'µ', , 'n', 'p', 'f'];


  return function (value) {

    if(typeof value == 'undefined') return '';

    var index = 5;

    while (value > 1000) {
      value = value / 1000;
      index--;
    }

    while (value < 1) {
      value = value * 1000;
      index++;
    }

    var fixed = 3;
    if (value > 9.99) fixed = 2;
    if (value > 99.9) fixed = 1;
    if (value > 999) fixed = 0;


    return value.toFixed(fixed) + postfix[index];

  };
});