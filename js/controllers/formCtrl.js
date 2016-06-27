app.controller("FormController", ['$scope', '$rootScope', '$location', '$filter', 'DataService', 'ResultsService', 'SessionService',
function ($scope, $rootScope, $location, $filter, dataService, ResultsService, SessionService) {
  $scope.provider = ResultsService.getSelected();

  $scope.createAction = function() {
    // get user info
    var user = SessionService.getUser();
    //get selected provider info
    $scope.provider = ResultsService.getSelected();
    //check if provider in system
    dataService.search($scope.provider.npi).then(function(res){
      // if it is, post the action to our user
      if (res.providers && res.providers.length >0) {
        //check if the npi is a match
        var ourProviderRecord = $filter('filter')(res.providers, {npi: $scope.provider.npi}, undefined);
        $scope.provider = ourProviderRecord[0];
        _PostAction(user);
      } else { 
        // need to create the user in our system
        var results = ResultsService.getResults();
        var currentProvider = results[$scope.provider.resultsIndex];
        // prepare provider data
        var services = currentProvider.taxonomies;
        var formattedServices = services.map(function(service, index) {
          return service = service.desc;
        });
        var providerData = {
          type: currentProvider.enumeration_type === 'NPI-1' ? 'individual' : 'organization', //TODO: find better way to determine this
          name: $scope.provider.name,
          npi: $scope.provider.npi,
          taxid: '', //TODO: figure out how to handle this
          services: formattedServices,
          mailing_address: $scope.provider.mailing_address,
          creator_id: user.id
        }
        // Post to /providers
        dataService.postProvider(JSON.stringify(providerData), user.id, function(res){
          //prepare data for post to actions
          $scope.provider = res;
          _PostAction(user);
        });
      } 
    });
  };

  //prepare data and post action
  function _PostAction(user){
    var dateString = $scope.year + "-" + $scope.month + "-" + $scope.day;
    var date = new Date(dateString);
    var postData =  {
        status: 'under_review',
        action_type: $scope.action.type,
        reason: [$scope.action.reason],
        provider_id: $scope.provider.id,
        address_id: $scope.provider.mailing_address_id,
        comments: $scope.action.comments
        //practice_address: $scope.provider.mailing_address
      }
      if ($scope.year !== undefined && $scope.month !== undefined && $scope.day !== undefined) {
        postData.expiration_timestamp = date.toISOString();
      }
      //post action and then attachment
      dataService.createAction(JSON.stringify(postData), user.id, function(res){
        var actionId = res.id;
        var files = angular.element(document.getElementById('attachment'))[0].files[0];
        var fd = new FormData();
        fd.append("attachment", files);
        dataService.postAttachment(actionId, user.id, fd).then(function(){
          $location.path('/actions');
          $rootScope.$broadcast('MyActions');
        });
      });
  }

  $scope.testRouting = function() {
    $location.path('/actions');
    $rootScope.$broadcast('MyActions');
  }

  // Check if mutual action
  $scope.$watch('provider', function() {
    if ($scope.provider.isMutual) {
      $scope.action = {
        reason: 'mutual',
        type: $scope.provider.action_type
      }
    }
  });

}]);