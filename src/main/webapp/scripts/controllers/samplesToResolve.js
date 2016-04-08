'use strict';

/**
 * @ngdoc function
 * @name tip_eiroa_mauro_server_frontend.controller:SamplesToResolveCtrl
 * @description # SamplesToResolveCtrl Controller of the tip_eiroa_mauro_server_frontend
 */
var app = angular.module('tip_eiroa_mauro_server_frontend');
app.controller('SamplesToResolveCtrl', function($scope, $log, $location, $http,$route,
		$rootScope, growl,globalService,dialogs,$translate,restServices,$timeout,$filter,ngTableParams) {

	
	function translate(){
		$translate('INDEX_PLANT_SPECIES').then(function (text) {
			$scope.title = text;
		    });
		translateTableColumns();
	}
	
	$scope.formatDateFull = function(secs){
		var d = new Date(secs); 
		return d;
	}
	
	$scope.formatDateSimple = function(secs){
		var d = $filter("date")(secs, "yyyy-MM-dd HH:mm:ss 'GMT:' Z"); 
		return d;
	}
	
	 $scope.tableColumns = {
	            user: "User",
	            imei: "IMEI",
	            name: "Sample Name",
	            date: "Sample Date",
	            images: "Images",
	            actions: "Actions"
	 };
		function translateTableColumns(){
			$translate('FORM_USER').then(function (text) {
				$scope.tableColumns.user = text;
			    });
			$translate('FORM_DATE').then(function (text) {
				$scope.tableColumns.date = text;
			    });
			$translate('FORM_IMAGES').then(function (text) {
				$scope.tableColumns.images= text;
			    });
			$translate('FORM_NAME').then(function (text) {
				$scope.tableColumns.name = text;
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
		 
		 $scope.filterOn = function(){
				return ($scope.tableParams != null) && Object.size($scope.tableParams.parameters().filter) >0;
		}
		$rootScope.$on('$translateChangeSuccess', function() {
				translate();
			});
		
		$scope.processImages = function(images){
			return Object.size(images)
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

	$scope.findOk = function(response) {
		$scope.samples=[];
		$scope.samples = response;
		
		
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
				
			var filteredData = params.filter() ?
			                    $filter('filter')($scope.samples, params.filter()) :
			                    	$scope.samples;
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

	
	$scope.inicializarVista = function() {
		globalService.setInMainMenu();
		restServices.invokeFindUnresolvedSamples($http, {limit:50},$scope.findOk,restServices.defaultHandlerOnError);
		translate();
	}

	$scope.inicializarVista();
});

