app.factory('UserService',
    function ($http, $timeout, $q, $rootScope) {
        $rootScope.users = [];

        var service = {
            loadCache: function () {
                var deferred = $q.defer();

                $http.get('https://cmsdex-api.540.co/users/', {}).then(function (response) {
                    $rootScope.users = response.data;
                    deferred.resolve(response.data);
                }, function (response) {
                    console.log('error when calling users endpoint');
                    console.log(response);
                    deferred.reject();
                })

                return deferred.promise;
            },

            getAll: function () {
                if (!$rootScope.users.length) {
                    return this.loadCache();
                }
                else {
                    var deferred = $q.defer();

                    $timeout(20).then(function () {
                        deferred.resolve($rootScope.users);
                    });

                    return deferred.promise;
                }
            },

            get: function (sID) {
              var deferred = $q.defer();

              var id = parseInt(sID) - 1;  // Arrays are 0 based, ID are 1 based

              if (!$rootScope.users.length) {
                  this.loadCache().then(function () {
                      deferred.resolve($rootScope.users[id]);
                  });
              }
              else {
                  $timeout(20).then(function () {
                      deferred.resolve($rootScope.users[id]);
                  });
              }

              return deferred.promise;
            }
        };

        return service;
    });
