'use strict';

/**
 * @ngdoc function
 * @name tip_eiroa_mauro_server_frontend.controller:MainCtrl
 * @description # MainCtrl Controller of the tip_eiroa_mauro_server_frontend
 */
var app = angular.module('tip_eiroa_mauro_server_frontend');
app.controller('CrudUserCtrl', function($scope, $log, $location, $http,
		$rootScope, growl,globalService,dialogs,$translate,restServices) {

	if ($rootScope.editingUser) {
		$scope.editingUser = $rootScope.editingUser;
		var userToEdit = $rootScope.userToEdit;
		$scope.inputCode = userToEdit.code;
		$scope.inputNick = userToEdit.nick;
		$scope.inputName = userToEdit.name;
		$scope.inputSurname = userToEdit.surname;
		$scope.inputImei= userToEdit.imei;
		$scope.inputAdmin = userToEdit.admin;
		$scope.anon = userToEdit.anonymous;
		$scope.id = userToEdit.id;
		var nick = userToEdit.nick;
		if(userToEdit.nick == null){
			nick = " ??? ";
		}
		var imei = userToEdit.imei;
		if(userToEdit.imei == null){
			imei = " ??? ";
		}
		$translate('TITLE_EDIT_USER').then(function (text) {
			$scope.title = text+ " . "+"    Nick: "+nick+ " Imei: "+imei;
	    });
	}else{
		$translate('TITLE_NEW_USER').then(function (text) {
			$scope.title = text ;
	    });
	}
	
	$scope.checkAdmin = function(){
		if($scope.inputAdmin){
			return {'color':'blue' ,'font-style':'italic'};
		}else{
			return {'font-style':'italic'};
		}
	};

	$scope.modoEdicion = function(){
		return $rootScope.editingUser;
	};

	$scope.modoRegistro = function(){
		return $rootScope.registeringUser;
	};

	$scope.registerUserOk = function(response) {
		$translate('USER_REGISTERED').then(function (text) {
			growl.info(text);
		    });
		$location.path('/users');
	};
	
	
	$scope.inicializarVista = function() {
		
	}

	$scope.updateUserOk = function(response) {
		$translate('USER_UPDATED').then(function (text) {
			growl.success(text);
		});
			$location.path('/users');
	}

	$scope.populateParams = function() {
		var isAdmin; 
		if($scope.inputAdmin == null){
			isAdmin = false;
		}else{
			isAdmin = $scope.inputAdmin;
		}
		var data = {
			code : $scope.inputCode,
			nick: $scope.inputNick,
			ps : $scope.inputPass,
			imei: $scope.inputImei,
			name : $scope.inputName,
			surname: $scope.inputSurname,
			admin : isAdmin,
			anon: false,
		};
		return data;
	}

	$scope.registerUser = function() {
		
		if(validate()){
			var data = $scope.populateParams();
			restServices.invokeRegisterUser($http, data, $scope.registerUserOk,
					restServices.defaultHandlerOnError);
		}else{
			getErrorMessage();
		}
		
	}
    

	
	function validate(){
		if ($scope.inputNick == null || $scope.inputNick == ""){
			return false;
		}
		return true;
	}
	
	function getErrorMessage(){
		if ($scope.inputNick == null || $scope.inputNick== ""){
			$translate('FORM_ERROR_NICK_REQUIRED').then(function (text) {
				growl.error(text);
			});
		}
	}

	$scope.updateUser= function() {
		if(validate()){
			var data = $scope.populateParams();
			data.id = $rootScope.userToEdit.id;
			restServices.invokeUpdateUser($http, data, $scope.updateUserOk,
					restServices.defaultHandlerOnError);
		}else{
			getErrorMessage();
		
		}
	}
	 


		 
		 $scope.inicializarVista();

});

