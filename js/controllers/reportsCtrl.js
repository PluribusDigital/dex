app.controller("ReportsController", ['$scope', '$routeParams', '$location', 'DataService', '$uibModal', 'SessionService', 'ResultsService', 'AuthorizationService',
function ($scope, $routeParams, $location, dataService, $uibModal, SessionService, ResultsService, AuthorizationService) {

  $scope.pageTitle = "Reports";
  $scope.emailButtonClass = "usa-button-disabled";
  $scope.user = SessionService.getUser();

  $scope.activeStatesChart = {
    data: [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ],
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    series: ['Series A', 'Series B']
  }

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
