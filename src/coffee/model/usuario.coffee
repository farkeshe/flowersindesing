define [ ] , () ->
	class Usuario
		# Busca en el servidor el usuario autentificado
		thisLogged : (success) =>
			# Traemos los datos del usuario autentificado
			$.ajax(
				type:'GET'
				url:"#{base_url}/index.php/services/login"
				statusCode:
					302: ->
						Singleton.get().reload()
				success : (data) => success(data)
			)