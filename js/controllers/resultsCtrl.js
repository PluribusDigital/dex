app.controller("ResultsController", ['$scope', '$rootScope', '$location', 'SessionService', 'ResultsService', 'DataService', function ($scope, $rootScope, $location, SessionService, ResultsService, DataService) {
		//TODO: Find a better way to send in results
		$scope.results = $rootScope.results;

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

}])