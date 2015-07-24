define [ ] , () ->
	class Lugar
		#Busca los sectores asociados a una comuna	
		buscarSectores  : (pro,success) ->
			# Traemos los datos de los sectores de una comuna
			$.ajax(
				url     : "#{base_url}/index.php/services/lugares/sectores/comuna/"+pro
				type    : 'GET'
				cache   : true
				async	: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		buscarTipos  : (success) ->
			# Traemos los datos de la regiones
			$.ajax(
				type    : 'GET'
				url     : "#{base_url}/index.php/services/lugares/tipos"				
				cache   : true
				async	: false
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		guardarLugar : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/lugares/guardarlugar"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		buscarLugarExistente    : (nombre,idtipo,idsector,success) ->
			# Traemos los datos de las comunas
			$.ajax(
				url     : "#{base_url}/index.php/services/lugares/obtenerlugar/nombre/"+nombre+"/idtipo/"+idtipo+"/idsector/"+idsector
				type    : 'GET'
				cache   : true
				async	: false
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		eliminarLugar : (datos,success) ->
			$.ajax(
				type:'GET'
				url:"#{base_url}/index.php/services/lugares/eliminar/id/"+datos
				cache: true
				async : false
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		buscarLugar : (id,success) ->
			$.ajax(
				type:'GET'
				url:"#{base_url}/index.php/services/lugares/buscar/id/"+id
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		#buscamos la region,provincia,comuna del sector
		buscarzona : (id,success) ->
			$.ajax(
				type:'GET'
				url:"#{base_url}/index.php/services/lugares/buscarzona/id/"+id
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		actualizarLugar : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/lugares/actualizar"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)