define [ ] , () ->
	class Comentarios

		guardarcomentarioentrega : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/listadoCotizacion/guardarcomentarioentrega"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		guardarcomentarioanulacion : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/listadoCotizacion/guardarcomentarioanulacion"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)
