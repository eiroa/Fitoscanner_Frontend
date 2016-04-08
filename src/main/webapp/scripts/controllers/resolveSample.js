'use Strict';

/**
 * @ngdoc function
 * @name tip_eiroa_mauro_server_frontend.controller:MainCtrl
 * @description # MainCtrl Controller of the tip_eiroa_mauro_server_frontend
 */

var app = angular.module('tip_eiroa_mauro_server_frontend');
app.controller('ResolveSampleCtrl', function($route, $scope, $location,
		$window, $http, $rootScope, growl, dialogs, globalService, $translate,
		ngTableParams, restServices, $filter, $timeout, leafletData,
		leafletEvents, $anchorScroll) {

	$scope.imageRestService = Object.imageRestService();
	$scope.isCollapse = true;
	// Inicializa los combos
	$scope.inicializarVista = function() {
		$scope.sample = $rootScope.sampleToResolve;
		if ($scope.sample.lat != null) {
			$scope.prepareMap($scope.sample);
		}
		restServices.invokeGetSpecies($http, {}, $scope.getSpeciesOk,
				restServices.defaultHandlerOnError);
	}

	$scope.getSpeciesOk = function(response) {
		$scope.species = response;
	}

	$scope.goToBottom = function() {
		$location.hash('bottom');
		$anchorScroll();
	};

	$scope.formatTreatments = function(treatmentNames) {
		var result;
		angular.forEach(treatmentNames, function(value, key) {
			this.push(key + ': ' + value);
		}, log);
	};

	$scope.goToTop = function() {
		$location.hash('top');
		$anchorScroll();
	};

	$scope.goTo = function(elementId) {
		$location.hash(elementId);
		$anchorScroll();
	};

	$scope.formatDateFull = function(secs) {
		var d = new Date(secs);
		return d;
	}

	$scope.formatDateSimple = function(secs) {
		var d = $filter("date")(secs, "yyyy-MM-dd HH:mm:ss 'GMT:' Z");
		return d;
	}

	$scope.selectSpecie = function(specie) {
		$scope.specieSelected = specie;
	}

	$scope.resolveSampleOk = function(response) {
		$translate('DIALOG_SAMPLE_RESOLUTION_SUCCESS').then(function(text) {
			growl.info(text);
		});
		$location.path('/samplesToResolve');
	}

	function resolveSample() {
		var data = {
			sampleId : $scope.sample.id,
			specieResolvedId : $scope.specieSelected.id
		};
		restServices.invokeResolveSample($http, data, $scope.resolveSampleOk,
				restServices.defaultHandlerOnError);
	}
	$scope.confirmationResolveSample = function() {
		var title;
		var desc;
		$translate('DIALOG_RESOLVE_SAMPLE_TITLE').then(function(text) {
			title = text;
			$translate('DIALOG_RESOLVE_SAMPLE_DESC').then(function(text) {
				desc = text;
				var dlg = dialogs.confirm(title, desc);
				dlg.result.then(function(btn) {
					resolveSample();
				}, function(btn) {

				});
			});
		});
	};

	$scope.resolveSample = function() {

	}

	$scope.searchSample = function() {
		var filtro = $scope.populateFilter();
	}

	$scope.populateFilter = function() {
		var filtro = {
			name : 'aloha'
		}
		return filtro;
	}

	$scope.prepareMap = function(sample) {
		var samples = {}
		var num = 1;
		var lat = sample.lat;
		if (lat != "") {
			lat = parseFloat(sample.lat);
			var lon = parseFloat(sample.lon);
			var name = sample.name;
			var sample = {
				lat : lat,
				lng : lon,
				message : name + " - "
						+ $scope.formatDateSimple(sample.sample_date),
				focus : true,
				draggable : false
			}
			console.log("Sample: " + lat + " / " + lon)
			samples[num] = sample;
		}

		num = num + 1;
		angular.extend($scope, {
			events : {
				map : {
					enable : [ 'drag', 'click', 'mousemove' ],
					logic : 'emit'
				}
			},
			markers : samples,
			defaults : {
				scrollWheelZoom : false
			}
		});
	}

	// Default Controlador
	$scope.inicializarVista();

	// Definicion base del mapa a generar

	$scope.activarDibujar = function() {
		dibujando = true;

		$scope.nombreRecorrido = 'Recorrido';
		$scope.colorRecorrido = '#000000';
		$scope.grosorRecorrido = 1;
	};
	$scope.desactivarDibujar = function() {
		dibujando = false;
		coords = new Array();

	};
	$scope.getDibujando = function() {
		return dibujando;
	};

	var clicks = 0;

	// Seteo inicial de click customizado
	leafletData.getMap().then(function(map) {
		map.on('click', function(e) {
			if (dibujando) {

				var newCord = new Array();
				newCord[0] = e.latlng.lat;
				newCord[1] = e.latlng.lng;
				coords.push(newCord);

			}
			;

		});

	});
	
	app.directive('fancybox', function($compile, $parse) 
			{
				return {
					restrict: 'C',
					replace: false,
					link: function($scope, element, attrs) {

						$scope.$watch(function() { return element.attr('openbox') }, function(openbox) 
						{
							if (openbox == 'show') {

								var options = $parse(attrs.options)($scope) || {};

								if (!options.href && !options.content) {

									options.content = angular.element(element.html()); 

									$compile(options.content)($scope);

								}
								
								var onClosed = options.onClosed || function() {};

								options.onClosed = function() {
									$scope.$apply(function() {
										onClosed();
										element.attr('openbox', 'hide');
									});
								};

								$.fancybox(options);
							}
						});		 
					}
				};
			});
	
	$scope.image = "https://www.google.com/images/srpr/logo11w.png";
	
	$scope.openBox = function(id) 
	{
		$(id).attr('openbox', 'show');
	}


});
