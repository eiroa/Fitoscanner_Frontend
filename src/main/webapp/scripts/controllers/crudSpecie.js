'use strict';

/**
 * @ngdoc function
 * @name tip_eiroa_mauro_server_frontend.controller:CrudTreatmentCtrl
 * @description # CrudTreatmentCtrl Controller of the tip_eiroa_mauro_server_frontend
 */
var app = angular.module('tip_eiroa_mauro_server_frontend');
app.controller('CrudSpecieCtrl', function($scope, $log, $parse, $location, $http,
		$rootScope, growl,globalService,dialogs,$translate,restServices) {
	$scope.imageRestService = Object.imageRestService();
	if ($rootScope.editingSpecie) {
		$scope.editingUser = $rootScope.editingUser;
		var specieToEdit = $rootScope.specieToEdit;
		$scope.inputDescription = specieToEdit.description;
		$scope.inputScientificName = specieToEdit.scientific_name;
		$scope.inputName = specieToEdit.name;
		$scope.images= specieToEdit.images;
		$scope.id = specieToEdit.id;
		if($rootScope.inCrudPlague){
			$translate('TITLE_EDIT_PLAGUE').then(function (text) {
				$scope.title = text+ " . "+" "+specieToEdit.name;
		    });
		}else{
			$translate('TITLE_EDIT_CROP').then(function (text) {
				$scope.title = text+ " . "+" "+specieToEdit.name;
		    });
		}
		
	}else{
		if($rootScope.inCrudPlague){
			$translate('TITLE_NEW_PLAGUE').then(function (text) {
				$scope.title = text;
		    });
		}else{
			$translate('TITLE_NEW_CROP').then(function (text) {
				$scope.title = text;
		    });
		}
	}
	
	function returnToPlagueOrPlantsAfterUpdate(){
		if($rootScope.inCrudPlague){
			$translate('PLAGUE_UPDATED').then(function (text) {
				growl.info(text);
			});
			$location.path('/plague_species');
		}else{
			$translate('CROP_UPDATED').then(function (text) {
				growl.info(text);
		    });
			$location.path('/plant_species');
		}
	}
	
	function returnToPlagueOrPlantsAfterRegister(){
		if($rootScope.inCrudPlague){
			$translate('PLAGUE_REGISTERED').then(function (text) {
				growl.info(text);
			});
			$location.path('/plague_species');
		}else{
			$translate('CROP_REGISTERED').then(function (text) {
				growl.info(text);
		    });
			$location.path('/plant_species');
		}
	}
	
	$scope.imageOk = function(message,response) {
		$translate(message).then(function (text) {
			if($rootScope.inCrudPlague){
				$translate('PLAGUE_UPDATED').then(function (text2) {
					growl.success(text);
					growl.success(text2);
				});
				$location.path('/plague_species');
			}else{
				$translate('CROP_UPDATED').then(function (text2) {
					growl.success(text);
					growl.success(text2);
			    });
				$location.path('/plant_species');
			}
		});
	}
	
	
	$scope.updateImage = function(image){
		var data;
		if(image.imageRaw != null){
			if(image.imageRaw.filesize < 1536000){
				data = {
						idImage : image.id,
						imageName: image.imageRaw.filename,
						altersBase64: true,
						base64: image.imageRaw.base64
					};
			}else{
				$translate('FORM_ERROR_IMAGE_TOOBIG').then(function (text) {
					growl.error(text);
				});
				return;
			}
			
		}else{
			data = {
					idImage : image.id,
					imageName: image.name,
					altersBase64: false,
					base64: "x"
				};
		}
		restServices.invokeEditImage($http, data, $scope.imageOk("IMAGE_UPDATED"),
				restServices.defaultHandlerOnError);
	}
	
	function deleteImage(id){
		var data ={
				idImage :id
		}
		restServices.invokeDeleteImage($http, data, $scope.imageOk("IMAGE_DELETED"),
				restServices.defaultHandlerOnError);
	}
	
	$scope.confirmationDeleteImage= function(image) {
		var title;
		var desc;
		if(Object.size($scope.images) >1){
			$translate('DIALOG_IMAGE_DELETE_TITLE').then(function (text) {
				 title = text;
				 $translate('DIALOG_DELETE_DESC_DEFAULT').then(function (text) {
					 desc = text;
					 var dlg = dialogs.confirm(title +' '+ image.name + ' ?',desc);
						dlg.result.then(function(btn) {
							deleteImage(image.id);
						}, function(btn) {

						});
				    });
			    });				
		}else{
			growl.error("La especie no puede tener menos de 1 imagen");
		}
		
	};
	
	$scope.addNewImage = function(){
		if($scope.imageToLoad != null && $scope.imageToLoad != ""){
			if($scope.imageToLoad.filesize < 1536000){
				var data = {
						id : $scope.id,
						imageName: $scope.imageToLoad.filename,
						base64: $scope.imageToLoad.base64
					};
				restServices.invokeSaveSpecieImage($http, data, $scope.imageOk("IMAGE_REGISTERED"),
						restServices.defaultHandlerOnError);
			}else{
				$translate('FORM_ERROR_IMAGE_TOOBIG').then(function (text) {
					growl.error(text);
				});
			}
		}else{
			$translate('FORM_ERROR_IMAGE_REQUIRED').then(function (text) {
				growl.error(text);
			});
		}
		
	}
	
	

	$scope.editionMode = function(){
		return $rootScope.editingSpecie;
	};

	$scope.registerMode = function(){
		return !($rootScope.editingSpecie);
	};

	$scope.registerSpecieOk = function(response) {
		returnToPlagueOrPlantsAfterRegister();
	};
	
	
	$scope.inicializarVista = function() {
		$scope.imageToLoad = "";
	}

	$scope.updateSpecieOk = function(response) {
		returnToPlagueOrPlantsAfterUpdate();
	}

	$scope.populateParams = function() {
		var data = {};
		if($scope.registerMode()){
			data = {
					name : $scope.inputName,
					scientificName: $scope.inputScientificName,
					isCrop: !$rootScope.inCrudPlague,
					isPlague: $rootScope.inCrudPlague,
					description: $scope.inputDescription,
					hasPictures: false,
					picturesQuantity: 0
				};
			var imagesPossible = 4;
			var i =1;
			for ( i = 1; i <= imagesPossible; i++) { 
				// Accedemos de forma dinamica al scope de una variable
				var name = 'imageToRegister'+i;
			    if($scope[name].filename != null 
						&& $scope[name].base64 != null 
						&& $scope[name].filename != ""
							&& $scope[name].base64 != null){
					data.hasPictures = true;
					data.picturesQuantity = data.picturesQuantity + 1;
					data["base64_"+data.picturesQuantity] = $scope[name].base64;
					data["im"+data.picturesQuantity] = $scope[name].filename;
				}
			}
		}else{
			data = {
					name : $scope.inputName,
					scientificName: $scope.inputScientificName,
					description: $scope.inputDescription,
					isCrop: !$rootScope.inCrudPlague,
					isPlague: $rootScope.inCrudPlague
				};
		}
		 
		return data;
	}
	
	$scope.registerSpecie = function() {
		
		if(validate()){
			var data = $scope.populateParams();
			restServices.invokeSaveSpecieWithNImages($http, data, $scope.registerSpecieOk,
					restServices.defaultHandlerOnError);
		}
		
	}
	
	
	function validate(){
		var validationArray;
		validationArray = [
		                       [$scope.inputName,'FORM_ERROR_NAME_REQUIRED'],
		                       [$scope.inputScientificName,'FORM_ERROR_SCIENTIFICNAME_REQUIRED'],
		                       [$scope.inputDescription,'FORM_ERROR_DESCRIPTION_REQUIRED']
		                      ];
		return Object.standardErrorMessages.apply(null,validationArray);
		
	}


	$scope.updateSpecie= function() {
		if(validate()){
			var data = $scope.populateParams();
			data.id = $rootScope.specieToEdit.id;
			restServices.invokeUpdateSpecieNoImages($http, data, $scope.updateSpecieOk,
					restServices.defaultHandlerOnError);
		}
	}	
	$scope.inicializarVista = function() {
		$scope.imageToLoad = "";
		$scope.imageToRegister1 = "";
		$scope.imageToRegister2 = "";
		$scope.imageToRegister3 = "";
		$scope.imageToRegister4 = "";
	}
		 $scope.inicializarVista();
		
});

