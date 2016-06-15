app.factory('DataService',
    function ($http, $timeout, $q, $http) {

        var service = {
            baseUrl: 'https://cmsdex-api.540.co/',
            npiUrl: 'https://npiregistry.cms.hhs.gov/api/',

            _get: function(url, params) {
                var deferred = $q.defer();

                $http.get(url, params).then(function (response) {
                    deferred.resolve(response.data);
                }, function (response) {
                    console.log('error when calling ' + url);
                    console.log(response);
                    deferred.reject();
                })

                return deferred.promise;
            },

            getAcknowledgements: function (id) {
                return this._get(this.baseUrl + "actions/" + id + "/acknowledgements", {});
            },

            getAllActions: function () {
                return this._get(this.baseUrl + "actions/", {});
            },

            getAction: function (id) {
                return this._get(this.baseUrl + "actions/" + id, {});
            },

            getAllAddresses: function () {
                return this._get(this.baseUrl + "addresses/", {});
            },

            getAddress: function (id) {
                return this._get(this.baseUrl + "addresses/" + id, {});
            },

            getAllAttachments: function () {
                return this._get(this.baseUrl + "attachments/", {});
            },

            getAttachment: function (id) {
                return this._get(this.baseUrl + "attachments/" + id, {});
            },

            getAllProviders: function () {
                return this._get(this.baseUrl + "providers/", {});
            },

            getProvider: function (id) {
                return this._get(this.baseUrl + "providers/" + id, {});
            },

            getAllStates: function () {
                return this._get(this.baseUrl + "states/", {});
            },

            getStateAcknowledgements: function (id) {
                return this._get(this.baseUrl + "states/" + id + "/acknowledgements", {});
            },

            getAllUsers: function () {
                return this._get(this.baseUrl + "users/", {});
            },

            getUser: function (id) {
                return this._get(this.baseUrl + "users/" + id, {});
            },

            search: function (input) {
                return this._get(this.baseUrl + "_search?q=" + input, {});
            },

            //searchWithText: function (text, page) {
            //    var params = {
            //        "page": (page || 1),
            //        "per_page": 20
            //    };
            //    if (text) {
            //        params.search_fields = "cac,title,office,division,branch,pacode,docketcode";
            //        params.search = text;
            //    }

            //    var deferred = $q.defer();

            //    $http.get("http://fathomless-fjord-7794.herokuapp.com/api/cacs", { "params": params }).then(function (response) {
            //        var mapped = response.data.data.map(fjordMap);
            //        deferred.resolve(mapped);
            //    }, function (response) {
            //        console.log('error when calling cacs endpoint');
            //        console.log(response);
            //        deferred.reject();
            //    })

            //    return deferred.promise;
            //}

        };

        return service;
    });