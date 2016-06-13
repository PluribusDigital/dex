app.controller("ActionsController", ['$scope', '$routeParams', '$location', 'DataService', '$rootScope',
function ($scope, $routeParams, $location, dataService, $rootScope) {
    $scope.pageTitle = "Review Feed";
    $scope.actions = [];

    // Fetch Handlers
    $scope.onActionsLoaded = function (data) {
        $scope.actions = data;
    };

    // Start fetching the data from the REST endpoints
    dataService.getAllActions().then($scope.onActionsLoaded);

    //Listen for user from login
    $rootScope.$on('gotUser', function(event, data) {
    	$scope.user = data;
    })
}]);
