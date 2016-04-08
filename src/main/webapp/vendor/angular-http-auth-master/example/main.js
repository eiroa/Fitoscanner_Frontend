(function() {
  'use strict';
  var app = angular.module('angular-auth-demo', [
    'http-auth-interceptor',
    'content-mocks',
    'login',
    'content'
  ])
  
  
  
  app.controller('authDemoCtrl', function() {
	  
	  
  });
  
  /**
   * This directive will find itself inside HTML as a class,
   * and will remove that class, so CSS will remove loading image and show app content.
   * It is also responsible for showing/hiding login form.
   */
  app.directive('authDemoApplication', function() {
    return {
      restrict: 'C', // c of class...
      link: function(scope, elem, attrs) {
        //once Angular is started, remove class:
    	  
       //Pequeño truco para habilitar vista una vez que angular se active
        elem.removeClass('waiting-for-angular');
         // #login-holder representa un id de elemento html, en este caso es un div
        var login = elem.find('#login-holder');
        var main = elem.find('#content');
        
        login.hide();
        //escondo ese elemento
        
        //ante el evento auth-loginrequired que es disparado por http interceptor ante un respuesta 401 del servidor
        scope.$on('event:auth-loginRequired', function() {
          login.slideDown('slow', function() {
            main.hide();
          });
        });
        scope.$on('event:auth-loginConfirmed', function() {
          main.show();
          login.slideUp();
        });
        
        scope.$on('event:auth-loginConfirmed', function() {
            alert('you are logged!');
          });
      }
    }
  });
})();