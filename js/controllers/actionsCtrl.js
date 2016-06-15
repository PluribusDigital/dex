app.controller("ActionsController", function ($scope, $routeParams, $rootScope, $location, DataService, $uibModal, 
                                              SessionService, AuthorizationService) {
    $scope.pageTitle = "Review Feed";

    $scope.searchNPI = function(npi) {   
    	console.log('searching for ' + npi);	
    	DataService.search(npi).then(function(res){
    		$rootScope.results = res;
    		// if found in our system
    		if (res.providers && res.providers.length === 1) {
    			$scope.provider = res.providers[0];
    			$location.path('/results');
    		} else { 
    		// if not found in our system...
    			// Search the CMS API for the number

    			// If didn't find NPI
    			var notFound = $uibModal.open({
    				templateUrl: 'templates/partials/not-found-modal.html',
            controller: function($scope, $uibModalInstance) {
            	$scope.npi = npi;
	            $scope.ok = function() {
	              $uibModalInstance.close($scope.selected);
	            };
	          }
    			});
    		}
    		
    	})
    }

    //Search by name
    $scope.searchName = function(name) {
    	console.log('searching for ' + name);	
    	DataService.search(name).then(function(res){
    		console.log(res)
    	})
    };

    $scope._findAction = function(collection, id) {
        for (var i = 0; i < collection.length; i++) {
            if(collection[i].id == id)
                return collection[i];
        };

        return null;
    };

    $scope.markFound = function (id) {
        var item = $scope._findAction($scope.stateActions, id);
        if( item )
            item.response = 'Found';
    };

    $scope.markNotFound = function (id) {
        var item = $scope._findAction($scope.stateActions, id);
        if( item )
            item.response = 'Not Found';
    };

    // Fetch Handlers
    $scope.onAdminActionsLoaded = function (data) {
        $scope.adminActions = data;
        $scope.pageTitle = "Review Feed - Admin";
    };

    $scope.onStateActionsLoaded = function (data) {
        $scope.stateActions = data.acknowledgements.pending;
        $scope.pageTitle = "Review Feed - " + data.name;
    };

    // Start fetching the data from the REST endpoints
    if( !AuthorizationService.inRole('state_user') )
        DataService.getAllActions().then($scope.onAdminActionsLoaded);
    else {
        var id = SessionService.getUser().state_id;
        DataService.getStateAcknowledgements(id).then($scope.onStateActionsLoaded);
    }
});
