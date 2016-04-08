'use Strict';

/**
 * @ngdoc function
 * @name tip_eiroa_mauro_server_frontend.controller:MainCtrl
 * @description # MainCtrl Controller of the tip_eiroa_mauro_server_frontend
 */

angular
		.module('tip_eiroa_mauro_server_frontend')
		.controller(
				'UserCtrl',
				function($route,$scope, $location, $http, $rootScope, growl,dialogs,
						globalService,$translate,
						ngTableParams,restServices,$filter,$timeout) {

					// Inicializa los combos
					$scope.inicializarVista = function() {
						globalService.setInMainMenu();
						$scope.totalUsers = 0;
						$scope.currentPage = 1;
						
					
						
						restServices.invokeGetUsers($http, {},
								$scope.findOk,
								restServices.defaultHandlerOnError);
					}
					
					$scope.newUser = function(){
						$rootScope.editingUser = false;
					}
					
						
					
					$scope.filterOn = function(){
						return ($scope.tableParams != null) && Object.size($scope.tableParams.parameters().filter) >0;
					}
					
					$scope.tableColumns = {
		                       code : "Code",
		                       imei: "IMEI",
		                       nick: "Nick",
		                       name: "Name",
		                       surname: "Surname",
		                       anon: "Anonymous",
		                       admin: "Admin",
		                       actions: "Actions"
		            };
					translateTableColumns();
					
					$rootScope.$on('$translateChangeSuccess', function() {
						translateTableColumns();
					});
					function translateTableColumns(){
						$translate('FORM_CODE').then(function (text) {
							$scope.tableColumns.code = text;
						    });
						$translate('FORM_NICKNAME').then(function (text) {
							$scope.tableColumns.nick = text;
						    });
						$translate('FORM_NAME').then(function (text) {
							$scope.tableColumns.name = text;
						    });
						$translate('FORM_SURNAME').then(function (text) {
							$scope.tableColumns.surname = text;
						    });
						$translate('FORM_ISANON').then(function (text) {
							$scope.tableColumns.anon = text;
						    });
						$translate('FORM_ACTIONS').then(function (text) {
							$scope.tableColumns.actions = text;
						    });
						
					}

					
					
					$scope.searchUsers= function() {

						$scope.tableParams.page(1);
						$scope.tableParams.reload();
					}

					
					$scope.populateFilter = function() {
						var filtro = {
							pageNumber : 1,
							paseSize : 1,
							resultCount : 0,
							name: 'aloha'
						}
						return filtro;
					}
					
					$scope.findOk = function(response) {
						$scope.resultUsers=[];
						$scope.resultUsers = response;
						console.log($scope.resultUsers)
						$scope.tableParams = new ngTableParams({
							page : 1, // show first page
							count : 10, // count per page
							filter : {
								
							},
							sorting : {
								
							}
						}, {
							counts: [10,20,30,50],
							total: function() {
								return getData().length;
							}, // length of data
							getData : function($defer, params) {
								
//								var filteredData =$scope.resultUsers;
//								var orderedData = params.sorting() ? $filter('orderBy')(
//										filteredData, params.orderBy()) : filteredData;
										
							var filteredData = params.filter() ?
							                    $filter('filter')($scope.resultUsers, params.filter()) :
							                    	$scope.resultUsers;
							 var orderedData = params.sorting() ?$filter('orderBy')
									 (filteredData, params.orderBy()) : filteredData;		
										
								$defer.resolve(orderedData.slice((params.page() - 1)
										* params.count(), params.page() * params.count()));
							},
							$scope : {
								$data : {}
							}
						});
						
					}




					function reloadTable() {
						$timeout( // Advertencia, fix sucio con timeout, se debe a
									// error en ng-table en tableParams.reload
						function() {
							$scope.$watch("dataset", function() {
								$scope.tableParams.reload();
							});
						}, 0);
					}
					
					$scope.editProvider = function(provider) {
						$rootScope.registeringProvider = false;
						$rootScope.providerToEdit = provider;
					}

					$scope.prepararEditarUsuario = function(user){
						$rootScope.editingUser = true;
						$rootScope.userToEdit = user;
					}
					
					$scope.findUserOk = function(response){
						$rootScope.userToEdit = response
					}
					
					$scope.deleteUserOk = function(response) {
						$translate('DIALOG_DELETE_SUCCESS').then(function (text) {
							growl.info(text);
						    });
						$route.reload();
					}
					function deleteUser(id) {
						var data = {
							userId: id
						};
						restServices.invokeDeleteUser($http, data, $scope.deleteUserOk,
								restServices.defaultHandlerOnError);
					}
					$scope.confirmacionBorrarUsuario= function(userId,imei) {
						var title;
						var desc;
						$translate('DIALOG_USER_DELETE_TITLE').then(function (text) {
							 title = text;
							 $translate('DIALOG_USER_DELETE_DESC').then(function (text) {
								 desc = text;
								 var dlg = dialogs.confirm(title +' '+ imei + ' ?',desc);
									dlg.result.then(function(btn) {
										deleteUser(userId);
									}, function(btn) {

									});
							    });
						    });				
					};
					
					$scope.checkUnresolvedSamples = function(user){
						$rootScope.resolvingSample = true;
						$rootScope.userToCheckSamples = user;
					}
					
					$scope.checkResolvedSamples = function(user){
						$rootScope.resolvingSample = false;
						$rootScope.userToCheckSamples = user;
					}
					// Default Controlador
					$scope.inicializarVista();

				});
