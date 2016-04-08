'use strict';

/**
 * @ngdoc function
 * @name tip_eiroa_mauro_server_frontend.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tip_eiroa_mauro_server_frontend
 */
angular.module('tip_eiroa_mauro_server_frontend')
  .controller('TreatmentsCtrl', function ($http, $location, $scope, ngTableParams,
			$filter, $window, $route, $rootScope, growl, dialogs,globalService,$translate,
			restServices,$timeout) {
	  
	  
	  $scope.inicializarVista = function() {
			globalService.setInMainMenu();
			$scope.totalUsers = 0;
			$scope.currentPage = 1;
			
		
			
			restServices.invokeGetTreatments($http, {},
					$scope.findOk,
					restServices.defaultHandlerOnError);
		}
	  
	  $scope.newTreatment= function(){
			$rootScope.editingTreatment = false;
		}
	  
	  $scope.filterOn = function(){
			return ($scope.tableParams != null) && Object.size($scope.tableParams.parameters().filter) >0;
		}
	  
	 $scope.tableColumns = {
              name: "Name",
              description: "Description",
              images: "Images",
              targets: "Targets",
              actions: "Actions"
   };
	translateTableColumns();
	
	$rootScope.$on('$translateChangeSuccess', function() {
		translateTableColumns();
	});
	  
	function translateTableColumns(){
		$translate('FORM_NAME').then(function (text) {
			$scope.tableColumns.name = text;
		    });
		$translate('FORM_DESCRIPTION').then(function (text) {
			$scope.tableColumns.description= text;
		    });
		$translate('FORM_IMAGES').then(function (text) {
			$scope.tableColumns.images= text;
		    });
		$translate('FORM_TARGETS').then(function (text) {
			$scope.tableColumns.targets = text;
		    });
		$translate('FORM_ACTIONS').then(function (text) {
			$scope.tableColumns.actions = text;
		    });
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
		$scope.resultTreatments=[];
		$scope.resultTreatments = response;
		console.log($scope.resultTreatments)
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
			                    $filter('filter')($scope.resultTreatments, params.filter()) :
			                    	$scope.resultTreatments;
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
	
	$scope.prepareEditTreatment= function(treatment){
		$rootScope.editingTreatment = true;
		$rootScope.processedTargets = $scope.processTargets(treatment.targets,"-");
		$rootScope.idTargetsTreatment = $scope.processIdTargets(treatment.targets,"-")
		$rootScope.speciesTreatment = treatment.targets;
		$rootScope.treatmentToEdit = treatment;
		console.log(treatment);
	}
	
	$scope.findTreatmentOk = function(response){
		$rootScope.treatmentToEdit = response
	}
	
	
	
	$scope.processTargets = function(targets,separator){
		console.log(targets)
		var index;
		var result = "";
		for	(index = 0; index < targets.length; index++) {
			result += targets[index].name;
			if(index < (targets.length -1)){
				result += separator;
			}
			
		}
		return result;
	}
	
	$scope.processIdTargets = function(targets,separator){
		var index;
		var result = "";
		for	(index = 0; index < targets.length; index++) {
			result += targets[index].id;
			//Si es el ultimo, no agregar separador
			if(index < (targets.length -1)){
				result += separator;
			}
			
		}
		return result;
	}
	
	$scope.processImages = function(images){
		return Object.size(images)
	}
	
	$scope.deleteTreatmentOk = function(response) {
		$translate('DIALOG_DELETE_SUCCESS').then(function (text) {
			growl.info(text);
		    });
		$route.reload();
	}
	
	function deleteTreatment(id) {
		var data = {
			treatmentId: id
		};
		restServices.invokeDeleteTreatment($http, data, $scope.deleteTreatmentOk,
				restServices.defaultHandlerOnError);
	}
	$scope.confirmationDeleteTreatment= function(treatmentId,name) {
		var title;
		var desc;
		$translate('DIALOG_TREATMENT_DELETE_TITLE').then(function (text) {
			 title = text;
			 $translate('DIALOG_DELETE_DESC_DEFAULT').then(function (text) {
				 desc = text;
				 var dlg = dialogs.confirm(title +' '+ name + ' ?',desc);
					dlg.result.then(function(btn) {
						deleteTreatment(treatmentId);
					}, function(btn) {

					});
			    });
		    });				
	};
	
	// Default Controlador
	$scope.inicializarVista();

	
  });
