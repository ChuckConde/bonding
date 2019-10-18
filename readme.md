# Full Starter Template
* Developed by Ioncity Themes
* Version 0.0.1
* Ionic View ID 2be052dc
* Connection to Server hosted by Heroku [here](https://app-social-starter.herokuapp.com)


## Installation
1. open path to project in terminal
2. Run **ionic serve**
3. Follow prompts to start npm install to install all dependencies
4. Run the app, usually  on default [ionic host](http://localhost:8100/) unless otherwise specified

## Connect to server
Configuration data to connect to server and to third party endpoint can be found in **src/app/main.ts**. 
```javascript
export const CONFIG = {
    BASE_URL: 'http://localhost:3000',
    API_VERSION: 'api',
    GOOGLE_API_KEY: 'change me',
    GOOGLE_CLIENT_ID: 'change me',
    FACEBOOK_KEY: 'change me',
};
```
where _BASE_URL_ is the url where the server is running, _API_VERSION_ is the _restApiRoot_ configured in config.json of your loopback project.

## Features
* Email and Password Authentication
* Data persistence to db of choice
* Send emails from server
* Camera Image Upload
* Multi Image selection upload
* Realtime chat
* Image Preview
* Image Lazy loader
* Facebook Login Native Integration
* Google Login Native Integration
* Google Maps
* Geolocation
* Social Sharing
* Custom Image Slider
* Call Number
* In App Browser
* Native Storage
* Show/Hide password field
* Keyboard Attach
* Elastic textarea
* Pin number component
* Color selector Popover
* Monthly View Calendar
* Custom Search
* Font Awesome and Simple Line Icons
* Custom Validation with ng2-validation
* Over 20 Screens, components and designs

## Pages and Screens
* Walkthrough
* Intro Page
    * Login
    * Sign up
    * Password reset
    * Verify account
* Dashboard
    * Charts
    * Map
    * Calendar
        * Add Event
* Feed (4 designs)
    * View Post
    * Add Post
    * Comment
* People
* Profile
    * Edit
* Chat
    * Contact
    * Messages
* Settings