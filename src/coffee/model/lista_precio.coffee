define [ ] , () ->
	class Lista_precio

		guardarlista : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/listaPrecios/guardarlista"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)
		#PROBANDO
		productolistainsert : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/listaPrecios/productolistainsert"
				data: JSON.stringify(datos)
				dataType: 'json'
				contentType: 'application/json; charset=utf-8'
				cache:false
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		productolistaeliminar : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/listaPrecios/productolistaeliminar"
				data: JSON.stringify(datos)
				dataType: 'json'
				contentType: 'application/json; charset=utf-8'
				cache:false
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		productolistaedit : (datos, success)->
			console.log "productolistaedit"
			console.log datos
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/listaPrecios/productolistaedit"
				data: JSON.stringify(datos)
				dataType: 'json'
				contentType: 'application/json; charset=utf-8'
				cache:false
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)
		#PROBANDO	

		actualizarLista : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/listaPrecios/actualizar"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)
		#a la Funcion Eliminar le pasa una Id que fue recivida por la llamada ajax el valor de esta es Datos
		eliminarLista : (datos,success) ->
			$.ajax(
				type:'GET'
				url:"#{base_url}/index.php/services/listaPrecios/eliminar/id/"+datos
				cache: true
				async : false
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)