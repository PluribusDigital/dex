app.controller("ProviderController", ['$scope', '$routeParams', '$location', 'DataService',
function ($scope, $routeParams, $location, dataService) {
    $scope.pageTitle = "Provider Detail";
    $scope.usStates = [];
    $scope.provider = {
        name: "Acme Health Care Providers, Inc.",
        npi: "1234567",
        address: "123 Main st., Fairbanks, AK 23323",
        actions: [
            {
                actionName: "Terminate",
                providerName: "Acme Health Care Providers, Inc.",
                practiceAddress: "123 Main St, Suite 500, Fairbanks, AK",
                date: "Today 3:30 p.m.",
                source: "Alaska",
                reason: "Documented Fraud",
                statusName: "Review"
            },
            {
                actionName: "Reinstate (Recip.)",
                providerName: "Acme Health Care Providers, Inc.",
                practiceAddress: "456 Aloha Lane, Kona, HI",
                date: "5/5/2013",
                source: "Hawaii",
                reason: "Documented Fraud",
                statusName: "Published"
            },
            {
                actionName: "Reinstate",
                providerName: "Acme Health Care Providers, Inc.",
                practiceAddress: "123 Main St, Suite 500, Fairbanks, AK",
                date: "5/1/2013",
                source: "Alaska",
                reason: "Documented Fraud",
                statusName: "Published"
            },
            {
                actionName: "Terminate (Recip.)",
                providerName: "Acme Health Care Providers, Inc.",
                practiceAddress: "456 Aloha Lane, Kona, HI",
                date: "5/15/2012",
                source: "Hawaii",
                reason: "Documented Fraud",
                statusName: "Published"
            },
            {
                actionName: "Terminate",
                providerName: "Acme Health Care Providers, Inc.",
                practiceAddress: "123 Main St, Suite 500, Fairbanks, AK",
                date: "5/1/2012",
                source: "Alaska",
                reason: "Documented Fraud",
                statusName: "Published"
            }
        ]
    };

    // Fetch Handlers
    $scope.onStatesLoaded = function (data) {
        $scope.usStates = data.map(function (o) {
            return o.abbreviation;
        })
    };

    $scope.onProviderLoaded = function (data) {
        console.log(data);
    };

    // Start fetching the data from the REST endpoints
    dataService.getAllStates().then($scope.onStatesLoaded);
    dataService.getProvider($routeParams.id).then($scope.onProviderLoaded);
}]);