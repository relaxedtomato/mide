app.service('LocalStorage',function($localstorage){
    //if(
    //console.log($cordovaNetwork.getNetwork());
    if($localstorage.get('auth-token')){
        //TODO: Test Network Connection on Device and Via Console Log

        var connection = !false;

        if(connection){
            //sync data
        } else {
            //load data from localStorage
            //you need to store to local storage at some point
            //so anytime you touch any of the localStorage data, be sure to write to it
        }
        //If Internet Connection

        //console.log($cordovaNetwork.getNetwork());
        //console.log(Connection.NONE);
    } else {
        //do nothing - welcome will handle un-auth users
    }
});

//Working Offline
//Sync Common Data on App Load if Possible (and store in LocalStorage) - Otherwise load from Local Storage
    //LocalStorage
        //Store Friends
        //Store Code Received (from Who)
        //Store Last Sync
//Sync Common Data Periodically as well (Not Sure How?!) Maybe on Certain HotSpots (clicking certain links) and TimeBased as wel
