'use strict';

/**
 * @ngdoc function
 * @name tip_eiroa_mauro_server_frontend.controller:MainCtrl
 * @description # MainCtrl Controller of the tip_eiroa_mauro_server_frontend
 */
var app = angular.module('tip_eiroa_mauro_server_frontend');

app.controller('PlantSpeciesCtrl', function($http, $location, $scope, ngTableParams,
		$filter, $window, $route, $rootScope, growl, dialogs,globalService,$translate,
		restServices,$timeout) {
	
	function translate(){
		$translate('INDEX_PLANT_SPECIES').then(function (text) {
			$scope.title = text;
		    });
		
		$translate('FORM_NEW_PLANT').then(function (text) {
			$scope.newSpecieTitle = text;
		    });
		
		translateTableColumns();
	}
	
	$scope.inicializarVista = function() {
		globalService.setInMainMenu();
		translate();
		$scope.checkBtnClass = function(){
			return 'btn btn-success';
		};
		
		restServices.invokeGetCrops($http, {},
				$scope.findOk,
				restServices.defaultHandlerOnError);
	}
	$scope.tableColumns = {
            name: "Name",
            scientific_name : "Scientific Name",
            description: "Description",
            images: "Images",
            actions: "Actions",
            active: "Active"
 };
	function translateTableColumns(){
		$translate('FORM_NAME').then(function (text) {
			$scope.tableColumns.name = text;
		    });
		$translate('FORM_DESCRIPTION').then(function (text) {
			$scope.tableColumns.description= text;
		    });
		$translate('FORM_SCIENTIFICNAME').then(function (text) {
			$scope.tableColumns.scientific_name = text;
		    });
		$translate('FORM_IMAGES').then(function (text) {
			$scope.tableColumns.images= text;
		    });
		$translate('FORM_ACTIONS').then(function (text) {
			$scope.tableColumns.actions = text;
		    });
		$translate('FORM_ACTIVE').then(function (text) {
			$scope.tableColumns.active = text;
		    });
	}
	 
	 $scope.filterOn = function(){
			return ($scope.tableParams != null) && Object.size($scope.tableParams.parameters().filter) >0;
	}
	$rootScope.$on('$translateChangeSuccess', function() {
			translate();
		});
	
	$scope.switchActive = function(specie){
		if(specie.active){
			restServices.invokeDisableSpecie($http, {id:specie.id}, $scope.updateSpecieOk,
					restServices.defaultHandlerOnError);
		}else{
			restServices.invokeActivateSpecie($http, {id:specie.id}, $scope.updateSpecieOk,
					restServices.defaultHandlerOnError);
		}
	}
	
	$scope.updateSpecieOk = function(response) {
		$translate('DIALOG_UPDATE_SUCCESS').then(function (text) {
			growl.info(text);
		    });
		$route.reload();
	}
	
	$scope.processImages = function(images){
		return Object.size(images)
	}
	
	$scope.findOk = function(response) {
		$scope.resultCrops=[];
		$scope.resultCrops = response;
		console.log($scope.resultCrops)
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
				
//				var filteredData =$scope.resultUsers;
//				var orderedData = params.sorting() ? $filter('orderBy')(
//						filteredData, params.orderBy()) : filteredData;
						
			var filteredData = params.filter() ?
			                    $filter('filter')($scope.resultCrops, params.filter()) :
			                    	$scope.resultCrops;
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
		$timeout(
		function() {
			$scope.$watch("dataset", function() {
				$scope.tableParams.reload();
			});
		}, 0);
	}
	
	$scope.prepareEditSpecie= function(specie){
		$rootScope.editingSpecie = true;
		$rootScope.specieToEdit = specie;
		$rootScope.inCrudPlague = false;
	}
	
	$scope.newSpecie= function(){
		$rootScope.editingSpecie = false;
		$rootScope.inCrudPlague = false;
	}
	$scope.deleteSpecieOk = function(response) {
		$translate('DIALOG_DELETE_SUCCESS').then(function (text) {
			growl.info(text);
		    });
		$route.reload();
	}
	
	function deleteSpecie(id) {
		var data = {
			specieId: id
		};
		restServices.invokeDeleteSpecie($http, data, $scope.deleteSpecieOk,
				restServices.defaultHandlerOnError);
	}
	$scope.confirmationDeleteSpecie= function(specieId,name) {
		var title;
		var desc;
		$translate('DIALOG_SPECIE_DELETE_TITLE').then(function (text) {
			 title = text;
			 $translate('DIALOG_DELETE_DESC_DEFAULT').then(function (text) {
				 desc = text;
				 var dlg = dialogs.confirm(title +' '+ name + ' ?',desc);
					dlg.result.then(function(btn) {
						deleteSpecie(specieId);
					}, function(btn) {

					});
			    });
		    });				
	};
	
	$scope.limitDescription = function(text){
		var result = text;
		return result.trunc(200,true);
	}
	
	$scope.updateSpecieOk = function(response) {
		returnToPlagueOrPlantsAfterUpdate();
	}
	
	function returnToPlagueOrPlantsAfterUpdate(){
			$translate('CROP_UPDATED').then(function (text) {
				growl.info(text);
		    });
			$location.path('/plant_species');
			
		$route.reload();
	}
	
	$scope.inicializarVista();

});
