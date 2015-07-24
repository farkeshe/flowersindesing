define [
	'backbone'
	'text!tpl/mantenedorConsignatarios/consignatarios.html'
	'text!tpl/mantenedorConsignatarios/resultadoconsignatario.html'
	'text!tpl/mantenedorConsignatarios/editarconsignatario.html'
	'text!tpl/mantenedorConsignatarios/nuevoconsignatario.html'
	'assets/js/view/paginador'
	'text!tpl/mantenedorEntidades/resultadoEntidad.html'


] , (Backbone,Tplconsignatarios,Tplresultadoconsignatario,Tpleditarconsignatario,Tplnuevoconsignatario,Paginador,Tplresultadosentidad) ->  
	class consignatarios extends Backbone.View
		el:('body')		

		initialize : () =>
			@paginador = new Paginador()

			@objData=
			{

				rut 		: "undefined"
				start		: '0'
				end 		: '14'
			}

			@init()
			#@initPaginador()


		#inicia la pantalla consignatario cargando todos los consignatarios en la tabla	
		init : () =>
			Singleton.get().showLoading()
			$('#appView').html _.template(Tplconsignatarios)({})
			$('#next').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})		
			$('#previous').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})	
			$('#nuevoconsignatario').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('.alertaverde').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			@destino()

			$('#filtrarDestino').change (e) =>
				Singleton.get().showLoading
				@destino(e)

			$('#regionesselect').change (e) =>
				@regiones(e)

			$('#provinciaselect').change (e) =>
				@provincia(e)

			$('#accionesconsignatarios').change (e) =>
				@consigna(e)

			$('#nuevoconsignatario').click (e) =>									
				@nuevo(e)

			$('#guardarconsignatario').click (e) =>									
				@guardarconsignatario(e)	

			$('#next').click (e) =>
					e.preventDefault()
					e.stopPropagation()
					#Singleton.get().showLoading()
					$.ajax
						url:"#{base_url}/index.php/services/destino/contarRegistros"
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

			$('#previous').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				#Singleton.get().showLoading()
				$.ajax
					url:"#{base_url}/index.php/services/destino/contarRegistros"
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


			$("#autoc1").autocomplete
				source: (request, response) ->
					$.ajax
						url:"#{base_url}/index.php/services/cotizacion"
						type:'POST'
						data: 
							palabra: request.term
						statusCode:
							302: ->
								Singleton.get().reload()
						success: (data) ->
							response $.map(data, (item) ->
								label: item.Nombre
								value: item.Nombre
								rut: item.Rut_Entidad
							)
						error: (data) ->
							$('#autoc1').removeClass("ui-autocomplete-loading")
							$('#autoc1').autocomplete( "close" );

				minLength: 1,

				select: (event, ui) ->
					if ui.item
						log(ui.item.rut)
				open: ->
					$('#autoc1').removeClass("ui-autocomplete-loading")
				close: ->
					$('#autoc1').removeClass("ui-autocomplete-loading")

			log = (rut) ->
				$('#rutcliente').val Singleton.get().formatearRut(rut)
			if window.innerWidth is 1280
				$('.scroll').css('width',window.innerWidth - 260)
				$('.alertaverde').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			else
				$('.scroll').css('width',window.innerWidth - 251)
				$('.alertaverde').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('.scroll').css('height',window.innerHeight - 75)
				

			$('#filtrarDestino').click (e) =>
				Singleton.get().showLoading
				@destino(e)	

			

		#maneja la seleccion de Acciones
		consigna : (e) =>
			e.preventDefault()
			e.stopPropagation()
			if ("nuevo" == $('#accionesconsignatarios').find(':selected').val())
				@nuevo(e)
			if ("editar" == $('#accionesconsignatarios').find(':selected').val())
				@editar(e)	
			if ("eliminar" == $('#accionesconsignatarios').find(':selected').val())
				@eliminar(e)

		#marca verde y guarda lo que seleccione el usuario en la tabla
		clickTr: (e) =>
			e.preventDefault()
			e.stopPropagation()
			@iddestino = e.currentTarget.attributes[0].value
			@main = e.currentTarget.cells[0].id
			@nombre =  e.currentTarget.cells[1].id
			@rutclientedestino = e.currentTarget.cells[2].id
			@region = e.currentTarget.cells[3].id
			@provinciaentidad = e.currentTarget.cells[4].id
			@comuna = e.currentTarget.cells[5].id
			@direccion = e.currentTarget.cells[6].id
			@telefono = e.currentTarget.cells[7].id
			@long = e.currentTarget.cells[8].id
			@lat = e.currentTarget.cells[9].id
			@ruta = e.currentTarget.cells[10].id
			html= html + """<option value="accionesconsignatarios">Acciones</option>""" + 
			"""<option value="editar">Editar</option>"""+"""<option value="eliminar">Eliminar</option>"""
			$('#accionesconsignatarios').html(html)
			$(e.currentTarget).addClass('active')
			$(e.currentTarget).siblings().removeClass('active')
			$('#nuevodestino').click (e) =>									
				@nuevo(e)	

		#crear nuevo consignatario
		nuevo : (e) =>
			Singleton.get().showLoading()
			$.ajax
				url:"#{base_url}/index.php/services/destino/regiones"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(s) =>
					$.ajax
						url:"#{base_url}/index.php/services/destino/rutas"
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success:(r) =>
							$('#appView').html _.template(Tplnuevoconsignatario)({regiones: s, ruta: r})
							Singleton.get().hideLoading()

							$('#telefono').keydown (event) ->
								if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
									return
								else
									event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)
											
							$('#rutaselect').attr('disabled', true)

							$('#guardarconsignatario').click (e) =>									
								@guardarconsignatario(e)
							
							$('#cancelarconsignatariou').click (e) =>									
								@initialize()

							$('#cancelarconsignatario').click (e) =>									
								@initialize()


							$('#regionesselect').change (e) =>
								@regiones(e)

							$('#provinciaselect').change (e) =>
								@provincia(e)

							$("#autoc1").autocomplete
								source: (request, response) ->
									$.ajax
										url:"#{base_url}/index.php/services/cotizacion"
										type:'POST'
										data: 
											palabra: request.term
										statusCode:
											302: ->
												Singleton.get().reload()
										success: (data) ->
											response $.map(data, (item) ->
												label: item.Nombre
												value: item.Nombre
												rut: item.Rut_Entidad
											)
										error: (data) ->
											$('#autoc1').removeClass("ui-autocomplete-loading")
											$('#autoc1').autocomplete( "close" );

								minLength: 1,

								select: (event, ui) ->
									if ui.item
										log(ui.item.rut)
								open: ->
									$('#autoc1').removeClass("ui-autocomplete-loading")
								close: ->
									$('#autoc1').removeClass("ui-autocomplete-loading")

							log = (rut) ->
								$('#rutcliente').val Singleton.get().formatearRut(rut)
	

		#Editar consignatario
		editar : (e) =>
			@auxprincipal = 0
			Singleton.get().showLoading()
			$.ajax
				url:"#{base_url}/index.php/services/destino/regiones"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(s) =>
					$.ajax
						url:"#{base_url}/index.php/services/destino/rutas"
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success:(r) =>
							$.ajax
								url:"#{base_url}/index.php/services/destino/obtener/id/"+@iddestino
								type:'GET'
								statusCode:
									302: ->
										Singleton.get().reload()
								success:(des) =>
									@rutclientedestino =  Singleton.get().formatearRut(@rutclientedestino)
									$('#appView').html _.template(Tpleditarconsignatario)({main: @main, ruta: r,nombre: @nombre, rut: @rutclientedestino,direccion: @direccion, telefono : @telefono, long: @long, lat:@lat,regiones: s})
									$('#regionesselect').attr("value",@region)
									$('#provinciaselect').attr("value",@provinciaentidad)
									$('#comunaselect').attr("value",@comuna)
									$('#rutaselect').attr("value",@ruta)

									$('#rutcliente').val Singleton.get().formatearRut(des[0].Rut_Entidad)
									$('#nombreconsignatario').attr("value",des[0].Nombre)
									$('#regionesselect').attr("value",des[0].REGION_ID)
									$('#provinciaselect').attr("value",des[0].PROVINCIA_ID)
									$('#comunaselect').attr("value",des[0].COMUNA_ID)
									$('#direccion').attr("value",des[0].Direccion)
									$('#telefono').attr("value",des[0].Telefono)	
									$('#lat').attr("value",des[0].Latitud)
									$('#long').attr("value",des[0].Longitud)
									if(des[0].principal == '1')
										$(".ck").attr("checked","checked")
										$('#rutaselect').attr('disabled', true)
										@auxprincipal = 1

									$('#telefono').keydown (event) ->
										if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
											return
										else
											event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)
												
									$('#guardarconsignatariou').click (e) =>									
										@guardarconsignatariou(e)

									$('#guardarconsignatario').click (e) =>									
										@guardarconsignatario(e)

									$('#cancelarconsignatariou').click (e) =>									
										@initialize()

									$('#cancelarconsignatario').click (e) =>									
										@initialize()

									$('#regionesselect').change (e) =>
										@regiones(e)

									$('#provinciaselect').change (e) =>
										@provincia(e)

									if(@main == "1")
										$(".ck").attr("checked","checked");
										$('.ck').attr('disabled', true)

									#autocompleta el buscador nombre

									#autocompleta el buscador nombre
									$("#autoc1").autocomplete
										source: (request, response) ->
											$.ajax
												url:"#{base_url}/index.php/services/entidades/mientidad"
												type:'POST'
												data: 
													palabra: request.term
												statusCode:
													302: ->
														Singleton.get().reload()
												success: (data) ->
													response $.map(data, (item) ->
														label: item.Nombre
														value: item.Nombre
														rut: item.Rut_Entidad
													)
												error: (data) ->
													$('#autoc1').removeClass("ui-autocomplete-loading")
													$('#autoc1').autocomplete( "close" );

										minLength: 1,

										select: (event, ui) ->
											if ui.item
												log(ui.item.rut)
										open: ->
											$('#autoc1').removeClass("ui-autocomplete-loading")
										close: ->
											$('#autoc1').removeClass("ui-autocomplete-loading")
									#Arregla el rut generado del autocompletar			
									log = (rut) ->
										$('#rutcliente').val Singleton.get().formatearRut(rut)
		

		#Eliminar nuevo consignatario	
		eliminar : () =>
			if(@main == '1')
				Singleton.get().showError('No se pueden eliminar Destinos Principales')
			else
				Singleton.get().showAdvertencia('¿Está seguro que desea eliminar la entidad?')
				$('#btnAceptarAdvertencia').click (e) =>
					$.ajax
						url:"#{base_url}/index.php/services/destino/eliminar/id/"+@iddestino
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success:(c) =>
							Singleton.get().showExito('Destino eliminado correrctamente')
							$('#btnExito').click (e) =>
								@initialize()
						error:(c)=>
							Singleton.get().showError('No se pudo eliminar el destino')
							$('#cancelarentidad').click (e) =>
								@initialize()


		#carga las regiones en el imput
		regiones : (e) =>
			option= '<option value="0" selected="selected">Seleccione...</option>'
			reg = $('#regionesselect').find(':selected').val()
			$.ajax
				url:"#{base_url}/index.php/services/destino/provincia/region/"+reg
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(p) =>
					for iterator in p
						option+= '<option value="' + iterator.PROVINCIA_ID + '" selected="selected">' + iterator.PROVINCIA_NOMBRE + '</option>'
						$('#provinciaselect').html option
						$('#provinciaselect option[value=0]').attr('selected',true)
						$('#comunaselect').html option
						$('#comunaselect option[value=0]').attr('selected',true)

		#carga la provincia segun la region seleccionada				
		provincia : (e) =>
			option= '<option value="0" selected="selected">Seleccione...</option>'
			pro = $('#provinciaselect').find(':selected').val()
			$.ajax
				url:"#{base_url}/index.php/services/destino/comuna/provincia/"+pro
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(p) =>
					for iterator in p
						option+= '<option value="' + iterator.COMUNA_ID+ '" selected="selected">' + iterator.COMUNA_NOMBRE + '</option>'
						$('#comunaselect').html option
						$('#comunaselect option[value=0]').attr('selected',true)
						$('#comunaselect').html option
						$('#comunaselect option[value=0]').attr('selected',true)
		
		#muestra los datos del mantenedor en la tabla
		destino : (e) =>
			rutentidad = "undefined"
			if($('#rutcliente').val() != "")
				rutentidad = Singleton.get().cleanRut($('#rutcliente').val())
			@objData=
			{
		
				rut 		: rutentidad
				start		: @paginador.start
				end 		: '14'
			}
			$.ajax
				url:"#{base_url}/index.php/services/destino/contarRegistros"
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
					Singleton.get().showError('No existe el filtro')
					$('#btnError').click (e) =>
						@initialize()

		cargar : () =>
			$.ajax
				url:"#{base_url}/index.php/services/destino"
				type:'POST'
				data: @objData
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(m) =>
					$('#cargatabla').html _.template(Tplresultadoconsignatario)({variable: m})
					$('.1').addClass('alertaverde')
					$('.alertaverde').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
					Singleton.get().hideLoading()
					$('#tablaBody tr').click (e) =>
						@clickTr(e)
					$('#nuevoconsignatario').click (e) =>
						@nuevo(e)
					$('#accionesconsignatarios').change (e) =>
						@destino()
					Singleton.get().hideLoading()		
				error: (m) =>	
					Singleton.get().showError('No existe el filtro')
					$('#btnError').click (e) =>
						@initialize()



		#guarda el consignatario editado
		guardarconsignatariou : (e) =>
			if($(".ck").is(':checked'))
				principal = 1;
			else
				principal = 0;
			
			if($('#nombreconsignatario').val() == "" or $('#rutcliente').val() == "")
				Singleton.get().showError('Ingrese Nombre y Rut del Consignatario ')
			else
				obj = {
					id: @iddestino
					rut : Singleton.get().cleanRut($('#rutcliente').val())
					nombre : $('#nombreconsignatario').val()
					region : $('#regionesselect').val()
					provincia : $('#provinciaselect').val()
					comuna : $('#comunaselect').val()
					rutas : $('#rutaselect').val()
					dir : $('#direccion').val()
					telefono : $('#telefono').val()
					long : $('#long').val()
					lat : $('#lat').val()
					principal : principal
				}
				$.ajax
					url:"#{base_url}/index.php/services/destino/guardardestinoprincipal"
					type:'POST'
					data: obj
					statusCode:
						302: ->
							Singleton.get().reload()
					success:(m) =>
						if m == 'false'
							if(@auxprincipal == 0)
								Singleton.get().showAdvertencia('El cliente ya tiene una ruta principal, Realmente desea cambiarla')
							$('#btnAceptarAdvertencia').click (e) =>
								$.ajax
									url:"#{base_url}/index.php/services/destino/guardardestinocambiou"
									type:'POST'
									data: obj
									statusCode:
										302: ->
											Singleton.get().reload()
									success:(g) =>
										Singleton.get().showExito('Destino actualizado correctamente','Exito')
										$('#btnExito').click (e) =>
											@initialize()
										$('#cancelarconsignatario').click (e) =>
											@initialize()
									error:(g) =>
										Singleton.get().showError('No se pudo actualizar el Destino, verifique que sea principal','Error')
										$('#cancelarentidad').click (e) =>
											@initialize()
						if m == 'true'
							$.ajax
								url:"#{base_url}/index.php/services/destino/guardardestinou"
								type:'POST'
								data: obj
								statusCode:
									302: ->
										Singleton.get().reload()
								success:(g) =>
									Singleton.get().showExito('Destino actualizado correctamente','Exito')
									$('#btnExito').click (e) =>
										@initialize()
									$('#cancelarconsignatario').click (e) =>
										@initialize()
								error:(g) =>
									Singleton.get().showError('No se pudo actualizar el Destino, verifique que sea principal','Error')
									$('#cancelarentidad').click (e) =>
										@initialize()
					error:(m) =>
						Singleton.get().showError('No se pudo actualizar el Destino','Error')
						$('#cancelarentidad').click (e) =>
							@initialize()


		#guarda el consignatario nuevo	
		guardarconsignatario : (e) =>
			if($(".ck").is(':checked'))
				principal = 1;
			else
				principal = 0;
			


			if($('#nombreconsignatario').val() == "" or $('#rutcliente').val() == "")
				Singleton.get().showError('Ingrese Nombre y Rut del Consignatario ')
			else
		
				obj = {
					rut : Singleton.get().cleanRut($('#rutcliente').val())
					nombre : $('#nombreconsignatario').val()
					region : $('#regionesselect').val()
					provincia : $('#provinciaselect').val()
					comuna : $('#comunaselect').val()
					rutas : $('#rutaselect').val()
					dir : $('#direccion').val()
					telefono : $('#telefono').val()
					long : $('#long').val()
					lat : $('#lat').val()
					principal : principal
				}
				$.ajax
					url:"#{base_url}/index.php/services/destino/guardardestinoprincipal"
					type:'POST'
					data: obj
					statusCode:
						302: ->
							Singleton.get().reload()
					success:(m) =>
						if m == 'false'
							Singleton.get().showAdvertencia('El cliente ya tiene una ruta principal, Realmente desea cambiarla',)
							$('#btnAceptarAdvertencia').click (e) =>
								$.ajax
									url:"#{base_url}/index.php/services/destino/guardardestinocambio"
									type:'POST'
									data: obj
									statusCode:
										302: ->
											Singleton.get().reload()
									success:(g) =>
										Singleton.get().showExito('Destino creado correctamente','Exito')
										$('#btnExito').click (e) =>
											@initialize()
										$('#cancelarconsignatario').click (e) =>
											@initialize()
									error:(g) =>
										Singleton.get().showError('No se pudo crear el Destino','Error')
										$('#cancelarentidad').click (e) =>
											@initialize()
						if m == 'true'
							$.ajax
								url:"#{base_url}/index.php/services/destino/guardardestino"
								type:'POST'
								data: obj					
								statusCode:
									302: ->
										Singleton.get().reload()
								success:(g) =>
									Singleton.get().showExito('Destino creado correctamente','Exito')
									$('#btnExito').click (e) =>
										@initialize()
									$('#cancelarconsignatario').click (e) =>
										@initialize()
								error:(g) =>
									Singleton.get().showError('No se pudo crear el Destino','Error')
									$('#cancelarentidad').click (e) =>
										@initialize()
					error:(m) =>
						Singleton.get().showError('No se pudo crear el Destino','Error')
						$('#cancelarentidad').click (e) =>
							@initialize()