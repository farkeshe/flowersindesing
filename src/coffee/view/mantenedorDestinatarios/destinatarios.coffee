define [
	'backbone'
	'text!tpl/mantenedorDestinatarios/destinatarios.html'
	'text!tpl/mantenedorDestinatarios/nuevo.html'
	'text!tpl/mantenedorDestinatarios/resultados.html'
	'text!tpl/mantenedorDestinatarios/editar.html'
	'text!tpl/gestorCotizaciones/modalCliente.html'
	'assets/js/view/paginador'
	'assets/js/model/destinatario'
	'assets/js/model/sector'
] , (Backbone,Tpldestinatarios,Tplnuevo,Tplresultados,Tpleditar,TplmodalCliente,Paginador,DestinatarioModel,Sector) -> 
	class Destinatarios extends Backbone.View
		el:('body')		

		initialize : () =>
			@paginador = new Paginador()
			@destinatarioModel = new DestinatarioModel()
			@sector = new Sector()
			# @destinatarioModel.buscarSector (@cargarSectorEnMemoria)
			# @destinatarioModel.buscarVilla (@cargarVillaEnMemoria)

			@objData=
			{
				nombrecliente	: ""
				rutcliente		: ""
				start		    : @paginador.start
				end 		    : '14'
			}

			@init()

		init : () =>
			Singleton.get().showLoading()
			$('#appView').html _.template(Tpldestinatarios)
			@filtrar()
			Singleton.get().hideLoading()
			# if window.innerWidth is 1280
			# 		$('.scroll').css('width',window.innerWidth - 260)
			# 		Singleton.get().hideLoading()
			# else
			# 	$('.scroll').css('width',window.innerWidth - 251)
			$('.scroll').css('height',window.innerHeight - 75)

			#setiamos los tooltips
			$('#next').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})		
			$('#previous').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			#setiamos los tooltips agregar destinatario
			$('#nuevodestinatario').tooltip({'trigger':'hover','delay':{'show':100,'hide':100},'placement':'top'})

			$('#nuevodestinatario').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				@nuevo(e)

			$(document).on "focusout", "#rut", (e) =>
				e.preventDefault()
				e.stopPropagation()
				if $('#rut').val() isnt ""
					if(!Singleton.get().ValidarRut($('#rut').val()))
						Singleton.get().showError('El Valor Ingresado es Incorrecto')
						$('#rut').val ""
					else
						rut = $('#rut').val()
						rut = Singleton.get().cleanRut(rut)
						rut = Singleton.get().formatearRut(rut)
						$('#rut').val rut

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
								#Rut: $('#DV').attr("value","")
								Rut: item.Rut_Entidad
							)
						error: (data) ->
							$('#autoc1').removeClass("ui-autocomplete-loading")
							$('#autoc1').autocomplete( "close" );

				minLength: 1,
				#
				select: (event, ui) ->
					if ui.item
						$('#rut').val(Singleton.get().formatearRut(ui.item.Rut))
				#
				open: ->
					$('#autoc1').removeClass("ui-autocomplete-loading")
				close: ->
					$('#autoc1').removeClass("ui-autocomplete-loading")


			$('#filtrarDestinatarios').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				@filtrar()



			#paginador next
			$('#next').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showLoading()
				$.ajax
					url:"#{base_url}/index.php/services/destinatarios/contarRegistros"
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


			#paginador previo
			$('#previous').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showLoading()
				$.ajax
					url:"#{base_url}/index.php/services/destinatarios/contarRegistros"
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


		nuevo : (e) =>
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appView').css('display','none')
			if _.isEmpty(@regiones)
				@sector.buscarRegiones(@cargarRegionesEnMemoria)
			$('#appViewNext').html _.template(Tplnuevo)(regiones: @regiones)
			
			#cargamos los tooltip
			$('#buscarcliente').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})

			$('#regionselect').attr("value",7)
			@sector.buscarProvincia(7,@cargaProvinciaTalca)
			$('#provinciaselect').attr("value",71)
			@sector.buscarComuna(71,@cargaComunaTalca)
			$('#comunaselect').attr("value",7101)
			Singleton.get().hideLoading()


			$('#regionselect').change (e) =>
				e.preventDefault()
				e.stopPropagation()
				option= '<option value="0" selected="selected">Seleccione...</option>'
				$('#sectorselect').html option
				$('#comunaselect').html option
				$('#comunaselect option[value=0]').attr('selected',true)
				$('#sector').val ""
				$('#idlugar').val ""
				$('#lugar').val ""
				reg = $('#regionselect').find(':selected').val()
				@sector.buscarProvincia(reg,@cargaProvincias)

			$('#provinciaselect').change (e) =>
				e.preventDefault()
				e.stopPropagation()
				pro = $('#provinciaselect').find(':selected').val()
				$('#sector').val ""
				$('#idlugar').val ""
				$('#lugar').val ""
				@sector.buscarComuna(pro,@cargaComuna)

			$('#comunaselect').change (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#sector').val ""
				$('#idlugar').val ""
				$('#lugar').val ""


			$(document).on "focusout", "#autoc2", (e) =>
				e.preventDefault()
				e.stopPropagation()
				if $('#autoc2').val() is ""
					$('#autoc3').val ""

			$(document).on "keyup", "#lugar", (e) =>
				if event.keyCode isnt 13
					e.preventDefault()
					e.stopPropagation()
					$('#sector').val ""
					$('#idlugar').val ""
				false

			$(document).on "focusout", "#lugar", (e) =>
				e.preventDefault()
				e.stopPropagation()
				if $('#idlugar').val() is "" and $('#lugar').val() isnt ""
					Singleton.get().showInformacion('El lugar ingresado no es válido')
					$('#sector').val ""
					$('#lugar').val ""



			$('.newTitulo').click (e) =>
				@volveriteminicial(e)


			#validamos que solo ingresen numeros en el telefono
			$('#telefono').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

			$('#buscarcliente').click (e) =>
				 @showModalCliente(e)

			#autocomplete para el cliente
			$("#autoc2").autocomplete
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
								rut: $('#autoc3').attr("value",Singleton.get().formatearRut(data[0].Rut_Entidad))
							)
						error: (data) ->
							$('#autoc2').removeClass("ui-autocomplete-loading")
							$('#autoc2').autocomplete( "close" );

				minLength: 1,
				open: ->
					$('#autoc2').removeClass("ui-autocomplete-loading")
				close: ->
					$('#autoc2').removeClass("ui-autocomplete-loading")

			#funcion del autocompletq eu setea el sector cuando elige una villa
			log = (idlugar,nombresector) =>
				$('#sector').val nombresector
				$('#idlugar').val idlugar

			#autocomplete para el lugar	
			$("#lugar").autocomplete
				source: (request, response) ->
					$.ajax
						url:"#{base_url}/index.php/services/destinatarios/milugar"
						type:'POST'
						data: 
							palabra: request.term
							idcomuna: $('#comunaselect').val()
						statusCode:
							302: ->
								Singleton.get().reload()
						success: (data) ->
							response $.map(data, (item) ->
								label: item.nombretipo + " - "  + item.nombrelugar + " - Sector " + item.nombresector
								value: item.nombrelugar
								idlugar: item.idlugar
								nombresector: item.nombresector
							)
						error: (data) ->
							$('#lugar').removeClass("ui-autocomplete-loading")
							$('#lugar').autocomplete( "close" );

				minLength: 1,
				select: (event, ui) ->
					if ui.item
						log(ui.item.idlugar,ui.item.nombresector)
				open: ->
					$('#lugar').removeClass("ui-autocomplete-loading")
				close: ->
					$('#lugar').removeClass("ui-autocomplete-loading")


			$('#cancelardestinatario').click (e) =>
				@cancelar(e)

			$('#guardardestinatario').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Validator = true
				#validamos los datos del destino===========================================================================================
				if $('#lugar').val() is '' or $('#idlugar').val() is '' or $('#sector').val() is ''
					Singleton.get().showInformacion('Debe Buscar el lugar del destinatario')
					Validator= false

				if $('#comunaselect').find(':selected').val() is '' or  $('#comunaselect').find(':selected').val() is '0'
					Singleton.get().showInformacion('Debe seleccionar la Comuna del destinatario')
					Validator= false

				if $('#provinciaselect').find(':selected').val() is '' or $('#provinciaselect').find(':selected').val() is '0'
					Singleton.get().showInformacion('Debe seleccionar la Provincia del destinatario')
					Validator= false

				if $('#regionselect').find(':selected').val() is ''
					Singleton.get().showInformacion('Debe seleccionar la Región del destinatario')
					Validator= false

				if $('#direccion').val() is ''
					Singleton.get().showInformacion('Debe ingresar la dirección del destinatario')
					Validator= false

				if $('#nombre').val() is ''
					Singleton.get().showInformacion('Debe ingresar el nombre del destinatario')
					Validator= false

				if $('#autoc3').val() is ''
					Singleton.get().showInformacion('No se ha cargado el Rut del Cliente')
					Validator= false

				if $('#autoc2').val() is ''
					Singleton.get().showInformacion('Debe Seleccionar un Cliente')
					Validator= false


				#ingresamos los datos si se han validado correctamente
				if Validator is true 
					datos = {
						nombrecliente: $('#autoc2').val()
						rut:Singleton.get().cleanRut($('#autoc3').val()) 
						nombredestinatario : $('#nombre').val()
						direccion: $('#direccion').val()
						telefono : $('#telefono').val()
						idlugar: $('#idlugar').val()
					}
					new DestinatarioModel().guardarDestinatario datos, (data) =>
						if _.isUndefined(data.error)
							Singleton.get().showExito('El destinatario ha sido guardado exitosamente.')
							$('#appView').css('display','block')
							$('#appViewNext').empty()
							@filtrar()
						else
							Singleton.get().showError('El destinatario no ha podido ser guardado.')

		#-------------------------------------------------------------------------------------------------------------------------------------------------------
		#carga las regiones en el imput
		cargaProvinciaTalca : (p) =>
			option= '<option value="0" selected="selected">Seleccione...</option>'
			for iterator in p
				option+= '<option value="' + iterator.PROVINCIA_ID + '" selected="selected">' + iterator.PROVINCIA_NOMBRE + '</option>'
				$('#provinciaselect').html option
				$('#provinciaselect option[value=0]').attr('selected',true)

		#carga las comunas segun la region seleccionada				
		cargaComunaTalca : (p) =>
			option= '<option value="0" selected="selected">Seleccione...</option>'
			for iterator in p
				option+= '<option value="' + iterator.COMUNA_ID+ '" selected="selected">' + iterator.COMUNA_NOMBRE + '</option>'
				$('#comunaselect').html option
				$('#comunaselect option[value=0]').attr('selected',true)

		#carga las regiones en el imput
		cargaProvincias : (p) =>
			Singleton.get().showLoading()
			option= '<option value="0" selected="selected">Seleccione...</option>'
			for iterator in p
				option+= '<option value="' + iterator.PROVINCIA_ID + '" selected="selected">' + iterator.PROVINCIA_NOMBRE + '</option>'
				$('#provinciaselect').html option
				$('#provinciaselect option[value=0]').attr('selected',true)
				$('#comunaselect option[value=0]').attr('selected',true)
			Singleton.get().hideLoading()

		#carga las comunas segun la provincia seleccionada		
		cargaComuna : (p) =>
			Singleton.get().showLoading()
			option= '<option value="0" selected="selected">Seleccione...</option>'
			for iterator in p
				option+= '<option value="' + iterator.COMUNA_ID+ '" selected="selected">' + iterator.COMUNA_NOMBRE + '</option>'
				$('#comunaselect').html option
				$('#comunaselect option[value=0]').attr('selected',true)
			Singleton.get().hideLoading()

		#---------------------------------------------------------------------------------------------------------------------------------------------------------------

		# Busca las regiones y las mantiene en memoria
		cargarRegionesEnMemoria : (regiones) => 
			@regiones = regiones

		cancelar: (e) =>					
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appViewNext').html("")
			$('#appView').css('display','inline')
			Singleton.get().hideLoading()

		#metodo que carga los sectores de talca en memoria
		cargarSectorEnMemoria : (sector) =>
			@sector = sector

		cargarVillas : () =>
			idsector = $('#sector').val()
			option = '<option value= 1 selected="selected">' + 'Seleccione...' + '</option>'
			if idsector isnt ""
				$.ajax
					url:"#{base_url}/index.php/services/destinatarios/buscarVillas/idsector/#{idsector}"
					type:'GET'
					async: false
					statusCode:
						302: ->
							Singleton.get().reload()
					success: (villas) =>
						for v in villas
							option+= '<option value="' + v.Id_Villa + '" selected="selected">' + v.Nombre + '</option>'
						$('#villa').html option
						$('#villa').attr("value",1)
					error: (data) =>
						$('#villa').html option
			else
				$('#villa').html option

		#crea el filtro para mostrar la tabla
		filtrar : () =>
			Singleton.get().showLoading()

			@objData=
			{
				nombrecliente	: $('#autoc1').val()
				rutcliente	: Singleton.get().cleanRut($('#rut').val())
				start		    : @paginador.start
				end 		    : '14'
			}
			
			$.ajax
				url:"#{base_url}/index.php/services/destinatarios/contarRegistros"
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


		#carga los datos de la tabla de destinos
		cargar : () =>
			$.ajax
				url:"#{base_url}/index.php/services/destinatarios/filtrar"
				type:'POST'
				data: @objData
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(s) =>
					$('#cargatabla').html _.template(Tplresultados)({destinatarios: s})
					Singleton.get().hideLoading()	
					$('#tablaBody tr').click (e) =>
						e.preventDefault()
						e.stopPropagation()
						@clickTr(e)
				error:(s) =>
					Singleton.get().showInformacion('No existe información para los filtros seleccionados')
					$('#btnExito').click (e) =>
						@initialize()

		#agregar color rojo a los tr de las tablas cuando se selecciona 
		clickTr: (e) =>
			e.preventDefault()
			e.stopPropagation()
			@Id_Destino = e.currentTarget.attributes[0].value
			html= html + """<option value="accion">Acciones</option>""" + """<option value="editar">Editar</option>"""+ """<option value="eliminar">Eliminar</option>"""
			$('#accionesdestinatarios').html(html)
			$(e.currentTarget).addClass('active')
			$(e.currentTarget).siblings().removeClass('active')
			$('#accionesdestinatarios').unbind "change"
			$('#accionesdestinatarios').change (e) =>
				e.preventDefault()
				e.stopPropagation()
				@acciones(e)


		acciones : (e) =>
			e.preventDefault()
			e.stopPropagation()
			if ("editar" == $('#accionesdestinatarios').find(':selected').val())
				Singleton.get().showLoading()
				$('#appView').css('display','none')
				if _.isEmpty(@regiones)
					@sector.buscarRegiones(@cargarRegionesEnMemoria)
				$('#appViewNext').html _.template(Tpleditar)({regiones: @regiones})
				@destinatarioModel.buscarDestinatario(@Id_Destino,@cargareditar)
				Singleton.get().hideLoading()
				$('#modal').remove()

				#autocomplete para el cliente
				$("#autoc2").autocomplete
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
									rut: $('#autoc3').attr("value",Singleton.get().formatearRut(data[0].Rut_Entidad))
								)
							error: (data) ->
								$('#autoc2').removeClass("ui-autocomplete-loading")
								$('#autoc2').autocomplete( "close" );

					minLength: 1,
					open: ->
						$('#autoc2').removeClass("ui-autocomplete-loading")
					close: ->
						$('#autoc2').removeClass("ui-autocomplete-loading")

				#funcion del autocompletq eu setea el sector cuando elige una villa
				log = (idlugar,nombresector) =>
					$('#sector').val nombresector
					$('#idlugar').val idlugar

				#autocomplete para el lugar	
				$("#lugar").autocomplete
					source: (request, response) ->
						$.ajax
							url:"#{base_url}/index.php/services/destinatarios/milugar"
							type:'POST'
							data: 
								palabra: request.term
								idcomuna: $('#comunaselect').val()
							statusCode:
								302: ->
									Singleton.get().reload()
							success: (data) ->
								response $.map(data, (item) ->
									label: item.nombretipo + " - "  + item.nombrelugar + " - Sector " + item.nombresector
									value: item.nombrelugar
									idlugar: item.idlugar
									nombresector: item.nombresector
								)
							error: (data) ->
								$('#lugar').removeClass("ui-autocomplete-loading")
								$('#lugar').autocomplete( "close" );

					minLength: 1,
					select: (event, ui) ->
						if ui.item
							log(ui.item.idlugar,ui.item.nombresector)
					open: ->
						$('#lugar').removeClass("ui-autocomplete-loading")
					close: ->
						$('#lugar').removeClass("ui-autocomplete-loading")

				$('#regionselect').change (e) =>
					e.preventDefault()
					e.stopPropagation()
					option= '<option value="0" selected="selected">Seleccione...</option>'
					$('#sectorselect').html option
					$('#comunaselect').html option
					$('#comunaselect option[value=0]').attr('selected',true)
					$('#sector').val ""
					$('#idlugar').val ""
					$('#lugar').val ""
					reg = $('#regionselect').find(':selected').val()
					@sector.buscarProvincia(reg,@cargaProvincias)

				$('#provinciaselect').change (e) =>
					e.preventDefault()
					e.stopPropagation()
					pro = $('#provinciaselect').find(':selected').val()
					$('#sector').val ""
					$('#idlugar').val ""
					$('#lugar').val ""
					@sector.buscarComuna(pro,@cargaComuna)

				$('#comunaselect').change (e) =>
					e.preventDefault()
					e.stopPropagation()
					$('#sector').val ""
					$('#idlugar').val ""
					$('#lugar').val ""


				$(document).on "focusout", "#autoc2", (e) =>
					e.preventDefault()
					e.stopPropagation()
					if $('#autoc2').val() is ""
						$('#autoc3').val ""

				$(document).on "keyup", "#lugar", (e) =>
					if event.keyCode isnt 13
						e.preventDefault()
						e.stopPropagation()
						$('#sector').val ""
						$('#idlugar').val ""
					false

				$(document).on "focusout", "#lugar", (e) =>
					e.preventDefault()
					e.stopPropagation()
					if $('#idlugar').val() is "" and $('#lugar').val() isnt ""
						Singleton.get().showInformacion('El lugar ingresado no es válido')
						$('#sector').val ""
						$('#lugar').val ""

				$('.newTitulo').click (e) =>
					@volveriteminicial(e)

				$('#telefono').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)


				$('#cancelardestinatario').click (e) =>
					@cancelar(e)


				$('#guardardestinatario').click (e) =>
					e.preventDefault()
					e.stopPropagation()
					Validator = true
					#validamos los datos del destino===========================================================================================
					if $('#lugar').val() is '' or $('#idlugar').val() is '' or $('#sector').val() is ''
						Singleton.get().showInformacion('Debe Buscar el lugar del destinatario')
						Validator= false

					if $('#comunaselect').find(':selected').val() is '' or  $('#comunaselect').find(':selected').val() is '0'
						Singleton.get().showInformacion('Debe seleccionar la Comuna del destinatario')
						Validator= false

					if $('#provinciaselect').find(':selected').val() is '' or $('#provinciaselect').find(':selected').val() is '0'
						Singleton.get().showInformacion('Debe seleccionar la Provincia del destinatario')
						Validator= false

					if $('#regionselect').find(':selected').val() is ''
						Singleton.get().showInformacion('Debe seleccionar la Región del destinatario')
						Validator= false

					if $('#direccion').val() is ''
						Singleton.get().showInformacion('Debe ingresar la dirección del destinatario')
						Validator= false

					if $('#nombre').val() is ''
						Singleton.get().showInformacion('Debe ingresar el nombre del destinatario')
						Validator= false

					if $('#autoc3').val() is ''
						Singleton.get().showInformacion('No se ha cargado el Rut del Cliente')
						Validator= false

					if $('#autoc2').val() is ''
						Singleton.get().showInformacion('Debe Seleccionar un Cliente')
						Validator= false

					if Validator is true
						datosactualizar = {
							iddestino : @Id_Destino
							nombrecliente: $('#autoc2').val()
							rut:Singleton.get().cleanRut($('#autoc3').val()) 
							nombredestinatario : $('#nombre').val()
							direccion: $('#direccion').val()
							telefono : $('#telefono').val()
							idlugar: $('#idlugar').val()
						}
						new DestinatarioModel().actualizarDestinatario datosactualizar, (data) =>
							if _.isUndefined(data.error)
								Singleton.get().showExito('El destinatario ha sido actualizado exitosamente.')
								$('#appView').css('display','block')
								$('#appViewNext').empty()
								@filtrar()
							else
								Singleton.get().showError('El destinatario no ha podido ser actualizado.')


			if ("eliminar" == $('#accionesdestinatarios').find(':selected').val())
				@eliminar()


		cargareditar : (data) =>
			console.log data[0]
			$('#autoc2').attr("value",data[0].Nombre_Cliente)
			$('#autoc3').attr("value",Singleton.get().formatearRut(data[0].Rut_Entidad))
			$('#nombre').attr("value",data[0].Nombre_Contacto)
			$('#direccion').attr("value",data[0].Direccion)
			if data[0].Telefono is '0'
				$('#telefono').attr("value","")
			else
				$('#telefono').attr("value",data[0].Telefono)
			$('#lugar').attr("value",data[0].Nombre_Lugar)
			$('#idlugar').attr("value",data[0].Id_Lugar)
			$('#sector').attr("value",data[0].Nombre_Sector)
			$('#regionselect').attr("value",data[0].REGION_ID)
			@sector.buscarProvincia(data[0].REGION_ID,@cargaProvinciaTalca)			
			$('#provinciaselect').attr("value",data[0].PROVINCIA_ID)
			@sector.buscarComuna(data[0].PROVINCIA_ID,@cargaComunaTalca)
			$('#comunaselect').attr("value",data[0].COMUNA_ID)

		#carga las regiones en el imput
		cargaProvinciaTalca : (p) =>
			option= '<option value="0" selected="selected">Seleccione...</option>'
			for iterator in p
				option+= '<option value="' + iterator.PROVINCIA_ID + '" selected="selected">' + iterator.PROVINCIA_NOMBRE + '</option>'
				$('#provinciaselect').html option
				$('#provinciaselect option[value=0]').attr('selected',true)

		#carga las comunas segun la region seleccionada				
		cargaComunaTalca : (p) =>
			option= '<option value="0" selected="selected">Seleccione...</option>'
			for iterator in p
				option+= '<option value="' + iterator.COMUNA_ID+ '" selected="selected">' + iterator.COMUNA_NOMBRE + '</option>'
				$('#comunaselect').html option
				$('#comunaselect option[value=0]').attr('selected',true)


		eliminar: () =>
			Singleton.get().showAdvertencia()
			$('#btnAceptarAdvertencia').click (e) =>
				new DestinatarioModel().eliminarDestinatario @Id_Destino, (data) =>
					if _.isUndefined(data.error)
						if data is 'true'
							Singleton.get().showExito('El destinatario ha sido eliminado exitosamente.')
							$('#appView').css('display','block')
							$('#appViewNext').empty()
							@filtrar()
						else
							Singleton.get().showInformacion('El destinatario no puede ser eliminado, debido a que esta siendo utilizado en un pedido')
					else
						Singleton.get().showError('El destinatario no ha podido ser eliminado.')

		showModalCliente :(e) =>
			e.preventDefault()
			e.stopPropagation()
			#oculto el popover de la nueva cotización
			$('#btnFiltro').removeClass('btnfiltrograndeDis')
			$('#btnFiltro').addClass('btnfiltrograndeAct')
			$('#btnFiltro').popover 'hide'
			#=============================================================================================
			#ocultamos el popover de la tabla detalles si es que estubiera visualizado
			$('#'+Singleton.get().idBtnFiltroArticulo).removeClass('btnfiltroDis')
			$('#'+Singleton.get().idBtnFiltroArticulo).addClass('btnfiltroAct')
			$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'

			#=============================================================================================
			$('#modal').css('width',475)	
			$('#modal').css('height',465)
			$('#modal').css('top' ,'50%')
			$('#modal').css('left','55.5%')	
			$('#modal').css('background-color', '#f6f6f6')
			$('#modal').html _.template(TplmodalCliente)({})
			$('#tituloCliente').html 'Elegir Cliente'
			$('#Head1').html 'Nombre'
			$('#Head2').html 'Rut'
			$('#modal').modal 'show'

			$('#btnModalBuscarCliente').click (e) =>
				@modalBuscarCliente(e)

			$('#inputModalBuscarCliente').keypress (e) =>
				if event.keyCode is 13
					@modalBuscarCliente(e)

			$('#btnModalclienteAceptar').click (e) =>
				@modalAceptarCliente(e)
			false

		modalBuscarCliente :(e) =>
			e.preventDefault()
			e.stopPropagation()

			idCliente = $('#inputModalBuscarCliente').val()
			radioOption = ''

			if $.isNumeric(idCliente) 
				$('#inputModalBuscarCliente').val Singleton.get().formatearRut(idCliente)
				$.ajax
					url:"#{base_url}/index.php/services/cotizacion/buscarRut/id/#{idCliente}"
					type:'GET'
					statusCode:
						302: ->
							Singleton.get().reload()
					success: (clientes) =>
						for c in clientes
							radioOption+= '<tr>'
							radioOption+= '<td class="td-radio"><input type="radio" name="tabla" value="'+c.Rut_Entidad+'"></td>'
							radioOption+= '<td class="td-nombre">'+c.Nombre+'</td>'
							radioOption+= '<td>'+Singleton.get().formatearRut(c.Rut_Entidad)+'</td>'
							radioOption+= '</tr>'
						$('#tablaModalMostrarClientes tbody').html radioOption
						
					error: (data) =>
						$('#tablaModalMostrarClientes tbody').empty()
			else
				$.ajax
					url:"#{base_url}/index.php/services/cotizacion"
					type:'POST'
					data:
						palabra: idCliente
					statusCode:
						302: ->
							Singleton.get().reload()
					success: (clientes) =>
						for c in clientes
							radioOption+= '<tr>'
							radioOption+= '<td class="td-radio"><input type="radio" name="tabla" value="'+c.Rut_Entidad+'"></td>'
							radioOption+= '<td class="td-nombre">'+c.Nombre+'</td>'
							radioOption+= '<td>'+Singleton.get().formatearRut(c.Rut_Entidad)+'</td>'
							radioOption+= '</tr>'
						$('#tablaModalMostrarClientes tbody').html radioOption
						
					error: (data) =>
						$('#tablaModalMostrarClientes tbody').empty()
			false

		modalAceptarCliente :(e) =>
			e.preventDefault()
			e.stopPropagation()
			$("#tablaModalMostrarClientes tbody tr").each (index) ->
				if $(this).children("td")[0].childNodes[0].checked is true
					rutCliente= $(this).children("td")[0].firstElementChild.value
					nombreCiente= $(this).children("td")[1].textContent
					$('#DV').val Singleton.get().formatearRut(rutCliente)
					option = ''
					#$('#autoc1').val nombreCiente
					$.ajax
						url:"#{base_url}/index.php/services/cotizacion/buscarRut/id/#{rutCliente}"
						type:'GET'
						async: false
						statusCode:
							302: ->
								Singleton.get().reload()
						success: (cliente) =>
							$('#autoc2').val cliente[0].Nombre
							$('#autoc3').val Singleton.get().formatearRut(rutCliente)
						error: (data) =>
							$('#autoc2').val ""
							$('#autoc3').val ""



					$.ajax
						url:"#{base_url}/index.php/services/cotizacion/buscarDestinatario/id/#{rutCliente}"
						type:'GET'
						async: false
						statusCode:
							302: ->
								Singleton.get().reload()
						success: (destino) =>
							if destino.error != '202'
								for d in destino
									option+= '<option value="' + d.Id_Destino + '" selected="selected">' + d.Nombre_Contacto + '</option>'
								$('#Destinatario').html option
								id = $('#Destinatario').val()
								$.ajax
									url:"#{base_url}/index.php/services/cotizacion/buscardatosDestinatario/id/#{id}"
									type:'GET'
									async: false
									statusCode:
										302: ->
											Singleton.get().reload()
									success: (destino) =>
										$('#idDestinatario').val id
										$('#DireccionDestinatario').val destino[0].Direccion
										$('#TelefonoDestinatario').val destino[0].Telefono
							else
								$('#Destinatario').html ""
								$('#idDestinatario').val ""
								$('#DireccionDestinatario').val ""
								$('#TelefonoDestinatario').val ""
			$('#modal').modal 'hide'
			#aplicando tooltips a la tabla de contactos
			$('.put-tooltips').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			#setiamos los valores del foot (el valor del flete segun el consignatario que tenga como principal)
			#@setiarFlete()
			false

		volveriteminicial: (e) =>
			#cuando hacen click en el hipervinculo
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appView').css('display','block')
			$('#appViewNext').empty()
			Singleton.get().hideLoading()
			false