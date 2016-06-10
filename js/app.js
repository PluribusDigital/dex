var app = angular.module('dex', [
  'ngRoute'
]);
// 'templates', 'ngRoute', 'ngResource', 'ngSanitize', 'directives', 'angular-flash.service',
// 'angular-flash.flash-alert-directive', 'ui.bootstrap'

app.config(function ($routeProvider, $locationProvider) {
    return $routeProvider.when('/', {
        templateUrl: "templates/actions/Index.html",
        controller: 'ActionsController'
    }).when('/providers/:id', {
        templateUrl: "templates/providers/Show.html",
        controller: 'ProviderController'
    });
});

app.controller("ActionsController", ['$scope', '$routeParams', '$location', 'DataService',
function ($scope, $routeParams, $location, dataService) {
    $scope.pageTitle = "Review Feed";
    $scope.actions = [
        {
            actionName: "Terminate",
            providerName: "Acme Health Care Providers, Inc.",
            date: "Today 3:30 p.m.",
            source: "Alaska",
            reason: "Documented Fraud",
            statusName: "Review"
        },
        {
            actionName: "Reinstate",
            providerName: "Jane Doe",
            date: "Today 2:15 p.m.",
            source: "New Jersey",
            reason: "Documented Fraud",
            statusName: "Published"
        }
    ];

}]);

app.controller("ProviderController", ['$scope', '$routeParams', '$location', 'DataService',
function ($scope, $routeParams, $location, dataService) {
    $scope.pageTitle = "Provider Detail";
    $scope.usStates = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];
    $scope.provider = {};

    // fetch details for the provider
    $scope.getDetail = function () {
        dataService.getProvider($routeParams.id, $scope.onProviderLoaded);
    }
    $scope.onProviderLoaded = function (data) {
        $scope.provider = data;
    }
    $scope.getDetail();
}]);
