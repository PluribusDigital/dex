app.controller("ActionsController", ['$scope', '$routeParams', '$location', 'DataService', '$uibModal', 'SessionService', 'ResultsService', 'AuthorizationService', 'UserService',
function ($scope, $routeParams, $location, dataService, $uibModal, SessionService, ResultsService, AuthorizationService, UserService) {

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
    dataService.deleteAction(action.id, user.id, function(){
      $location.path('/actions')
    })
  }

  $scope.setProvider = function(provider) {
    // Check if has an ID (is in our system already)
    $scope.provider = provider;
    ResultsService.setSelected(provider);
    $location.path('/create-action/form');
  }

  // ---------------------------------------------------------------------------
  // Action Index handlers

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

  // ---------------------------------------------------------------------------
  // Fetch Handlers

  $scope.onAdminActionsLoaded = function (data) {
      $scope.adminActions = data;
      $scope.pageTitle = "Review Feed - Admin";
      $scope.adminActions.forEach(function(item){
        UserService.get(item.creator_id).then(function(res){
          item.createdBy = res.state.abbreviation;
        });
      })
  };

  $scope.onStateActionsLoaded = function (data) {
      $scope.stateActions = []
      $scope.pageTitle = "Review Feed - " + data.name;

      // Add the various actions
      data.acknowledgements.pending.forEach(function(o) {
          o.response = '';
          $scope.stateActions.push(o);
      });

      // TODO: Missing 'Provider' and the ack_type needs to match the case of Found or Not Found
      // data.acknowledgements.complete.forEach(function(o) {
      //     o.action.response = o.ack_type;
      //     $scope.stateActions.push(o.action);
      // });

      // Add the source into the action object
      $scope.stateActions.forEach(function(item){
        UserService.get(item.creator_id).then(function(res){
          item.createdBy = res.state.abbreviation;
        });
      })
  };

  // Start fetching the data from the REST endpoints
  if( !AuthorizationService.inRole('state_user') )
      dataService.getAllActions().then($scope.onAdminActionsLoaded);
  else {
      var id = SessionService.getUser().state_id;
      dataService.getStateAcknowledgements(id).then($scope.onStateActionsLoaded);
  }
}]);
