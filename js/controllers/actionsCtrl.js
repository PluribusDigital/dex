app.controller("ActionsController", ['$scope', '$routeParams', '$location', 'DataService', '$uibModal', 'SessionService', 'ResultsService', 'AuthorizationService',
function ($scope, $routeParams, $location, dataService, $uibModal, SessionService, ResultsService, AuthorizationService) {

  $scope.pageTitle = "Review Feed";

  $scope.searchNPI = function(npi) {   	
    $scope.results = {};
    var results;
    dataService.searchNPI(npi).then(function(data){
      results = data.npi_api_response;
      ResultsService.setResults(results);
    
      // If didn't find NPI
      if (results === undefined || results.length === 0) {
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

  $scope.delete = function(action) {
    var user = SessionService.getUser();
    dataService.deleteAction(action.id, user.id)
  }

  $scope.setProvider = function(provider) {
    // Check if has an ID (is in our system already)
    $scope.provider = provider;
    ResultsService.setSelected(provider);
    $location.path('/create-action/form');
  }

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
      // Add the source into the action object
      $scope.stateActions.forEach(function(item, index){
        var createdBy = dataService.getUser(item.creator_id).then(function(res){
          $scope.stateActions[index].createdBy = res.state.abbreviation;
        })
      })
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
