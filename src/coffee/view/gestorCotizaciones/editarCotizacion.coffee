define [
	'backbone'
	'text!tpl/gestorCotizaciones/editarCotizacion.html'
	'text!tpl/gestorCotizaciones/modalMensaje.html'
	'text!tpl/gestorCotizaciones/modalCliente.html'
	'text!tpl/gestorCotizaciones/modalConsultorCotizacionesEdicion.html'
	'text!tpl/gestorCotizaciones/modalListaPrecio.html'
	'text!tpl/gestorCotizaciones/addRowEdicion.html'
] , (Backbone,TpleditarCotizacion, TplmodalMensaje, TplmodalCliente, TplmodalConsultorCotizaciones, TplmodalListaPrecio, TpladdRow) ->  
	class editarCotizacion extends Backbone.View
	
		# Cargamos la vista principal de la nueva cotizacion
		initialize : (idCotizacion) =>
			Singleton.get().contLin = 0
			Singleton.get().mailMensajeModal = ''
			Singleton.get().mailAsuntoModal = ''
			Singleton.get().CountRowDelete = 0
			@idCotizacion= idCotizacion
			@init()

		
		init : () =>
			Singleton.get().showLoading()
			$('#appView').css('display','none')
			$('#appViewNext').html _.template(TpleditarCotizacion)({})
			# $('.scroll').css('width',window.innerWidth - 260)
			$('.scroll').css('height',window.innerHeight - 75)
			

			#titulo
			$('.nexttitulo').html 'Editar Pedido Nº '+@idCotizacion

			#cuando hacen click en el hipervinculo, listado de cotizaciones
			$('.newTitulo').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showLoading()
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				Singleton.get().hideLoading()

			#bloqueamos el descuento para el pefil de vendedor y vendedor exterior
			if Singleton.get().idPerfilUsuarioLogueado is '4' or Singleton.get().idPerfilUsuarioLogueado is '5'
				$('#CotDescuentoEdicion').attr('disabled','disabled')

			#setiamos el campo fech cot. con la fecha actual
			fecha= new Date()
			dia= fecha.getDate()
			mes= fecha.getMonth() + 1
			ano= fecha.getFullYear()
			if dia<10
				dia= '0' + dia
			if mes<10
				mes= '0' + mes

			$("#fechaCotizacionEditar").attr('value',dia+'/'+mes+'/'+ano)

# 			#cargamos los usos
# 			@cargarUso()

# 			#cargamos las subgerencias
# 			@cargarSubgerencia()

# 			#cargamos los datos del usuario segun su perfil de usuario
			@cargarVendedor()

# 			#cargamos los origenes de la cotizacion
# 			@cargarOrigen()

# 			#cargamos los datos de la cotizacion seleccionada para ser editada
			@cargarCotizacion()

			#validamos que solo ingresen numero en la cantidad
			$('.cantidadEdicion').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)
			#validamos que solo ingresen numero en el precio
			$('.precio-unidadEdicion').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)
			#validamos que solo ingresen numero en el valor del flete
			$('#CotFleteEdicion').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)
			#validamos que solo ingresen numero en el % de descuento
			$('#CotDescuentoEdicion').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

# 			#aplicando el estilo a los tooltip
			$('#btnFiltro').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#newMail').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#histMail').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#buscarClienteEditar').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#bntAddRow').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#btnAddDestinatario').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#btnAddCliente').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})

			$('.btnfiltroArticulo').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('.btnfiltro-producto').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('.btnfiltro-precio').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			
			
			$('#validezCotizacionEditar').datepicker
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

							fechainvertida = Singleton.get().invertirFecha($('#validezCotizacionEditar').val(),'I')
							fechadespacho = fechainvertida.slice(0,4)
							fechadespacho += fechainvertida.slice(5,7)
							fechadespacho += fechainvertida.slice(8,10)

							if  parseInt(fechasistema)<=parseInt(fechadespacho)
								#obtenemos los repartdiores disponibles para ese dia
								fecha = Singleton.get().invertirFecha($('#validezCotizacionEditar').val(),'I')

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
											#defecto 1 repartidor
											@repartidoresdia = repartidoresdia = 1
								@setiarhorasdespacho()
							else
								Singleton.get().showInformacion('La fecha ingresada no es valida')
								$('#validezCotizacionEditar').val ""
								$('#horaentregaEditar').html '<option value="">Seleccione</option>'
							false					

			#revisamos si el producto es valido y si existe ya en el pedido
			$(document).on "focusout", ".productoEdicion", (e) ->
				console.log 'pasa x aqui'
				i = 1
				e.preventDefault()
				e.stopPropagation()
				if $('#idproducto'+e.currentTarget.attributes['row'].value).val() is "" and $('#producto'+e.currentTarget.attributes['row'].value).val() isnt ""
					Singleton.get().showInformacion('El producto ingresado no es valido')
					$('#producto'+e.currentTarget.attributes['row'].value).val ""
					$('#precioUnidad'+e.currentTarget.attributes['row'].value).val ""
					Singleton.get().setiarPrecioTotalEditar(e.currentTarget.attributes['row'].value)
				while i <= Singleton.get().contLin
					if i != parseInt(e.currentTarget.attributes['row'].value)
						if $('#idproducto'+e.currentTarget.attributes['row'].value).val() is $('#idproducto'+i).val() and $('#idproducto'+e.currentTarget.attributes['row'].value).val() isnt ""
							Singleton.get().showInformacion('El producto ingresado ya existe en el pedido')
							$('#idproducto'+e.currentTarget.attributes['row'].value).val ""
							$('#producto'+e.currentTarget.attributes['row'].value).val ""
							$('#precioUnidad'+e.currentTarget.attributes['row'].value).val ""
							Singleton.get().setiarPrecioTotalEditar(e.currentTarget.attributes['row'].value)
					i++	
				false

			#cuando este tipeando el producto seteamos su indice
			$(document).on "keyup", ".productoEdicion", (e) ->
				e.preventDefault()
				e.stopPropagation()
				if event.keyCode isnt 13
					$('#idproducto'+e.currentTarget.attributes['row'].value).val ""
				false

			$(document).on "change", '#horaentregaEditar', (e) =>
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

						fechainvertida = Singleton.get().invertirFecha($('#validezCotizacionEditar').val(),'I')
						fechadespacho = fechainvertida.slice(0,4)
						fechadespacho += fechainvertida.slice(5,7)
						fechadespacho += fechainvertida.slice(8,10)

						if 	parseInt(fechasistema) is parseInt(fechadespacho)
							if parseInt(horasistema)>parseInt($('#horaentregaEditar').val().substr(0, 2))
								Singleton.get().showInformacion('Combinacion de Fecha y Hora no valida')
								$('#horaentregaEditar').val ""
							else
								if parseInt(horasistema) == parseInt($('#horaentregaEditar').val().substr(0, 2)) and parseInt(minutossistema)>30
									Singleton.get().showInformacion('Combinacion de Fecha y Hora no valida')
									$('#horaentregaEditar').val "" 
						false

			$(document).on "click", ".clsEliminarFilaEdicion", (e) ->
				e.preventDefault()
				e.stopPropagation()
				objFila = $(this).parents().get(1)
				$(objFila).remove()
				#guardamos los id de los items eliminados en un arreglo para luego ser eliminados en la BD
				if $(this).parents().get(1).attributes['iditem'].value isnt 'New'
					Singleton.get().RowDelete[Singleton.get().CountRowDelete] = $(this).parents().get(1).attributes['iditem'].value
					Singleton.get().CountRowDelete+= 1
				false

			#actualizamos el tfoot cuando se elimina una fila (row)
			$(document).on "click", ".updateTfootEdicion", (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().setiarDescuentoEditar()
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
				$('#modal').css('width',475)	
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

			$(document).on "focus", ".productoEdicion", (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().inFocusIdProducto= e.currentTarget.value
				false

			$(document).on "keyup", ".cantidadEdicion", (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().setiarPrecioTotalEditar(e.currentTarget.attributes['row'].value)
				false

			$(document).on "focusout", ".cantidadEdicion", (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().setiarPrecioTotalEditar(e.currentTarget.attributes['row'].value)
				false


			$(document).on "keyup", ".precio-unidadEdicion", (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#precioUnidad'+e.currentTarget.attributes['row'].value).val Singleton.get().formatMiles(e.currentTarget.value)
				Singleton.get().setiarPrecioTotalEditar(e.currentTarget.attributes['row'].value)
				false

			$(document).on "focusout", ".precio-unidadEdicion", (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#precioUnidad'+e.currentTarget.attributes['row'].value).val Singleton.get().formatMiles(e.currentTarget.value)
				Singleton.get().setiarPrecioTotalEditar(e.currentTarget.attributes['row'].value)
				false

			$(document).on "keyup","#CotFleteEdicion", (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#CotFleteEdicion').val Singleton.get().formatMiles($('#CotFleteEdicion').val())
				Singleton.get().setiarNetoEditar()
				false

			#validamos que el valor del flete sea numerico
			$(document).on "focusout", "#CotFleteEdicion", (e) =>
				e.preventDefault()
				e.stopPropagation()
				
				if $('#CotFleteEdicion').val() isnt '' 		
					if !$.isNumeric(Singleton.get().cleanValor($('#CotFleteEdicion').val()))
						Singleton.get().showError('El Valor del Flete Ingresado es Incorrecto')
						$('#CotFleteEdicion').val '0'
					else
						$('#CotFleteEdicion').val Singleton.get().formatMiles($('#CotFleteEdicion').val())
						Singleton.get().setiarNetoEditar()
				false

			$(document).on "keyup","#CotDescuentoEdicion", (e) =>
				e.preventDefault()
				e.stopPropagation()
		
				if Number(Singleton.get().cleanValor($('#CotDescuentoEdicion').val())) >100
					Singleton.get().showError('El Porcentaje Ingresado Es Incorrecto')
					$('#CotDescuentoEdicion').val '0'
				else
					$('#CotDescuentoEdicion').val Singleton.get().formatMiles($('#CotDescuentoEdicion').val())
					Singleton.get().setiarDescuentoEditar()
				false

			$(document).on "focusout", "#CotDescuentoEdicion", (e) =>
				e.preventDefault()
				e.stopPropagation()
				
				if $('#CotDescuentoEdicion').val() isnt ''
					if !$.isNumeric(Singleton.get().cleanValor($('#CotDescuentoEdicion').val()))
						Singleton.get().showError('El % de Descuento Ingresado es Incorrecto')
						$('#CotDescuentoEdicion').val '0'
					else
						if Number(Singleton.get().cleanValor($('#CotDescuentoEdicion').val())) >100
							Singleton.get().showError('El Porcentaje Ingresado Es Incorrecto')
							$('#CotDescuentoEdicion').val '0'
						else
							$('#CotDescuentoEdicion').val Singleton.get().formatMiles($('#CotDescuentoEdicion').val())
							Singleton.get().setiarDescuentoEditar()
				false

			$(document).on "focusout", "#autoc1Editar", (e) =>
				e.preventDefault()
				e.stopPropagation()
				if $('#autoc1Editar').val() is ''
					$('#DVEditar').val ''
					$('#TelefonoClienteEditar').val ''
					$('#DestinatarioEditar').empty()
					$('#DireccionDestinatarioEditar').val ''
					$('#TelefonoDestinatarioEditar').val ''
					$('#CotFleteEdicion').val '0'
					$('#validezCotizacionEditar').val ""
					$('#validezCotizacionEditar').attr('disabled','disabled')
					$('#horaentregaEditar').html '<option value="">Seleccione</option>' 
					Singleton.get().setiarFleteEditar()
				false

			$(document).on "keyup", "#autoc1Editar", (e) =>
				if event.keyCode isnt 13
					e.preventDefault()
					e.stopPropagation()
					$('#DVEditar').val ''
					$('#TelefonoClienteEditar').val ''
					$('#DestinatarioEditar').empty()
					$('#DireccionDestinatarioEditar').val ''
					$('#TelefonoDestinatarioEditar').val ''
					$('#CotFleteEdicion').val '0'
					$('#validezCotizacionEditar').val ""
					$('#validezCotizacionEditar').attr('disabled','disabled')
					$('#horaentregaEditar').html '<option value="">Seleccione</option>' 
					Singleton.get().setiarFleteEditar()
				false

# 			#validamos que la orden de compra sea numerico
# 			$(document).on "focusout", "#cotOrdenCompra", (e) =>
# 				e.preventDefault()
# 				e.stopPropagation()
				
# 				if $('#cotOrdenCompra').val() isnt ''		
# 					if !$.isNumeric(Singleton.get().cleanValor($('#cotOrdenCompra').val()))
# 						Singleton.get().showError('La Orden de Compra Ingresada es Incorrecta')
# 						$('#cotOrdenCompra').val ''

# 				false

			$('#bntAddRow').click (e) =>
				@agregarFila(e)

			$('#btnAddCliente').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showModalAddClienteEditar()

			$('#btnAddDestinatario').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				if $('#DVEditar').val() isnt ''
					Singleton.get().showModalAddDestinatarioEditar()
				else
					Singleton.get().showInformacion('Debe seleccionar un cliente')

			$('#buscarClienteEditar').click (e) =>
				@showModalCliente(e)			

			$('#guardar' ).click (e) =>
				@btnGuardar(e)

			$('#DestinatarioEditar').change (e) =>
				e.preventDefault()
				e.stopPropagation()
				@datosdestinatario()

			$('#cancelar' ).click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showLoading()
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				Singleton.get().hideLoading()

			#autocomplete cliente ==================================================================================
			#funcion que envia el id del cliente
			log = (rut,nombre,telefono) =>
				$('#DVEditar').val Singleton.get().formatearRut(rut)
				$('#autoc1Editar').val nombre
				$('#TelefonoClienteEditar').val telefono
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
							$('#DestinatarioEditar').html option
							@datosdestinatario()
						else
							$('#DestinatarioEditar').html ""
							$('#DireccionDestinatarioEditar').val ""
							$('#TelefonoDestinatarioEditar').val ""
							$('#idDestinatarioEditar').val ""
							$('#CotFleteEdicion').val 0
							Singleton.get().setiarFleteEditar()
					error: (data) =>
						$('#DestinatarioEditar').html ""
						$('#DireccionDestinatarioEditar').val ""
						$('#TelefonoDestinatarioEditar').val ""
						$('#idDestinatarioEditar').val ""
						$('#CotFleteEdicion').val 0
						Singleton.get().setiarFleteEditar()
				
						

			$("#autoc1Editar").autocomplete
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
							$('#autoc1Editar').removeClass("ui-autocomplete-loading")
							$('#autoc1Editar').autocomplete( "close" )
							$('#tablaContactos tbody').empty()
							$('#DVEditar').val ''
							$('#TelefonoClienteEditar').val ''

				minLength: 1,

				select: (event, ui) ->
					if ui.item
						log(ui.item.rut,ui.item.value,ui.item.telefono)
				open: ->
					$('#autoc1Editar').removeClass("ui-autocomplete-loading")
				close: ->
					$('#autoc1Editar').removeClass("ui-autocomplete-loading")

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
			$('#modal').css('width',490)	
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
							
		setiarhorasdespacho :() =>
			htmlhoras = '<option value="">Seleccione</option>'
			#seteamos las hotas a utilizar
			hora = new Array(1) 
			hora[0] = "<option>09:30</option>"
			hora[1] = "<option>10:30</option>"
			hora[2] = "<option>11:30</option>"
			hora[3] = "<option>12:30</option>"
			hora[4] = "<option>13:30</option>"
			hora[5] = "<option>14:30</option>"
			hora[6] = "<option>15:30</option>"
			hora[7] = "<option>16:30</option>"
			hora[8] = "<option>17:30</option>"
			hora[9] = "<option>18:30</option>"
			hora[10] = "<option>19:30</option>"
			if @disponibilidad is ""
				#muestra todas las horas disponibles del dia
				i = 0
				while i< 11
					htmlhoras = htmlhoras + hora[i]
					i++
				$('#horaentregaEditar').html htmlhoras
			else
				i = 0
				while i < 11
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
				$('#horaentregaEditar').html htmlhoras
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
							#validamos que exista un precio y que sea numerico
							if $(this)[0].firstElementChild.value is ''
								Singleton.get().showInformacion('Existe Un Precio Unidad Sin Ingresar')
								Validator= false	
								break
							if !$.isNumeric(Singleton.get().cleanValor($(this)[0].firstElementChild.value))
								Singleton.get().showError('Existe Un Precio Unidad Incorrecto')
								Validator= false
								break							

			#==========================================================================================================================================

			if Validator is true
				#incrementamos una fila
				Singleton.get().contLin++
				#agregamos la nueva fila a la tabla
				$('#tablaItem').find("tbody").append _.template(TpladdRow)({contLin:Singleton.get().contLin,newItem:'New'})
				$('.precio-unidadEdicion').attr('disabled','disabled')
				#validamos que solo ingresen numeros
				$('.cantidadEdicion').keydown (event) ->
					if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
						return
					else
						event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

				#validamos que solo ingresen numero en el precio
				$('.precio-unidadEdicion').keydown (event) ->
					if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
						return
					else
						event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)


				idUsuario= Singleton.get().idUsuarioLogueado
				#autocomplete del producto==============================================================================
				$(".productoEdicion").autocomplete
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
								$('.productoEdicion').removeClass("ui-autocomplete-loading")
								$('.productoEdicion').autocomplete( "close" )
					
					minLength: 1,
					select: (event, ui) ->
						if ui.item
							indice = event.target.id.split("producto")
							$('#idproducto'+indice[1]).val ui.item.id
							$('#precioUnidad'+indice[1]).val Singleton.get().formatMiles(ui.item.precio)
							Singleton.get().setiarPrecioTotalEditar(indice[1])
					open: ->
						$('.productoEdicion').removeClass("ui-autocomplete-loading")
					close: ->
						$('.productoEdicion').removeClass("ui-autocomplete-loading")
				#=======================================================================================================
				$('.btnfiltro-producto').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
				#=======================================================================================================
			false

		cargarVendedor :() =>
			idUsuario= Singleton.get().idUsuarioLogueado
			perfil= Singleton.get().perfilUsuarioLogueado
			usuariolog= Singleton.get().nombreUsuarioLogueado
			idSupervisor= Singleton.get().idSupervisorUsuarioLogueado
			idSubgerencia= Singleton.get().idSubgerenciaUsuarioLogueado
			
			$('#cotVendedor').attr('disabled', 'disabled');
			$('#nomVendedorEditar').val usuariolog
			
			$.ajax
				url:"#{base_url}/index.php/services/cotizacion/buscarUsuario/id/#{idSupervisor}"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(usuario) =>
					if usuario.error != '202'
						$('#cotResponsableEditar').val usuario[0].Nombre
						$('#idResponsableEditar').val idSupervisor
					else
						$('#cotResponsableEditar').val usuariolog
						$('#idResponsableEditar').val idUsuario
				error:(data) =>
					$('#cotResponsableEditar').val usuariolog
					$('#idResponsableEditar').val idUsuario
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
					$('#DVEditar').val Singleton.get().formatearRut(rutCliente)
					option = ''
					#$('#autoc1').val nombreCiente
					$.ajax
						url:"#{base_url}/index.php/services/cotizacion/buscarRut/id/#{rutCliente}"
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success: (cliente) =>
							$('#autoc1Editar').val cliente[0].Nombre
							$('#TelefonoClienteEditar').val cliente[0].Telefono
						error: (data) =>

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
								$('#DestinatarioEditar').html option

								id = $('#DestinatarioEditar').val()
								$.ajax
									url:"#{base_url}/index.php/services/cotizacion/buscardatosDestinatario/id/#{id}"
									type:'GET'
									async: false
									statusCode:
										302: ->
											Singleton.get().reload()
									success: (destino) =>
										$('#idDestinatarioEditar').val id
										$('#DireccionDestinatarioEditar').val destino[0].Direccion
										if destino[0].Telefono isnt '0'
											$('#TelefonoDestinatarioEditar').val destino[0].Telefono
										else
											$('#TelefonoDestinatarioEditar').val ""
										$('#CotFleteEdicion').val destino[0].PrecioFlete
										$('#validezCotizacionEditar').val ""
										$('#horaentregaEditar').html '<option value="">Seleccione</option>'
										$('#validezCotizacionEditar').removeAttr('disabled')
										Singleton.get().idsector = destino[0].Id_Sector
							else
								$('#DestinatarioEditar').html ""
								$('#idDestinatarioEditar').val ""
								$('#DireccionDestinatarioEditar').val ""
								$('#TelefonoDestinatarioEditar').val ""
								$('#CotFleteEdicion').val "0"

						error: (data) =>
							$('#DestinatarioEditar').html ""
							$('#idDestinatarioEditar').val ""
							$('#DireccionDestinatarioEditar').val ""
							$('#TelefonoDestinatarioEditar').val ""


			$('#modal').modal 'hide'
			Singleton.get().setiarFleteEditar()
			#aplicando tooltips a la tabla de contactos
			$('.put-tooltips').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			#setiamos los valores del foot (el valor del flete segun el consignatario que tenga como principal)
			#@setiarFlete()
			false


		# 	cargamos los datos del destinatario seleccionado
		datosdestinatario : () =>
			id = $('#DestinatarioEditar').val()
			$.ajax
				url:"#{base_url}/index.php/services/cotizacion/buscardatosDestinatario/id/#{id}"
				type:'GET'
				async: false
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (destino) =>
					$('#idDestinatarioEditar').val id
					$('#DireccionDestinatarioEditar').val destino[0].Direccion
					if destino[0].Telefono isnt '0'
						$('#TelefonoDestinatarioEditar').val destino[0].Telefono
					else
						$('#TelefonoDestinatarioEditar').val ""
					$('#CotFleteEdicion').val destino[0].PrecioFlete
					$('#validezCotizacionEditar').val ""
					$('#horaentregaEditar').html '<option value="">Seleccione</option>'
					$('#validezCotizacionEditar').removeAttr('disabled')
					Singleton.get().idsector = destino[0].Id_Sector
					Singleton.get().setiarFleteEditar()
				error: (data) =>
			false

		modalBuscarProducto : (e) =>
			e.preventDefault()
			e.stopPropagation()

			#idUsuario= Singleton.get().idUsuarioLogueado
			nombreProducto = $('#inputModalBuscarCliente').val()
			
			radioOption = ''
			$.ajax
				url:"#{base_url}/index.php/services/restricciones/buscarProducto/nombre/#{nombreProducto}"
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
					$('#idproducto'+Singleton.get().rowBtnFiltroProducto).val idPro
					$('#producto'+Singleton.get().rowBtnFiltroProducto).css('background-color','#ffffff')
					$('#precioUnidad'+Singleton.get().rowBtnFiltroProducto).val Singleton.get().formatMiles(precio)
					Singleton.get().setiarPrecioTotalEditar(Singleton.get().rowBtnFiltroProducto)
					while i <= Singleton.get().contLin
						if i != parseInt(Singleton.get().rowBtnFiltroProducto)
							if $('#idproducto'+Singleton.get().rowBtnFiltroProducto).val() is $('#idproducto'+i).val() and $('#idproducto'+Singleton.get().rowBtnFiltroProducto).val() isnt ""
								$('#idproducto'+Singleton.get().rowBtnFiltroProducto).val ""
								$('#producto'+Singleton.get().rowBtnFiltroProducto).val ""
								$('#precioUnidad'+Singleton.get().rowBtnFiltroProducto).val ""
								Singleton.get().setiarPrecioTotalEditar(Singleton.get().rowBtnFiltroProducto)
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
			if $('#autoc1Editar').val() is ''
				Singleton.get().showInformacion('Debe Seleccionar un Cliente')
				Validator= false

			if $('#DestinatarioEditar option').length  is 0
				Singleton.get().showInformacion('No existen destinatarios asociados al Cliente')
				Validator= false

			if $('#validezCotizacionEditar').val() is ''
				Singleton.get().showInformacion('Debe Seleccionar un Fecha de Despacho')
				Validator= false

			if $('#horaentregaEditar').find(':selected').val() is ''
				Singleton.get().showInformacion('Debe Seleccionar una hora de Despacho')
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
							#validamos si existen  productos inactivos en el pedido
							if $('#idproducto'+(index+1)).val() is '0'
								$('#producto'+(index+1)).css('background-color','#f5c0bb')
								Singleton.get().showInformacion('Existe productos inactivos en el pedido')
								Validator= false	
								break

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
			if $('#CotFleteEdicion').val() is ''
				$('#CotFleteEdicion').val '0'

			if $('#CotDescuentoEdicion').val() is ''
				$('#CotDescuentoEdicion').val '0'

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
					url:"#{base_url}/index.php/services/cotizacion/actualizarCotizacion"
					type:'POST'
					data:
						Id_Clase: '1'
						Id_Pedidos: @idCotizacion
						Cliente: $('#autoc1Editar').val()
						Rut_Entidad: Singleton.get().cleanRut($('#DVEditar').val())
						Fecha_Ped: Singleton.get().invertirFecha($('#fechaCotizacionEditar').val(),'I')
						Id_Destinatario: $('#DestinatarioEditar').val()
						FechaHoraDespacho: Singleton.get().invertirFecha($('#validezCotizacionEditar').val(),'I')+' '+$('#horaentregaEditar').val()
						Id_Vendedor: Singleton.get().idUsuarioLogueado
						Responsable: $('#idResponsableEditar').val()
						Total_Flete: Singleton.get().cleanValor($('#CotFleteEdicion').val())
						Valor_Neto: Singleton.get().cleanValor($('#CotNeto').val())
						Descuento: $('#CotDescuentoEdicion').val()
						Iva: Singleton.get().cleanValor($('#CotIva').val())
						Total: Singleton.get().cleanValor($('#CotTotal').val())
						Observaciones_Fabricacion: $('#obsfabr').val()
						Observaciones_Generales: $('#obsgen').val()
						Observaciones_Despacho: $('#obsdesp').val()
						Id_Subgerencia: Singleton.get().idSubgerenciaUsuarioLogueado

					statusCode:
						302: ->
							Singleton.get().reload()

					success: (result) =>
						if result is true

							#eliminamos las filas que el usuario a eliminado, en la BD
							if Singleton.get().RowDelete.length isnt 0
								#convierto el arreglo de filas eliminadas en un  objeto
								jObject = {}
								for i of Singleton.get().RowDelete
									jObject[i] = Singleton.get().RowDelete[i]

								#serializo el json
								jObject= JSON.stringify(jObject) 

								#envio la peticion
								$.ajax
									url:"#{base_url}/index.php/services/cotizacion/deleteRowItem"
									type:'POST'
									data:
										jObject: jObject
							
							#asignamos el id de la cotizacion en una variable para poder ser accedida en los siguientes metodos.
							id= @idCotizacion
							#guardamos los items que se han creado y actualizamos los editados
							cantidad= 0
							producto= ''
							precio= 0
							valorTotal= 0
							#recorremos la tabla de los items para guardarlos
							$("#tablaItem tbody tr").each (index) ->
								idItem= $(this)[0].attributes['iditem'].value
								$(this).children("td").each (index2) ->
									switch index2
										when 0
											#cantidad
											cantidad= $(this)[0].firstElementChild.value
										when 1
											if idItem is 'New'
												producto= $(this)[0].childNodes[4].attributes[4].value
											else
												producto= $(this)[0].childNodes[2].attributes[2].value

										when 2
											#precio
											precio= $(this)[0].firstElementChild.value
										when 3
											#valor total
											valorTotal= $(this)[0].firstElementChild.value
								$.ajax
									url:"#{base_url}/index.php/services/cotizacion/actualizarItemTracking"
									type:'POST'
									data:
										Id_Pedido: id
										Id_ItemPedido:idItem
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
											Singleton.get().showExito()
											$('#btnExito').click (e) =>
												e.preventDefault()
												e.stopPropagation()
												Singleton.get().cargarListadoCotizacion()
									error: (data) =>
										#Singleton.get().showError('Error en la conexión con la base de datos')
										Singleton.get().showError('Error 1')
									
						else
							Singleton.get().showError('Error 2')
					error: (data) =>
						Singleton.get().showError('Error 3')
			#========================================================================================================================================
			
			false

		cargarCotizacion: () =>
			checkContacto= ''
			option= '<option value="0" selected="selected">Seleccione</option>'
			row= ''

			$.ajax
				url:"#{base_url}/index.php/services/cotizacion/buscarCotizacion/idCotizacion/#{@idCotizacion}"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (cotizacion) =>

					#buscamos los items del pedido
					$.ajax
						url:"#{base_url}/index.php/services/cotizacion/buscarItems/idCotizacion/#{@idCotizacion}"
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success: (items) =>
							for i in items
								#incrementamos una fila
								Singleton.get().contLin++

								row+='<tr iditem="'+i.Id_ItemPedido+'">'
								row+='<td class="td-cantidad">'
								row+='<input type="text" id="cantidadEdicion'+Singleton.get().contLin+'" class="cantidadEdicion" row="'+Singleton.get().contLin+'" value="'+i.Cantidad+'">'
								row+='</td>'
								row+='<td class="td-producto">'
								row+='<input type="text" id="producto'+Singleton.get().contLin+'" class="productoEdicion" row="'+Singleton.get().contLin+'" value="'+i.nombreproducto+'">'
								if i.estadoproducto	is 'Activo'
									row+='<input type="hidden"  id="idproducto'+Singleton.get().contLin+'" value="'+i.Id_Producto+'">'
								else
									row+='<input type="hidden"  id="idproducto'+Singleton.get().contLin+'" value="'+0+'">' 	
								row+='<div class="btnfiltro-producto" row="'+Singleton.get().contLin+'" title="Buscador de Productos"></div>'
								row+='</td>'
								row+='<td class="td-precioUnidad">'
								row+='<input type="text" id="precioUnidad'+Singleton.get().contLin+'" class="precio-unidadEdicion" row="'+Singleton.get().contLin+'" value="'+Singleton.get().miles(i.Precio_Unitario)+'">'
								row+='</td>'
								row+='<td class="td-precioTotal">'
								row+='<input type="text" id="precioTotal'+Singleton.get().contLin+'" class="precio-total" row="'+Singleton.get().contLin+'" disabled value="'+Singleton.get().miles(i.Precio_Total)+'">'
								row+='</td>'
								row+='<td class="td-delete">'
								row+='<div class="clsEliminarFilaEdicion updateTfootEdicion" id="btndelete" row="'+Singleton.get().contLin+'"> </div>'
								row+='</td>'
								row+='</tr>'

								#agregamos la fila nueva
								$('#tablaItem tbody').append row
								#limpiamos la variable para el siguiente item
								row= ''

								#validamos que solo ingresen numeros
								$('.cantidadEdicion').keydown (event) ->
									if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
										return
									else
										event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

								#validamos que solo ingresen numero en el precio
								$('.precio-unidadEdicion').keydown (event) ->
									if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
										return
									else
										event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

								$(document).on "focus", ".productoEdicion", (e) ->
									e.preventDefault()
									e.stopPropagation()
									$(this).css('background-color','#ffffff')
									false


								idUsuario= Singleton.get().idUsuarioLogueado
								#autocomplete del producto==============================================================================
								$(".productoEdicion").autocomplete
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
												$('.productoEdicion').removeClass("ui-autocomplete-loading")
												$('.productoEdicion').autocomplete( "close" )
									
									minLength: 1,
									select: (event, ui) ->
										if ui.item
											indice = event.target.id.split("producto")
											$('#idproducto'+indice[1]).val ui.item.id
											$('#precioUnidad'+indice[1]).val Singleton.get().formatMiles(ui.item.precio)
											Singleton.get().setiarPrecioTotalEditar(indice[1])
									open: ->
										$('.productoEdicion').removeClass("ui-autocomplete-loading")
									close: ->
										$('.productoEdicion').removeClass("ui-autocomplete-loading")
								#=======================================================================================================


								#setiamos el select del destino segun el usuario que se a seleccionado=================================
								idRut= new String($('#DVEditar').val()).substr(0, 2) + new String($('#DVEditar').val()).substr(3, 3) + new String($('#DVEditar').val()).substr(7, 3)
								option= '<option value="0" selected="selected">Seleccione</option>'
								
								#=======================================================================================================
								#setiamos los title para darle apariencia de tooltips
								$('.btnfiltro-producto').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
								#=======================================================================================================
								#validamos la restriccion de editar precios
								# @restriccionEditarPrecio('#precioUnidad'+Singleton.get().contLin)

							#cargamos los datos del cliente
							if cotizacion[0].rutCliente isnt null
								$('#DVEditar').val Singleton.get().formatearRut(cotizacion[0].rutCliente)
							if cotizacion[0].nombreCliente isnt null
								$('#autoc1Editar').val cotizacion[0].nombreCliente
							if cotizacion[0].telefonoCliente isnt '0'
								$('#TelefonoClienteEditar').val cotizacion[0].telefonoCliente
							else
								$('#TelefonoClienteEditar').val ""
							if cotizacion[0].direcciondestino isnt null
								$('#DireccionDestinatarioEditar').val cotizacion[0].direcciondestino
							if cotizacion[0].telefonodestino isnt '0'
								$('#TelefonoDestinatarioEditar').val cotizacion[0].telefonodestino
							else
								$('#TelefonoDestinatarioEditar').val ""

							if cotizacion[0].FechaHoraDespacho.substring(11,16) isnt null
								hora = new Array(1) 
								hora[0] = "<option>09:30</option>"
								hora[1] = "<option>10:30</option>"
								hora[2] = "<option>11:30</option>"
								hora[3] = "<option>12:30</option>"
								hora[4] = "<option>13:30</option>"
								hora[5] = "<option>14:30</option>"
								hora[6] = "<option>15:30</option>"
								hora[7] = "<option>16:30</option>"
								hora[8] = "<option>17:30</option>"
								i = 0
								while i< 9
									if  parseInt(cotizacion[0].FechaHoraDespacho.substring(11,13)) is parseInt(hora[i].substring(8,10))
										$("#horaentregaEditar").html hora[i]
									i++
								
							#cargamos las observaciones
							if cotizacion[0].Observaciones_Fabricacion isnt null
								$('#obsfabr').val cotizacion[0].Observaciones_Fabricacion

							if cotizacion[0].Observaciones_Despacho isnt null
								$('#obsdesp').val cotizacion[0].Observaciones_Despacho

							if cotizacion[0].Observaciones isnt null
								$('#obsgen').val cotizacion[0].Observaciones

							#cargamos el tfoot de la cotización
							if cotizacion[0].Total_Flete isnt null
								$('#CotFleteEdicion').val Singleton.get().miles(cotizacion[0].Total_Flete)

							$('#CotNeto').val Singleton.get().miles(cotizacion[0].Valor_Neto)
							$('#CotDescuentoEdicion').val cotizacion[0].Descuento
							$('#CotIva').val Singleton.get().miles(cotizacion[0].Iva)
							$('#CotTotal').val Singleton.get().miles(cotizacion[0].Total)
	
							#cargamos la fecha de despacho
							$('#validezCotizacionEditar').val Singleton.get().invertirFecha(cotizacion[0].FechaHoraDespacho.substring(0,10))


							#cargamos los destinos y seleccionamos el que tenia el pedido
							if cotizacion[0].rutCliente isnt null
								$.ajax
									url:"#{base_url}/index.php/services/cotizacion/buscarDestinatario/id/#{cotizacion[0].rutCliente}"
									type:'GET'
									statusCode:
										302: ->
											Singleton.get().reload()
									success: (destino) =>
										for d in destino
											option+= '<option value="' + d.Id_Destino + '" selected="selected">' + d.Nombre_Contacto + '</option>'
										$('#DestinatarioEditar').html option
										$('#DestinatarioEditar option[value='+cotizacion[0].Id_Destinatario+']').attr('selected',true)
									error: (data) =>
										$('#DestinatarioEditar').empty()		

							#ocultamos el div del listado de cotizaciones y descargamos el modal de espera
							$('#appView').css('display','none')
							$('.precio-unidadEdicion').attr('disabled','disabled')
							Singleton.get().hideLoading()
			false
