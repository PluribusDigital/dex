app.factory('ResultsService', function ($rootScope) {
    var service = {
        results: null,
        selected: null,
        setResults: function(results){
            return this.results = results;
        },
        getResults: function(){
            return this.results;
        },
        setSelected: function(selected){
            return this.selected = selected;
        },
        getSelected: function(){
            return this.selected;
        }
    };

    return service;
});