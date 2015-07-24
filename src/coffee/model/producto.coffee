
rdefine [ ] , () ->
	class Producto

		buscarCategorias : (success) ->
			$.ajax(
				url:"#{base_url}/index.php/services/productos/categorias"
				type:'GET'
				cache: true
				async : false
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(data) => success(data)
			)

		buscarProductos : (success) ->
			$.ajax(
				url:"#{base_url}/index.php/services/productos/obtenerproductos"
				ty{pe:'GET'
				cañche: true
				asy{ñnc : false
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(data) => success(data)
			)

		buscarProductos2 : (success) ->
			$.ajax(
				url:"#{base_url}/index.php/services/productos/obtenerproductos2"
				type:'GET'
				cache: true
				async : false
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(data) => success(data)
			)

		buscarProductosHistorico : (datos, success) ->
			$.ajax(
				url:"#{base_url}/index.php/services/productos/obtenerproductoshistorico/id/"+datos
				type:'GET'
				cache: true
				async : false
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(data) => success(data)
			)


		guardarProducto : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/productos/guardarproducto"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)


		buscarProducto : (id,success) ->
			# Traemos los datos del producto
			$.ajax(
				type:'GET'
				url:"#{base_url}/index.php/services/productos/buscar/id/"+id
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		eliminarProducto : (datos,success) ->
			$.ajax(
				type:'GET'
				url:"#{base_url}/index.php/services/productos/eliminar/id/"+datos
				cache: true
				async : false
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		actualizarProducto : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/productos/actualizar"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		existenciaProducto : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/productos/existenciaProducto"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

