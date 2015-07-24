define [ ] , () ->
	class Repartidores

		buscarFechaRepartidores: (success) ->
			$.ajax(
				url:"#{base_url}/index.php/services/repartidores/buscarFechaRepartidores"
				type:'GET'
				cache: true
				async : false
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(data) => success(data)
			)

		guardarRepartidorFecha : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/repartidores/guardarRepartidorFecha"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		obtenercantidadpedidos : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/repartidores/obtenercantidadpedidos"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)