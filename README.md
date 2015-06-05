#mide

<a href="https://vimeo.com/129849131" target="_blank"><img src="./mide/development/img/mide_logo_300x150.png" width="300px"/></a>

##Demo
<a href="https://vimeo.com/129849131" target="_blank">Click here to view demo</a>

## Synopsis

Mide is an Ionic mobile application that allows anyone to complete coding challenges or code offline. It features a customizable keyboard bar that can insert pre-defined code snippets to write with ease.

## Motivation

The motivation for this project is to create an environment for individuals to learn and tackle coding challenges without a stable internet connection. Currently we only support JavaScript coding challenges.

## Code Structure

The repository is split into two folders: 

####_mide_
This contains the mobile application. View folder <a href="https://github.com/RichardBansal/mide/tree/development/mide/development" target="_blank">development</a> to view the Angular code compiled by Ionic for native (iOS).

####_server_
This is the Node backend server deployed to Heroku that the native application will access.

## Installation

The native application is available through <a href="http://view.ionic.io/" target="_blank">Ionic View</a>. **We will release a App ID shortly for viewing the project.**

**To emulate this app:**

1. Clone this repo
2. npm and bower install in the mide folder
3. Install ionic CLI : npm install -g cordova ionic
4. In terminal: ionic emulate ios

**Alternatively to deploy to Ionic View app:**

1. Sign up for an account at ionic.io
2. Get Ionic View app on Apple Store
3. Follow steps 1-3 above
4. In Terminal: ionic upload _-Note: you will be prompted for your ionic username and password_
5. Log into your account on Ionic View account and load app

## External Libraries and Technologies Used

We have used many open source technologies for completion of this project as follows:
* Mobile Application
  * Cordova  
  * Ionic
  * Angular
  * Code Mirror
  * Jasmine
* Backend Server
  * Node
  * Express
  * Mongoose
  * Heroku
  * JSON Web Tokens
* Code Challenges
  * Exercism

## Tests

Currently we have an initial test framework set-up on the front-end and will contribute to this further once our application features and work flow is stable.
