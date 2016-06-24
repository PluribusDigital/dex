app.controller("ProviderIndexController", function ($scope, DataService) {

  $scope.pageTitle = "Providers";
  $scope.searchText = "";

  $scope.search = function() {
    DataService.searchProviders($scope.searchText + "*").then($scope.onSearchResults);
  };

  $scope.onSearchResults = function(data) {
    $scope.providers = data;
  };
});
