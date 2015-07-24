define [
	'backbone'
	'assets/js/view/mainView'
	'text!tpl/login/login.html'
	'text!tpl/modal/error.html'
	'assets/js/model/usuario'
	'assets/js/view/listadoCotizaciones/viewList'
],(Backbone, MainView, TplLogin, TplError, usuarioModel, ViewList) ->
	root = exports ? this
	 # The publicly accessible Singleton fetcher
	class root.Singleton
		_instance = undefined # Must be declared here to force the closure on the class
		@get: () -> # Must be a static method
			_instance ?= new MainView 
	class Router extends Backbone.Router
		routes:
			'' : 'index'			
		
		initialize : =>
			Backbone.history.start()

		index : =>
			#instanciamos la clase usuario con su metodo thisLogged para obtener lo datos del usuario autentificado
			usuario = new usuarioModel()
			#llamamos a la funcion viewData para obtener el objeto
			usuario.thisLogged(@render)

			if @readCookie('session_out') is 'true'
				@createCookie("session_out","",-1)
				@session_out = true
				Singleton.get().showInformacion('Su tiempo de session ha expirado')
				$("#modal").on "hidden", ->
					$('#modal').removeAttr('style')

		render : (logged) =>
			if logged.logIn is 'True'
				@mainView = root.Singleton.get()
			else
				#limpiamos el div que contiene el menu de la aplicacion principal
				$('#appMain').empty()
				#escondemos el div del menu de la aplicacion
				$('#appMain').css('display','none')
				#activamos el div para cargar el login de la aplicacion 
				$('#appLogin').css('display','block')
				#cargamos el template de logueo en el div de login
				$('#appLogin').html _.template(TplLogin)

			$('#btnlogin').click (e) =>
				@log_in()
				false
			$('#pass').keypress (e) =>
				if event.keyCode is 13
					@log_in()

				

		log_in : () =>

			if $('#user').val() is ''
				@showError('El campo usuario es requerido','Error')
				$("#modal").on "hidden", ->
					$('#modal').removeAttr('style')
			else if $('#pass').val() is ''
				@showError('El campo contraseña es requerido','Error')
				$("#modal").on "hidden", ->
					$('#modal').removeAttr('style')
			else
				obj = 	{
						user : $('#user').val()
						pass : $('#pass').val()	
						}
				
				$.ajax
					url:"#{base_url}/index.php/services/login/logIn"
					type:'POST'
					data: obj
					success:(result) =>
						if result is 'True'
							if @session_out is true
								@mainView = root.Singleton.get()
								window.location.reload(false)
							else
								@mainView = root.Singleton.get()
						else
							@showError('Nombre de usuario o contraseña incorrecta','Error')
							$("#modal").on "hidden", ->
								$('#modal').removeAttr('style')
			false

		showError : (txt, titulo) =>			
			if txt?		
				if titulo?				
					$('#modal').html _.template(TplError)({ titulo : titulo, mensaje : txt })
				else		
					$('#modal').html _.template(TplError)({ titulo : 'Error', mensaje : txt })				
			else
				$('#modal').html _.template(TplError)({ titulo : 'Error', mensaje : 'La operaci&oacute;n a concluido con errores.' })		
			$('#image_error').attr("src","#{base_url}/assets/img/img_error.png")
			$('#modal').modal 'show'
			false

		# Despliega la ventana modal de Informacion
		showInformacion : (txt, titulo) =>			
			if txt?		
				if titulo?				
					$('#modal').html _.template(TplInformacion)({ titulo : titulo, mensaje : txt })
				else		
					$('#modal').html _.template(TplInformacion)({ titulo : 'Informaci&oacute;n', mensaje : txt })				
			else
				$('#modal').html _.template(TplInformacion)({ titulo : 'Informaci&oacute;n', mensaje : 'La operaci&oacute;n a concluido exitosamente.' })		
			$('#image_informacion').attr("src","#{base_url}/assets/img/img_info.png")
			$('#modal').css('width',450)	
			$('#modal').css('height',170)
			$('#modal').css('left','55.5%')	
			$('#modal').css('top' ,'50%')
			$('#modal').css('background-color', '#ffffff')
			$('#modal').modal ({
			'show' : true
			'backdrop' : 'static'
			'keyboard' : false
			})
			false

		readCookie:(name) =>
			nameEQ = name + "="
			ca = document.cookie.split(";")
			i = 0

			while i < ca.length
				c = ca[i]
				while c.charAt(0) is " "
					c = c.substring(1, c.length) 
					if c.indexOf(nameEQ) is 0
						return c.substring nameEQ.length, c.length
				i++
			return 'null'
			false

		createCookie:(name,value,days) =>
			if days
				date = new Date()
				date.setTime date.getTime() + (days * 24 * 60 * 60 * 1000)
				expires = "; expires=" + date.toGMTString()
			else
				expires = ""
			document.cookie = name + "=" + value + expires + "; path=/"
			false

				