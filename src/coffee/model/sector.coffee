define [ ] , () ->
	class Sector

		buscarRegiones  : (success) ->
			# Traemos los datos de la regiones
			$.ajax(
				type    : 'GET'
				url     : "#{base_url}/index.php/services/sectores/regiones"				
				cache   : true
				async	: false	
				datatype: "json"
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		#Busca las provincias relacionadas con la region	
		buscarProvincia : (reg, success) ->
			# Traemos los datos de las provincias
			$.ajax(
				url 	: "#{base_url}/index.php/services/sectores/provincia/region/"+reg
				type  	: 'GET'
				cache 	: true
				async	: false
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		#Busca las comunas relacionadas con la provincia	
		buscarComuna    : (pro,success) ->
			# Traemos los datos de las comunas
			$.ajax(
				url     : "#{base_url}/index.php/services/sectores/comuna/provincia/"+pro
				type    : 'GET'
				cache   : true
				async	: false
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		guardarSector : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/sectores/guardarsector"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		buscarSectorExistente    : (nombre,idcomuna,success) ->
			# Traemos los datos de las comunas
			$.ajax(
				url     : "#{base_url}/index.php/services/sectores/obtenersector/nombre/"+nombre+"/idcomuna/"+idcomuna
				type    : 'GET'
				cache   : true
				async	: false
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		eliminarSector : (datos,success) ->
			$.ajax(
				type:'GET'
				url:"#{base_url}/index.php/services/sectores/eliminar/id/"+datos
				cache: true
				async : false
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		buscarSector : (id,success) ->
			$.ajax(
				type:'GET'
				url:"#{base_url}/index.php/services/sectores/buscar/id/"+id
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		#buscamos la region y provincia de editar zona	
		buscarzona : (id,success) ->
			$.ajax(
				type:'GET'
				url:"#{base_url}/index.php/services/sectores/buscarzona/id/"+id
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		actualizarSector : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/sectores/actualizar"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)