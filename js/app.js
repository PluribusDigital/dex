var app = angular.module('dex', [
  'ngRoute'
]);
// 'templates', 'ngRoute', 'ngResource', 'ngSanitize', 'directives', 'angular-flash.service',
// 'angular-flash.flash-alert-directive', 'ui.bootstrap'

app.config(function ($routeProvider, $locationProvider) {
    return $routeProvider.when('/', {
        templateUrl: "templates/login/login.html",
        controller: 'LoginController'
    }).when('/actions', {
        templateUrl: "templates/actions/Index.html",
        controller: 'ActionsController'
    }).when('/create-action', {
        templateUrl: "templates/actions/create-action.html",
        controller: 'ProviderController'
    }).when('/providers/:id', {
        templateUrl: "templates/providers/Show.html",
        controller: 'ProviderController'
    }).when('/reports', {
        template: "<h1>reports</h1>",
        controller: 'ProviderController'
    }).when('/settings', {
        template: "<h1>settings</h1>",
        controller: 'ProviderController'
    }).otherwise({redirectTo:'/'})
});
