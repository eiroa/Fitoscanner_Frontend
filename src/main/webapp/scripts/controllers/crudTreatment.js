'use strict';

/**
 * @ngdoc function
 * @name tip_eiroa_mauro_server_frontend.controller:CrudTreatmentCtrl
 * @description # CrudTreatmentCtrl Controller of the tip_eiroa_mauro_server_frontend
 */
var app = angular.module('tip_eiroa_mauro_server_frontend');
app.controller('CrudTreatmentCtrl', function($scope, $log, $location, $http,
		$rootScope, growl,globalService,dialogs,$translate,restServices) {
	$scope.imageRestService = Object.imageRestService();
	
	if ($rootScope.editingTreatment) {
		$scope.editingTreatment = $rootScope.editingTreatment;
		var treatmentToEdit = $rootScope.treatmentToEdit;
		$scope.inputDescription = treatmentToEdit.description;
		$scope.inputName = treatmentToEdit.name;
		$scope.inputTypeQuantity =treatmentToEdit.typeQuantity;
	    $scope.inputQuantity =treatmentToEdit.quantity;
	    $scope.inputTypeFrequency =treatmentToEdit.typeFrequency;
	    $scope.inputFrequency =treatmentToEdit.frequency;
	    $scope.inputUseExplanation =treatmentToEdit.useExplanation;
	    
	    $scope.inputExtraLink1 =treatmentToEdit.extraLink1;
	    $scope.inputExtraLink2 =treatmentToEdit.extraLink2;
	    $scope.inputExtraLink3 =treatmentToEdit.extraLink3;
	    
		$scope.idTargets = $rootScope.idTargetsTreatment;
		$scope.speciesSelected = $rootScope.processedTargets;
		$scope.speciesSelectedRaw = $rootScope.speciesTreatment;
		$scope.images= treatmentToEdit.images;
		$scope.id = treatmentToEdit.id;
		$scope.usingPreviousSpecies = true;
		$translate('TITLE_EDIT_TREATMENT').then(function (text) {
			$scope.title = text+ " . "+" "+treatmentToEdit.name;
	    });
		
	}else{
		$translate('TITLE_NEW_TREATMENT').then(function (text) {
			$scope.title = text ;
	    });
	}
	
	$scope.getSpeciesOk = function(response) {
		$scope.species = response;
		if($scope.editionMode()&& $scope.usingPreviousSpecies){
			var indexFor;
			for	(indexFor = 0; indexFor < $scope.speciesSelectedRaw.length; indexFor++) {
				removeFromArray($scope.speciesSelectedRaw[indexFor],$scope.species);
			}
			$scope.usingPreviousSpecies = false;
		}
	}
	
	function removeFromArray(specie,array){
		var indexFor;
		for	(indexFor = 0; indexFor < array.length; indexFor++) {
			if(array[indexFor].id == specie.id){
				array.splice(indexFor,1)
			}
		}
	}
	
	$scope.imageOk = function(message,response) {
		$translate(message).then(function (text) {
			$translate("TREATMENT_UPDATED").then(function (text2) {
				growl.success(text);
				growl.success(text2);
			});
		});
		$location.path('/treatments');
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
		if(Object.size($scope.images) > 1){
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
			growl.error("El tratamiento debe tener al menos una imagen");
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
				restServices.invokeSaveTreatmentImage($http, data, $scope.imageOk("IMAGE_REGISTERED"),
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
	
	$scope.selectSpecie = function(specie){
		var ids = "";//$scope.inputTargets;
		ids = $scope.idTargets;
		var newId = specie.id;
		if($scope.idTargets == null || $scope.idTargets == ""){
			$scope.idTargets = newId;
			$scope.speciesSelected = specie.name;
		}else{
			$scope.idTargets = $scope.idTargets+"-"+newId ;
			$scope.speciesSelected = $scope.speciesSelected + "-"+specie.name;
		}
		var index = $scope.species.indexOf(specie);
		 $scope.species.splice(index, 1);
		 console.log( "id of selectedone is " +specie.id +" -> id targets are " +$scope.idTargets);
	}
	
	
	$scope.checkAdmin = function(){
		if($scope.inputAdmin){
			return {'color':'blue' ,'font-style':'italic'};
		}else{
			return {'font-style':'italic'};
		}
	};
	
	$scope.resetSpecies = function(){
		$scope.idTargets = "";
		$scope.speciesSelected = "";
		restServices.invokeGetSpecies($http, {}, $scope.getSpeciesOk,
				restServices.defaultHandlerOnError);
	}

	$scope.editionMode = function(){
		return $rootScope.editingTreatment;
	};

	$scope.registerMode = function(){
		return !($rootScope.editingTreatment);
	};

	$scope.registerTreatmentOk = function(response) {
		$translate('TREATMENT_REGISTERED').then(function (text) {
			growl.info(text);
		    });
		$location.path('/treatments');
	};
	
	
	$scope.inicializarVista = function() {
		
		if($scope.registerMode()){
			$scope.idTargets ="";
			$scope.speciesSelected="";
			
		}
		restServices.invokeGetSpecies($http, {}, $scope.getSpeciesOk,
				restServices.defaultHandlerOnError);
		$scope.imageToLoad = "";
	}

	$scope.updateTreatmentOk = function(response) {
		$translate('TREATMENT_UPDATED').then(function (text) {
			growl.success(text);
		});
			$location.path('/treatments');
	}

	$scope.populateParams = function() {
		var data = {};
		if($scope.registerMode){
			data = {
					name : $scope.inputName,
					description: $scope.inputDescription,
					typeQuantity: $scope.inputTypeQuantity,
				    quantity:$scope.inputQuantity,
				    typeFrequency:$scope.inputTypeFrequency,
				    frequency:$scope.inputFrequency,
				    useExplanation:$scope.inputUseExplanation,
				    extraLink1:$scope.inputExtraLink1,
				    extraLink2:$scope.inputExtraLink2,
				    extraLink3:$scope.inputExtraLink3,
					idTargets: $scope.idTargets,
					hasPictures: false,
					picturesQuantity: 0
				};
			
			var imagesPossible = 1;
			var i =1;
			for ( i = 1; i <= imagesPossible; i++) { 
				// Accedemos de forma dinamica al scope de una variable
				var name = 'imageToLoad'+i;
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
					typeQuantity: $scope.inputTypeQuantity,
				    quantity:$scope.inputQuantity,
				    typeFrequency:$scope.inputTypeFrequency,
				    frequency:$scope.inputFrequency,
				    useExplanation:$scope.inputUseExplanation,
				    extraLink1:$scope.inputExtraLink1,
				    extraLink2:$scope.inputExtraLink2,
				    extraLink3:$scope.inputExtraLink3,
					description: $scope.inputDescription,
					idTargets: $scope.idTargets
				};
		}
		 
		return data;
	}
	

	$scope.registerTreatment = function() {
		if(validate()){
			var data = $scope.populateParams();
			restServices.invokeSaveTreatmentWithNImages($http, data, $scope.registerTreatmentOk,
					restServices.defaultHandlerOnError);
		}
	}
	
	function validate(){
		var validationArray;
			 validationArray = [
			                       [$scope.inputName,'FORM_ERROR_NAME_REQUIRED'],
			                       [$scope.inputDescription,'FORM_ERROR_DESCRIPTION_REQUIRED'],
			                       [$scope.idTargets,'FORM_ERROR_TARGET_REQUIRED']
			                       ];
			return Object.standardErrorMessages.apply(null,validationArray);
		
	}
	

	$scope.updateTreatment= function() {
		if(validate()){
			$scope.registerMode=false;
			var data = $scope.populateParams();
			data.id = $rootScope.treatmentToEdit.id;
			restServices.invokeUpdateTreatmentNoImages($http, data, $scope.updateTreatmentOk,
					restServices.defaultHandlerOnError);
		}
	}
		 
		 $scope.inicializarVista();

});

