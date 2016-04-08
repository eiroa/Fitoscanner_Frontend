function codigoOk(response){
	var codigo = response['code'];
	return codigo==0;
}

function extractSelectedValues(combo) {
	var lista = [];
	if (combo != null && combo != undefined) {
		if (combo.length > 0) {
			lista = [];

			for (var n = 0; n < combo.length; n++) {
				lista.push(combo[n].value);
			}
		}
	}
	return lista;

}

function extractSelectedId(select) {
	if (select != null && select != undefined) {
		return select.value;
	} else {
		return null;
	}
}

function extractText(text) {
	return text;
}