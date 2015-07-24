define [ ] , () ->
	class Destinatario


		# buscarVilla : (success) ->
		# 	$.ajax(
		# 		url:"#{base_url}/index.php/services/destinatarios/obtenervillas"
		# 		type:'GET'
		# 		cache: true
		# 		async : false
		# 		success:(data) => success(data)
		# 	)


		# buscarSector : (success) ->
		# 	$.ajax(
		# 		url:"#{base_url}/index.php/services/destinatarios/obtenersectores"
		# 		type:'GET'
		# 		cache: true
		# 		async : false
		# 		success:(data) => success(data)
		# 	)


		guardarDestinatario : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/destinatarios/guardardestinatario"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		buscarDestinatario : (id,success) ->
			# Traemos los datos del destinatario y su cliente asociado
			$.ajax(
				type:'GET'
				url:"#{base_url}/index.php/services/destinatarios/buscar/id/"+id
				cache: true
				async : true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)


		actualizarDestinatario : (datos, success)->
			$.ajax(
				type:'POST'
				url:"#{base_url}/index.php/services/destinatarios/actualizar"
				data: datos
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)

		eliminarDestinatario : (datos,success) ->
			$.ajax(
				type:'GET'
				url:"#{base_url}/index.php/services/destinatarios/eliminar/id/"+datos
				cache: true
				async : false
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)


