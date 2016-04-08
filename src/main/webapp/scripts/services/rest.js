(function() {
	'use strict';
	var app = angular.module('restServicesModule',
			[ 'LocalStorageModule' ,'angular-growl','ngRoute','pascalprecht.translate']);
	app.config(['$httpProvider', function($httpProvider) {
	    delete $httpProvider.defaults.headers.common["X-Requested-With"]
	}]);
	app.provider('restServices', function () {
		
		this.$get = [
		             '$rootScope',
		             '$filter',
		             '$routeParams',
		             '$location',
		             '$translate',
		             'growl',
		             'localStorageService',
		             function ($rootScope,$filter,$routeParams,$location,$translate,growl,localStorageService) {
		               
		         		function invokeRestService(httpService, header, data, modulo, servicio,
		        				handlerOnSuccess, handlerOnError) {
		        			var respuesta = [];
		        			
		        			//Para todo metodo post, se enviaran las credenciales
							data.nick=localStorageService.get('nick');
		                    data.token=localStorageService.get('token');
		        			httpService(
		        					{
		        						method : 'POST',
		        						url : 'http://' + restHost + '/' + restContext + '/rest/'
		        								+ modulo + '/' + servicio,
		        						data : data,
		        						headers: header,
		        						transformRequest : function(obj) {
		        							var str = [];
		        							for ( var p in obj)
		        								str.push(encodeURIComponent(p) + "="
		        										+ encodeURIComponent(obj[p]));
		        							return str.join("&");
		        						}
		        					}).success(function(response) {
		        				handlerOnSuccess(response);

		        			}).error(function(response,status) {
		        				handlerOnError(response,status);
		        			});
		        		}

		        		function invokeGetRestService(httpService, header, data, modulo, servicio,
		        				handlerOnSuccess, handlerOnError) {
		        			var respuesta = [];

		        			httpService(
		        					{
		        						method : 'GET',
		        						url : 'http://' + restHost + '/' + restContext + '/rest/'
		        								+ modulo + '/' + servicio,
		        						data : data,
		        						headers : header
		        						
		        					}).success(function(response) {
		        				handlerOnSuccess(response);

		        			}).error(function(response) {
		        				console.log(response)
		        				handlerOnError(response);
		        			});
		        		}

		        		function defaultHandlerOnError(response,status) {
		        			if(status == 403){
		        				growl.error(response.errorMessage)
		        				$location.path('/login');
		        			}
		        			
		        			console.log(response);
		        		}

		        		function defaultHeader() {
		        			return {
		        				'Content-Type' : 'application/x-www-form-urlencoded;'
		        			};
		        		}

		        		function jsonHeader() {
		        			return {
		        				'Content-Type' : 'application/json'
		        			};
		        		}
		        		function mergeJSONs(obj1,obj2){ // Our merge function
		        		    var result = {}; // return result
		        		    for(var i in obj1){      // for every property in obj1 
		        		        if((i in obj2) && (typeof obj1[i] === "object") && (i !== null)){
		        		            result[i] = merge(obj1[i],obj2[i]); // if it's an object, merge   
		        		        }else{
		        		           result[i] = obj1[i]; // add it to result
		        		        }
		        		    }
		        		    for(i in obj2){ // add the remaining properties from object 2
		        		        if(i in result){ //conflict
		        		            continue;
		        		        }
		        		        result[i] = obj2[i];
		        		    }
		        		    return result;
		        		}

		        		function autenticar(cnxHttp, data, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'seguridad', 'login',
		        					handlerOnSuccess, handlerOnError);

		        		}


		        		//==Rest Operations==\\


		        		function invokeRegisterOperation(cnxHttp, data, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'operation', 'new',
		        					handlerOnSuccess, handlerOnError);
		        		}



		        		//==Rest Concept==\\
		        		function invokeDeleteConcept(cnxHttp, data, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'concept', 'delete',
		        					handlerOnSuccess, handlerOnError);
		        		}




		        		// Usuarios
		        		function invokeRegisterUser(cnxHttp, data, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'user',
		        					'save', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeUpdateUser(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'user',
		        					'edit', handlerOnSuccess, handlerOnError);
		        		}

		        		function invokeBuscarUsuario(cnxHttp, data, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'user', 'searchAll',
		        					handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeAuthenticateAdmin(cnxHttp, data, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'user', 'authenticate',
		        					handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeValidateAdmin(cnxHttp, data, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'user', 'validateAdmin',
		        					handlerOnSuccess, handlerOnError);
		        		}

		        		

		        		// Buscar Usuarios
		        		function invokeBuscarUsuarios(cnxHttp, filtro, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, filtro, 'user',
		        					'searchAll', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeGetUsers(cnxHttp, filtro, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeGetRestService(cnxHttp, header, filtro, 'user',
		        					'all', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeFindUserById(cnxHttp, filtro, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, filtro, 'user',
		        					'findById', handlerOnSuccess, handlerOnError);
		        		}

		        		function invokeDeleteUser(cnxHttp, filtro, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, filtro, 'user',
		        					'delete', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		
		        		
		        		//== Rest muestras ==\\
		            	 
		        		function invokeFindUserSamples(cnxHttp, filtro, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, filtro, 'sample',
		        					'findSamples', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeFindUnresolvedSamples(cnxHttp, filtro, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, filtro, 'sample',
		        					'latestUnresolved', handlerOnSuccess, handlerOnError);
		        		}
		        		function invokeGetSampleImageById(cnxHttp, filtro,id, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			
		        			invokeGetRestService(cnxHttp, header, filtro, 'image',
		        					'getImage/'+id, handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		//== Rest treatments ==\\
		        		function invokeGetTreatments(cnxHttp, filtro, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeGetRestService(cnxHttp, header, filtro, 'treatment',
		        					'all', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeDeleteTreatment(cnxHttp, filtro, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, filtro, 'treatment',
		        					'delete', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeRegisterTreatmentNoImages(cnxHttp, data, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'treatment',
		        					'saveNoImages', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeRegisterTreatmentWith1Image(cnxHttp, data, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'treatment',
		        					'saveWith1Image', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeUpdateTreatmentNoImages(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'treatment',
		        					'editNoImages', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeSaveTreatmentWithNImages(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'treatment',
		        					'saveWithNImages', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeSaveTreatmentImage(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'treatment',
		        					'saveTreatmentImage', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeSaveTreatmentTarget(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'treatment',
		        					'addSpecieTarget', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeDeleteTreatmentTarget(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'treatment',
		        					'deleteSpecieTarget', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		//== Rest species ==\\
		        		
		        		function invokeGetSpecies(cnxHttp, filtro, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeGetRestService(cnxHttp, header, filtro, 'specie',
		        					'all', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeGetPlagues(cnxHttp, filtro, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeGetRestService(cnxHttp, header, filtro, 'specie',
		        					'plagues', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeGetCrops(cnxHttp, filtro, handlerOnSuccess, handlerOnError) {
		        			var header = defaultHeader();
		        			invokeGetRestService(cnxHttp, header, filtro, 'specie',
		        					'crops', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeSaveSpecieWith4Images(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'specie',
		        					'save4Images', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeSaveSpecieWithNImages(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'specie',
		        					'saveWithNImages', handlerOnSuccess, handlerOnError);
		        		}
		        		function invokeSaveSpecieImage(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'specie',
		        					'saveSpecieImage', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeUpdateSpecieNoImages(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'specie',
		        					'editNoImages', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeDeleteSpecie(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'specie',
		        					'delete', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeActivateSpecie(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'specie',
		        					'activateSpecie', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeDisableSpecie(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'specie',
		        					'disableSpecie', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		//== Rest images ==\\
		        		
		        		function invokeEditImage(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'image',
		        					'edit', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeDeleteImage(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'image',
		        					'delete', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		//=============== resolution ============\\
		        		
		        		function invokeResolveSample(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'sample',
		        					'resolve', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		function invokeDeleteSample(cnxHttp, data, handlerOnSuccess,
		        				handlerOnError) {
		        			var header = defaultHeader();
		        			invokeRestService(cnxHttp, header, data, 'sample',
		        					'delete', handlerOnSuccess, handlerOnError);
		        		}
		        		
		        		
		               return {
		                 defaultHandlerOnError: defaultHandlerOnError,
		                 invokeRestService: invokeRestService,
		                 invokeGetRestService: invokeGetRestService,
		                 defaultHeader: defaultHeader,
		                 jsonHeader: jsonHeader,
		                 mergeJSONs: mergeJSONs,
		                 autenticar: autenticar,
		                 invokeRegisterOperation: invokeRegisterOperation,
		                 invokeDeleteUser: invokeDeleteUser,
		                 invokeRegisterUser: invokeRegisterUser,
		                 invokeUpdateUser: invokeUpdateUser,
		                 invokeAuthenticateAdmin:invokeAuthenticateAdmin,
		                 invokeValidateAdmin:invokeValidateAdmin,
		                 invokeBuscarUsuarios: invokeBuscarUsuarios,
		                 invokeGetUsers: invokeGetUsers,
		                 invokeFindUserById: invokeFindUserById,
		                 invokeGetSampleImageById: invokeGetSampleImageById,
		                 invokeFindUserSamples: invokeFindUserSamples,
		                 invokeGetTreatments: invokeGetTreatments,
		                 invokeDeleteTreatment :invokeDeleteTreatment,
		                 invokeRegisterTreatmentNoImages:invokeRegisterTreatmentNoImages,
		                 invokeRegisterTreatmentWith1Image:invokeRegisterTreatmentWith1Image,
			        	 invokeUpdateTreatmentNoImages:invokeUpdateTreatmentNoImages,
			        	 invokeSaveTreatmentImage:invokeSaveTreatmentImage,
			        	 invokeSaveTreatmentWithNImages:invokeSaveTreatmentWithNImages,
			        	 invokeSaveTreatmentTarget:invokeSaveTreatmentTarget,
			        	 invokeDeleteTreatmentTarget:invokeDeleteTreatmentTarget,
			        	 invokeGetSpecies:invokeGetSpecies,
			        	 invokeEditImage:invokeEditImage,
			        	 invokeDeleteImage:invokeDeleteImage,
			        	 invokeGetPlagues:invokeGetPlagues,
			        	 invokeGetCrops:invokeGetCrops,
			        	 invokeSaveSpecieWith4Images:invokeSaveSpecieWith4Images,
			        	 invokeSaveSpecieWithNImages:invokeSaveSpecieWithNImages,
			        	 invokeSaveSpecieImage: invokeSaveSpecieImage,
			        	 invokeUpdateSpecieNoImages: invokeUpdateSpecieNoImages,
			        	 invokeDeleteSpecie:invokeDeleteSpecie,
		                 invokeResolveSample:invokeResolveSample,
		                 invokeActivateSpecie:invokeActivateSpecie,
		                 invokeDisableSpecie:invokeDisableSpecie,
		                 invokeDeleteSample:invokeDeleteSample,
		                 invokeFindUnresolvedSamples:invokeFindUnresolvedSamples
		               };
		             }
		           ];
	})
})();



