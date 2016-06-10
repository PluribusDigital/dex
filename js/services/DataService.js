app.factory('DataService',
    function ($http) {
        'use strict';

        var service = {

            baseUrl: 'https://cmsdex-api.540.co/', 
            // Docs at https://cmsdex-api.540.co/

            error: function (response) {
                console.log('error when calling Data API');
                console.log(response);
                return [];
            },

            getProvider: function (id,success) {
                return $http.get(this.baseUrl+"providers/"+id,{})
                .then(function (response) { success(response.data); }, this.error);
            }

        };

        return service;
    });