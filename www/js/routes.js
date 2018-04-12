angular.module('starter.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
            

  
      .state('home', {
      url: '/home',
       templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })
    .state('stario/:portName/:emulation', {
      url: '/stario/:portName/:emulation',
       templateUrl: 'templates/starioextmanager.html',
      controller: 'StarIOCtrl'
    })
      
    
      

  // if none of the above states are matched, use this as the fallback
$urlRouterProvider.otherwise('/home');

});