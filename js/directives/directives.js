app.directive('dexAddress', function() {
  return {
    restrict: 'A',
    scope: {
      address: '=dexAddress'
    },
    templateUrl: 'js/directives/address.html'
  };
});