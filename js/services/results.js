app.factory('ResultsService', function () {
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
    },
    formatResults: function(results) {
      var formatted = [];
      results.forEach(function(item, index){
        var mailing = item.addresses;
        mailing = mailing.filter(function(item){
          return item.address_purpose === "MAILING";
        });
        var addressObj = {
          street_line1: mailing[0].address_1,
          street_line2: mailing[0].address_2 || "",
          street_line3: mailing[0].address_3 || "",
          city: mailing[0].city,
          state: mailing[0].state,
          zipcode: mailing[0].postal_code
        };
        var formattedItem = {
          name: item.basic.first_name + " " + item.basic.last_name,
          npi: item.number,
          mailing_address: addressObj,
          resultsIndex: index
        };
        formatted.push(formattedItem);
      });
      return formatted;
    }
  };

  return service;
});