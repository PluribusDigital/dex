app.controller("ActionsController", ['$scope', '$routeParams', '$location', 'DataService',
function ($scope, $routeParams, $location, dataService) {
    $scope.pageTitle = "Review Feed";
    $scope.actions = [];

    // Fetch Handlers
    $scope.onActionsLoaded = function (data) {
        $scope.actions = data;
    };

    // Start fetching the data from the REST endpoints
    dataService.getAllActions().then($scope.onActionsLoaded);
}]);
