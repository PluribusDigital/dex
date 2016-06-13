app.controller("ActionsController", ['$scope', '$routeParams', '$location', '$rootScope', 'DataService', '$uibModal',
function ($scope, $routeParams, $location, $rootScope, dataService, $uibModal) {
    $scope.pageTitle = "Review Feed";
    $scope.actions = [];
    $scope.provider = {};

    $scope.searchNPI = function(npi) {
    	
    	dataService.search(npi).then(function(res){
    		if (res.providers && res.providers.length === 1) {
    			$scope.provider = res.providers[0]
    			console.log($scope.provider)
    		} else {
    			// If didn't find NPI
    			var notFound = $uibModal.open({
    				templateUrl: 'templates/partials/not-found-modal.html',
            controller: function($scope, $uibModalInstance) {
	            $scope.ok = function() {
	              $uibModalInstance.close($scope.selected);
	            };
	            $scope.field = 'NPI'
	          }
    			});
    		}
    		
    	})
    }

    // Fetch Handlers
    $scope.onActionsLoaded = function (data) {
        $scope.actions = data;
    };

    // Start fetching the data from the REST endpoints
    dataService.getAllActions().then($scope.onActionsLoaded);

    //Listen for user from login
    $rootScope.$on('gotUser', function(event, data) {
    	$scope.user = data;
    	$scope.loggedIn = true;
    })
}]);
