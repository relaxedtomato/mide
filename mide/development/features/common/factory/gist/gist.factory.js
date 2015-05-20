app.factory('GistFactory',function($http,$q,ApiEndpoint){

    //TODO: handling for multiple friends (after testing one friend works)
    //TODO: Friend and code must be present
    //TODO: friends is an array of friend Mongo IDs

    function shareGist(friends,code,description,fileName){
        return $http.post(ApiEndPoint.url + '/users/shareGists',
            {
                friends:friends,
                code:code,
                description:description || 'no description',
                fileName:fileName+".js" || 'no file name'
            });
    }

    function queueGists(){
        return $http.get(ApiEndpoint.url + '/users/gistsQueue');
    }

    function createdGists(){
        return $http.get(ApiEndpoint.url + '/users/createdGists')
    }

    return{
        shareGist: shareGist,
        queuedGists: queuedGists, //push notifications
        createdGists: createdGists
   }
});