'use Strict';

/**
 * @ngdoc function
 * @name tip_eiroa_mauro_server_frontend.controller:MainCtrl
 * @description # MainCtrl Controller of the tip_eiroa_mauro_server_frontend
 */

 var app = angular
		.module('tip_eiroa_mauro_server_frontend');
		app.controller(
				'SamplesCtrl',
				function($route,$scope, $location,$window, $http, $rootScope, growl,dialogs,globalService,$translate,
						ngTableParams,restServices,$filter,$timeout,leafletData,leafletEvents,$anchorScroll) {
					
					$scope.imageRestService = Object.imageRestService();
					
					function translate(){
						 if($scope.resolvingSample){
							$translate('INDEX_UNRESOLVED_SAMPLES').then(function (text) {
								$scope.title = text;
							    });
						}else{
							$translate('INDEX_RESOLVED_SAMPLES').then(function (text) {
								$scope.title = text;
							    });
						}
						  
					  }
					
					
					// Inicializa los combos
					$scope.inicializarVista = function() {
						$scope.resolvingSample = $rootScope.resolvingSample;
						$scope.user = $rootScope.userToCheckSamples.id;
						translate();
						var data ={userId :$scope.user, getResolved:!$scope.resolvingSample } 
						restServices.invokeFindUserSamples($http, data,$scope.findSamplesOk,restServices.defaultHandlerOnError);
//						
					}
					
					$scope.goToBottom = function() {
					      $location.hash('bottom');
					      $anchorScroll();
					    };
					    
				   $scope.goToTop = function() {
						      $location.hash('top');
						      $anchorScroll();
						    };
						    
				   $scope.goTo = function(elementId) {
							      $location.hash(elementId);
							      $anchorScroll();
					};	    
					
					$scope.formatDateFull = function(secs){
						var d = new Date(secs); 
						return d;
					}
					
					$scope.formatDateSimple = function(secs){
						var d = $filter("date")(secs, "yyyy-MM-dd HH:mm:ss 'GMT:' Z"); 
						return d;
					}
					
					
					
					$scope.searchSample= function() {
						var filtro = $scope.populateFilter();
					}

					
					$scope.populateFilter = function() {
						var filtro = {
							name: 'aloha'
						}
						return filtro;
					}
					
					$scope.findSamplesOk = function(response) {
//						growl.success('Muestras cargadas')
						console.log(response)
						$scope.samples =response;
						var samples = {}
						var num = 1;
						for (var key in response)
						{
						   if (response.hasOwnProperty(key))
						   {
						      // here you have access to
						      var lat = response[key].lat;
						      if( lat != ""){
						    	  lat = parseFloat(response[key].lat);
							      var lon = parseFloat(response[key].lon);
							      var name = response[key].name;
							      var sample = {
							    		  lat:lat,
							    		  lng:lon,
							    		  message: name + " - " + $scope.formatDateSimple(response[key].sample_date),
							    		  focus: true,
							              draggable: false}
							      console.log("Sample: "+lat+" / "+ lon)
							      samples[num] = sample;
						      }
						      
						   }
						   num = num +1;
						}
//						console.log("and the samples are... ")
//						console.log(samples)
						angular.extend($scope, {
					        osloCenter: {
					        	lat: -34.7065494,
				                lng: -58.2776461,
					            zoom: 12
					        },
					        events: {
					            map: {
					                enable: [ 'drag', 'click', 'mousemove'],
					                logic: 'emit'
					            }
					        },
					        markers: samples,
					        defaults: {
					            scrollWheelZoom: false
					        }
					    });
					}
					
					// Default Controlador
					$scope.inicializarVista();
					
					
					
					
					 // LEAFLET /////////////////
					
					var dibujando = false;
				      var coords = new Array();
				      var objetosDelMapa = new Array();
				      
				      $scope.getCoords = function() {
				        return coords;
				      };
				      
				      $scope.increaseWidth = function (){
				        this.paths.p1.weight ++;
				          this.paths.p2.weight ++;
				      };
				    
				      //Ejemplo de seteo de vista
				    $scope.fitToBaires = function() {
				                leafletData.getMap().then(function(map) {      
				                    map.fitBounds([ [-34.521, -58.571], [-34.666, -58.245] ]);
				                });
				    };

				    $scope.decreaseWidth = function (){
				        this.paths.p1.weight --;
				          this.paths.p2.weight --;
				      };
				      
				      $scope.getWidth = function(){
				       return this.paths.p1.weight;
				      };
				    
				    //Definicion base del mapa a generar  
				      
				      
				      
				      $scope.activarDibujar = function(){ 
				          dibujando = true;
				          
				          $scope.nombreRecorrido ='Recorrido';
				          $scope.colorRecorrido ='#000000';
				          $scope.grosorRecorrido = 1;
				       };
				      $scope.desactivarDibujar = function(){ 
				          dibujando = false; 
				          coords = new Array(); 
				          
				      };
				      $scope.getDibujando = function(){return dibujando;};
				      
				      var clicks= 0;
				      
				      //Seteo inicial de click customizado
				      leafletData.getMap().then(function(map) {                          
				            map.on('click', function(e) {  
				                if(dibujando){

				                    var newCord = new Array();
				                    newCord[0] = e.latlng.lat;
				                    newCord[1] = e.latlng.lng;
				                    coords.push(newCord);

				                 };

				            });
				                           
				       });
				      
				      $scope.resolveSample = function(sample){
				    	  $rootScope.sampleToResolve = sample;
				      }
				      
				      $scope.confirmationDeleteSample= function(sampleId,name) {
				  		var title;
				  		var desc;
				  		$translate('DIALOG_SAMPLE_DELETE_TITLE').then(function (text) {
				  			 title = text;
				  			 $translate('DIALOG_DELETE_DESC_DEFAULT').then(function (text) {
				  				 desc = text;
				  				 var dlg = dialogs.confirm(title +' '+ name + ' ?',desc);
				  					dlg.result.then(function(btn) {
				  						deleteSample(sampleId);
				  					}, function(btn) {

				  					});
				  			    });
				  		    });				
				  	};
				  	
				  	function deleteSample(id) {
						var data = {
							sampleId: id
						};
						restServices.invokeDeleteSample($http, data, $scope.deleteSampleOk,
								restServices.defaultHandlerOnError);
					}
				  	
				  	$scope.deleteSampleOk = function(response) {
						$translate('DIALOG_DELETE_SUCCESS').then(function (text) {
							growl.info(text);
						    });
						$route.reload();
					}

	});


