define [
	'backbone'
	'text!tpl/mantenedorDestinatarios/adddestinatariopedido.html'
	'assets/js/model/destinatario'
	'assets/js/model/sector'
] , (Backbone,TplViewAddCliente,DestinatariosModel,Sector) ->  
	class agregarDestinatario extends Backbone.View
	
		# Cargamos la vista principal de la nueva cotizacion
		initialize : () =>
			@destinatarioModel = new DestinatariosModel()
			@sector = new Sector()
			@init()

		init : () =>
			Singleton.get().showLoading()
			$('#modal').css('width',950)	
			$('#modal').css('height',370)	
			$('#modal').css('left' ,'40.5%')	
			$('#modal').css('top' ,'45%')
			$('#modal').css('background-color', '#f6f6f6')
			if _.isEmpty(@regiones)
				@sector.buscarRegiones(@cargarRegionesEnMemoria)

			@sector.buscarProvincia(7,@cargaProvinciaDefecto)
			@sector.buscarComuna(71,@cargaComunaDefecto)	
			$('#modal').html _.template(TplViewAddCliente)(regiones: @regiones,provincias: @provincias, comunas: @comunas)
			$('#autoc2').val $('#autoc1').val()
			$('#autoc3').val $('#DV').val()
			$('#regionselect').attr("value",7)
			$('#provinciaselect').attr("value",71)
			$('#comunaselect').attr("value",7101)
			$('#mensaje').css('display','none')

			#validamos que solo ingresen numeros en el 
			$('#telefono').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

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
				if reg isnt '0' and reg isnt ''
					@sector.buscarProvincia(reg,@cargaProvincias)
				else
					$('#provinciaselect').html option
					$('#comunaselect').html option


			$('#provinciaselect').change (e) =>
				e.preventDefault()
				e.stopPropagation()
				pro = $('#provinciaselect').find(':selected').val()
				$('#sector').val ""
				$('#idlugar').val ""
				$('#lugar').val ""
				if pro isnt '0' and pro isnt ''
					@sector.buscarComuna(pro,@cargaComuna)
				else
					option= '<option value="0" selected="selected">Seleccione...</option>'
					$('#comunaselect').html option


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

			$(document).on "focus","#lugar", (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#mensaje').css('display','none')
				false

			$(document).on "focusout", "#lugar", (e) =>
				e.preventDefault()
				e.stopPropagation()
				if $('#idlugar').val() is "" and $('#lugar').val() isnt ""
					$("#mensaje").html  "&nbsp;&nbsp;El Lugar Ingresado no es valido"
					$('#mensaje').css('display','inline')
					$('#sector').val ""
					$('#lugar').val ""

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
								console.log item.nombretipo + " - "  + item.nombrelugar + " - Sector " + item.nombresector
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


			$('#guardardestinatario').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Validator = true
				#validamos los datos del destino===========================================================================================
				if $('#lugar').val() is '' or $('#idlugar').val() is '' or $('#sector').val() is ''
					Validator= false

				if $('#comunaselect').find(':selected').val() is '' or  $('#comunaselect').find(':selected').val() is '0'
					Validator= false

				if $('#provinciaselect').find(':selected').val() is '' or $('#provinciaselect').find(':selected').val() is '0'
					Validator= false

				if $('#regionselect').find(':selected').val() is ''
					Validator= false

				if $('#direccion').val() is ''
					Validator= false

				if $('#nombre').val() is ''
					Validator= false

				if $('#autoc3').val() is ''
					Validator= false

				if $('#autoc2').val() is ''
					Validator= false


				#ingresamos los datos si se han validado correctamente
				if Validator is true
					@rut = Singleton.get().cleanRut($('#autoc3').val()) 
					datos = {
						nombrecliente: $('#autoc2').val()
						rut:Singleton.get().cleanRut($('#autoc3').val()) 
						nombredestinatario : $('#nombre').val()
						direccion: $('#direccion').val()
						telefono : $('#telefono').val()
						idlugar: $('#idlugar').val()
					}
					new DestinatariosModel().guardarDestinatario datos, (data) =>
						if _.isUndefined(data.error)
							option = ""
							$.ajax
								url:"#{base_url}/index.php/services/cotizacion/buscarDestinatario/id/#{@rut}"
								type:'GET'
								async: true
								statusCode:
									302: ->
										Singleton.get().reload()
								success: (destino) =>
									if destino.error != '202'
										for d in destino
											option+= '<option value="' + d.Id_Destino + '" selected="selected">' + d.Nombre_Contacto + '</option>'
										$('#Destinatario').html option
										@datosdestinatario()
										Singleton.get().showExito('El destinatario ha sido guardado exitosamente.')
										$('#appView').css('display','block')
										$('#appViewNext').empty()
									else 
										$('#Destinatario').html ""
										$('#DireccionDestinatario').val ""
										$('#TelefonoDestinatario').val ""
										$('#idDestinatario').val ""
										$('#appView').css('display','block')
										$('#appViewNext').empty()
										Singleton.get().showError('no se ha podido cargar los valores del destinatario.')
						else
							Singleton.get().showError('El destinatario no ha podido ser guardado.')

			$('#cancelardestinatario').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#modal').modal('hide')


		# Cargamos en memoria las regiones, provinvias y comunas por defecto
		cargarRegionesEnMemoria : (regiones) => 
			@regiones = regiones

		cargaProvinciaDefecto : (p) =>
			@provincias = p

		cargaComunaDefecto : (c) =>
			@comunas = c

		#carga las regiones en el imput
		cargaProvincias : (p) =>
			option= '<option value="0" selected="selected">Seleccione...</option>'
			for iterator in p
				option+= '<option value="' + iterator.PROVINCIA_ID + '" selected="selected">' + iterator.PROVINCIA_NOMBRE + '</option>'
				$('#provinciaselect').html option
				$('#provinciaselect option[value=0]').attr('selected',true)
				$('#comunaselect option[value=0]').attr('selected',true)

		#carga las comunas segun la provincia seleccionada		
		cargaComuna : (p) =>
			option= '<option value="0" selected="selected">Seleccione...</option>'
			for iterator in p
				option+= '<option value="' + iterator.COMUNA_ID+ '" selected="selected">' + iterator.COMUNA_NOMBRE + '</option>'
				$('#comunaselect').html option
				$('#comunaselect option[value=0]').attr('selected',true)

		#cargamos los datos del destinatario seleccionado
		datosdestinatario : () =>
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
					if destino[0].Telefono isnt '0'
						$('#TelefonoDestinatario').val destino[0].Telefono
					else
						$('#TelefonoDestinatario').val ""
					$('#CotFlete').val destino[0].PrecioFlete
					$('#validezCotizacion').val ""
					$('#horaentrega').html '<option value="">Seleccione</option>'
					$('#validezCotizacion').removeAttr('disabled')
					Singleton.get().idsector = destino[0].Id_Sector
					Singleton.get().setiarFlete()
				error: (data) =>
		false