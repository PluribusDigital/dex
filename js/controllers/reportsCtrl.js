app.controller("ReportsController", ['$scope', '$routeParams', '$location', 'DataService', '$uibModal', 'SessionService', 'ResultsService', 'AuthorizationService',
function ($scope, $routeParams, $location, dataService, $uibModal, SessionService, ResultsService, AuthorizationService) {

  $scope.pageTitle = "Reports";
  $scope.emailButtonClass = "usa-button-disabled";
  $scope.user = SessionService.getUser()

  $scope.drillStateActivity = function(stateAbbr){
    var notFound = $uibModal.open({
      templateUrl: 'templates/partials/state-activity-modal.html',
      controller: function($scope, $uibModalInstance) {
        $scope.stateAbbr = stateAbbr;
        $scope.ok = function() {
          $uibModalInstance.close($scope.selected);
        };
      }
    });
  }


  $scope.checkState = function(){
    $scope.emailButtonClass = "usa-button";
  }
  $scope.emailStates = function(user){
    var notFound = $uibModal.open({
      templateUrl: 'templates/partials/state-email-modal.html',
      controller: function($scope, $uibModalInstance) {
        $scope.user = user;
        $scope.send = $scope.cancel = function() {
          $uibModalInstance.close($scope.selected);
        };
      }
    });
  }


}]);
