// Simple URL searches in ES...
// http://ec2-52-27-189-225.us-west-2.compute.amazonaws.com/es/uspto/trademarkapp/_search?q=pepsi
// http://ec2-52-27-189-225.us-west-2.compute.amazonaws.com/es/uspto/trademarkapp/_search?q=ibm
// (As you begin to consume the data, you will want to understand the field types are and whether they have been analyzed or not.  
// This endpoint will show the mapping for that index/type:  http://ec2-52-27-189-225.us-west-2.compute.amazonaws.com/es/uspto/trademarkapp/_mapping 
// Depending on the types of queries we may want to fine tune some of these fields and/or duplicate them with different types of analysis.

app.factory('DataService',
    function ($http) {
        'use strict';

        var service = {

            // baseUrl: 'http://ec2-52-27-189-225.us-west-2.compute.amazonaws.com/es/uspto/trademarkapp/_search',

            // error: function (response) {
            //     console.log('error when calling Search API');
            //     console.log(response);
            //     return [];
            // },

            // searchSuccess: function (response) {
            //     var results = response.data.hits.hits.map( function(obj){
            //         var rObj = obj._source['case-file'];
            //         rObj._score = obj._score;
            //         return rObj;
            //     } );
            //     return results;
            // },

            // // These methods encapsulate API calls
            // stringSearch: function (val) {
            //     return $http.get(this.baseUrl, {
            //         q: "pepsi"
            //         // "query": {
            //         //     "serial-number": val
            //         // }
            //     }).then(this.searchSuccess, this.error);
            // },

        };

        return service;
    });