app.controller("ProviderController", ['$scope', '$routeParams', '$location', 'DataService',
function ($scope, $routeParams, $location, dataService) {
    $scope.pageTitle = "Provider Detail";
    $scope.provider = {};
    $scope.actions = [];

    // Fetch Handlers
    $scope.onProviderLoaded = function (data) {
        $scope.provider = data
        angular.forEach(data.actions, function(action) {
            dataService.getAction(action.id).then($scope.onActionLoaded);
        });
    };

    $scope.onActionLoaded = function (data) {
        $scope.actions.push(data);
    };

    // Start fetching the data from the REST endpoints
    dataService.getProvider($routeParams.id).then($scope.onProviderLoaded);
}]);