define [
	'backbone'
	'text!tpl/mantenedorProductos/productos.html'
	'text!tpl/mantenedorProductos/resultados.html'
	'text!tpl/mantenedorProductos/nuevo.html'
	'text!tpl/mantenedorProductos/editar.html'
	'text!tpl/gestorCotizaciones/modalCliente.html'
	'assets/js/view/paginador'
	'assets/js/model/producto'
] , (Backbone,Tplproductos,Tplresultados,Tplnuevo,Tpleditar,TplmodalCliente,Paginador,ProductoModel) ->  
	class Productos extends Backbone.View
		el:('body')		

		initialize : () =>
			@paginador = new Paginador()
			@productoModel = new ProductoModel()
			@productoModel.buscarCategorias(@cargarCategoriasEnMemoria)
			@productoModel.buscarProductos(@cargarProductosEnMemoria)
			@objData=
			{
				nombreproducto 	: ""
				Id_Categoria 	: ""
				start			: @paginador.start
				end 			: '14'
			}
			@init()
			#@initPaginador()

		init : () =>
			$('#appView').html _.template(Tplproductos)({categorias: @categorias})
			#$('#cargartabla').html _.template(Tplresultados)({productos: @productos})
			$('#nuevoproducto').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				@nuevo(e)
			@filtrar()
			
			$('.scroll').css('height',window.innerHeight - 75)

			#setiamos los tooltips
			$('#next').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})		
			$('#previous').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			#setiamos los tooltips agregar producto
			$('#nuevoproducto').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#buscarProducto').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})

			#bloqueamos la opcion de añadir nuevos productos si el perfil no es administrador, gerente o supervisor
			if Singleton.get().idPerfilUsuarioLogueado isnt '1' and Singleton.get().idPerfilUsuarioLogueado isnt '2' and Singleton.get().idPerfilUsuarioLogueado isnt '3'
				$('#nuevoproducto').css('display', 'none')
				$('#accionesProductos').css('display', 'none')

			#autocompleta el buscador nombre
			$("#autoc1").autocomplete
				source: (request, response) ->
					$.ajax
						url:"#{base_url}/index.php/services/productos/miproducto"
						type:'POST'
						data: 
							palabra: request.term
						statusCode:
							302: ->
								Singleton.get().reload()
						success: (data) ->
							console.log data
							response $.map(data, (item) ->
								label: item.Nombre
								value: item.Nombre
								#
								categoria: item.Id_Categoria
								#
							)
						error: (data) ->
							$('#autoc1').removeClass("ui-autocomplete-loading")
							$('#autoc1').autocomplete( "close" );

				minLength: 1,
				#
				select: (event, ui) ->
					if ui.item
						$('#categoria').val(ui.item.categoria).attr('selected',true)
						#$('#rut').val(Singleton.get().formatearRut(ui.item.Rut))
				#
				open: ->
					$('#autoc1').removeClass("ui-autocomplete-loading")
				close: ->
					$('#autoc1').removeClass("ui-autocomplete-loading")

			$('#buscarProducto').click  (e) =>
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

				$('#btnModalBuscarCliente').click (e) =>
					@modalBuscarProducto(e)

				$('#inputModalBuscarCliente').keypress (e) =>
					if event.keyCode is 13
						@modalBuscarProducto(e)

				$('#btnModalclienteAceptar').click (e) =>
					@modalAceptarProducto(e)

				false

			#paginador next
			$('#next').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showLoading()
				$.ajax
					url:"#{base_url}/index.php/services/productos/contarRegistros"
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
				Singleton.get().showLoading()
				$.ajax
					url:"#{base_url}/index.php/services/productos/contarRegistros"
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


			$('#filtrar').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				@filtrar()


		#crea el filtro para mostrar la tabla
		filtrar : () =>
			Singleton.get().showLoading()

			@objData=
			{
				nombreproducto 	: $('#autoc1').val()
				Id_Categoria    : $('#categoria').find(':selected').val()
				start		    : @paginador.start
				end 		    : '14'
			}
			
			$.ajax
				url:"#{base_url}/index.php/services/productos/contarRegistros"
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
	


		#carga los datos de la tabla de los productos	
		cargar : () =>
			$.ajax
				url:"#{base_url}/index.php/services/productos/filtrar"
				type:'POST'
				data: @objData
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(s) =>
					$('#cargatabla').html _.template(Tplresultados)({productos: s})
					Singleton.get().hideLoading()	
					$('#tablaBody tr').click (e) =>
						e.preventDefault()
						e.stopPropagation()
						@clickTr(e)
				error:(s) =>
					Singleton.get().showInformacion('No existe información para los filtros seleccionados')
					$('#btnExito').click (e) =>
						@initialize()


		#metodo que realiza el manejo de ingreso de un nuevo producto
		nuevo : (e) =>
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appView').css('display','none')
			$('#appViewNext').html _.template(Tplnuevo)({categorias: @categorias})	
			#restriccion para que solo ingresen numeros en el precio
			$('#precioproducto').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

			$('.newTitulo').click (e) =>
				@volveriteminicial(e)

			$('#guardarproducto').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Validator = true
				datos = {
					Nombre: $('#nombreproducto').val()
					Id_Categoria : $('#categoriaselect').val()
				}
				@productoModel.existenciaProducto datos, (existencia) =>
					if existencia is 'true'
						Singleton.get().showInformacion('El producto para la categoría ya ha sido ingresado')
					else
						#validamos el encabezado de la cotización===========================================================================================
						if $('#nombreproducto').val() is ''
							Singleton.get().showInformacion('Debe ingresar un nombre al producto')
							Validator= false

						if $('#categoriaselect').find(':selected').val() is ''
							Singleton.get().showInformacion('Debe asignar una categoría al producto')
							Validator= false
						#===================================================================================================================================
						if Validator is true 
							new ProductoModel().guardarProducto datos, (data) =>
								if _.isUndefined(data.error)
									Singleton.get().showExito('El producto a sido guardado exitosamente.')
									$('#appView').css('display','block')
									$('#appViewNext').empty()
									@filtrar()
								else
									Singleton.get().showError('El producto no ha podido ser guardado.')

						
			$('#cancelarproducto').click (e) =>
				@cancelar(e)
				
			Singleton.get().hideLoading()

		cargarCategoriasEnMemoria : (categorias) =>
			@categorias = categorias

		cargarProductosEnMemoria : (productos) =>
			@productos = productos

		acciones : (e) =>
			Validator= true
			e.preventDefault()
			e.stopPropagation()
			if ("editar" == $('#accionesProductos').find(':selected').val())
				Singleton.get().showLoading()
				$('#appView').css('display','none')
				$('#appViewNext').html _.template(Tpleditar)({categorias: @categorias})
				@productoModel.buscarProducto(@idproducto,@cargareditar)
				Singleton.get().hideLoading()
				$('#modal').remove()

				$('.newTitulo').click (e) =>
					@volveriteminicial(e)

				$('#guardarproducto').click (e) =>
					e.preventDefault()
					e.stopPropagation()
					Validator = true
					datos = {
						Nombre: $('#nombreproducto').val()
						Id_Categoria : $('#categoriaselect').val()
					}
					@productoModel.existenciaProducto datos, (existencia) =>
						if existencia is 'true'
							Singleton.get().showInformacion('El producto para la categoría ya ha sido ingresado')
						else
							#validamos el encabezado de la cotización===========================================================================================
							if $('#nombreproducto').val() is ''
								Singleton.get().showInformacion('Debe Seleccionar un nombre al producto')
								Validator= false

							if $('#categoriaselect').find(':selected').val() is ''
								Singleton.get().showInformacion('Debe asignar una categoría al producto')
								Validator= false
							#===================================================================================================================================
							if Validator is true 
								datosactualizar = {
									idproducto : @idproducto
									Nombre: $('#nombreproducto').val()
									Id_Categoria : $('#categoriaselect').val()
								}
								new ProductoModel().actualizarProducto datosactualizar, (data) =>
									if _.isUndefined(data.error)
										Singleton.get().showExito('El producto ha sido actualizado exitosamente.')
										$('#appView').css('display','block')
										$('#appViewNext').empty()
										@filtrar()
									else
										Singleton.get().showError('El producto no ha podido ser actualizado.')
 
				$('#cancelarproducto').click (e) =>
					@cancelar(e)
															
			if ("eliminar" == $('#accionesProductos').find(':selected').val())
				@eliminar()

		#agregar color rojo a los tr de las tablas cuando se selecciona 
		clickTr: (e) =>
			e.preventDefault()
			e.stopPropagation()
			@idproducto = e.currentTarget.attributes[0].value
			html= html + """<option value="accion">Acciones</option>""" + """<option value="editar">Editar</option>"""+ """<option value="eliminar">Eliminar</option>"""
			$('#accionesProductos').html(html)
			$(e.currentTarget).addClass('active')
			$(e.currentTarget).siblings().removeClass('active')
			$('#accionesProductos').change (e) =>
				e.preventDefault()
				e.stopPropagation()
				@acciones(e)
				
				
		eliminar: () =>
			#Singleton.get().showAdvertencia()
			#$('#btnAceptarAdvertencia').click (e) =>
			new ProductoModel().eliminarProducto @idproducto, (data) =>
				#console.log data
				if data is 'true'
					Singleton.get().showExito('El producto ha sido eliminado exitosamente.')
					$('#appView').css('display','block')
					$('#appViewNext').empty()
					@filtrar()
				else
					Singleton.get().showInformacion('El producto esta siendo ocupado en la Lista : '+data)

		cancelar: (e) =>					
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appViewNext').html("")
			$('#appView').css('display','inline')
			Singleton.get().hideLoading()

		cargareditar : (data) =>
			$('#nombreproducto').attr("value",data[0].Nombre)
			$('#categoriaselect').attr("value",data[0].Id_Categoria)
			@nombreProductoEditar = data[0].Nombre

		volveriteminicial: (e) =>
			#cuando hacen click en el hipervinculo
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appView').css('display','block')
			$('#appViewNext').empty()
			Singleton.get().hideLoading()

		modalBuscarProducto : (e) =>
			e.preventDefault()
			e.stopPropagation()

			nombreProducto = $('#inputModalBuscarCliente').val()

			console.log 'nombreProducto'
			console.log nombreProducto
			
			radioOption = ''
			$.ajax
				url:"#{base_url}/index.php/services/restricciones/buscarProducto/nombre/#{nombreProducto}"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (productos) =>
					console.log 'productos'
					console.log productos
					for p in productos
						radioOption+= '<tr>'
						radioOption+= '<td class="td-radio"><input type="radio" name="tabla" value="'+p.Id_Producto+'"></td>'
						radioOption+= '<td class="td-nombre">'+p.Nombre+'</td>'
						radioOption+= '<td>'+p.Id_Producto+'</td>'
						radioOption+= '</tr>'
					$('#tablaModalMostrarClientes tbody').html radioOption
					
				error: (data) =>
					$('#tablaModalMostrarClientes tbody').empty()
			false

		modalAceptarProducto : (e) =>
			e.preventDefault()
			e.stopPropagation()
			idPro= ''
			$("#tablaModalMostrarClientes tbody tr").each (index) ->
				if $(this).children("td")[0].childNodes[0].checked is true
					idPro = $(this).children("td")[2].textContent
					nombre = $(this).children("td")[1].textContent
					$('#autoc1').val nombre
			#@setiarArticulo(Singleton.get().rowBtnFiltroProducto,idPro)	
			#actualizamos los valores
			#@setiarValorUnidad(Singleton.get().rowBtnFiltroProducto)
			$('#modal').modal 'hide'
			false



