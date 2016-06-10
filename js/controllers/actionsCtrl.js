app.controller("ActionsController", ['$scope', '$routeParams', '$location', 'DataService',
function ($scope, $routeParams, $location, dataService) {
    $scope.pageTitle = "Review Feed";
    $scope.actions = [
        {
            id: 1,
            actionName: "Terminate",
            providerName: "Acme Health Care Providers, Inc.",
            date: "Today 3:30 p.m.",
            source: "Alaska",
            reason: "Documented Fraud",
            statusName: "Review"
        },
        {
            id:2,
            actionName: "Reinstate",
            providerName: "Jane Doe",
            date: "Today 2:15 p.m.",
            source: "New Jersey",
            reason: "Documented Fraud",
            statusName: "Published"
        }
    ];

}]);
