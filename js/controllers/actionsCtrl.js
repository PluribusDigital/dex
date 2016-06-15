app.controller("ActionsController", ['$scope', '$routeParams', '$location', 'DataService', '$uibModal', 'SessionService', 'ResultsService', 'AuthorizationService',
function ($scope, $routeParams, $location, dataService, $uibModal, SessionService, ResultsService, AuthorizationService) {

    $scope.pageTitle = "Review Feed";
    $scope.adminActions = [];

    $scope.searchNPI = function(npi) {   
    	dataService.search(npi).then(function(res){
    		$scope.results = res;
    		// if found in our system
    		if (res.providers && res.providers.length === 1) {
    			$scope.provider = res.providers[0];
    		} else { 
    		// if not found in our system...
    			// Search the CMS API for the number
          var results;
          dataService.searchNPI(npi).then(function(data){
            results = data.npi_api_response.body.results;
            ResultsService.setResults(results);
            
            // If didn't find NPI
            if (results === undefined) {
              var notFound = $uibModal.open({
                templateUrl: 'templates/partials/not-found-modal.html',
                controller: function($scope, $uibModalInstance) {
                  $scope.npi = npi;
                  $scope.ok = function() {
                    $uibModalInstance.close($scope.selected);
                  };
                }
              });
            } else {
              $scope.results.providers = ResultsService.formatResults(results);

            }
          })    			
    		}		
    	})
    }

    $scope.delete = function(action) {
        var user = SessionService.getUser();
        dataService.deleteAction(action.id, user.id)
    }

    $scope.setProvider = function(provider) {
      // Check if has an ID (is in our system already)
      if (provider.id){
        $scope.provider = provider;
        ResultsService.setSelected(provider);
        $location.path('/create-action/form');
      } else { // if not in system, put in there
        console.log(provider)
      }
    }

    $scope.createAction = function() {
      $scope.provider = ResultsService.getSelected();
      var user = SessionService.getUser();
      var date = new Date();
      date = date.getDate() + 30;
      var postData =  {
        status: 'under_review',
        action_type: $scope.action.type,
        reason: [$scope.action.reason],
        provider_id: $scope.provider.id,
        address_id: $scope.provider.mailing_address_id,
        //expiration_timestamp: date,
        practice_address: $scope.provider.mailing_address,
        //attachments: ['']
      }

      DataService.createAction(JSON.stringify(postData), user.id);
    }

    //Search by name
    $scope.searchName = function(name) {
    	console.log('searching for ' + name);	
    	DataService.search(name).then(function(res){
    		console.log(res)
    	})
    }

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
        dataService.getAllActions().then($scope.onAdminActionsLoaded);
    else {
        var id = SessionService.getUser().state_id;
        dataService.getStateAcknowledgements(id).then($scope.onStateActionsLoaded);
    }
}]);
