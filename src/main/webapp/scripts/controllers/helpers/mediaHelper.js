function extend (target, source) {
  target = target || {};
  for (var prop in source) {
    if (typeof source[prop] === 'object') {
      target[prop] = extend(target[prop], source[prop]);
    } else {
      target[prop] = source[prop];
    }
  }
  return target;
}

function buscarContenidos(cnxHttp, handlerOnSuccess) {
	var data = {};
	invokeBuscarContenidos(cnxHttp, data, handlerOnSuccess, defaultHandlerOnError);
}
/*
 * Busca un contenido en la lista con el ID indicado Asume que siempre lo
 * encontrara
 */
function buscarContenido(id, lista) {
	for (var n = 0; n < lista.length; n++) {
		var contenido = lista[n];
		if (contenido.id == id) {
			return contenido;
		}
	}
}