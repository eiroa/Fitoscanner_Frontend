	'use strict';

	/**
	 * @ngdoc overview
	 * @name tip_eiroa_mauro_server_frontend
	 * @description # tip_eiroa_mauro_server_frontend
	 * 
	 * Main module of the application.
	 */
	(function() {
		var app = angular.module('tip_eiroa_mauro_server_frontend', [ 'ngAnimate', 'ngCookies',
				'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch',
				'angularFileUpload', 'ngTable',
				'LocalStorageModule', 'ngRoute', 'checklist-model',
				'angular-growl', 'ui.bootstrap', 'dialogs.main',
				'pascalprecht.translate','tip_eiroa_mauro_server_frontend.services',
				'restServicesModule',
			    'leaflet-directive',
			    'naif.base64',
			    'angular-loading-bar']);

		
		app.controller(
						'IndexCtrl',
						function($rootScope, $scope, $location, $http,
								localStorageService, $window, growl, $timeout,
								$document, $interval, dialogs,globalService,$translate,
								restServices,$upload) {
							
							$scope.changeLanguage = function (langKey) {
							    $translate.use(langKey);
							    $translate.refresh();					    
							  };
							  
							  String.prototype.trunc = String.prototype.trunc ||
						      function(n){
						          return this.length>n ? this.substr(0,n-1)+'....' : this;
						      };
							  
							  /*
							   * La siguiente función valida que los valores pasados, verifiquen que no
							   * sean ni nulos ni strings vacíos.Tener en cuenta que trabaja por igual con 
							   * valores atómicos que con funciones.
							   * 
							   * Para aplicarla, utilizar standardValidation.apply(null,[valores...])
							   * 
							   */
								Object.standardValidation = function (){
									  for(var i = 0; i < arguments.length; i++) {
										    if (arguments[i] == null || arguments[i] == ""){
										    	return false;
										    }
										  }
									  return true;
								}
								
								/**
								 * La siguiente funcion se encarga de validar una serie de campos, 
								 * en caso de encontrar un campo incompleto, 
								 * muestra el mensaje de error correspondiente.
								 * 
								 * Internamente recorre los argumentos de la funcion, los cuales, 
								 * los espera en forma de un array de dos dimensiones, donde
								 * 
								 * f( [  [funcion/valor a verificar, mensaje de error] , 
								 *       [funcion/valor a verificar2, mensaje de erro2r] ] )
								 * @returns {Boolean}
								 * 
								 */
								Object.standardErrorMessages = function(){	
									  for(var i = 0; i < arguments.length; i++) {
										    if ( arguments[i][0] == null || arguments[i][0] == ""){
										    	$translate(arguments[i][1]).then(function (text) {
													growl.error(text);
												});
										    	return false
										    }
										  }
									  return true;
								}
							  
							    Object.imageRestService = function(){
									return 'http://' + restHost + '/' + restContext + '/rest/'+ 'image/getImage';
								};
							  
							//Stack Overflow - How to check an object size
								Object.size = function(obj) {
								    var size = 0, key;
								    for (key in obj) {
								        if (obj.hasOwnProperty(key)) size++;
								    }
								    return size;
								};

							$scope.UserScope = globalService.getUserPosition();
							
                            $scope.goBack = function(){
                                $window.history.back();
                            };
                            
                            $scope.setInBills = function(){
                                globalService.setInBills();
                                $location.path('/comprobantes');
                            };
                            
                             $scope.setInBillTypes = function(){
                                globalService.setInBillTypes();
                                $location.path('/comprobantes');

                            };
                            
							$scope.inMainMenu = function(){
								return localStorageService.get('userInMainMenu');
							}; 

							$scope.setInNewOutcome = function(){
								$rootScope.editingOperation = false;
								$rootScope.outcomeOperation =true;
							};
							
							$scope.setInNewIncome = function(){
								$rootScope.editingOperation = false;
								$rootScope.outcomeOperation =false;
							};

							$rootScope.inDatos = false;
							$scope.usuarioLogueado = localStorageService
									.get('usuario');


							$rootScope.check = function(view_id) {
								return true;
							}

							var nick = localStorageService.get('nick');
							$scope.getLogged = function() {
								return logged;
							};
							$scope.getUsuario = function() {
								if (localStorageService.get('nick')!=null) {
									return localStorageService.get('nick');
								} else {
									return 'Please Login';
								}
							};


							$scope.launch = function(which) {
								switch (which) {
								case 'confirm':
									if (logged) {
										// Atencion, el dialog toma por defecto la
										// traduccion proporcionada
										// En este app.js, esta definida una
										// traduccion
										// pero tambien se puede enviar el titulo y
										// el mensaje de confirmacion
										// directamente como argumentos de la
										// funcion confirm()
										var dlg = dialogs.confirm();
										dlg.result.then(function(btn) {
											logout();
										}, function(btn) {

										});
									} else {
										growl.info("Usted ya se ha desconectado");
									}

									break;
								}
							}; 

							$scope.logout= function(){
								if(localStorageService.get('nick')!=null &&localStorageService.get('token')!=null){
									localStorageService.remove('nick');
									localStorageService.remove('token');
									logged = false;
									$location.path('/login');
								}else{
									growl.info("Usted ya se ha desconectado");
									$location.path('/login');
								}
								
							}
							;

							
							$scope.isActive = function(route) {
								return route === $location.path();
							};
							localStorageService.set('userInMainMenu', false);
							
							$timeout( function(){ $scope.allowPage(); }, 1500);
							$scope.allowPage = function(){
								 $("#appContainer").show();
							}
						})
						
				app.config(
						[
								'dialogsProvider',
								'$translateProvider',
								function(dialogsProvider, $translateProvider) {
									dialogsProvider.useBackdrop('static');
									dialogsProvider.useEscClose(true);
									dialogsProvider.useCopy(false);
									dialogsProvider.setSize('m'); 

									$translateProvider.useStaticFilesLoader({
										  prefix: 'scripts/languages/',
										  suffix: '.json'
										});

									dialogsProvider.setSize('m');

									$translateProvider.preferredLanguage('es');
									
									
								} ]);

		app.factory('UserService', [ function() {
			var sdo = {
				isLogged : false,
				username : ''
			};
			return sdo;
		} ]);

		app.controller('loginController', [
				'$scope',
				'$http',
				'UserService',
				function(scope, $http, User) {
					scope.login = function() {
						var config = { /* ... */}; // configuration object

						$http(config).success(
								function(data, status, headers, config) {
									if (data.status) {
										// succefull login
										User.isLogged = true;
										User.username = data.username;
									} else {
										User.isLogged = false;
										User.username = '';
									}
								}).error(function(data, status, headers, config) {
							User.isLogged = false;
							User.username = '';
						});
					};
				} ]);
		app.config([ 'growlProvider', function(growlProvider) {
			growlProvider.globalTimeToLive(5000);
		} ]);




		app.directive('ngReallyClick', [ '$parse', function($parse) {
			return {
				compile : function(tElement, tAttrs) {
					var fn = $parse(tAttrs.ngReallyClick);
					return function(scope, element, attrs) {
						element.on('click', function(event) {
							var message = attrs.ngReallyMessage;
							if (message && confirm(message)) {
								scope.$apply(function() {
									fn(scope, {
										$event : event
									});
								});
							}
						});
					};
				}
			};
		} ]);

		app.config(function($routeProvider) {

			$routeProvider.when('/', {
				templateUrl : 'views/inicio.html',
				controller : 'InicioCtrl'
			}).when('/login', {
				templateUrl : 'views/login.html',
				controller : 'LoginCtrl'
			}).when('/crudUser', {
				templateUrl : 'views/crudUser.html',
				controller : 'CrudUserCtrl'
			}).when('/crudTreatment', {
				templateUrl : 'views/crudTreatment.html',
				controller : 'CrudTreatmentCtrl'
			}).when('/crudSpecie', {
				templateUrl : 'views/crudSpecie.html',
				controller : 'CrudSpecieCtrl'
			}).when('/resolve', {
				templateUrl : 'views/resolveSample.html',
				controller : 'ResolveSampleCtrl'
			}).when('/samples', {
				templateUrl : 'views/samples.html',
				controller : 'SamplesCtrl'
			}).when('/ingreso', {
				templateUrl : 'views/crudMovimiento.html',
				controller : 'CrudOperationCtrl',
			}).when('/users', {
				templateUrl : 'views/users.html',
				controller : 'UserCtrl'
			}).when('/plant_species', {
				templateUrl : 'views/specie.html',
				controller : 'PlantSpeciesCtrl'
			}).when('/plague_species', {
				templateUrl : 'views/specie.html',
				controller : 'PlagueSpeciesCtrl'
            }).when('/treatments', {
				templateUrl : 'views/treatments.html',
				controller : 'TreatmentsCtrl'    
			}).when('/samplesToResolve', {
				templateUrl : 'views/samplesToResolve.html',
				controller : 'SamplesToResolveCtrl'    
			}).otherwise({
				redirectTo : '/'
			});
		});
//		app.run( function ($rootScope, $location, cellService) {        
//		    $("#appContainer").show();
//
//		});
	})();
