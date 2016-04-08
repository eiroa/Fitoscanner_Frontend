/* Create an application module that holds all services */
var rootServices = angular.module('tip_eiroa_mauro_server_frontend.services', []);

/* Global service */
rootServices.service('globalService', function () {
    this.UserScope = {
        inMainMenu: 'false',
        inLogin: 'false'
    };
    this.getUserPosition= function () {
        return this.UserScope;
    };

    this.anulateAllExcept = function (val){
    	var values = this.UserScope;
     	angular.forEach(values, function(value, key) {
       		if(val == key ){
       			values[key] = "true";
       		}else{
       			values[key] = "false";
       		}
     });
    this.UserScope =  values; 
    };
    this.setInMainMenu = function () {
        this.anulateAllExcept('inMainMenu');
    };
    this.setInCargarDatos = function (){
    	this.anulateAllExcept('inCargarDatos');
    };
    
    this.setInNewOperation = function (){
    	this.anulateAllExcept('inNewOperation');
    };
    
    this.setInNewBill = function (){
    	this.anulateAllExcept('inNewBill');
    };
    this.setInBills = function (){
    	this.anulateAllExcept('inBills');
    };
    this.setInBillTypes = function (){
    	this.anulateAllExcept('inBillTypes');
    };
    this.setInLogin = function (){
    	this.anulateAllExcept('inLogin');
    };
    
});