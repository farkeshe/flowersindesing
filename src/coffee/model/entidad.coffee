define [ ] , () ->
	class Entidad

		buscarCategorias : (success) ->
			$.ajax(
				url:"#{base_url}/index.php/services/entidades/clasificacionentidad"
				type:'GET'
				cache: true
				async : false
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(data) => success(data)
			)

		guardarEntidad : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/entidades/guardarentidad"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		buscarEntidad : (id,success) ->
			# Traemos los datos de la entidad
			$.ajax(
				type:'GET'
				url:"#{base_url}/index.php/services/entidades/buscar/id/"+id
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		actualizarEntidad : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/entidades/actualizar"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		eliminarEntidad : (datos,success) ->
			$.ajax(
				type:'GET'
				url:"#{base_url}/index.php/services/entidades/eliminar/rut/"+datos
				cache: true
				async : false
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)