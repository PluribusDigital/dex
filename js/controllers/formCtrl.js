app.controller("FormController", ['$scope', '$location', 'DataService', 'ResultsService', 'SessionService',
function ($scope, $location, dataService, ResultsService, SessionService) {
  $scope.provider = ResultsService.getSelected();

  $scope.createAction = function() {
    var date = new Date();
    date = date.getDate() + 30;
    // get user info
    var user = SessionService.getUser();
    //get selected provider info
    $scope.provider = ResultsService.getSelected();
    //check if provider in system
    if ($scope.provider.id) {
      _PostAction(user)
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
  }

  //prepare data and post action
  function _PostAction(user){
    var postData =  {
        status: 'under_review',
        action_type: $scope.action.type,
        reason: [$scope.action.reason],
        provider_id: $scope.provider.id,
        address_id: $scope.provider.mailing_address_id,
        comments: $scope.action.comments
        //expiration_timestamp: date,
        //practice_address: $scope.provider.mailing_address
      }
      //post action and then attachment
      dataService.createAction(JSON.stringify(postData), user.id, function(res){
        var actionId = res.id;
        var files = angular.element(document.getElementById('attachment'))[0].files[0];
        var fd = new FormData();
        fd.append("attachment", files);
        dataService.postAttachment(actionId, user.id, fd)
      });
  }

}]);