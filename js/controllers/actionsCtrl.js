app.controller("ActionsController", ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'DataService', '$uibModal', 'SessionService', 'ResultsService', 'AuthorizationService', 'UserService',
function ($scope, $rootScope, $routeParams, $location, $timeout, dataService, $uibModal, SessionService, ResultsService, AuthorizationService, UserService) {

  $scope.pageTitle = "Inventory Feed";
  $scope.user = SessionService.getUser();
  $scope.isCmsUser = $scope.user.type=='cms_user';

  $scope.searchNPI = function(npi) {
    $scope.results = {};
    var results;
    dataService.searchNPI(npi).then(function(data){
      results = data.npi_api_response;
      ResultsService.setResults(results);

      // If didn't find Provider
      if (results === undefined || results.length === 0) {
        var notFound = $uibModal.open({
          templateUrl: 'templates/partials/not-found-modal.html',
          controller: function($scope, $uibModalInstance) {
            $scope.npi = npi;
            $scope.ok = function() {
              $uibModalInstance.close($scope.selected);
            };
          }
        });
      } else {
        $scope.results.providers = ResultsService.formatResults(results);
      }
    })
  }

  $scope.delete = function(action) {
    var user = SessionService.getUser();
    dataService.deleteAction(action.id, user.id, function(){
      $location.path('/actions')
    })
  }

  $scope.setProvider = function(provider) {
    // Check if has a mailing address
    if (!provider.mailing_address) {
      provider.mailing_address = dataService.getAddress(provider.mailing_address_id).then(function(res){
        provider.mailing_address = res;
        $scope.provider = provider;
        ResultsService.setSelected(provider);
        $location.path('/create-action/form');
      })
    } else {
      $scope.provider = provider;
      ResultsService.setSelected(provider);
      $location.path('/create-action/form');
    }   
  }

  // Sets active tab to needs attention
  $scope.switchWip = function($event, actions, simEvent) {
    var user = SessionService.getUser();
    var switchTo = $event.target.attributes['switch-to'].nodeValue;

    if (simEvent === 'recentActions' || switchTo === 'Recent Actions') {
      $scope.recentActions = true;
      $scope.needsAttn = false;
      $scope.acknowledgedActions = false;
      // console.log('hi', $scope.recentActions, $scope.needsAttn, $scope.acknowledgedActions)
    } else if (switchTo === 'Needs Response' || switchTo === 'Needs Attention') {
      $scope.needsAttn = true;
      $scope.recentActions = false;
      $scope.acknowledgedActions = false;
    } else if (switchTo === 'Acknowledged Actions') {
      $scope.needsAttn = false;
      $scope.recentActions = false;
      $scope.acknowledgedActions = true;
    }
    
    angular.element(document.querySelectorAll('.active-tab')[2]).removeClass('active-tab');
    angular.element(document.querySelectorAll('.active-tab')[1]).removeClass('active-tab');
    angular.element(document.querySelectorAll('.active-tab')[0]).removeClass('active-tab');
    
    if (simEvent === 'recentActions') {
      var el = document.getElementById('state-recent-tab');
      angular.element(el).addClass('active-tab');
    } else if ($event.currentTarget){
      angular.element($event.currentTarget).addClass('active-tab');
    }
    
    if (actions && !$scope.myActions) {
      var filteredActions = [];
      actions.forEach(function(item){
        if (item.createdBy === user.state.abbreviation || user.type === 'cms_user' && item.status !== 'under_review') {
          filteredActions.push(item);
        }
      });
      filteredActions.sort(function (a, b) {
        if (a.created_timestamp < b.created_timestamp) {
          return 1;
        }
      });
      if($scope.stateActionsResponded){
        $scope.stateActionsResponded.forEach(function(item){
          console.log(item)
        })
      }
      $scope.filteredActions = filteredActions;
    }
  }

  // ---------------------------------------------------------------------------
  // Action Index handlers

  $scope._findAction = function(collection, id) {
    for (var i = 0; i < collection.length; i++) {
        if(collection[i].id == id)
            return collection[i];
    };

    return null;
  };

  $scope.markFound = function (id) {
      var item = $scope._findAction($scope.stateActions, id);
      if( item ){
        item.response = 'Found';

        var mutualAction = $uibModal.open({
          templateUrl: 'templates/partials/mutual-action-modal.html',
          scope: $scope,
          controller: function($scope, $uibModalInstance, $rootScope) {
            $scope.stateActions = $scope.stateActions;
            
            $scope.postifFound = function(){
              
              if( item ) {
                var actionId = item.id;
                item.response = 'Found';
                var itemIndex = $scope.stateActions.indexOf(item);
                $scope.stateActions.splice(itemIndex, 1);
                var postData = {
                  state_id: user.state_id, 
                  ack_type: "found"
                }
                
                dataService.postAcknowledgement(JSON.stringify(postData), actionId, user.id).then(function(res){
                  // remove from needs attn
                  var itemIndex = $scope.stateActions.indexOf(item);
                  console.log(res)
                  // format item to be pushed to acknowledged actions
                  var thisAction = res.data;
                  thisAction.action = item;
                  thisAction.createdBy = thisAction.action.createdBy;
                  thisAction.action.ack_type = thisAction.ack_type;
                  $scope.stateActionsResponded.push(thisAction);
                  $rootScope.$broadcast('removeFromState', itemIndex)
                });
              }
            };

            $scope.mutualAction = function() {
              item.provider.isMutual = true;
              item.provider.action_type = item.action_type;
              if (!item.provider.mailing_address) {
                item.provider.mailing_address = dataService.getAddress(item.provider.mailing_address_id).then(function(res){
                  item.provider.mailing_address = res;
                  $scope.provider = item.provider;
                  ResultsService.setSelected(item.provider);
                  $location.path('/create-action/form');
                })
              } else {
                $scope.provider = item.provider;
                ResultsService.setSelected(item.provider);
                $location.path('/create-action/form');
              }
              $scope.postifFound();
              $scope.close();
            };
            $scope.close = function() {
              $scope.postifFound();
              $uibModalInstance.close($scope.selected);
            };
          }
        });
      }
  };

  $scope.markNotFound = function (id) {
      var user = SessionService.getUser();
      var item = $scope._findAction($scope.stateActions, id);

      if( item ) {
        var actionId = item.id;

        item.response = 'Not Found';
        var postData = {
          state_id: user.state_id, 
          ack_type: "not_found"
        }

        dataService.postAcknowledgement(JSON.stringify(postData), actionId, user.id).then(function(res){
          // remove from needs attn
          var itemIndex = $scope.stateActions.indexOf(item);
          $scope.stateActions.splice(itemIndex, 1);
          // format item to be pushed to acknowledged actions
          var thisAction = res.data;
          thisAction.action = item;
          thisAction.createdBy = thisAction.action.createdBy;
          thisAction.action.ack_type = thisAction.ack_type;
          $scope.stateActionsResponded.push(thisAction);
          
        });

      }
  };

  // ---------------------------------------------------------------------------
  // Fetch Handlers

  $scope.onAdminActionsLoaded = function (data) {
    $scope.adminActions = data;
    $scope.filteredActions =[];
    $scope.pageTitle = "Inventory Feed - Admin";
    $scope.needsAttn = true;
    $scope.recentActions = false;
    $scope.adminActions.forEach(function(item){

      UserService.get(item.creator_id).then(function(res){
        item.createdBy = res.state.abbreviation;
        var d = new Date();
        var n = d.toISOString();
        var filtered = [];
        var user = res;
        // if item has an expiration date and it's before than today's date, (already expired)
        // check if reinstated and if not, auto-reinstate
        if (item.expiration_timestamp && item.expiration_timestamp <= n) {
          if (item.action_type === 'terminate') {
            var putData = {
              status: 'under_review',
              action_type: 'reinstatement',
              reason: ['expired'],
              provider_id: item.provider_id
            };
            var index = $scope.adminActions.indexOf(item);
            var urgentIcon = angular.element(document.querySelectorAll('.urgent-icon')[index]);
            angular.element(urgentIcon[0]).removeClass('hidden');
            /* TODO: figure out how to best handle this (maybe send to the action form?)
            Currently it takes user to the create action form */
          };
        };      
      });
    });
  }; //onAdminActionsLoaded

  $scope.onStateActionsLoaded = function (data) {
    $scope.stateActions = [];
    $scope.stateActionsResponded = [];
    $scope.myActions = [];
    if (data.name.length > 12) {
      $scope.pageTitle = "Inventory Feed - " + data.name;
      var el = document.getElementById('page-title');
      angular.element(el).addClass('smaller-title');
    } else {
      $scope.pageTitle = "Inventory Feed - " + data.name;
    }
    $scope.needsAttn = true;
    $scope.recentActions = false;
    user = SessionService.getUser();
    $scope.filteredActions = [];
    
    // Add the various actions (not acknowledged)
    data.acknowledgements.pending.forEach(function(o) {
      var myActions = [];
      o.response = '';
      if (o.creator.state_id !== user.state_id){
        $scope.stateActions.push(o);
      } else if (o.creator.state_id == user.state_id) {
        $scope.myActions.push(o)
      } else {
        console.log('not pushed', o)
      }
    });

    data.acknowledgements.complete.forEach(function(o){
      if (o.action) {
        o.action.response = o.ack_type;
      }
      if (o.action && !o.action.provider) {
        dataService.getProvider(o.action.provider_id).then(function(res){
          o.action.provider = {
            name: res.name
          }
        });
        $scope.stateActionsResponded.push(o);
      }
    });
    // TODO: Missing 'Provider' and the ack_type needs to match the case of Found or Not Found
    // data.acknowledgements.complete.forEach(function(o) {
    //     o.action.response = o.ack_type;
    //     $scope.stateActions.push(o.action);
    // });
    // Add the source into the action object
    $scope.stateActions.forEach(function(item, index){

      if (item.creator_id) {
        // get all users
        UserService.getAll().then(function(data) {
          $scope.users = data;
          var match = $scope.users.find(function(user) {
            return user.state_id === item.creator.state_id;
          });
          item.createdBy = match.state.abbreviation;
        });
      } 
    });

    $scope.myActions.forEach(function(item,index){
      if (item.creator_id) {
        // get all users
        UserService.getAll().then(function(data) {
          $scope.users = data;
          var match = $scope.users.find(function(user) {
            return user.state_id === item.creator.state_id;
          });
          item.createdBy = match.state.abbreviation;
        });
      } 
    });
    for(i=0;i<$scope.stateActionsResponded.length -1;i++){
      //console.log(i, $scope.stateActionsResponded.length, $scope.stateActionsResponded[i].action_id, $scope.stateActionsResponded[i+1].action_id)
      if ($scope.stateActionsResponded[i].action_id == $scope.stateActionsResponded[(i+1)].action_id){
        $scope.stateActionsResponded.splice(i, 1)
      }
    }
    $scope.stateActionsResponded.forEach(function(item,index){
      if (item) {
        var stateId =[];

        // get all users
        UserService.getAll().then(function(data) {
          $scope.users = data;
          var match = $scope.users.find(function(user) {
            return user.state_id === item.action.state_id;
          });
          item.createdBy = match.state.abbreviation;
        });
        
      }
    });
    

  };

  // Start fetching the data from the REST endpoints
  if( !AuthorizationService.inRole('state_user') ) {
    dataService.getAllActions().then(function(res){
      $scope.onAdminActionsLoaded(res);
    });
  } else {
    var id = SessionService.getUser().state_id;
    dataService.getStateAcknowledgements(id).then(function(res){
      $scope.onStateActionsLoaded(res);
    });
  }

  

  var goToRecent = function(){
    $scope.needsAttn = false; 
    $scope.recentActions = true;
    $scope.$apply(function(){
      $scope.needsAttn = false; 
      $scope.recentActions = true;
      angular.element(document.getElementById('state-recent-tab').triggerHandler('click'))
    });
    console.log($scope.needsAttn, $scope.recentActions, $scope.acknowledgedActions);
  }

  //watch for My Actions event
  $rootScope.$on('MyActions', function() {
    $timeout(function(){
      var el = document.getElementById('state-recent-tab');
      angular.element(el).addClass('active-tab');
      el = document.getElementById('state-needs-response-tab');
      angular.element(el).removeClass('active-tab');
    }, 100);
    console.log($scope.needsAttn, $scope.recentActions, $scope.acknowledgedActions);
    goToRecent()
  })

  $rootScope.$on('removeFromState', function(itemIndex){
    //console.log(itemIndex)
    $scope.stateActions.splice(itemIndex, 1)
  })
}]);
