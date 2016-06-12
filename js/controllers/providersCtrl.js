app.controller("ProviderController", ['$scope', '$routeParams', '$location', 'DataService',
function ($scope, $routeParams, $location, dataService) {
    $scope.pageTitle = "Provider Detail";
    $scope.usStates = [];
    $scope.provider = {};
    $scope.actions = [];

    // Fetch Handlers
    $scope.onStatesLoaded = function (data) {
        $scope.usStates = data.map(function (o) {
            return o.abbreviation;
        })
    };

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
    dataService.getAllStates().then($scope.onStatesLoaded);
    dataService.getProvider($routeParams.id).then($scope.onProviderLoaded);
}]);