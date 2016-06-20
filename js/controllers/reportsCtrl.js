app.controller("ReportsController", ['$scope', '$routeParams', '$location', 'DataService', '$uibModal', 'SessionService', 'ResultsService', 'AuthorizationService',
function ($scope, $routeParams, $location, dataService, $uibModal, SessionService, ResultsService, AuthorizationService) {

  $scope.pageTitle = "Reports";
  $scope.emailButtonClass = "usa-button-disabled";
  $scope.user = SessionService.getUser();

  // Global Charts Config for Axes starting at 0
  Chart.scaleService.updateScaleDefaults('linear', {
      ticks: {
          min: 0
      }
  })

  // Chart Data & Options
  $scope.activeStatesChart = {
    data: [
      [65, 59, 55, 42, 30, 19, 15],
      [75, 60, 62, 55, 25, 10, 15]
    ],
    labels: ['CA', 'TN', 'MI', 'OH', 'NY', 'AL', 'WA'],
    series: ['Terminations', 'Reciprocal'],
    options: {}
  }
  $scope.reviewChart = {
    data: [2.5, 2.4, 2.1, 2.5, 3.0, 3.1, 3.0],
    labels: ['5/20/16', '5/27/16', '6/3/16', '6/10/16', '6/17/16', '6/24/16', '7/1/16'],
    options: {}
  }
  $scope.inventoryChart = {
    data: [20, 21, 19, 17, 18, 17, 15],
    labels: ['5/20/16', '5/27/16', '6/3/16', '6/10/16', '6/17/16', '6/24/16', '7/1/16'],
    options: {}
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
