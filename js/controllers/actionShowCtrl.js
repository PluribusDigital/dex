app.controller("ActionShowController", function ($scope, $routeParams, DataService, AuthorizationService) {
    $scope.pageTitle = "Action Detail";
    $scope.action = {};
    $scope.inventory = [];
    $scope.totals = {};
    $scope.nexts = [];
    $scope.response = '';

    // Fetch Handlers
    $scope.onActionLoaded = function (data) {
        $scope.action = data;
    };

    $scope.onAcknowledgementsLoaded = function (data) {
        var a = data.awaiting_response.map(function(value) {
            return {
                'name': value.name,
                'abbreviation': value.abbreviation,
                'status': 'not-responded'
            };
        });

        var b = data.responded_notfound.map(function(value) {
            return {
                'name': value.name,
                'abbreviation': value.abbreviation,
                'status': 'not-found'
            };
        });

        var c = data.responded_found.map(function(value) {
            return {
                'name': value.name,
                'abbreviation': value.abbreviation,
                'status': 'found'
            };
        });

        $scope.inventory = a.concat(b.concat(c));
        $scope.totals = {
            'found': c.length,
            'notFound': b.length,
            'notResponded': a.length
        };

        // Disable the buttons if the state has already responded?
        // ...but they may not even be able to get in here without l33t h4xx on the URL
        // TODO
    };

    $scope.onNext = function(next) {
        $scope.response = next;
    };

    // Setup the role-based buttons
    if( !AuthorizationService.inRole('state_user') ) {
        $scope.nexts = ['publish', 'reject'];
    }
    else {
        $scope.nexts = ['found', 'not_found'];
    }

    // Start fetching the data from the REST endpoints
    DataService.getAction($routeParams.id).then($scope.onActionLoaded);
    DataService.getAcknowledgements($routeParams.id).then($scope.onAcknowledgementsLoaded);
});