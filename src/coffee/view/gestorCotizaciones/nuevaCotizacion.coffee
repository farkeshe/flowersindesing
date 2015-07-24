define [
	'backbone'
	'text!tpl/gestorCotizaciones/nuevaCotizacion.html'
	'text!tpl/gestorCotizaciones/modalMensaje.html'
	'text!tpl/gestorCotizaciones/modalCliente.html'
	'text!tpl/gestorCotizaciones/modalConsultorCotizaciones.html'
	'text!tpl/gestorCotizaciones/modalListaPrecio.html'
	'text!tpl/gestorCotizaciones/addRow.html'
] , (Backbone,TplnuevaCotizacion, TplmodalMensaje, TplmodalCliente, TplmodalConsultorCotizaciones, TplmodalListaPrecio, TpladdRow) ->  
	class nuevaCotizacion extends Backbone.View
	
		# Cargamos la vista principal de la nueva cotizacion
		initialize : () =>
			Singleton.get().contLin = 1
			Singleton.get().mailMensajeModal = ''
			Singleton.get().mailAsuntoModal = ''
			@init()

		
		init : () =>
			Singleton.get().showLoading()
			$('#appView').html _.template(TplnuevaCotizacion)({})
			# $('.scroll').css('width',window.innerWidth - 260)
			$('.scroll').css('height',window.innerHeight - 75)
			$('#modal').css('display','none')
			$('#validezCotizacion').attr('disabled','disabled')
			$('.precio-unidad').attr('disabled','disabled')

			#bloqueamos el descuento para el pefil de vendedor y vendedor exterior
			if Singleton.get().idPerfilUsuarioLogueado is '4' or Singleton.get().idPerfilUsuarioLogueado is '5'
				$('#CotDescuento').attr('disabled','disabled')

			$.ajax
				url:"#{base_url}/index.php/services/cotizacion/obtenerfechahora/"
				type:'GET'
				async: false
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (fechahora) =>
					aux = Singleton.get().invertirFecha(fechahora.slice(0,10),'I')
					ano = aux.slice(0,4)
					mes = aux.slice(5,7)
					dia = aux.slice(8,10)
					$("#fechaCotizacion").attr('value',dia+'/'+mes+'/'+ano)


			#cargamos los datos del usuario segun su perfil de usuario
			@cargarVendedor()

			#validamos que solo ingresen numero en la cantidad
			$('.cantidad').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)
			#validamos que solo ingresen numero en el precio
			$('.precio-unidad').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)
			#validamos que solo ingresen numero en el valor del flete
			$('#CotFlete').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)
			#validamos que solo ingresen numero en el % de descuento
			$('#CotDescuento').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

			#aplicando el estilo a los tooltip
			$('#btnFiltro').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#newMail').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#histMail').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#buscarCliente').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#bntAddRow').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#btnAddDestinatario').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#btnAddCliente').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})

			$('.btnfiltroArticulo').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('.btnfiltro-producto').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('.btnfiltro-precio').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			
			Singleton.get().hideLoading()
			
			
			$('#validezCotizacion').datepicker
				firstDay: 1
				dateFormat: "dd/mm/yy"
				dayNamesMin: [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa" ]
				monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ]
				onSelect: (dateText, inst) =>
					$.ajax
						url:"#{base_url}/index.php/services/cotizacion/obtenerfechahora/"
						type:'GET'
						async: false
						statusCode:
							302: ->
								Singleton.get().reload()
						success: (fechahora) =>
							aux = Singleton.get().invertirFecha(fechahora.slice(0,10),'I')
							fechasistema = aux.slice(0,4)
							fechasistema += aux.slice(5,7)
							fechasistema += aux.slice(8,10)

							horasistema = fechahora.slice(11,13)

							fechainvertida = Singleton.get().invertirFecha($('#validezCotizacion').val(),'I')
							fechadespacho = fechainvertida.slice(0,4)
							fechadespacho += fechainvertida.slice(5,7)
							fechadespacho += fechainvertida.slice(8,10)

							if  parseInt(fechasistema)<=parseInt(fechadespacho)
								#obtenemos los repartdiores disponibles para ese dia
								fecha = Singleton.get().invertirFecha($('#validezCotizacion').val(),'I')

								#cargamos los sectores y horas de despacho para los pedidos realizados
								$.ajax
									url:"#{base_url}/index.php/services/cotizacion/buscardisponibilidad/fecha/#{fecha}"
									type:'GET'
									async: false
									statusCode:
										302: ->
											Singleton.get().reload()
									success: (disponibilidad) =>
										if disponibilidad.error != '202'
											@disponibilidad = disponibilidad
										else
											@disponibilidad = ""
									error: (data) =>

								#obtenemos los repartidores del dia seleccionado
								$.ajax
									url:"#{base_url}/index.php/services/repartidores/obtenerrepartidoresdia/fecha/#{fecha}"
									type:'GET'
									async: false
									statusCode:
										302: ->
											Singleton.get().reload()
									success: (repartidoresdia) =>
										if repartidoresdia.error != '202'
											@repartidoresdia = repartidoresdia[0].Cantidad_Repartidores
										else
											#defecto 2 repartidor
											@repartidoresdia = repartidoresdia = 2
								@setiarhorasdespacho()
							else
								Singleton.get().showInformacion('La fecha ingresada no es valida')
								$('#validezCotizacion').val ""
								$('#horaentrega').html '<option value="">Seleccione</option>'
							false
				

			$('#fechaCotizacion').datepicker
				firstDay: 1
				dateFormat: "dd/mm/yy"
				dayNamesMin: [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa" ]
				monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ]						
			
			#revisamos si el producto es valido y si existe ya en el pedido
			$(document).on "focusout", ".producto", (e) ->
				i = 1
				e.preventDefault()
				e.stopPropagation()
				if $('#idProducto'+e.currentTarget.attributes['row'].value).val() is "" and $('#producto'+e.currentTarget.attributes['row'].value).val() isnt ""
					Singleton.get().showInformacion('El producto ingresado no es valido')
					$('#producto'+e.currentTarget.attributes['row'].value).val ""
					$('#precioUnidad'+e.currentTarget.attributes['row'].value).val ""
					Singleton.get().setiarPrecioTotal(e.currentTarget.attributes['row'].value)
				while i <= Singleton.get().contLin
					if i != parseInt(e.currentTarget.attributes['row'].value)
						if $('#idProducto'+e.currentTarget.attributes['row'].value).val() is $('#idProducto'+i).val() and $('#idProducto'+e.currentTarget.attributes['row'].value).val() isnt ""
							Singleton.get().showInformacion('El producto ingresado ya existe en el pedido')
							$('#idProducto'+e.currentTarget.attributes['row'].value).val ""
							$('#producto'+e.currentTarget.attributes['row'].value).val ""
							$('#precioUnidad'+e.currentTarget.attributes['row'].value).val ""
							Singleton.get().setiarPrecioTotal(e.currentTarget.attributes['row'].value)
					i++	
				false

			#cuando este tipeando el producto seteamos su indice
			$(document).on "keyup", ".producto", (e) ->
				e.preventDefault()
				e.stopPropagation()
				if event.keyCode isnt 13
					$('#idProducto'+e.currentTarget.attributes['row'].value).val ""
				false

			$(document).on "click", ".clsEliminarFila", (e) ->
				e.preventDefault()
				e.stopPropagation()
				objFila = $(this).parents().get(1)
				$(objFila).remove()
				false

			#actualizamos el tfoot cuando se elimina una fila (row)
			$(document).on "click", ".updateTfoot", (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().setiarDescuento()
				false

			$(document).on "change", '#horaentrega', (e) =>
				e.preventDefault()
				e.stopPropagation()

				$.ajax
					url:"#{base_url}/index.php/services/cotizacion/obtenerfechahora/"
					type:'GET'
					async: false
					statusCode:
						302: ->
							Singleton.get().reload()
					success: (fechahora) =>
						aux = Singleton.get().invertirFecha(fechahora.slice(0,10),'I')
						fechasistema = aux.slice(0,4)
						fechasistema += aux.slice(5,7)
						fechasistema += aux.slice(8,10)
						horasistema = fechahora.slice(11,13)
						minutossistema = fechahora.slice(14,16)

						fechainvertida = Singleton.get().invertirFecha($('#validezCotizacion').val(),'I')
						fechadespacho = fechainvertida.slice(0,4)
						fechadespacho += fechainvertida.slice(5,7)
						fechadespacho += fechainvertida.slice(8,10)

						if 	parseInt(fechasistema) is parseInt(fechadespacho)
							if parseInt(horasistema)>parseInt($('#horaentrega').val().substr(0, 2))
								Singleton.get().showInformacion('Combinacion de Fecha y Hora no valida')
								$('#horaentrega').val ""
							else
								if parseInt(horasistema) == parseInt($('#horaentrega').val().substr(0, 2)) and parseInt(minutossistema)>30
									Singleton.get().showInformacion('Combinacion de Fecha y Hora no valida')
									$('#horaentrega').val ""
						false


			$(document).on "click", ".btnfiltro-producto", (e) =>
				e.preventDefault()
				e.stopPropagation()
				#oculto el popover de la nueva cotización
				$('#btnFiltro').removeClass('btnfiltrograndeDis')
				$('#btnFiltro').addClass('btnfiltrograndeAct')
				$('#btnFiltro').popover 'hide'
				#=============================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).removeClass('btnfiltroDis')
				$('#'+Singleton.get().idBtnFiltroArticulo).addClass('btnfiltroAct')
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'

				#=============================
				$('#modal').css('width',490)	
				$('#modal').css('height',465)	
				$('#modal').css('top' ,'50%')
				$('#modal').css('left','55.5%')	
				$('#modal').css('background-color', '#f6f6f6')
				$('#modal').html _.template(TplmodalCliente)
				$('#tituloCliente').html 'Elegir Producto'
				$('#Head1').html 'Producto'
				$('#Head2').html 'Id'
				$('#modal').modal 'show'

				Singleton.get().rowBtnFiltroProducto= e.currentTarget.attributes['row'].value

				$('#btnModalBuscarCliente').click (e) =>
					@modalBuscarProducto(e)

				$('#inputModalBuscarCliente').keypress (e) =>
					if event.keyCode is 13
						@modalBuscarProducto(e)

				$('#btnModalclienteAceptar').click (e) =>
					@modalAceptarProducto(e)

				false

			$(document).on "focus", ".producto", (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().inFocusIdProducto= e.currentTarget.value
				false

			$(document).on "keyup", ".cantidad", (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().setiarPrecioTotal(e.currentTarget.attributes['row'].value)
				false

			$(document).on "focusout", ".cantidad", (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().setiarPrecioTotal(e.currentTarget.attributes['row'].value)
				false

			$(document).on "keyup", ".precio-unidad", (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#precioUnidad'+e.currentTarget.attributes['row'].value).val Singleton.get().formatMiles(e.currentTarget.value)
				Singleton.get().setiarPrecioTotal(e.currentTarget.attributes['row'].value)
				false

			$(document).on "focusout", ".precio-unidad", (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#precioUnidad'+e.currentTarget.attributes['row'].value).val Singleton.get().formatMiles(e.currentTarget.value)
				Singleton.get().setiarPrecioTotal(e.currentTarget.attributes['row'].value)
				false

			$(document).on "keyup","#CotFlete", (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#CotFlete').val Singleton.get().formatMiles($('#CotFlete').val())
				Singleton.get().setiarFlete()
				false

			#validamos que el valor del flete sea numerico
			$(document).on "focusout", "#CotFlete", (e) =>
				e.preventDefault()
				e.stopPropagation()
				
				if $('#CotFlete').val() isnt '' 		
					if !$.isNumeric(Singleton.get().cleanValor($('#CotFlete').val()))
						Singleton.get().showError('El Valor del Flete Ingresado es Incorrecto')
						$('#CotFlete').val '0'
					else
						$('#CotFlete').val Singleton.get().formatMiles($('#CotFlete').val())
						Singleton.get().setiarFlete()
				false

			$(document).on "keyup","#CotDescuento", (e) =>
				e.preventDefault()
				e.stopPropagation()
		
				if Number(Singleton.get().cleanValor($('#CotDescuento').val())) >100
					Singleton.get().showError('El Porcentaje Ingresado Es Incorrecto')
					$('#CotDescuento').val '0'
				else
					$('#CotDescuento').val Singleton.get().formatMiles($('#CotDescuento').val())
					Singleton.get().setiarDescuento()
				false

			$(document).on "focusout", "#CotDescuento", (e) =>
				e.preventDefault()
				e.stopPropagation()
				
				if $('#CotDescuento').val() isnt ''
					if !$.isNumeric(Singleton.get().cleanValor($('#CotDescuento').val()))
						Singleton.get().showError('El % de Descuento Ingresado es Incorrecto')
						$('#CotDescuento').val '0'
					else
						if Number(Singleton.get().cleanValor($('#CotDescuento').val())) >100
							Singleton.get().showError('El Porcentaje Ingresado Es Incorrecto')
							$('#CotDescuento').val '0'
						else
							$('#CotDescuento').val Singleton.get().formatMiles($('#CotDescuento').val())
							Singleton.get().setiarDescuento()
				false

			$(document).on "focusout", "#autoc1", (e) =>
				e.preventDefault()
				e.stopPropagation()
				if $('#autoc1').val() is ''
					$('#DV').val ''
					$('#TelefonoCliente').val ''
					$('#Destinatario').empty()
					$('#DireccionDestinatario').val ''
					$('#TelefonoDestinatario').val ''
					$('#CotFlete').val '0'
					$('#validezCotizacion').val ""
					$('#validezCotizacion').attr('disabled','disabled')
					$('#horaentrega').html '<option value="">Seleccione</option>' 
					Singleton.get().setiarFlete()
				false

			$(document).on "keyup", "#autoc1", (e) =>
				if event.keyCode isnt 13
					e.preventDefault()
					e.stopPropagation()
					$('#DV').val ''
					$('#TelefonoCliente').val ''
					$('#Destinatario').empty()
					$('#DireccionDestinatario').val ''
					$('#TelefonoDestinatario').val ''
					$('#CotFlete').val '0'
					$('#validezCotizacion').val ""
					$('#validezCotizacion').attr('disabled','disabled')
					$('#horaentrega').html '<option value="">Seleccione</option>' 
					Singleton.get().setiarFlete()
				false

			$('#bntAddRow').click (e) =>
				@agregarFila(e)


			$('#buscarCliente').click (e) =>
				 @showModalCliente(e)			

			$('#guardar' ).click (e) =>
				 @btnGuardar(e)

			$('#Destinatario').change (e) =>
				e.preventDefault()
				e.stopPropagation()
				@datosdestinatario()


			$('#btnAddCliente').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showModalAddCliente()

			$('#btnAddDestinatario').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				if $('#DV').val() isnt ''
					Singleton.get().showModalAddDestinatario()
				else
					Singleton.get().showInformacion('Debe seleccionar un cliente')

			#autocomplete cliente ==================================================================================
				#funcion que envia el id del cliente
			log = (rut,nombre,telefono) =>
				$('#DV').val Singleton.get().formatearRut(rut)
				$('#autoc1').val nombre
				$('#TelefonoCliente').val telefono
				option = ''
				$.ajax
					url:"#{base_url}/index.php/services/cotizacion/buscarDestinatario/id/#{rut}"
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
							@datosdestinatario()
						else 
							$('#Destinatario').html ""
							$('#DireccionDestinatario').val ""
							$('#TelefonoDestinatario').val ""
							$('#idDestinatario').val ""
							$('#CotFlete').val 0
							Singleton.get().setiarFlete()
					error: (data) =>
						$('#Destinatario').html ""
						$('#DireccionDestinatario').val ""
						$('#TelefonoDestinatario').val ""
						$('#idDestinatario').val ""
						$('#CotFlete').val 0
						Singleton.get().setiarFlete()



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
						success: (data) =>
							response $.map(data, (item) ->
								label: item.Nombre
								value: item.Nombre
								rut: item.Rut_Entidad
								telefono: item.Telefono
							)
						error: (data) ->
							$('#autoc1').removeClass("ui-autocomplete-loading")
							$('#autoc1').autocomplete( "close" )
							$('#DV').val ''
							$('#TelefonoCliente').val ''
							$('#Destinatario').html ''
							$('#DireccionDestinatario').val ''
							$('#TelefonoDestinatario').val ''

				minLength: 1,

				select: (event, ui) ->
					if ui.item
						log(ui.item.rut,ui.item.value,ui.item.telefono)
				open: ->
					$('#autoc1').removeClass("ui-autocomplete-loading")
				close: ->
					$('#autoc1').removeClass("ui-autocomplete-loading")

				false
		# 	#=======================================================================================================

			# idUsuario= Singleton.get().idUsuarioLogueado
			#autocomplete del producto==============================================================================
			$("#producto1").autocomplete
				source: (request, response) ->

					$.ajax
						url:"#{base_url}/index.php/services/restricciones/buscarProducto/nombre/#{request.term}"
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success: (data) ->
							response $.map(data, (item) ->
								label: item.Nombre
								value: item.Nombre
								id: item.Id_Producto
								precio: item.Precio
							)
						error: (data) ->
							$('#producto1').removeClass("ui-autocomplete-loading")
							$('#producto1').autocomplete( "close" )
				
				minLength: 1, ########################################################################################################
				select: (event, ui) ->
					$('#precioTotal1').val(0)
					
					if ui.item
						$('#idProducto1').val ui.item.id
						$('#producto1').val ui.item.value
						$('#precioUnidad1').val Singleton.get().formatMiles(ui.item.precio)
						Singleton.get().setiarPrecioTotal(1)
						
				open: ->
					$('#producto1').removeClass("ui-autocomplete-loading")
				close: ->
					$('#producto1').removeClass("ui-autocomplete-loading")
		# 	#=======================================================================================================

		setiarhorasdespacho :() =>
			htmlhoras = '<option value="">Seleccione</option>'
			#seteamos las hotas a utilizar
			hora = new Array(1) 
			hora[0] = "<option>09:30</option>"
			hora[1] = "<option>10:00</option>"
			hora[2] = "<option>10:30</option>"
			hora[3] = "<option>11:00</option>"
			hora[4] = "<option>11:30</option>"
			hora[5] = "<option>12:00</option>"
			hora[6] = "<option>12:30</option>"
			hora[7] = "<option>13:00</option>"
			hora[8] = "<option>13:30</option>"
			hora[9] = "<option>14:00</option>"
			hora[10] = "<option>14:30</option>"
			hora[11] = "<option>15:00</option>"
			hora[12] = "<option>15:30</option>"
			hora[13] = "<option>16:00</option>"
			hora[14] = "<option>16:30</option>"
			hora[15] = "<option>17:00</option>"
			hora[16] = "<option>17:30</option>"
			hora[17] = "<option>18:00</option>"
			hora[18] = "<option>18:30</option>"
			hora[19] = "<option>19:00</option>"
			hora[20] = "<option>19:30</option>"		
			if @disponibilidad is ""
				#muestra todas las horas disponibles del dia
				i = 0
				while i< 21
					htmlhoras = htmlhoras + hora[i]
					i++
				$('#horaentrega').html htmlhoras
			else
				i = 0
				while i < 21
					sectoresocupadoshora = []
					#obtenemos los sectores que tiene repartos por hora
					for  d in @disponibilidad
						if parseInt(d.FechaHoraDespacho.slice(11,13)) is parseInt(hora[i].slice(8,11))
							sectoresocupadoshora.push d.Id_Sector 
					#revisamos si el sector del destinatario esta en esos sectores
					existe = false
					for  s in sectoresocupadoshora
						if Singleton.get().idsector is s
							existe = true
					if existe is true
						htmlhoras = htmlhoras + hora[i]
					else
						if sectoresocupadoshora.length < @repartidoresdia
							htmlhoras = htmlhoras + hora[i]
					i++
				$('#horaentrega').html htmlhoras
			false

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
							


		agregarFila :(e) =>
			e.preventDefault()
			e.stopPropagation()

			#validamos que todos los datos de las filas anteriores esten correctos antes de agregar una nueva.=========================================
			Validator= true
			$("#tablaItem tbody tr").each (index) ->
				$(this).children("td").each (index2) ->
					switch index2
						when 0
							#validamos la cantidad para cada item generado
							if $(this)[0].firstElementChild.value is ''
								Singleton.get().showInformacion('Existe Una Cantidad Sin Ingresar')
								Validator= false	
								break
							if !$.isNumeric($(this)[0].firstElementChild.value)
								Singleton.get().showError('Existe Una Cantidad Incorrecta')
								Validator= false
								break
						when 1
							#validamos el producto para cada item generado
							if $(this)[0].firstElementChild.value is ''
								Singleton.get().showInformacion('Existe Un Producto Sin Ingresar')
								Validator= false	
								break
						when 2
							#validamos el precio de unidad
							if $(this)[0].firstElementChild.value is ''
								Singleton.get().showInformacion('Existe Un Precio de Unidad Sin Ingresar')
								Validator= false	
								break
							if !$.isNumeric(Singleton.get().cleanValor($(this)[0].firstElementChild.value))
								Singleton.get().showError('Existe Un Precio de unidad Incorrecto')
								Validator= false
								break
			#==========================================================================================================================================

			if Validator is true
				#incrementamos una fila
				Singleton.get().contLin++
				#agregamos la nueva fila a la tabla
				$('#tablaItem').find("tbody").append _.template(TpladdRow)({contLin:Singleton.get().contLin,newItem:'New'})
				$('.precio-unidad').attr('disabled','disabled')
				#validamos que solo ingresen numeros
				$('.cantidad').keydown (event) ->
					if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
						return
					else
						event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

				#validamos que solo ingresen numero en el precio
				$('.precio-unidad').keydown (event) ->
					if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
						return
					else
						event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)


				idUsuario= Singleton.get().idUsuarioLogueado
				#autocomplete del producto==============================================================================
				$(".producto").autocomplete
					source: (request, response) ->
						$.ajax
							url:"#{base_url}/index.php/services/restricciones/buscarProducto/nombre/#{request.term}"
							type:'GET'
							statusCode:
								302: ->
									Singleton.get().reload()
							success: (data) ->
								response $.map(data, (item) ->
									label: item.Nombre
									value: item.Nombre
									id: item.Id_Producto
									precio: item.Precio
								)
							error: (data) ->
								$('.producto').removeClass("ui-autocomplete-loading")
								$('.producto').autocomplete( "close" )
					
					minLength: 1,
					select: (event, ui) ->
						indice2 = event.target.id.split("producto")
						$('#precioTotal'+indice2[1]).val(0)
						if ui.item
							indice = event.target.id.split("producto")
							$('#idProducto'+indice[1]).val ui.item.id
							$('#producto'+indice[1]).val ui.item.value
							$('#precioUnidad'+indice[1]).val Singleton.get().formatMiles(ui.item.precio)
							Singleton.get().setiarPrecioTotal(indice[1])
					open: ->
						$('.producto').removeClass("ui-autocomplete-loading")
					close: ->
						$('.producto').removeClass("ui-autocomplete-loading")
				#=======================================================================================================
				# #setiamos el select del destino segun el usuario que se a seleccionado=================================
				# idRut= new String($('#DV').val()).substr(0, 2) + new String($('#DV').val()).substr(3, 3) + new String($('#DV').val()).substr(7, 3)
				# option= '<option value="0" selected="selected">Seleccione</option>'
				# principal= 0
				
				# $.ajax
				# 	url:"#{base_url}/index.php/services/cotizacion/buscarDestino/id/#{idRut}"
				# 	type:'GET'
				# 	success: (destino) =>
				# 		for d in destino
				# 			if d.Principal is '1'
				# 					principal= d.Id_Consignatario
				# 			option+= '<option value="' + d.Id_Consignatario + '" selected="selected">' + d.Nombre + '</option>'
				# 		$('#consignatario'+Singleton.get().contLin).html option
				# 		if principal isnt 0
				# 			$('#consignatario'+Singleton.get().contLin+' option[value='+principal+']').attr('selected',true)
				# 		else
				# 			$('#consignatario'+Singleton.get().contLin+' option[value=0]').attr('selected',true)
				# 	error: (data) =>
				# 		$('#consignatario'+Singleton.get().contLin).empty()
				#=======================================================================================================
				#setiamos los title para darle apariencia de tooltips
				# $('.btnfiltroArticulo').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
				$('.btnfiltro-producto').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
				# $('.btnfiltro-precio').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
				#=======================================================================================================
				#validamos la restriccion de editar precios
				# @restriccionEditarPrecio('#precioUnidad'+Singleton.get().contLin)

			false

		cargarVendedor :() =>
			idUsuario= Singleton.get().idUsuarioLogueado
			perfil= Singleton.get().perfilUsuarioLogueado
			usuariolog= Singleton.get().nombreUsuarioLogueado
			idSupervisor= Singleton.get().idSupervisorUsuarioLogueado
			idSubgerencia= Singleton.get().idSubgerenciaUsuarioLogueado
			
			$('#cotVendedor').attr('disabled', 'disabled');
			$('#nomVendedor').val usuariolog
			
			$.ajax
				url:"#{base_url}/index.php/services/cotizacion/buscarUsuario/id/#{idSupervisor}"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(usuario) =>
					if usuario.error != '202'
						$('#cotResponsable').val usuario[0].Nombre
						$('#idResponsable').val idSupervisor
					else
						$('#cotResponsable').val usuariolog
						$('#idResponsable').val idUsuario
				error:(data) =>
					$('#cotResponsable').val usuariolog
					$('#idResponsable').val idUsuario

			false

		#=======================================================================================================
		# 	cargamos los datos del destinatario seleccionado
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
							$('#autoc1').val cliente[0].Nombre
							$('#TelefonoCliente').val cliente[0].Telefono
						error: (data) =>
							$('#autoc1').val ""
							$('#TelefonoCliente').val ""


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
										if destino[0].Telefono isnt '0'
											$('#TelefonoDestinatario').val destino[0].Telefono
										else
											$('#TelefonoDestinatario').val ""
										$('#validezCotizacion').val ""
										$('#horaentrega').html '<option value="">Seleccione</option>'
										$('#validezCotizacion').removeAttr('disabled')
										Singleton.get().idsector = destino[0].Id_Sector
										$('#CotFlete').val destino[0].PrecioFlete
							else
								$('#Destinatario').html ""
								$('#idDestinatario').val ""
								$('#DireccionDestinatario').val ""
								$('#TelefonoDestinatario').val ""
								$('#CotFlete').val "0"
			$('#modal').modal 'hide'
			Singleton.get().setiarFlete()
			#aplicando tooltips a la tabla de contactos
			$('.put-tooltips').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			#setiamos los valores del foot (el valor del flete segun el consignatario que tenga como principal)
			false

		modalBuscarProducto : (e) =>
			e.preventDefault()
			e.stopPropagation()

			#idUsuario= Singleton.get().idUsuarioLogueado
			nombreProducto = $('#inputModalBuscarCliente').val()
			radioOption = ''
			$.ajax
				url:"#{base_url}/index.php/services/restricciones/buscarProducto/nombre/"+nombreProducto
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (productos) =>
					for p in productos
						radioOption+= '<tr>'
						radioOption+= '<td class="td-radio"><input type="radio" name="tabla" value="'+p.Id_Producto+'"></td>'
						radioOption+= '<td class="td-nombre">'+p.Nombre+'</td>'
						radioOption+= '<td>'+p.Id_Producto+'</td>'
						radioOption+= '<td visibility: hidden>'+p.Precio+'</td>'
						radioOption+= '</tr>'
					$('#tablaModalMostrarClientes tbody').html radioOption
					
				error: (data) =>
					$('#tablaModalMostrarClientes tbody').empty()
			false

		#agregamos el producto si este no a sido agregado
		modalAceptarProducto : (e) =>
			i = 0
			iguales = 0
			e.preventDefault()
			e.stopPropagation()
			idPro= ''
			$("#tablaModalMostrarClientes tbody tr").each (index) ->
				if $(this).children("td")[0].childNodes[0].checked is true
					idPro = $(this).children("td")[2].textContent
					nombre = $(this).children("td")[1].textContent
					precio = $(this).children("td")[3].textContent
					$('#producto'+Singleton.get().rowBtnFiltroProducto).val nombre
					$('#precioUnidad'+Singleton.get().rowBtnFiltroProducto).val Singleton.get().formatMiles(precio)
					$('#idProducto'+Singleton.get().rowBtnFiltroProducto).val idPro
					Singleton.get().setiarPrecioTotal(Singleton.get().rowBtnFiltroProducto)
					while i <= Singleton.get().contLin
						if i != parseInt(Singleton.get().rowBtnFiltroProducto)
							if $('#idProducto'+Singleton.get().rowBtnFiltroProducto).val() is $('#idProducto'+i).val() and $('#idProducto'+Singleton.get().rowBtnFiltroProducto).val() isnt ""
								$('#idProducto'+Singleton.get().rowBtnFiltroProducto).val ""
								$('#producto'+Singleton.get().rowBtnFiltroProducto).val ""
								$('#precioUnidad'+Singleton.get().rowBtnFiltroProducto).val ""
								Singleton.get().setiarPrecioTotal(Singleton.get().rowBtnFiltroProducto)
								iguales = 1 
						i++
					if iguales is 1 
						Singleton.get().showInformacion('El producto ingresado ya existe en el pedido')
					else
						$('#modal').modal 'hide'
			false

		btnGuardar: (e) =>
			e.preventDefault()
			e.stopPropagation()
			Validator= true
			restriccion= true
			Singleton.get().CountItemsExito= 0
			Singleton.get().CountItemsSave= 0

			#oculto el popover de la nueva cotización
			$('#btnFiltro').popover 'hide'

			#validamos el encabezado de la cotización=================================================================================================
			if $('#horaentrega').find(':selected').val() is ''
				Singleton.get().showInformacion('Debe Seleccionar una hora de Despacho')
				Validator= false

			if $('#validezCotizacion').val() is ''
				Singleton.get().showInformacion('Debe Seleccionar un Fecha de Despacho')
				Validator= false

			if $('#Destinatario option').length  is 0
				Singleton.get().showInformacion('No existen destinatarios asociados al Cliente')
				Validator= false

			if $('#autoc1').val() is ''
				Singleton.get().showInformacion('Debe Seleccionar un Cliente')
				Validator= false

			#========================================================================================================================================

			#validamos cada uno de los detalles de la cotización=====================================================================================
			$("#tablaItem tbody tr").each (index) ->
				#contamos los items que vamos a guardar
				Singleton.get().CountItemsSave+= 1
				$(this).children("td").each (index2) ->
					switch index2
						when 0
							#validamos la cantidad para cada item generado
							if $(this)[0].firstElementChild.value is ''
								Singleton.get().showInformacion('Existe Una Cantidad Sin Ingresar')
								Validator= false	
								break
							if !$.isNumeric($(this)[0].firstElementChild.value)
								Singleton.get().showError('Existe Una Cantidad Incorrecta')
								Validator= false
								break
						when 1
							#validamos el producto para cada item generado
							if $(this)[0].firstElementChild.value is ''
								Singleton.get().showInformacion('Existe Un Producto Sin Ingresar')
								Validator= false	
								break
						when 2
							#validamos el precio de unidad
							if $(this)[0].firstElementChild.value is ''
								Singleton.get().showInformacion('Existe Una Precio de Unidad Sin Ingresar')
								Validator= false	
								break
							if !$.isNumeric(Singleton.get().cleanValor($(this)[0].firstElementChild.value))
								Singleton.get().showError('Existe Un Precio de unidad Incorrecto')
								Validator= false
								break
			#========================================================================================================================================

			#validamos que el flete y el descuento no esten vacio y si lo estan los setiamos con valor 0 antes de grabar=============================
			if $('#CotFlete').val() is ''
				$('#CotFlete').val '0'

			if $('#CotDescuento').val() is ''
				$('#CotDescuento').val '0'

			#========================================================================================================================================

			#validamos que exista por lo menos un detalle de cotizacion==============================================================================
			if Singleton.get().CountItemsSave is 0
				Singleton.get().showError('Debe existir un detalle de cotizacion')
				Validator= false
			#========================================================================================================================================						
			#Guardando el encabezado de la cotización================================================================================================
			if Validator is true and restriccion is true	
				#mostramos el modal de espera
				Singleton.get().showLoading('Guardando Información ...')
				$.ajax
					url:"#{base_url}/index.php/services/cotizacion/grabarCotizacion"
					type:'POST'
					data:
						Id_Clase: '1'
						Cliente: $('#autoc1').val()
						Rut_Entidad: Singleton.get().cleanRut($('#DV').val())
						Fecha_Ped: Singleton.get().invertirFecha($('#fechaCotizacion').val(),'I')
						Id_Destinatario: $('#idDestinatario').val()
						FechaHoraDespacho: Singleton.get().invertirFecha($('#validezCotizacion').val(),'I')+' '+$('#horaentrega').val()
						Id_Vendedor: Singleton.get().idUsuarioLogueado
						Responsable: $('#idResponsable').val()
						Total_Flete: Singleton.get().cleanValor($('#CotFlete').val())
						Valor_Neto: Singleton.get().cleanValor($('#CotNeto').val())
						Descuento: $('#CotDescuento').val()
						Iva: Singleton.get().cleanValor($('#CotIva').val())
						Total: Singleton.get().cleanValor($('#CotTotal').val())
						Observaciones_Fabricacion: $('#obsfabr').val()
						Observaciones_Generales: $('#obsgen').val()
						Observaciones_Despacho: $('#obsdesp').val()
						Id_Subgerencia: Singleton.get().idSubgerenciaUsuarioLogueado

					statusCode:
						302: ->
							Singleton.get().reload()
					success: (id) =>

						if $.isNumeric(id)
							#guardamos los items
							cantidad= 0
							producto= ''
							precio= 0
							valorTotal= 0
							#recorremos la tabla de los items para guardarlos
							$("#tablaItem tbody tr").each (index) ->
								$(this).children("td").each (index2) ->
									switch index2
										when 0
											#cantidad
											cantidad= $(this)[0].firstElementChild.value
										when 1
											#producto
											producto= $(this)[0].childNodes[6].attributes[4].value
										when 2
											#precio
											precio= $(this)[0].firstElementChild.value
										when 3
											#valor total
											valorTotal= $(this)[0].firstElementChild.value
								$.ajax
									url:"#{base_url}/index.php/services/cotizacion/grabarItemTracking"
									type:'POST'
									data:
										Id_Pedido: id
										Cantidad: cantidad
										Id_Producto: producto
										Precio_Unitario: Singleton.get().cleanValor(precio)
										Precio_Total: Singleton.get().cleanValor(valorTotal)
										Id_Usuario: Singleton.get().idUsuarioLogueado

									statusCode:
										302: ->
											Singleton.get().reload()
									success: (result) =>
										if result is 'true'
											Singleton.get().CountItemsExito+= 1
											
										#validamos que todos los items se hayan guardado.
										if Singleton.get().CountItemsExito is Singleton.get().CountItemsSave
											Singleton.get().showInformacionmitir()
											$('#btnAceptarAdvertencia').click (e) =>
												e.preventDefault()
												e.stopPropagation()
												idUsuario= Singleton.get().idUsuarioLogueado
												idCotizacion = id
												clase = '3'
												$.ajax
													url:"#{base_url}/index.php/services/listadoCotizacion/cambiarClase/idCotizacion/#{idCotizacion}/clase/#{clase}/idUsuario/#{idUsuario}"
													type:'PUT'

													statusCode:
														302: ->
															Singleton.get().reload()
													success: (result) =>	
														if result is 'true'
															Singleton.get().showExito()
															$('#btnExito').click (e) =>
																e.preventDefault()
																e.stopPropagation()
																$('#NuevaCotizacion').removeClass('active')
																$('#ListadoCotizacion').addClass('active')
																Singleton.get().cargarListadoCotizacion()
																Singleton.get().showLoading()
																false
														else
															Singleton.get().showError('Error en la conexión con la base de datos')
													error: (data) =>
														Singleton.get().showError('Error en la conexión con la base de datos')

											$('#btnCancelarAdvertencia').click (e) =>
												e.preventDefault()
												e.stopPropagation()
												$('#NuevaCotizacion').removeClass('active')
												$('#ListadoCotizacion').addClass('active')
												Singleton.get().cargarListadoCotizacion()


									error: (data) =>
										Singleton.get().showError('Error en la conexión con la base de datos')		
						else
							Singleton.get().showError('Error en la conexión con la base de datos')
					error: (data) =>
						Singleton.get().showError('Error en la conexión con la base de datos')
			#========================================================================================================================================
			false