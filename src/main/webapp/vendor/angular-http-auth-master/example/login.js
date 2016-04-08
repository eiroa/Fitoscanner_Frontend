(function() {
  'use strict';
  angular.module('login',['http-auth-interceptor'])
  
  .controller('LoginController', function ($scope, $http, authService) {
	  
    $scope.submitLogin = function() {
      $http.post('auth/login').success(function() {
    	  //Auth service es un servicio definido en http-auth-interceptor
        authService.loginConfirmed();
      });
    }
  });
})();
