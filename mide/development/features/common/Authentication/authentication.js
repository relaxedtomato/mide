//token is sent on every http request
app.factory('AuthInterceptor',function AuthInterceptor(AUTH_EVENTS,$rootScope,$q,AuthTokenFactory){

    var statusDict = {
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
    };

    return {
        request: addToken,
        responseError: function (response) {
            $rootScope.$broadcast(statusDict[response.status], response);
            return $q.reject(response);
        }
    };

    function addToken(config){
        var token = AuthTokenFactory.getToken();
        if(token){
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    }
}); //skipped Auth Interceptors given TODO: You could apply the approach in
//http://devdactic.com/user-auth-angularjs-ionic/

app.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
});

app.constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
});

app.constant('USER_ROLES', {
        //admin: 'admin_role',
        public: 'public_role'
});

app.factory('AuthTokenFactory',function($window){
    var store = $window.localStorage;
    var key = 'auth-token';

    return {
        getToken: getToken,
        setToken: setToken
    };

    function getToken(){
        return store.getItem(key);
    }

    //TODO: Create log-out function, were if token is not defined, remove token
    function setToken(token){
        if(token){
            store.setItem(key,token);
        } else {
            store.removeItem(key);
        }
    }
});

app.service('AuthService',function($q,$http,USER_ROLES,AuthTokenFactory,ApiEndpoint,$rootScope){
    var LOCAL_TOKEN_KEY = 'auth-token';
    var username = '';
    var isAuthenticated = false;
    var authToken;


    function loadUserCredentials() {
        //var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        var token = AuthTokenFactory.getToken();
        if (token) {
            useCredentials(token);
        }
    }

    function useCredentials(token) {
        console.log('useCredentails token',token);
        //username = token.split('.')[0]; //TODO:
        isAuthenticated = true;
        //authToken = token; //TODO:

        // Set the token as header for your requests!
        //$http.defaults.headers.common['X-Auth-Token'] = token; //TODO
    }

    var logout = function(){
        AuthTokenFactory.setToken(); //destroyUserCredentials
    };

    //var login = function()
    var login = function(userdata){
        console.log('postLogin',JSON.stringify(userdata));
        return $q(function(resolve,reject){
            $http.post(ApiEndpoint.url+"/user/login", userdata)
                .then(function(response){
                    AuthTokenFactory.setToken(response.data.token); //storeUserCredentials
                    resolve(response); //TODO: sent to authenticated
                });
        });
    };

    loadUserCredentials();

    var isAuthorized = function(authenticated) {
        if (!angular.isArray(authenticated)) {
            authenticated = [authenticated];
        }
        return (isAuthenticated && authenticated.indexOf(USER_ROLES.public) !== -1);
    };
    
    //TODO: Need to fix getLoggedInUser
    var getLoggedInUser = function () {
        console.log('getLoggedInUser called')
        // If an authenticated session exists, we
        // return the user attached to that session
        // with a promise. This ensures that we can
        // always interface with this method asynchronously.

        //TODO: In what case will the below code run? It will work, but not clear of the use
        if (isAuthenticated) {
            return $q.when(AuthTokenFactory.getToken());
        }

        // Make request GET /session.
        // If it returns a user, call onSuccessfulLogin with the response.
        // If it returns a 401 response, we catch it and instead resolve to null.

        if(AuthTokenFactory.getToken()){
            return $http.get(ApiEndpoint.url+'/user/token')
                .then(function(response){
                    console.log('ApiEndpoint.url /user/token response',response);
                    var data = response.data.user
                    //TODO:$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    return data; //user is being returned
                }).catch(function () {
                    console.log('getLoggedInUser returned null');
                    return null;
                });
        } else {
            return $q.reject({data: 'no auth token exists'});
        }

    };

    return {
        login: login,
        logout: logout,
        isAuthenticated: function() {return isAuthenticated;},
        username: function(){return username;},
        getLoggedInUser: getLoggedInUser,
        isAuthorized: isAuthorized
    }

});

//TODO: Did not complete main ctrl 'AppCtrl for handling events' as per http://devdactic.com/user-auth-angularjs-ionic/