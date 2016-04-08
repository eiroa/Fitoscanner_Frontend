'use Strict';

/**
 * @ngdoc function
 * @name tip_eiroa_mauro_server_frontend.controller:LoginCtrl
 * @description # LoginCtrl Controller of the tip_eiroa_mauro_server_frontend
 */

angular
		.module('tip_eiroa_mauro_server_frontend')
		.controller(
				'LoginCtrl',
				function($route,$scope, $location, $http, $rootScope, growl,dialogs,globalService,$translate,
						ngTableParams,restServices,$filter,$timeout,localStorageService) {

					// Inicializa los combos
					$scope.inicializarVista = function() {
						globalService.setInLogin();
						
					 
                    //localStorageService.get('usuario');
                    //localStorageService.remove('Logged');
                    //localStorageService.set('userInMainMenu', false);
                    //localStorageService.clearAll();
                    
                    var data = {
							user: localStorageService.get('nick'),
                            token: localStorageService.get('token')
						};
						
				     restServices.invokeValidateAdmin($http, data,
					 			$scope.validUserOk,
					 			$scope.validUserFail);
                    }
                    
                    $scope.validUserFail = function(response,status) {
		        		   growl.info('Por favor ingrese usuario y contraseña para utilizar el sistema');
                           localStorageService.remove('nick');
                           localStorageService.remove('token ');
		        		   console.log(response);
      		        }
                    
                     $scope.validUserOk = function(response) {
		        		   growl.info('Usted ya se ha logueado');
                           $location.path('/');
                           
      		        }
                     
                     $scope.authUserFail = function(response,status) {
                    	 if(status == 401){
                    		 growl.error('Usuario y/o contraseña inválidos...');
                    	 }else{
                    		 growl.error('Error en el servidor, verifique su conexión y el estado del servidor'); 
                    	 }
                         localStorageService.remove('nick');
                         localStorageService.remove('token ');
		        		   console.log(response);
    		        }
                  
                   $scope.authUserOk = function(response) {
		        		   growl.info('Bienvenido');
		        		   localStorageService.set('nick', response.nick);
		        		   localStorageService.set('token', response.token);
		        		   $location.path('/');
    		        }
                     
                     $scope.login = function(){
                    	 var data = {
                    			 user_nick : $scope.inputNick,
                    			 ps :$scope.inputPassword
                    	 }
                    	 restServices.invokeAuthenticateAdmin($http, data,
 					 			$scope.authUserOk,
 					 			$scope.authUserFail);
                     }
					
					$scope.inicializarVista();

				});