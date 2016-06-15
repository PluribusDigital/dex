app.factory('AuthorizationService', function (SessionService) {
    return {
        roles: ['admin', 'cms_user', 'state_user'],
        objects: ['action', 'acknowledgement', 'provider'],

        hasPermission: function (operation, thing) {
            var user = SessionService.getUser();
            if (user == null )
                return false;

            if ( $.inArray(Suser.type, this.roles) == -1)
                return false;

            // Always allow read-only access
            if( user.permissions == null )
                return operation == 'read'

            // Get the user's permissions for the object
            var objectPermission = user.permissions[thing.toLowerCase()];
            if (objectPermission == null)
                return false;

            // See if the operation is allowed on the object
            return $.inArray(operation.toLowerCase(), objectPermission) != -1;
        },

        inRole: function (role) {
            var user = SessionService.getUser();
            if (user == null )
                return false;

            return user.type.toLowerCase() == role.toLowerCase();
        },

        assignPermissions: function () {
            var permissions = {};

            /* TODO */

            var user = SessionService.getUser();
            if (user == null )
                return;
            user.permissions = permissions;
            SessionService.setUser(user);
        }
    };
});

app.factory('SessionService', function ($rootScope) {
    var service = {
        currentUser: null,
        changedEvent: 'gotUser',
        setUser: function(user){
            localStorage.user = JSON.stringify(user);
            return this.currentUser = user;
        },
        getUser: function(){
            if( this.currentUser == null && localStorage.user != null)
                this.currentUser = JSON.parse(localStorage.user);
            return this.currentUser;
        },
        hasUser: function() {
            return this.currentUser != null;
        }
    };

    // Broadcast an event when the current user changes   
    $rootScope.$watch(function () {
        return service.currentUser;
    }, function (newValue, oldValue, scope) {
        $rootScope.$broadcast('gotUser', newValue);
    }, true);

    return service;
});