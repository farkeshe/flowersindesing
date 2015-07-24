define [
	'backbone'
	'text!tpl/mantenedorUsuarios/usuarios.html'
	'text!tpl/mantenedorUsuarios/nuevousuarios.html'
	'text!tpl/mantenedorUsuarios/editarusuarios.html'
	'text!tpl/mantenedorUsuarios/resultadousuarios.html'
	'text!tpl/mantenedorUsuarios/restricciones.html'
	'assets/js/view/paginador'
] , (Backbone,Tplusuarios,Tplnuevousuario,Tpleditarusuarios,Tplresultadosusuarios,Tplrestricciones,Paginador) ->  
	class entidades extends Backbone.View
		el:('body')		
	
		initialize : () =>
			@paginador = new Paginador()

			@objData=
			{
				sucursal: "vacio"
				perfil:  "vacio"
				start: '0'
				end: '14'
			}

			@init()

		init : () =>
			Singleton.get().showLoading()
			#si se loguea el usuario administrador
			if(Singleton.get().idPerfilUsuarioLogueado == '1' or Singleton.get().idPerfilUsuarioLogueado == '2')
				$.ajax
					url:"#{base_url}/index.php/services/usuarios/perfil"
					type:'GET'
					statusCode:
						302: ->
							Singleton.get().reload()
					success:(p) =>
						$.ajax
							url:"#{base_url}/index.php/services/usuarios/sucursal"
							type:'GET'
							statusCode:
								302: ->
									Singleton.get().reload()
							success:(s) =>
								$('#appView').html _.template(Tplusuarios)({perfiles: p,sucursal: s})
								@filtrar()
								Singleton.get().hideLoading()
								$('#accionesusuarios').change (e) =>
									@usuarios(e)

								$('#nuevousuario').click (e) =>
									@nueva(e)

								$('.scroll').css('height',window.innerHeight - 75)

								$('#filtrarUsuarios').click (e) =>
									@filtrar()

								#paginador next	
								$('#next').click (e) =>
									e.preventDefault()
									e.stopPropagation()
									Singleton.get().showLoading()
									$.ajax
										url:"#{base_url}/index.php/services/usuarios/contarRegistros"
										type:'POST'
										data: @objData
										statusCode:
											302: ->
												Singleton.get().reload()
										success: (result) =>
											@paginador.setTotal(result[0].Cantidad_Total)
											@paginador.next()
											$('#labelPaginador').html @paginador.label()
											$(this)[0].objData.end = @paginador.end
											$(this)[0].objData.start = @paginador.start
											@cargar()
											Singleton.get().hideLoading()
										error: (data) =>
											Singleton.get().hideLoading()
											Singleton.get().showError('No hay datos filtrados')

								#paginador previous		
								$('#previous').click (e) =>
									e.preventDefault()
									e.stopPropagation()
									Singleton.get().showLoading()
									$.ajax
										url:"#{base_url}/index.php/services/usuarios/contarRegistros"
										type:'POST'
										data: @objData
										statusCode:
											302: ->
												Singleton.get().reload()
										success: (result) =>
											@paginador.setTotal(result[0].Cantidad_Total)
											@paginador.previous()
											$('#labelPaginador').html @paginador.label()
											$(this)[0].objData.end = @paginador.end
											$(this)[0].objData.start = @paginador.start
											@cargar()
											Singleton.get().hideLoading()
										error: (data) =>
											Singleton.get().hideLoading()
											Singleton.get().showError('No hay datos filtrados')
			#si el usuario no es administrador								
			else
				@idusuario = Singleton.get().idUsuarioLogueado
				@editar()
		#controla los eventos del dropdown de acciones	
		usuarios : (e) =>
			e.preventDefault()
			e.stopPropagation()
			if ("nueva" == $('#accionesusuarios').find(':selected').val())
				@nueva(e)
			if ("editar" == $('#accionesusuarios').find(':selected').val())
				@editar()
			if ("eliminar" == $('#accionesusuarios').find(':selected').val())
				@eliminar(e)

		#Se crea un nuevo usuario		
		nueva : () =>
			Singleton.get().showLoading()
			$.ajax
				url:"#{base_url}/index.php/services/usuarios/sucursal"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(d) =>
					$.ajax
						url:"#{base_url}/index.php/services/usuarios/perfil"
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success:(p) =>
							$.ajax
								url:"#{base_url}/index.php/services/usuarios/supervisor"
								type:'GET'
								statusCode:
									302: ->
										Singleton.get().reload()
								success:(s) =>
									$('#appView').html _.template(Tplnuevousuario)({sucursales: d, perfiles: p, supervisor : s})
									$('#telefono').keydown (event) ->
										if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
											return
										else
											event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)
									
									$('#celular').keydown (event) ->
										if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
											return
										else
											event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)
									
									#validamos que el valor del flete sea numerico
									$(document).on "focusout", "#telefono", (e) =>
										e.preventDefault()
										e.stopPropagation()
										
										if $('#telefono').val() isnt '' 		
											if !$.isNumeric(Singleton.get().cleanValor($('#telefono').val()))
												Singleton.get().showError('El Valor Ingresado es Incorrecto')
												$('#telefono').val '0'
										false		
									
									$(document).on "focusout", "#celular", (e) =>
										e.preventDefault()
										e.stopPropagation()
										
										if $('#celular').val() isnt '' 		
											if !$.isNumeric(Singleton.get().cleanValor($('#celular').val()))
												Singleton.get().showError('El Valor Ingresado es Incorrecto')
												$('#celular').val '0'
										false

									$(document).on "focusout", "#perfil", (e) =>
										e.preventDefault()
										e.stopPropagation()
										option = ""
										if $('#perfil').val() is  '1' or $('#perfil').val() is  '2'		
											$('#responsable').html '<option value="">Seleccione...</option>'
										else
											for e in s
												option+= '<option value="' + e.Id_Usuario + '" selected="selected">' + e.Nombre + '</option>'
											$('#responsable').html option
										false

									Singleton.get().hideLoading()

									$('#cancelarestado').click (e) =>
										@initialize()
									$('#guardarestado').click (e) =>
										@guardarusuario()
		
		guardarusuario : () =>
			Singleton.get().showLoading()
			#guarda los datos y las restricciones
			perfil = $('#perfil').val()
			supervisor = $('#responsable').val()
			nombre = $('#nombre').val()
			pass = $('#passwd').val()
			repitpass = $('#repitpass').val()
			telefono = $('#telefono').val()  
			celular = $('#celular').val() 
			email = $('#email').val()
			user = $('#nuevoUsuario').val()
			consignatario = $('#consignatario').val()

			if(pass != repitpass)
				Singleton.get().showError('Contraseña inválida, verifique que sean iguales o no esten en blanco','Error')
			else
				if(perfil != "vacio" and supervisor != "vacio" and nombre != "" and pass != "" and consignatario != "vacio")
					datos=
					{
						perfil: perfil 
						supervisor: supervisor
						consignatario: consignatario
						nombre: nombre 
						pass: pass
						telefono: telefono 
						celular: celular 
						email: email 
						user: user

					}

					$.ajax
						url:"#{base_url}/index.php/services/usuarios/guardarusuario"
						type:'POST'
						data: datos
						statusCode:
							302: ->
								Singleton.get().reload()
						success:(g) =>
							@init()
						error:(g) =>
							Singleton.get().hideLoading()
							#Singleton.get().showError('No se pudo guardar el usuario')
				else
					Singleton.get().showError('Faltan datos')

		cargar : () =>
			$.ajax
				url:"#{base_url}/index.php/services/usuarios"
				type:'POST'
				data: @objData
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(s) =>
					$('#cargatabla').html _.template(Tplresultadosusuarios)({variable: s})
					$('#accionesLista').change (e) =>
						@usuarios(e)
					$('#tablaBody tr').click (e) =>
						@clickTr(e)
					$('#nuevalista').click (e) =>
						@nueva(e)
					Singleton.get().hideLoading()
				error: (s) =>
					Singleton.get().showInformacion('No existe información para los filtros seleccionados')
					$('#btnExito').click (e) =>
						@initialize()

		filtrar : () =>
			Singleton.get().showLoading()
			sucursalusuarios = "vacio"
			perfilusuarios = "vacio"

			if $('#sucursalusuarios').val() isnt ''
				sucursalusuarios = $('#sucursalusuarios').val()
			if $('#perfilusuarios').val() isnt ''
				perfilusuarios = $('#perfilusuarios').val()

			@objData=
			{
				sucursal: sucursalusuarios
				perfil:  perfilusuarios
				start: @paginador.start
				end : '14'
			}
		
			$.ajax
				url:"#{base_url}/index.php/services/usuarios/contarRegistros"
				type:'POST'
				data: @objData
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (result) =>
					@paginador.init(0, 14,result[0].Cantidad_Total)
					$('#labelPaginador').html @paginador.label()
					$(this)[0].objData.end = @paginador.end
					$(this)[0].objData.start = @paginador.start
					@cargar()
				error: (result) =>
					Singleton.get().hideLoading()	
					Singleton.get().showError('No existe el filtro')


		#editar usuario												
		editar :() =>
			Singleton.get().showLoading()
			$.ajax
				url:"#{base_url}/index.php/services/usuarios/sucursal"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(d) =>
					$.ajax
						url:"#{base_url}/index.php/services/usuarios/perfil"
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success:(p) =>
							$.ajax
								url:"#{base_url}/index.php/services/usuarios/supervisor"
								type:'GET'
								statusCode:
									302: ->
										Singleton.get().reload()
								success:(s) =>
									$('#appView').html _.template(Tpleditarusuarios)({sucursal: d, perfiles: p, supervisor : s})
									$('#telefono').keydown (event) ->
										if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
											return
										else
											event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)
									
									$('#celular').keydown (event) ->
										if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
											return
										else
											event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)
									
									#validamos que el valor del flete sea numerico
									$(document).on "focusout", "#telefono", (e) =>
										e.preventDefault()
										e.stopPropagation()
										
										if $('#telefono').val() isnt '' 		
											if !$.isNumeric(Singleton.get().cleanValor($('#telefono').val()))
												Singleton.get().showError('El Valor Ingresado es Incorrecto')
												$('#telefono').val '0'
										false		
									
									$(document).on "focusout", "#celular", (e) =>
										e.preventDefault()
										e.stopPropagation()
										
										if $('#celular').val() isnt '' 		
											if !$.isNumeric(Singleton.get().cleanValor($('#celular').val()))
												Singleton.get().showError('El Valor Ingresado es Incorrecto')
												$('#celular').val '0'
										false

									$.ajax
										url:"#{base_url}/index.php/services/usuarios/obtenerusuario/id/"+@idusuario
										type:'GET'
										statusCode:
											302: ->
												Singleton.get().reload()
										success:(u) =>
											$('#perfil').attr("value",u[0].Id_Perfil)
											$('#nombre').attr("value",u[0].Nombre)
											if u[0].Telefono isnt '0'
												$('#telefono').attr("value",u[0].Telefono)
											else
												$('#telefono').val ""
											if u[0].Celular isnt '0'
												$('#celular').attr("value",u[0].Celular)
											else
												$('#celular').val ""
											$('#email').attr("value",u[0].Email)
											$('#consignatario').attr("value",u[0].Id_Sucursal)
											$('#user').attr("value",u[0].User)
											$('#responsable').attr("value",u[0].Supervisor)
											Singleton.get().hideLoading()

									if window.innerWidth is 1280
										$('.scroll').css('width',window.innerWidth - 260)
									else
										$('.scroll').css('width',window.innerWidth - 251)
									$('.scroll').css('height',window.innerHeight - 75)

									if(Singleton.get().idPerfilUsuarioLogueado == '1' or Singleton.get().idPerfilUsuarioLogueado == '2')
										$('#cancelarestado').click (e) =>
											@initialize()
										$('#guardarestado').click (e) =>
											Validator = true
											#validamos la edicion del usuario===========================================================================================
											if $('#nombre').val() is ''
												Singleton.get().showInformacion('Debe ingresar su nombre')
												Validator= false

											if $('#user').val() is ''
												Singleton.get().showInformacion('Debe ingresar un nombre de usuario')
												Validator= false

											if $('#perfil').find(':selected').val() is ''
												Singleton.get().showInformacion('Debe asignar un perfil al usuario')
												Validator= false

											if $('#consignatario').find(':selected').val() is ''
												Singleton.get().showInformacion('Debe asignar una sucursal al usuario')
												Validator= false

											#===================================================================================================================================
											if Validator is true
												@guardarusuarioeditar()
									else
										$('#perfil').attr('disabled', 'disabled')
										$('#consignatario').attr('disabled', 'disabled')
										$('#responsable').attr('disabled', 'disabled')
										$('#user').attr('disabled', 'disabled')
										$('#nombre').attr('disabled', 'disabled')
										$('#telefono').attr('disabled', 'disabled')
										$('#celular').attr('disabled', 'disabled')
										$('#email').attr('disabled', 'disabled')
										$('#guardarestado').click (e) =>
											Validator = true
											#validamos la edicion del usuario===========================================================================================
											if $('#nombre').val() is ''
												Singleton.get().showInformacion('Debe ingresar su nombre')
												Validator= false

											if $('#user').val() is ''
												Singleton.get().showInformacion('Debe ingresar un nombre de usuario')
												Validator= false
											#===================================================================================================================================
											if Validator is true
												@guardarusuarioeditar()
											#Singleton.get().hideLoading()
										$('#cancelarestado').click (e) =>
											$('#barraizq').find('.active').removeClass('active')
											$('#appView').empty()

		guardarusuarioeditar : () =>
			Singleton.get().showLoading()
			#guarda los datos y las restricciones
			@perfil = $('#perfil').val()
			@supervisor = $('#responsable').val()
			@nombre = $('#nombre').val()
			#@subgerencia = $('#subgerencia').val()
			@pass = $('#passwde').val()
			@repitpass = $('#repitpass').val()
			@telefono = $('#telefono').val()  
			@celular = $('#celular').val() 
			@email = $('#email').val()
			@user = $('#editarusuario').val()
			@consignatario = $('#consignatario').val()

			if(@pass != "" and @pass != "") 
				if(@pass != @repitpass)
					Singleton.get().showError('Contraseña inválida, verifique que sean iguales','Error')
				else
					datos=
					{
						perfil: @perfil 
						supervisor: @supervisor
						consignatario: @consignatario
						nombre: @nombre 
						pass: @pass
						telefono: @telefono 
						celular: @celular 
						email: @email 
						user: @user
						antiguo: @userusuario
						id: @idusuario

					}
					$.ajax
						url:"#{base_url}/index.php/services/usuarios/updateusuario"
						type:'POST'
						data: datos
						statusCode:
							302: ->
								Singleton.get().reload()
						success:(g) =>
							if(Singleton.get().idPerfilUsuarioLogueado is '1'  or Singleton.get().idPerfilUsuarioLogueado is '2')
								@initialize()
							else
								Singleton.get().showExito('Usuario guardado correctamente','Exito')
								$('#btnExito').click (e) =>
									$('#barraizq').find('.active').removeClass('active')
									$('#appView').empty()
						error:(g) =>
							Singleton.get().showError('No se pudo guardar el usuario','Error')
			else
				datos=
				{
					perfil: @perfil 
					supervisor: @supervisor
					consignatario: @consignatario
					nombre: @nombre 
					pass: ""
					telefono: @telefono 
					celular: @celular 
					email: @email 
					user: @user
					antiguo: @userusuario
					id: @idusuario

				}
				$.ajax
					url:"#{base_url}/index.php/services/usuarios/updateusuario"
					type:'POST'
					data: datos
					statusCode:
						302: ->
							Singleton.get().reload()
					success:(g) =>
						if(Singleton.get().idPerfilUsuarioLogueado == '1')
							Singleton.get().showExito('Usuario guardado correctamente','Exito')
							$('#btnExito').click (e) =>
								@initialize()
						else
							Singleton.get().showExito('Usuario guardado correctamente','Exito')
							$('#btnExito').click (e) =>
								$('#barraizq').find('.active').removeClass('active')
								$('#appView').empty()
					error:(g) =>
						Singleton.get().showError('No se pudo guardar el usuario','Error')

		eliminar : () =>
			Singleton.get().showAdvertencia('¿Está seguro que desea desactivar el usuario?')
			$('#btnAceptarAdvertencia').click (e) =>
				$.ajax
					url:"#{base_url}/index.php/services/usuarios/eliminar/id/"+@idusuario
					type:'GET'
					statusCode:
						302: ->
							Singleton.get().reload()
					success: (data) =>
						Singleton.get().showExito('Usuario desactivado correctamente')
						$('.modal-backdrop').css('display','none')
						@filtrar()
					error: (data) =>
						#Singleton.get().hideLoading()
						Singleton.get().showError('No se puede desactivar el usuario')
	
		#agregar color rojo a los tr de las tablas cuando se selecciona 
		clickTr: (e) =>
			e.preventDefault()
			e.stopPropagation()
			@idusuario = e.currentTarget.attributes[0].value
			Singleton.get().restriccionusuario = @idusuario
			@nombreusuario =  e.currentTarget.cells[0].id
			@telefonousuario = e.currentTarget.cells[1].id
			@celularusuario = e.currentTarget.cells[2].id
			@emailusuario = e.currentTarget.cells[3].id
			@userusuario = e.currentTarget.cells[4].id
			@cuotamaximausuario = e.currentTarget.cells[5].id
			@tipousuario = e.currentTarget.cells[6].id
			@subgerenciausuario = e.currentTarget.cells[7].id
			#@supervisorusuario = e.currentTarget.cells[8].id

			html= html + """<option value="accionesusuarios">Acciones</option>""" + """<option value="editar">Editar</option>"""+"""<option value="eliminar">Desactivar</option>"""
			$('#accionesusuarios').html(html)
			$(e.currentTarget).addClass('active')
			$(e.currentTarget).siblings().removeClass('active')
