var app = angular.module('dex', [
  'ngRoute'
]);
// 'templates', 'ngRoute', 'ngResource', 'ngSanitize', 'directives', 'angular-flash.service',
// 'angular-flash.flash-alert-directive', 'ui.bootstrap'

app.config(function ($routeProvider, $locationProvider) {
//    $locationProvider.html5Mode(true).hashPrefix('!');
    return $routeProvider.when('/', {
        templateUrl: "templates/providers/Index.html",
        controller: 'ProvidersController'
    });
});

app.controller("ProvidersController", ['$scope', '$routeParams', '$location', 'DataService',
function ($scope, $routeParams, $location, dataService) {
    $scope.pageTitle = "Providers";
    $scope.search = {};
    $scope.results = [];
    $scope.noResults = true;


    // $scope.doSearch = function () {
    //     var promise = searchService.stringSearch($scope.search.stringQuery);
    //     promise.then(function (data) {
    //         $scope.noResults = (data == null || data.length == 0);
    //         $scope.results = data;
    //     });
    //     return promise;
    // };

}]);
