#Getting Started (installation steps)
1. [iOS SDK](http://cordova.apache.org/docs/en/3.3.0/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide): Only up to and including step 'Install the SDK'. Note once the Apple SDK is installed, ensure you load the SDK (make sure it loads and possibly set-up any configuration) before moving onto ionic steps. 
2. [Ionic Framework](http://ionicframework.com/getting-started/) try to create a test app first before shifting to mide

##mide/
* All ionic related stuff is in the ```mide/development``` which is basically an Angular application. You must be in the ```mide``` folder for any ionic commands to run. 
* Run ```npm install``` and ```bower install```

####Buildtool
* Ensure you are running the gulp process on the mide folder (```/development to /www```) .

####Styling
* ```scss/ionic.app.scss``` is where you can override and add additional styling.

####Dependencies
* ```/www/lib``` loaded here when installed using the Ionic CLI or Cordova CLI

####Relevant commands
* Mobile Emulator (iOS): ```ionic emulate ios -c -l``` (use this over ```ionic build ios```) <br>
* Browser Emulator: ```ionic serve -c -s browser``` (you have direct access to Browser Dev Tools)

####Other notes:
* You can temporarily remove the front-end authentication steps to focus on core app features (view ```welcome.js``` line 27 for ```auth-toggl```).<br>
* [ngCordova common issues](http://ngcordova.com/docs/common-issues/)
* [Use Ionic View to test on a mobile device](http://view.ionic.io/)

##server/
* Handles authentication and sharing of code snippets.
* Run ```npm install```
