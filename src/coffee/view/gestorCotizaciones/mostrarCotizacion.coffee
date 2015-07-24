define [
	'backbone'
	'text!tpl/gestorCotizaciones/mostrarCotizacion.html'
	'assets/js/view/gestorCotizaciones/editarCotizacion'
] , (Backbone,TplmostrarCotizacion, viewEditarCotizacion) ->  
	class mostrarCotizacion extends Backbone.View
	
		# Cargamos la vista principal de la nueva cotizacion
		initialize : (idCotizacion) =>
			@init(idCotizacion)

		
		init : (idCotizacion) =>
			Singleton.get().showLoading()
			Contactos= ''
			item= ''
			option= '<option value="0" selected="selected">Acciones</option>'
						
			$.ajax
				url:"#{base_url}/index.php/services/cotizacion/buscarCotizacion/idCotizacion/#{idCotizacion}"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (cotizacion) =>
					$.ajax
						url:"#{base_url}/index.php/services/cotizacion/buscarItems/idCotizacion/#{idCotizacion}"
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success: (items) =>

							$('#modal').css('width',1100)	
							$('#modal').css('height',625)	
							$('#modal').css('left' ,'30%')	
							$('#modal').css('top' ,'40.5%')	
							$('#modal').html _.template(TplmostrarCotizacion)
							$('#histMailView').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})

							# if cotizacion[0].Id_Clase is '2'
								# option+='<option value="1" >Recotizar</option>'
							# 	option+='<option value="2" >Exportar a PDF</option>'
							# else
							option+='<option value="2" >Exportar a PDF</option>'

							$('#CotAccionesView').html option
							# if cotizacion[0].Id_Clase is '1' or cotizacion[0].Id_Clase is '5'
							# 	$('#CotAccionesView').attr('disabled', 'disabled');

							$('#CotAccionesView').change (e) =>
								e.preventDefault()
								e.stopPropagation()
								if $('#CotAccionesView').find(':selected').val() is '2'
									$('#ExportarPDF').attr('action','index.php/services/exportar/exportarcotPDF')
									$("#ExportarPDF").submit()


								#recotiza	
								if $('#CotAccionesView').find(':selected').val() is '1'
									Singleton.get().showAdvertencia()

									$('#btnAceptarAdvertencia').click (e) =>
										e.preventDefault()
										e.stopPropagation()

										$.ajax
											url:"#{base_url}/index.php/services/listadoCotizacion/recotizarCotizacion/idCotizacion/#{idCotizacion}/idUsuario/#{Singleton.get().idUsuarioLogueado}"
											type:'POST'
											statusCode:
												302: ->
													Singleton.get().reload()
											success: (result) =>
												if result[0] is 'true'
													Singleton.get().showExito()
													$('#btnExito').click (e) =>
														e.preventDefault()
														e.stopPropagation()
														#limpiamos los eventos del formulario antes de instanciarlo
														$(document).unbind('click')
														$(document).unbind('change')
														$(document).unbind('focus')
														$(document).unbind('focusout')
														$(document).unbind('keyup')

														#instanciamos el objeto
														editarCotizacion = new viewEditarCotizacion(result[1])
														false
												else
													Singleton.get().showError('Error en la conexión con la base de datos')
											error: (data) =>
												Singleton.get().showError('Error en la conexión con la base de datos')

									$('#btnCancelarAdvertencia').click (e) =>
										e.preventDefault()
										e.stopPropagation()
										Singleton.get().showModalCotizacion(idCotizacion)
										false


								$('#CotAccionesView option[value=0]').attr('selected',true)

							for i in items
								item += '<tr>'
								item += '<td class="td-cantidad">'
								item += '<input type="text" id="cantidad1View" class="cantidad" row="1" style="background-color: #ffffff;" disabled value="'+i.Cantidad+'">'
								item += '</td>'
								item += '<td class="td-producto">'
								item += '<input type="text" id="producto1View" class="producto" row="1" style="width:95% !important; background-color: #ffffff;margin-left:10px;" disabled value="'+i.nombreproducto+'">'
								item += '</td>'
								item += '<td class="td-precioUnidad">'
								item += '<input type="text" id="precioUnidad1View" class="precio-unidad" row="1" style="width:90% !important; background-color: #ffffff;" disabled value="'+Singleton.get().miles(i.Precio_Unitario)+'">'
								item += '</td>'
								item += '<td class="td-precioTotal">'
								item += '<input type="text" id="precioTotal1View" class="precio-total" row="1" style="width:88% !important; background-color: #ffffff; margin-left:7px;" disabled value="'+Singleton.get().miles(i.Precio_Total)+'">'
								item += '</td>'
								item += '</tr>'
							$('.tablaItemView tbody').html item
					

							$('.titulocot').html 'Pedido Nº '+cotizacion[0].Id_Pedidos

							if cotizacion[0].nombreCliente isnt null
								$('#clienteView').val cotizacion[0].nombreCliente

							if cotizacion[0].rutCliente isnt null
								$('#rutClienteView').val Singleton.get().formatearRut(cotizacion[0].rutCliente)

							if cotizacion[0].telefonoCliente isnt null
								$('#telefonoClienteView').val cotizacion[0].telefonoCliente

							$('#destinatarioView').val cotizacion[0].nombredestino
							$('#direcciondestinatarioView').val cotizacion[0].direcciondestino
							$('#telefonodestinatarioView').val cotizacion[0].telefonodestino

							$('#fechapedidoView').val cotizacion[0].Fecha_pedido
							$('#vendedorView').val cotizacion[0].nombreVendedor
							$('#responsableView').val cotizacion[0].Responsable
							$('#fechadespachoView').val cotizacion[0].FechaHoraDespacho.substring(0,10)
							$('#horadespachoView').val cotizacion[0].FechaHoraDespacho.substring(11,16)

							if cotizacion[0].Observaciones_Fabricacion isnt null
								$('#obsfView').val cotizacion[0].Observaciones_Fabricacion
							if cotizacion[0].Observaciones_Despacho isnt null
								$('#obsdView').val cotizacion[0].Observaciones_Despacho
							if cotizacion[0].Observaciones isnt null
								$('#obsgView').val cotizacion[0].Observaciones

							$('#CotFleteView').val cotizacion[0].Total_Flete
							$('#CotNetoView').val cotizacion[0].Valor_Neto
							$('#CotDescuentoView').val cotizacion[0].Descuento
							$('#CotIvaView').val cotizacion[0].Iva
							$('#CotTotalView').val cotizacion[0].Total
								
						error: (data) =>