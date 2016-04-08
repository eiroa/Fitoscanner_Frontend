function extractCombo(response) {
	var respuesta = [];
	var codigo = response['code'];
	var valores = response['valores'];

	if (valores != null && valores != undefined) {
		for (var n = 0; n < valores.length; n++) {
			var clave = valores[n].clave;
			var valor = valores[n].valor;

			var tupla = {
				description : valor,
				value : clave
			}
			respuesta.push(tupla);
		}
	}

	return respuesta;
}

function obtenerComboEmpresa(cnxHttp, handlerOnSuccess) {
	var data = {};
	procesarCombo(cnxHttp, data, 'comboEmpresa', handlerOnSuccess);
}

function obtenerComboEstadoTerminal(cnxHttp, handlerOnSuccess) {
	var data = {};
	procesarCombo(cnxHttp, data, 'comboEstadoTerminal', handlerOnSuccess);
}

function obtenerComboSectoresXSucursal(cnxHttp, idSucursal, handlerOnSuccess) {
	var data = {
		id : idSucursal
	}
	procesarCombo(cnxHttp, data, 'comboSectorXSucursal', handlerOnSuccess);
}

function obtenerComboSectores(cnxHttp, idEmpresa, handlerOnSuccess) {
	var data = {
		id : idEmpresa
	}
	procesarCombo(cnxHttp, data, 'comboSector', handlerOnSuccess);
}

function obtenerComboSectoresFaltantesASucursal(cnxHttp, idEmpresa, idSucursal, handlerOnSuccess) {
	var data = {
		id_empresa : idEmpresa,
		id_sucursal : idSucursal
	}
	procesarCombo(cnxHttp, data, 'comboSectoresFaltantesASucursal', handlerOnSuccess);
}

function obtenerComboSucursales(cnxHttp, idEmpresa, handlerOnSuccess) {
	var data = {
		id : idEmpresa
	}
	procesarCombo(cnxHttp, data, 'comboSucursal', handlerOnSuccess);
}

function obtenerComboSectoresSegunSucursales(cnxHttp, idEmpresa, ids, handlerOnSuccess) {
	var data = {
		id : idEmpresa,
		ids : ids
	}
	procesarCombo(cnxHttp, data, 'comboSectoresXSucursales', handlerOnSuccess);
}

function obtenerComboNivelesDePermiso(cnxHttp, handlerOnSuccess) {
	var data = {};
	procesarCombo(cnxHttp, data, 'comboNivelDePermiso', handlerOnSuccess);
}

function obtenerComboAccesoAModulo(cnxHttp, handlerOnSuccess) {
	var data = {};
	procesarCombo(cnxHttp, data, 'comboAccesoAModulo', handlerOnSuccess);
}


function obtenerComboAccionesFaltantesANivelDePermiso(cnxHttp, idNivelDePermiso, handlerOnSuccess) {
	var data = {
		id : idNivelDePermiso
	}
	procesarCombo(cnxHttp, data, 'obtenerComboAccionesFaltantesANivelDePermiso', handlerOnSuccess);
}

function procesarCombo(cnxHttp, data, servicio, handlerOnSuccess) {
	invokeRestService(cnxHttp, defaultHeader(), data, 'combos', servicio,
			handlerOnSuccess, defaultHandlerOnError);
}
		 

