app.factory('AuthorizationService', function (SessionService) {
    return {
        roles: ['admin', 'cms_user', 'state_user'],
        objects: ['action', 'acknowledgement', 'provider'],

        hasPermission: function (operation, thing) {
            if (SessionService.currentUser == null )
                return false;

            if ( $.inArray(SessionService.currentUser.type, this.roles) == -1)
                return false;

            // Always allow read-only access
            if( SessionService.currentUser.permissions == null )
                return operation == 'read'

            // Get the user's permissions for the object
            var objectPermission = SessionService.currentUser.permissions[thing.toLowerCase()];
            if (objectPermission == null)
                return false;

            // See if the operation is allowed on the object
            return $.inArray(operation.toLowerCase(), objectPermission) != -1;
        },

        inRole: function (role) {
            if (SessionService.currentUser == null)
                return false;

            return SessionService.currentUser.type.toLowerCase() == role.toLowerCase();
        },

        assignPermissions: function () {
            var permissions = {};

            /* TODO */

            SessionService.currentUser.permissions = permissions;
        }
    };
});

app.factory('SessionService', function ($rootScope) {
    var service = {
        currentUser: null,
        changedEvent: 'gotUser',
        setUser: function(user){
            return this.currentUser = user;
        },
        getUser: function(user){
            return this.currentUser;
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