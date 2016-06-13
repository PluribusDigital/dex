var app = angular.module('dex', [
  'ngRoute',
  'ui.bootstrap'
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
    }).when('/actions/:id', {
        templateUrl: "templates/actions/show.html",
        controller: 'ActionShowController'
    }).when('/create-action', {
        templateUrl: "templates/actions/create-action.html",
        controller: 'ActionsController'
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

// http://stackoverflow.com/questions/27474503/trying-to-replace-spaces-with-dashes-using-ng-model
app.filter('unsnake',function() {
    return function(input) {
        if (input) {
            return input.replace('_', ' ');    
        }
    }
});

// Came from the comments here:  https://gist.github.com/maruf-nc/5625869
app.filter('titlecase', function() {
    return function (input) {
        var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
        if( !input )
            return;

        input = input.toLowerCase();
        return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
            if (index > 0 && index + match.length !== title.length &&
                match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                title.charAt(index - 1).search(/[^\s-]/) < 0) {
                return match.toLowerCase();
            }

            if (match.substr(1).search(/[A-Z]|\../) > -1) {
                return match;
            }

            return match.charAt(0).toUpperCase() + match.substr(1);
        });
    }
});