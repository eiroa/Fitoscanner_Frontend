'use Strict';

/**
 * @ngdoc function
 * @name tip_eiroa_mauro_server_frontend.controller:MainCtrl
 * @description # MainCtrl Controller of the tip_eiroa_mauro_server_frontend
 */

angular
		.module('tip_eiroa_mauro_server_frontend')
		.controller(
				'AccionesCtrl',
				function($scope, $location, $http, $rootScope, growl,$translate) {

					// Inicializa los combos
					$scope.inicializarVista = function() {
						$scope.descripcion = $rootScope.descripcionNivelDePermiso;
						$scope.resultadoAcciones = [];
						$scope.accionesAccesosSeleccionadas = [];

						obtenerComboAccesoAModulo($http, function(response) {
							$scope.accionesAccesos = extractCombo(response);
						});

						$scope.obtenerAccionesDeAccesoDeNivelDePermiso();
						$scope.obtenerComboAccionesFaltantesANivelDePermiso();

					}

					$scope.obtenerAccionesDeAccesoDeNivelDePermiso = function() {

						var filtro = {
							id : $rootScope.idNivelDePermiso
						}

						invokeBuscarAccionesDeAccesoDeNivelDePermiso($http,
								filtro, function(response) {
									$scope.accionesAccesosSeleccionadas = [];
									var datos = response['acciones'];

									if (datos != null && datos != undefined) {
										for (var n = 0; n < datos.length; n++) {
											$scope.accionesAccesosSeleccionadas
													.push((datos[n].id)
															.toString());
										}
									}

								}, defaultHandlerOnError);
					}

					$scope.verSelecciones = function() {
						$scope.accionesAccesosSeleccionadas;
						a = 2;
					}

					$scope.obtenerComboAccionesFaltantesANivelDePermiso = function() {
						$scope.acciones = [];
						obtenerComboAccionesFaltantesANivelDePermiso($http,
								$rootScope.idNivelDePermiso,
								function(response) {
									$scope.acciones = extractCombo(response);
								});
					}

					$scope.obtenerAccionesDeNivelDePermiso = function() {

						var filtro = {
							id : $rootScope.idNivelDePermiso
						};

						invokeBuscarAccionesDeNivelDePermiso($http, filtro,
								function(response) {
									var datos = response['acciones'];
									$scope.resultadoAcciones = [];

									if (datos != null && datos != 'undefined') {
										for (var n = 0; n < datos.length; n++) {
											$scope.resultadoAcciones
													.push(datos[n]);
										}
									}
								}, defaultHandlerOnError);
					}

					$scope.desvincularAccion = function(idAccion) {

						var data = {
							id_nivel : $rootScope.idNivelDePermiso,
							id_accion : idAccion
						};

						invokeDesvincularAccion(
								$http,
								data,
								function(response) {

									$scope.obtenerAccionesDeNivelDePermiso();
									$scope.obtenerComboAccionesFaltantesANivelDePermiso();

								}, defaultHandlerOnError);
					}

					$scope.asociar = function() {

						var accionesSeleccionadas = extractSelectedValues($scope.accionesSeleccionadas);

						var data = {
							id_nivel : $rootScope.idNivelDePermiso,
							ids_acciones : accionesSeleccionadas
						};

						invokeAsociarAcciones(
								$http,
								data,
								function(response) {
									$scope
											.obtenerComboAccionesFaltantesANivelDePermiso();
									$scope.obtenerAccionesDeNivelDePermiso();
								}, defaultHandlerOnError);
					}

					$scope.toggleSelection = function toggleSelection(idAccion) {
						var idx = $scope.accionesAccesosSeleccionadas
								.indexOf(idAccion);

						// is currently selected
						if (idx > -1) {
							$scope.desvincularAccion(idAccion);
						}

						// is newly selected
						else {
							var accionesSeleccionadas = [];
							accionesSeleccionadas.push(idAccion);

							var data = {
								id_nivel : $rootScope.idNivelDePermiso,
								ids_acciones : accionesSeleccionadas
							};

							invokeAsociarAcciones(
									$http,
									data,
									function(response) {
										$scope
												.obtenerComboAccionesFaltantesANivelDePermiso();
										$scope
												.obtenerAccionesDeNivelDePermiso();
									}, defaultHandlerOnError);
						}
					}

					// Default Controlador
					$scope.inicializarVista();

				});
