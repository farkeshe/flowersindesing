define [
	'backbone'
	'text!tpl/listadoCotizaciones/viewList.html'
	'text!tpl/listadoCotizaciones/viewFiltro.html'
	'text!tpl/gestorCotizaciones/modalCliente.html'
	'assets/js/view/paginador'
	'text!tpl/listadoCotizaciones/viewReasignar.html'
	'text!tpl/listadoCotizaciones/viewDespachar.html'
	'text!tpl/listadoCotizaciones/viewEntregar.html'
	'text!tpl/listadoCotizaciones/comentariosEntregada.html'
	'text!tpl/listadoCotizaciones/comentariosAnulada.html'
	'assets/js/view/gestorCotizaciones/editarCotizacion'
	'assets/js/view/historialCotizaciones/tracking'
	'assets/js/model/comentarios'
] , (Backbone,TplviewList, TplviewFiltro, TplmodalCliente, Paginador, TplviewReasignar, TplviewDespachar, TplviewEntregar,tplcomentariosEntregada,tplcomentariosAnulada, viewEditarCotizacion, viewTracking,ComentariosModel) ->  
	class verLista extends Backbone.View

		# Cargamos la vista principal de la lista de cotizaciones
		initialize : () =>
			#inicializamos el paginador
			@paginador = new Paginador()
			#cargar listado segun perfil y usuario logueado
			Singleton.get().showLoading()
			@objData=
				{
					idClase: '0'
					idVendedor: '0'
					idCliente: ''
					idDestinatario: '0'
					idCentroNegocio: '0'
					idForma: '0'
					idProducto: '0'
					fechaDesde: ''
					fechaHasta: ''
					idPerfil: Singleton.get().idPerfilUsuarioLogueado
					idUsuario: Singleton.get().idUsuarioLogueado
					start: '0'
				}
			#cargamos los templates y sus metodos
			@init()
			#setiamos el paginador
			@initPaginador()
			#cargamos las cotizaciones existentes segun el usuario que ha ingresado
			@filtrarListado()
		
		init : () =>
			#cargamos los template=====================================================================================================================
			$('#appView').html _.template(TplviewFiltro)({})
			##HACER LA CONSULTA A
			$('#filtroResultados').html _.template(TplviewList)({})
			#==========================================================================================================================================			

			#setiamos los tooltips
			$('#next').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})		
			$('#previous').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#buscarCliente').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})	

		# 	#desactivamos los filtros de vendedor y responsable si el perfil de usuario no es gerente
			if Singleton.get().idPerfilUsuarioLogueado isnt '2' 
				#$('#filtroResponsable').attr('disabled', 'disabled');
				$('#flitroVendedor').attr('disabled', 'disabled');

			# $('.scroll').css('width',window.innerWidth - 260)
			$('.scroll').css('height',window.innerHeight - 75)
					
			$('#fechaDesde').datepicker
				dateFormat: "dd/mm/yy"
				dayNamesMin: [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa" ]
				monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ]

			$('#fechaHasta').datepicker
				dateFormat: "dd/mm/yy"
				dayNamesMin: [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa" ]
				monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ]

			$('#filtrar').click (e) =>
				@showfiltrar(e)
			
			$('#buscarCliente').click (e) =>
				@showModalCliente(e)

			$('#acciones').change (e) =>
				@showacciones(e)

			#cargando el filtro de clase
			@cargarFiltroClase()

		# 	#cargando el filtro de responsables
			# @cargarFiltroResponsable()

			#cargando el filtro de productos por defecto (*)
			@cargarFiltroProducto()

			#cargando el filtro de vendedores (*)
			@cargarFiltroVendedor()

			$('#autoc1').focusout (e) =>
				e.preventDefault()
				e.stopPropagation()
				if $('#DV').val() is '' and $('#autoc1').val() isnt ''
					Singleton.get().showInformacion('El cliente ingresado no existe')
					$('#autoc1').val ''
				false


			$(document).on "keyup", "#autoc1", (e) =>
				if event.keyCode isnt 13
					e.preventDefault()
					e.stopPropagation()
					$('#DV').val ''
					$('#consignatario').html '<option value="0" selected="selected">Seleccione</option>'

				false

			$('#next').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showLoading()
				$.ajax
					url:"#{base_url}/index.php/services/listadoCotizacion/contarRegistros"
					type:'POST'
					data: @objData
					statusCode:
						302: ->
							Singleton.get().reload()
					success: (result) =>
						@paginador.setTotal(result[0].Cantidad_Total)
						@paginador.next()
						$('#labelPaginador').html @paginador.label()
						$(this)[0].objData.start = @paginador.start
						@filtrarListado()
					error: (data) =>
						Singleton.get().hideLoading()
						Singleton.get().showError('Error en la conexión con la base de datos')

			$('#previous').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showLoading()
				$.ajax
					url:"#{base_url}/index.php/services/listadoCotizacion/contarRegistros"
					type:'POST'
					data: @objData
					statusCode:
						302: ->
							Singleton.get().reload()
					success: (result) =>
						@paginador.setTotal(result[0].Cantidad_Total)
						@paginador.previous()
						$('#labelPaginador').html @paginador.label()
						$(this)[0].objData.start = @paginador.start
						@filtrarListado()
					error: (data) =>
						Singleton.get().hideLoading()
						Singleton.get().showError('Error en la conexión con la base de datos')




			#autocomplete cliente ==================================================================================

			#funcion que envia el id del cliente
			log = (rut,nombre) =>
				$('#DV').val rut
				$('#autoc1').val nombre
				option= '<option value="0" selected="selected">Seleccione</option>'
				
				$.ajax
					url:"#{base_url}/index.php/services/cotizacion/buscarDestinatario/id/#{rut}"
					type:'GET'
					async: false
					statusCode:
						302: ->
							Singleton.get().reload()
					success: (destino) =>
						for d in destino
							option+= '<option value="' + d.Id_Destino+ '" selected="selected">' + d.Nombre_Contacto + '</option>'
						$('#consignatario').html option
						$('#consignatario option[value=0]').attr('selected',true)

					error: (data) =>
						$('#consignatario').empty()
						$('#consignatario').html '<option value="0" selected="selected">Seleccione</option>'
						$('#consignatario option[value=0]').attr('selected',true)

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
							)
						error: (data) ->
							$('#autoc1').removeClass("ui-autocomplete-loading")
							$('#autoc1').autocomplete( "close" )
							$('#consignatario').empty()
							$('#DV').val ''

				minLength: 1,

				select: (event, ui) ->
					if ui.item
						log(ui.item.rut,ui.item.value)
				open: ->
					$('#autoc1').removeClass("ui-autocomplete-loading")
				close: ->
					$('#autoc1').removeClass("ui-autocomplete-loading")
		# 	#=======================================================================================================

		# 	false


		showModalCliente :(e) =>
			e.preventDefault()
			e.stopPropagation()

			$('#modal').css('width',475)	
			$('#modal').css('height',465)	
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
					$('#DV').val rutCliente
					$('#autoc1').val nombreCiente
					option= '<option value="0" selected="selected">Seleccione</option>'
					$.ajax
						url:"#{base_url}/index.php/services/cotizacion/buscarDestinatario/id/#{rutCliente}"
						type:'GET'
						async: false
						statusCode:
							302: ->
								Singleton.get().reload()
						success: (destino) =>
							for d in destino
								option+= '<option value="' + d.Id_Destino + '" selected="selected">' + d.Nombre_Contacto + '</option>'
							$('#consignatario').html option
							$('#consignatario option[value=0]').attr('selected',true)

						error: (data) =>
							$('#consignatario').empty()
							$('#consignatario').html '<option value="0" selected="selected">Seleccione</option>'
							$('#consignatario option[value=0]').attr('selected',true)
							
			$('#modal').modal 'hide'
			#aplicando tooltips a la tabla de contactos
			false

		showfiltrar :(e) =>
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()

			fechaDesde= ''
			fechaHasta= ''

			if $('#fechaDesde').val() isnt ''
				fechaDesde= Singleton.get().invertirFecha($('#fechaDesde').val(),'I')
			if $('#fechaHasta').val() isnt ''
				fechaHasta= Singleton.get().invertirFecha($('#fechaHasta').val(),'I')

			if fechaHasta < fechaDesde
				aux = fechaDesde
				fechaDesde = fechaHasta
				fechaHasta = aux
				
					
			@objData=
				{
					idClase: $('#filtroClase').find(':selected').val()
					idVendedor: $('#flitroVendedor').find(':selected').val()
					idCliente: $('#DV').val()
					idDestinatario: $('#consignatario').find(':selected').val()
					idProducto: $('#producto').find(':selected').val()
					fechaDesde: fechaDesde
					fechaHasta: fechaHasta
					idPerfil: Singleton.get().idPerfilUsuarioLogueado
					idUsuario: Singleton.get().idUsuarioLogueado
					start: @paginador.start
				}

			#setiamos el paginador con el total de registros segun los filtros seleccionados
			$.ajax
				url:"#{base_url}/index.php/services/listadoCotizacion/contarRegistros"
				type:'POST'
				data: @objData
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (result) =>
					@paginador.init(0, 14,result[0].Cantidad_Total)
					$('#labelPaginador').html @paginador.label()
					$(this)[0].objData.start = @paginador.start
					@filtrarListado()
				error: (data) =>
					@paginador.init(0, 14, 0)
					$('#labelPaginador').html @paginador.label()
					$(this)[0].objData.start = @paginador.start
					@filtrarListado()
			false	

				
				

		clickTr: (e) =>
			e.preventDefault()
			e.stopPropagation()
			$(e.currentTarget).addClass('active')
			$(e.currentTarget).siblings().removeClass('active')	

			Singleton.get().idCotizacionListado= e.currentTarget.childNodes[1].textContent
			Singleton.get().idVendedorListado= e.currentTarget.id

			option= '<option value="0">Acciones</option>'
			option+= '<option value="1">Consultar</option>'

			if e.currentTarget.childNodes[3].textContent is 'Pendiente'
				option+= '<option value="2">Editar</option>'
				option+= '<option value="7">En Proceso</option>'

			if e.currentTarget.childNodes[3].textContent is 'Proceso'
				option+= '<option value="9">Anular</option>'
				option+= '<option value="10">Despachar</option>'
				# option+= '<option value="11">Entregar</option>'

			if e.currentTarget.childNodes[3].textContent isnt 'Pendiente' and e.currentTarget.childNodes[3].textContent isnt 'Anulada'
				option+= '<option value="4">Clonar</option>'

			if e.currentTarget.childNodes[3].textContent is 'Despachada'
				option+= '<option value="11">Entregar</option>'	

			if Singleton.get().idPerfilUsuarioLogueado is '1' or Singleton.get().idPerfilUsuarioLogueado is '2' 
				option+= '<option value="12">Ver Tracking</option>'
			# else
			# 	if Singleton.get().restriccionEmitir() is 1 and e.currentTarget.childNodes[4].textContent is 'Ingresada'
			# 		option+= '<option value="7">Emitir</option>'

			# option+= '<option value="13">Exportar a Excel</option>'
			option+= '<option value="14">Exportar a PDF</option>'
			$('#acciones').html option
			$('#acciones option[value=0]').attr('selected',true)
			
			false

		showacciones: (e) =>
			e.preventDefault()
			e.stopPropagation()
			accion= $('#acciones').find(':selected').val()
			$('#acciones option[value=0]').attr('selected',true)
			switch accion
				when '1' then @showConsultar()
				when '2' then @showEditar()
				# when '3' then @showEliminar()
				when '4' then @showClonar()
				#accion emitir
				when '7' 
					$.ajax
						url:"#{base_url}/index.php/services/listadoCotizacion/existeCliente/idCotizacion/#{Singleton.get().idCotizacionListado}"
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success: (result) =>
							if result[0].Existe is '1'
								@showCambiarClase('3') 
							else
								Singleton.get().showInformacion('Debe asignar un cliente para el pedido seleccionado')
						error: (data) =>
							Singleton.get().showError('Error en la conexión con la base de datos')

				#accion anular
				when '9' then @showCambiarClase('4')
				when '10' then @showCambiarClase('7')
				when '11' then @showCambiarClase('9')
				when '12' then @showTracking()
				# when '13' then @showExportarExcel()
				when '14' then @showExportarPDF()
			false

		showConsultar: () =>
			Singleton.get().showModalCotizacion(Singleton.get().idCotizacionListado)
			false

		showEditar: () =>
			#limpiamos los eventos del formulario antes de instanciarlo
			$(document).unbind('click')
			$(document).unbind('change')
			$(document).unbind('focus')
			$(document).unbind('focusout')
			$(document).unbind('keyup')

			#instanciamos el objeto
			editarCotizacion = new viewEditarCotizacion(Singleton.get().idCotizacionListado)
			false

		showEliminar: () =>
			Singleton.get().showAdvertencia()
			$('#btnAceptarAdvertencia').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				idCotizacion= Singleton.get().idCotizacionListado
				$.ajax
					url:"#{base_url}/index.php/services/listadoCotizacion/eliminarCotizacion/idCotizacion/#{idCotizacion}"
					type:'DELETE'
					statusCode:
						302: ->
							Singleton.get().reload()
					success: (result) =>	
						if result is 'true'
							Singleton.get().showExito()
							$('#btnExito').click (e) =>
								e.preventDefault()
								e.stopPropagation()
								Singleton.get().showLoading()
								@filtrarListado()
								false
						else
							Singleton.get().showError('Error en la conexión con la base de datos')
					error: (data) =>
						Singleton.get().showError('Error en la conexión con la base de datos')

			false

		showClonar: () =>
			Singleton.get().showAdvertencia()

			$('#btnAceptarAdvertencia').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				idCotizacion= Singleton.get().idCotizacionListado
				$.ajax
					url:"#{base_url}/index.php/services/listadoCotizacion/clonarCotizacion/idCotizacion/#{idCotizacion}/idUsuario/#{Singleton.get().idUsuarioLogueado}"
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
								#actualizamos el paginador
								$(this)[0].objData.start = 0;
								@initPaginador()
								@filtrarListado()

								#inicializamos la pantalla de edicion con la nueva cotizacion generada
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
			false

		showRecotizar: () =>
			Singleton.get().showAdvertencia()

			$('#btnAceptarAdvertencia').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				idCotizacion= Singleton.get().idCotizacionListado
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
								#actualizamos el paginador
								$(this)[0].objData.start = 0;
								@initPaginador()
								@filtrarListado()

								#inicializamos la pantalla de edicion con la nueva cotizacion generada
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
			false

		showReasignar: () =>
			idPerfil= Singleton.get().idPerfilUsuarioLogueado
			newRow= ''

			$('#modal').css('width',500)	
			$('#modal').css('height',273)	
			$('#modal').css('left','55.5%')	
			$('#modal').css('top' ,'50%')
			$('#modal').css('background-color', '#f6f6f6')
			$('#modal').html _.template(TplviewReasignar)
			$('#modal').modal 'show'
			$('#subtituloModalListaPrecio').html 'Pedido Nº '+Singleton.get().idCotizacionListado
			$.ajax
				url:"#{base_url}/index.php/services/listadoCotizacion/cargarVendedores/id/#{idPerfil}"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (data) =>
					for d in data
						newRow += '<tr idSupervisor="'+d.Id_Supervisor+'">'
						newRow += '<td class="td-radio"><input type="radio" name="tabla" value="'+d.Id_Usuario+'"></td>'
						newRow += '<td class="td-lista">'+d.Nombre+'</td>'
						newRow += '<td class="td-precio">'+d.Perfil+'</td>'

						if d.Supervisor isnt null
							newRow += '<td class="td-tipo">'+d.Supervisor+'</td>'	
						else
							newRow += '<td class="td-tipo"></td>'	

						newRow += '<td>'+d.Sucursal+'</td>'
						newRow += '</tr>'
					$('#tablaModalReasignar tbody').html newRow

					$.each $('#tablaModalReasignar')[0].childNodes[1].children, (index, value) ->
						if $(this)[0].cells[0].childNodes[0].value is Singleton.get().idVendedorListado
							$(this)[0].cells[0].childNodes[0].checked = true


				#evento click del boton guardar
				$('#btnGuardarVendedor').click (e) =>
					e.preventDefault()
					e.stopPropagation()
					idVendedor= 0
					idSupervisor= 0
					idCotizacion= Singleton.get().idCotizacionListado

					$("#tablaModalReasignar tbody tr").each (index) ->
						if $(this).children("td")[0].childNodes[0].checked is true
							idVendedor= $(this).children("td")[0].childNodes[0].value
							idSupervisor= $(this)[0].attributes[0].value
					
					$.ajax
						url:"#{base_url}/index.php/services/listadoCotizacion/updateVendedores/idVendedor/#{idVendedor}/idSupervisor/#{idSupervisor}/idCotizacion/#{idCotizacion}"
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
									Singleton.get().showLoading()
									@filtrarListado()
									false
							else
								Singleton.get().showError('Error en la conexión con la base de datos')	
						error: (data) =>
							Singleton.get().showError('Error en la conexión con la base de datos')
			false

		showCambiarClase: (clase) =>
			Singleton.get().showAdvertencia()

			$('#btnAceptarAdvertencia').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				idCotizacion= Singleton.get().idCotizacionListado
				idUsuario= Singleton.get().idUsuarioLogueado

				$.ajax
					url:"#{base_url}/index.php/services/listadoCotizacion/cambiarClase/idCotizacion/#{idCotizacion}/clase/#{clase}/idUsuario/#{idUsuario}"
					type:'PUT'
					async: false
					statusCode:
						302: ->
							Singleton.get().reload()
					success: (result) =>	
						if result is 'true'
							Singleton.get().showExito()
							$('#btnExito').click (e) =>
								e.preventDefault()
								e.stopPropagation()
								if clase isnt '9' and clase isnt '4'
									Singleton.get().showLoading()
									@filtrarListado()
								if clase is '9'
									@modalcomentariosEntregada()
								if clase is '4'
									@modalcomentariosAnulada()
								false
						else
							Singleton.get().showError('Error en la conexión con la base de datos')
					error: (data) =>
						Singleton.get().showError('Error en la conexión con la base de datos')
			false

		modalcomentariosAnulada : () =>
			$('#modal').css('width',475)	
			$('#modal').css('height',465)
			$('#modal').css('top' ,'50%')
			$('#modal').css('left','55.5%')	
			$('#modal').css('background-color', '#f6f6f6')
			$('#modal').html _.template(tplcomentariosAnulada)()
			$('#Head1').html '&nbsp;&nbsp;&nbsp;Motivo'

			radioOption = ''
			$.ajax
				url:"#{base_url}/index.php/services/listadoCotizacion/buscarMotivos/"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (motivos) =>
					for m in motivos
						radioOption+= '<tr>'
						radioOption+= '<td class="td-radio"><input type="radio" name="tabla" value="'+m.Id_Opcion+'"></td>'
						radioOption+= '<td class="td-nombre">'+m.Detalle+'</td>'
						radioOption+= '</tr>'
					$('#tablaModalMostrarOpciones tbody').html radioOption
					
				error: (data) =>
					$('#tablaModalMostrarOpciones tbody').empty()


			$('#btnMotivoAceptar').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Validator = true

				if _.isUndefined($('input[name=tabla]:checked').val()) and $('#comentarios').val() is ""
					Validator= false
					console.log $('input[name=tabla]:checked').val()

				if Validator is true
					opcion = ""
					if _.isUndefined($('input[name=tabla]:checked').val())
						opcion = ""
					else
						opcion  =  $('input[name=tabla]:checked').val()
					datos = {
						idcotizacion : Singleton.get().idCotizacionListado
						idopcion: opcion
						comentarios: $('#comentarios').val()
					}
					new ComentariosModel().guardarcomentarioanulacion datos, (data) =>

					$('#modal').modal 'hide'
					@filtrarListado()
			false			

		modalcomentariosEntregada : () =>
			$('#modal').css('width',651)	
			$('#modal').css('height',360)	
			$('#modal').css('left' ,'45.5%')	
			$('#modal').css('background-color', '#f6f6f6')
			$('#modal').html _.template(tplcomentariosEntregada)()
			$('#mensajehora').css('display','none')

			$(document).on "change", ".rg", (e) =>
				if $("#radio1").attr("checked")
					$('#receptor').val ""
					$('#receptor').attr('disabled', 'disabled');
					$('.mensaje2').html  "&nbsp;&nbsp"
				else
					$('.mensaje2').html  "*"
					$('.mensaje2').css('display','inline')
					$("#receptor").removeAttr("disabled");
				false

			#validamos que solo ingresen numero en la cantidad
			$('#hora').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

			$('#minutos').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

			$(document).on "focusout", "#hora", (e) =>
				e.preventDefault()
				e.stopPropagation()
				if $('#hora').val() > 23
					$('#hora').val ""
					$('#mensajehora').html  "Hora no valida"
					$('#mensajehora').css('display','inline')

			$(document).on "focus", "#hora", (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#mensajehora').css('display','none')

			$(document).on "focusout", "#minutos", (e) =>
				e.preventDefault()
				e.stopPropagation()
				if $('#minutos').val() > 59
					$('#minutos').val ""
					$('#mensajehora').html  "minutos no validos"
					$('#mensajehora').css('display','inline')

			$(document).on "focus", "#minutos", (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#mensajehora').css('display','none')

			$('#guardardestinatario').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Validator = true

				#validamos dependiendo si recibio destinatario o no
				if $('input[name=radios]:checked').val() is '1'
					if $('#hora').val() is '' or $('#minutos').val() is ''
						Validator= false
				else 
					if $('#hora').val() is '' or $('#minutos').val() is '' or $('#receptor').val() is '' or $('#comentarios').val() is ''
						Validator= false

				if Validator is true
					datos = {
						idcotizacion : Singleton.get().idCotizacionListado
						recibiodestinatario : $('input[name=radios]:checked').val()
						nombrereceptor: $('#receptor').val()
						hora:	$('#hora').val()+":"+$('#minutos').val()
						comentarios: $('#comentarios').val()
					}
					new ComentariosModel().guardarcomentarioentrega datos, (data) =>

					$('#modal').modal 'hide'
					@filtrarListado()
		false			

		showTracking: () =>
			Singleton.get().idPedidoTracking = Singleton.get().idCotizacionListado
			$('#ListadoCotizacion').removeClass('active')
			$('#trackingCotizacion').addClass('active')
			@tracking = new viewTracking()
			false

		# showExportarExcel: () =>
		# 	$('#ExportarExcel').attr('action','index.php/services/exportar/exportarExcelListadoCotizacion')
		# 	$("#ExportarExcel").submit()
		# 	false
			
		showExportarPDF: () =>
			$.ajax
				url:"#{base_url}/index.php/services/cotizacion/buscarCotizacion/idCotizacion/#{Singleton.get().idCotizacionListado}"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (cotizacion) =>
					$.ajax
						url:"#{base_url}/index.php/services/cotizacion/buscarItems/idCotizacion/#{Singleton.get().idCotizacionListado}"
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success: (items) =>
							$('#ExportarPDF').attr('action','index.php/services/exportar/exportarcotPDF')
							$("#ExportarPDF").submit()



		cargarFiltroClase: () =>
			option= '<option value="0" selected="selected">Seleccione</option>'
			$.ajax
				url:"#{base_url}/index.php/services/listadoCotizacion/cargarFiltroClase"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (clases) =>
					for c in clases
						option+= '<option value="' + c.Id_Clase + '" selected="selected">' + c.Nombre + '</option>'
					$('#filtroClase').html option
					$('#filtroClase option[value=0]').attr('selected',true)
				error: (data) =>
					$('#filtroClase').html '<option value="0" selected="selected">Seleccione</option>'
					$('#filtroClase option[value=0]').attr('selected',true)
			false

		# cargarFiltroResponsable: () =>
		# 	option= '<option value="0" selected="selected">Seleccione</option>'
		# 	$.ajax
		# 		url:"#{base_url}/index.php/services/listadoCotizacion/cargarFiltroResponsable"
		# 		type:'GET'
		# 		success: (responsables) =>
		# 			for r in responsables
		# 				option+= '<option value="' + r.Id_Usuario + '" selected="selected">' + r.Nombre + '</option>'
		# 			$('#filtroResponsable').html option
		# 			$('#filtroResponsable option[value=0]').attr('selected',true)
		# 		error: (data) =>
		# 			$('#filtroResponsable').html '<option value="0" selected="selected">Seleccione</option>'
		# 			$('#filtroResponsable option[value=0]').attr('selected',true)
		# 	false

		cargarFiltroVendedor: () =>
			option= '<option value="0" selected="selected">Seleccione</option>'
			$.ajax
				url:"#{base_url}/index.php/services/listadoCotizacion/cargarFiltroVendedor"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (vendedores) =>
					for v in vendedores
						option+= '<option value="' + v.Id_Usuario + '" selected="selected">' + v.Nombre + '</option>'
					$('#flitroVendedor').html option
					$('#flitroVendedor option[value=0]').attr('selected',true)
				error: (data) =>
					$('#flitroVendedor').html '<option value="0" selected="selected">Seleccione</option>'
					$('#flitroVendedor option[value=0]').attr('selected',true)
			false

		cargarFiltroProducto: () =>

			idCentroNegocio= $('#centroNegocio').find(':selected').val()
			idFormas= $('#forma').find(':selected').val()
			option= '<option value="0" selected="selected">Seleccione</option>'
			$.ajax
				url:"#{base_url}/index.php/services/listadoCotizacion/cargarFiltroProducto"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (productos) =>
					for P in productos
						option+= '<option value="' + P.Id_Producto + '" selected="selected">' + P.Nombre + '</option>'
					$('#producto').html option
					$('#producto option[value=0]').attr('selected',true)
				error: (data) =>
					$('#producto').html '<option value="0" selected="selected">Seleccione</option>'
					$('#producto option[value=0]').attr('selected',true)
			false

		filtrarListado: () =>
			row= ''
			option= '<option value="0">Acciones</option>'
			#option+= '<option value="13">Exportar a Excel</option>'
			#option+= '<option value="14">Exportar a PDF</option>'
			$('#acciones').html option
			$('#acciones option[value=0]').attr('selected',true)

			$.ajax
				url:"#{base_url}/index.php/services/listadoCotizacion"
				type:'POST'
				data: @objData
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (result) =>
					for r in result
						row+='<tr id="'+r.Id_Vendedor+'">'
						row+='<td style="width: 4.7%;">'
						row+='<td style="width: 10.5%;">'+r.Id_Pedidos+'</td>'
						# row+='<td style="width: 10.5%;">'+Singleton.get().invertirFecha(r.FechaHoraDespacho)+'</td>'
						row+='<td style="width: 10.5%;">'+Singleton.get().invertirFecha(r.FechaHoraDespacho.substring(0,10))+' '+r.FechaHoraDespacho.substring(10,16)+'</td>'
						row+='<td style="width: 10.5%;">'+r.Clase+'</td>'
						row+='<td style="width: 11.3%;">'+r.Nombre_Contacto+'</td>'
						row+='<td style="width: 10.5%;">'+r.Vendedor+'</td>'
						if r.Cliente isnt null
							row+='<td style="width: 10.5%;">'+r.Cliente+'</td>'	
						else
							row+='<td style="width: 10.5%;"></td>'
						row+='<td align="right" style="width: 10.5%;">'+Singleton.get().miles(r.Total)+'</td>'
						row+='</tr>'
					$('#myTable tbody tr').addClass('delete')
					$('#myTable tbody').append row
					$('#myTable').trigger("update")
					$('#myTable').trigger("appendCache")
					#setiamos el metodo de ordenamiento====================================================================
					$('#myTable').tablesorter({usNumberFormat:false, dateFormat: "dd/mm/yyyy", headers:{ 0:{sorter:false}, 2:{sorter:"datetime"} },sortList: [[0,0]]})
					$('#myTable tbody tr.delete').remove()
					$('#myTable').trigger('update')					

					$('.tablesorter-header').css('background-position','right')
					$('#tablaBodyListado tr').click (e) =>
						@clickTr(e)	

					Singleton.get().hideLoading()
				error: (data) =>
					$('#tablaBodyListado').empty()
					Singleton.get().hideLoading()
			false

		initPaginador: () =>
			$.ajax
				url:"#{base_url}/index.php/services/listadoCotizacion/contarRegistros"
				type:'POST'
				data: @objData
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (result) =>
					@paginador.init(0, 14,result[0].Cantidad_Total)
					$('#labelPaginador').html @paginador.label()
			false
