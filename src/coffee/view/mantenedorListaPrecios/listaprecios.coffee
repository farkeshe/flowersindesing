define [
	'backbone'
	'text!tpl/mantenedorListaPrecios/productosLista.html'
	'text!tpl/mantenedorListaPrecios/listaprecios.html'
	'text!tpl/mantenedorListaPrecios/resultados.html'
	'text!tpl/mantenedorListaPrecios/editar.html'
	'text!tpl/mantenedorListaPrecios/nuevo.html'
	'text!tpl/mantenedorListaPrecios/listahistorica.html'
	'assets/js/view/paginador'
	'assets/js/model/lista_precio'
	'assets/js/model/producto'
] , (Backbone,TplproductosLista,TplListasPrecios,Tplresultados,Tpleditar,Tplnuevo,Tplhistorica,Paginador,ListaPrecio,ProductoModel) ->  
	class listaprecios extends Backbone.View
		el:('body')		

		initialize : () =>
			@paginador= new Paginador()
			@lista_precio= new ListaPrecio()
			@objData=
			{
				nombre 			: ""
				Id_ListaPrecio 	: ""
				start			: @paginador.start
				end 			: '14'
			}
			@init()

		#inicia el mantenedor de lista de precios	
		init : () =>
			Singleton.get().showLoading()
			$('#appView').html _.template(TplListasPrecios)({})
			$('.scroll').css('height',window.innerHeight - 75)
			@filtrar()
			Singleton.get().hideLoading()

			#setiamos los tooltip
			$('#nuevalista').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#next').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})		
			$('#previous').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#filtrar').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			
			$('#nuevalista').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				@nuevalista(e)

			$('#filtrar').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				@filtrar()
		
			$("#filtrolista").autocomplete
				source: (request, response) ->
					$.ajax
						url:"#{base_url}/index.php/services/listaPrecios/milista"
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
							)
						error: (data) ->
							$('#filtrolista').removeClass("ui-autocomplete-loading")
							$('#filtrolista').autocomplete( "close" );

				minLength: 1,
				open: ->
					$('#filtrolista').removeClass("ui-autocomplete-loading")
				close: ->
					$('#filtrolista').removeClass("ui-autocomplete-loading")
		
		filtrar : () =>
			Singleton.get().showLoading()

			@objData=
			{
				nombre   		: $('#filtrolista').val()
				start		    : @paginador.start
				end 		    : '14'
			}
			$.ajax
				url:"#{base_url}/index.php/services/listaPrecios/contarRegistros"
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
			
		cargar : () =>
			$.ajax
				url:"#{base_url}/index.php/services/listaPrecios/filtrar"
				type:'POST'
				data: @objData
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(s) =>
					$('#cargatabla').html _.template(Tplresultados)({listaprecio: s})
					Singleton.get().hideLoading()
					$('#tablaBody tr').click (e) =>
						e.preventDefault()
						e.stopPropagation()
						@clickTr(e)

					#paginador next
					$('#next').click (e) =>
						e.preventDefault()
						e.stopPropagation()
						Singleton.get().showLoading()
						$.ajax
							url:"#{base_url}/index.php/services/listaPrecios/contarRegistros"
							type:'POST'
							data: @objData
							statusCode:
								302: ->
									Singleton.get().reload()
							success: (result) =>
								#PREGUNTAR SI LLEGO AL FINAL
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
							url:"#{base_url}/index.php/services/listaPrecios/contarRegistros"
							type:'POST'
							data: @objData
							statusCode:
								302: ->
									Singleton.get().reload()
							success: (result) =>
								#PREGUNTAR SI LLEGO AL PRINCIPIO
								@paginador.setTotal(result[0].Cantidad_Total)
								@paginador.previous()
								$('#labelPaginador').html @paginador.label()
								console.log $('#labelPaginador')
								$(this)[0].objData.end = @paginador.end
								$(this)[0].objData.start = @paginador.start
								@cargar()
								Singleton.get().hideLoading()
							error: (data) =>
								Singleton.get().hideLoading()
								Singleton.get().showError('No hay datos filtrados')
							#paginadores

				error:(s) =>
					Singleton.get().showInformacion('No existe información para los filtros seleccionados')
					$('#btnExito').click (e) =>
						@initialize()

		#agregar color rojo a los tr de las tablas cuando se selecciona 
		clickTr: (e) =>
			e.preventDefault()
			e.stopPropagation()

			@idlista = e.currentTarget.attributes[0].value
			@listaEstado = $('#'+@idlista)[0].cells[3].textContent

			if @listaEstado is "Historica"
				html= html + """<option value="accion">Acciones</option>""" + """<option value="ver">Ver</option>"""
				$('#accionesListas').html(html)
				$(e.currentTarget).addClass('active')
				$(e.currentTarget).siblings().removeClass('active')
				$('#accionesListas').unbind "change"
				$('#accionesListas').change (e) =>
					e.preventDefault()
					e.stopPropagation()
					@acciones(e)

			if @listaEstado is "Activo"
				html= html + """<option value="accion">Acciones</option>""" + """<option value="editar">Editar</option>"""
				$('#accionesListas').html(html)
				$(e.currentTarget).addClass('active')
				$(e.currentTarget).siblings().removeClass('active')
				$('#accionesListas').unbind "change"
				$('#accionesListas').change (e) =>
					e.preventDefault()
					e.stopPropagation()
					@acciones(e)

			if @listaEstado is "Temporal"
				html= html + """<option value="accion">Acciones</option>""" + """<option value="editar">Editar</option>""" + """<option value="eliminar">Eliminar</option>"""
				$('#accionesListas').html(html)
				$(e.currentTarget).addClass('active')
				$(e.currentTarget).siblings().removeClass('active')
				$('#accionesListas').unbind "change"
				$('#accionesListas').change (e) =>
					e.preventDefault()
					e.stopPropagation()
					@acciones(e)
		
		#aCCIONES
		acciones : (e) =>
			Validator= true
			e.preventDefault()
			e.stopPropagation()
			#eliminar
			if ("eliminar" == $('#accionesListas').find(':selected').val())
				@eliminar()
			#Ver
			if ("ver" == $('#accionesListas').find(':selected').val())
				Singleton.get().showLoading()
				@objData=
				{
					id   		: @idlista
				}
				$.ajax
					url:"#{base_url}/index.php/services/listaPrecios/editarlista"
					type:'POST'
					data: @objData
					statusCode:
						302: ->
							Singleton.get().reload()
					success: (result) =>
						$('#appView').css('display','none')
						$('#appViewNext').html _.template(Tplhistorica)({nombre: result[0].Nombre,tipo: result[0].Tipo, estado: result[0].Estado, fecha: result[0].Fecha_C})
						$('.scroll').css('height',window.innerHeight - 75)
						$('.newTitulo').click (e) =>
							@volveriteminicial(e)
						if result[0].Tipo is 'Normal'
							$('#tiposelect').attr('disabled','disabled')
						if Number(result[0].Estado) is 2
							$('#estadoselect').attr('disabled','disabled')	
						#cargando datos de productos en EDITAR-------------------->
						@productoModel = new ProductoModel()
						@productoModel.buscarCategorias(@cargarCategoriasEnMemoria) 
						#@productoModel.buscarProductos2(@cargarProductosEnMemoria2)
						@productoModel.buscarProductosHistorico(@idlista,@cargarProductosEnMemoriahistorico)
						console.log @productos
						#$('#appView').css('display','none')
						$('#productoslista').html _.template(TplproductosLista)({categorias: @categorias, productos: @productos})
						cate = 0
						for c in @categorias
							listaProd = Array()
							for p in @productos
								if p.Id_Categoria == c.Id_Categoria
									listaProd.push(p)
							i = 0
							html = ""
							while i < listaProd.length
								html+= '<div style="width: 50%;float:left;">'
								html+= '<div style="width: 30%;float:left;">'
								html+= '<input type="checkbox" style="margin-left: 3%;" id="check'+cate+''+i+'" disabled="disabled" name="option">'
								html+= '<label class="etiquetas" style="margin-left: 32%;margin-right: -53%;">'+listaProd[i].nombreProducto+'</label>'
								html+= '</div>'
								html+= '<div>'
								html+= '<label class="etiquetas" style="width:3%">$</label>'
								html+= '<input type="text" id="input'+cate+''+i+'" class="precios" readonly="readonly" style="width: 35.6%; margin-top: -0.5%;"/>'
								html+= '<input type="hidden" id="oculto'+cate+''+i+'" value='+listaProd[i].Id_Producto+'>'	
								html+= '</div>'
								html+= '</div>'
								i++
							$('#cat'+c.Id_Categoria).html html
							cate++
						
						#instanciado lo eventos slideToggle para el modulo de filtros de centro
						$('.datos-titulo').click (e) =>
							id = e.currentTarget.id.substr(19,e.currentTarget.id.length)					
							$('#cat'+id).slideToggle 'slow'

							if $('#encabezadocategoria'+id)[0].attributes[1].value is 'datos-titulo act'
								$('#encabezadocategoria'+id).removeClass('act')
								$('#encabezadocategoria'+id).addClass('dis')
							else
								$('#encabezadocategoria'+id).removeClass('dis')
								$('#encabezadocategoria'+id).addClass('act')	
						Singleton.get().hideLoading()
						# #<--------------------Cargando Datos de productos en EDITAR
						#EDITANDO DATOS
						$.ajax
							url:"#{base_url}/index.php/services/listaPrecios/traerlistaproductos"
							type:'POST'
							data: @objData
							statusCode:
								302: ->
									Singleton.get().reload()
							success: (result) =>
								#Pintar las tablas de productos para editar
								i1 = 0
								for c in @categorias
									i2 = 0
									for p in @productos	
										if c.Id_Categoria is p.Id_Categoria
											for r in result
												if r.Id_Producto is p.Id_Producto
													if r.Estado is "1"
														# console.log "caja : "+i1+" - "+i2
														$('#check'+i1+i2).attr('checked',true)
														$('#input'+i1+i2).val(r.Precio)
													else
														$('#input'+i1+i2).val(r.Precio)
											i2++
									i1++
						$('#cancelarlistaHistorica').click (e) =>
							@cancelar(e)
								#<--Pintar las tablas de productos para editar	
				
			#Editar
			if ("editar" == $('#accionesListas').find(':selected').val())
				Singleton.get().showLoading()
				@objData=
				{
					id   		: @idlista
				}
				$.ajax
					url:"#{base_url}/index.php/services/listaPrecios/editarlista"
					type:'POST'
					data: @objData
					statusCode:
						302: ->
							Singleton.get().reload()
					success: (result) =>
						$('#appView').css('display','none')
						$('#appViewNext').html _.template(Tpleditar)({nombre: result[0].Nombre,tipo: result[0].Tipo, estado: result[0].Estado, fecha: result[0].Fecha_C})
						$('.scroll').css('height',window.innerHeight - 75)

						if Number(result[0].Estado) is 1
							$('#estadoselect').attr('disabled','disabled')

						$('.newTitulo').click (e) =>
							@volveriteminicial(e)

						#cargando datos de productos en EDITAR-------------------->
						@productoModel = new ProductoModel()
						@productoModel.buscarCategorias(@cargarCategoriasEnMemoria) 
						@productoModel.buscarProductos2(@cargarProductosEnMemoria2)


						$('#productoslista').html _.template(TplproductosLista)({categorias: @categorias})

						console.log '@categorias'
						console.log @categorias

						cate = 0
						for c in @categorias
							listaProd = Array()
							for p in @productos
								if p.Id_Categoria == c.Id_Categoria
									listaProd.push(p)
							i = 0
							html = ""
							while i < listaProd.length
								html+= '<div style="width: 50%;float:left;">'
								html+= '<div style="width: 50%;float:left;">'
								html+= '<input type="checkbox" style="margin-left: -10%;" id="check'+cate+''+i+'" class="chekProducto" name="option">'
								html+= '<label class="etiquetas" style="margin-left: 16%;margin-right: -53%;width: 54%;">'+listaProd[i].nombreProducto+'</label>'
								html+= '</div>'
								html+= '<div>'
								html+= '<label class="etiquetas" style="width:3%">$</label>'
								html+= '<input type="text" id="input'+cate+''+i+'" class="precios"  style="width: 35.6%; margin-top: -0.5%;"/>'
								html+= '<input type="hidden" id="oculto'+cate+''+i+'" value='+listaProd[i].Id_Producto+'>'	
								html+= '</div>'
								html+= '</div>'
								i++
							$('#cat'+c.Id_Categoria).html html
							cate++
						#validamos que solo ingresen numeros en el rut
						$('.precios').keydown (event) ->
							if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
								return
							else
								event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

						$('#checkTodosProductos').click (e) =>
							if $('#checkTodosProductos').is(':checked') is true
								$('.chekProducto').prop('checked',true)
							else
								$('.chekProducto').prop('checked',false)

						#instanciado lo eventos slideToggle para el modulo de filtros de centro
						$('.datos-titulo').click (e) =>
							id = e.currentTarget.id.substr(19,e.currentTarget.id.length)					
							$('#cat'+id).slideToggle 'slow'

							if $('#encabezadocategoria'+id)[0].attributes[1].value is 'datos-titulo act'
								$('#encabezadocategoria'+id).removeClass('act')
								$('#encabezadocategoria'+id).addClass('dis')
							else
								$('#encabezadocategoria'+id).removeClass('dis')
								$('#encabezadocategoria'+id).addClass('act')	
						Singleton.get().hideLoading()

						# Carga los datos de la lista de precio seleccionada
						$.ajax
							url:"#{base_url}/index.php/services/listaPrecios/traerlistaproductos"
							type:'POST'
							data: @objData
							statusCode:
								302: ->
									Singleton.get().reload()
							success: (result) =>
								#Pintar las tablas de productos para editar
								i1 = 0
								for c in @categorias
									i2 = 0
									for p in @productos	
										if c.Id_Categoria is p.Id_Categoria
											for r in result
												if r.Id_Producto is p.Id_Producto
													if r.Estado is "1"
														$('#check'+i1+i2).attr('checked',true)
														$('#input'+i1+i2).val(r.Precio)
													else
														$('#input'+i1+i2).val(r.Precio)
											i2++
									i1++
								#<--Pintar las tablas de productos para editar	

						$('#cancelarlistaEditar').click (e) =>
							@cancelar(e)
						
						$('#guardarlistaEditar').click (e) =>
							Validator = true

							if $('#nombrelista').val() is ''
								Validator = false
								Singleton.get().showInformacion('Debe ingresar un nombre a la Lista.')

							if $('#estadoselect').val() is ''
								Validator = false
								Singleton.get().showInformacion('Debe ingresar un Estado.')
						
							$.ajax(
								url:"#{base_url}/index.php/services/listaPrecios/conactiva/id/"+@idlista
								type:'POST'
								data: ''
								statusCode:
									302: ->
										Singleton.get().reload()
								success: (result) =>
									#la lista no esta activa-----------------------------------------------------------------------------------------
									if result is 'false'
										if Validator is true
											datos = {
												idlista: @idlista
												nombre: $('#nombrelista').val()
												estado: $('#estadoselect').val()
												fecha: $('#fechaActual').val()
											}

											Singleton.get().showLoading()
											new ListaPrecio().actualizarLista datos, (data) =>
												if _.isUndefined(data.error)
													#FALTA VALIDAD SI ESTAN VACIOS LOS CHECKBOX
													cont = 0
													lproductos = Array()
													# divide el lproductos en tantas partes como categorias tenga y guarda cuantos productos tiene cada categoria.
													for c in @categorias
														contp = 0
														for p in @productos
															if p.Id_Categoria == c.Id_Categoria
																contp++
														lproductos[cont] = contp
														cont++
													cont = 0
													cc = 0
													#arreglo cant es para guardar los resultados de los distintos checkbox
													@cant = Array()
													while cc < lproductos.length
														i = 0
														while i < lproductos[cont]
															#validar los checkbox
															if $('#check'+cc+i).is(':checked')
																da=
																{
																	val_c	: @idlista
																	val_v	: $('#input'+cc+i).val()
																	val_p	: $('#oculto'+cc+i).val()
																	val_e	: 1
																}
															else
																da=
																{
																	val_c	: @idlista
																	val_v	: $('#input'+cc+i).val()
																	val_p	: $('#oculto'+cc+i).val()
																	val_e	: 0
																}
															@cant.push(da)

															i++
														cont++
														cc++
													new ListaPrecio().productolistaedit @cant, (data) =>
														Singleton.get().showExito('La lista ha sido Editado exitosamente.')
														$('#appView').css('display','block')
														$('#appViewNext').empty()
														$('#btnExito').click (e) =>
															e.preventDefault
															e.stopPropagation
															@filtrar()
															false
												else
													Singleton.get().showError('La lista no a podido ser guardado.')
													Singleton.get().hideLoading()
										
									else 
										#lista activa -------------------------------------------------------------------------------------------
										if $('#estadoselect').val() is '0'
											if Validator is true
												datos = {
													idlista: @idlista
													nombre: $('#nombrelista').val()
													estado: $('#estadoselect').val()
													fecha: $('#fechaActual').val()
												}
												Singleton.get().showLoading()
												new ListaPrecio().actualizarLista datos, (data) =>
													if _.isUndefined(data.error)
														#FALTA VALIDAD SI ESTAN VACIOS LOS CHECKBOX
														cont = 0
														lproductos = Array()
														# divide el lproductos en tantas partes como categorias tenga y guarda cuantos productos tiene cada categoria.
														for c in @categorias
															contp = 0
															for p in @productos
																if p.Id_Categoria == c.Id_Categoria
																	contp++
															lproductos[cont] = contp
															cont++
														cont = 0
														cc = 0
														#arreglo cant es para guardar los resultados de los distintos checkbox
														@cant = Array()
														while cc < lproductos.length
															i = 0
															while i < lproductos[cont]
																#validar los checkbox
																if $('#check'+cc+i).is(':checked')
																	da=
																	{
																		val_c	: @idlista
																		val_v	: $('#input'+cc+i).val()
																		val_p	: $('#oculto'+cc+i).val()
																		val_e	: 1
																	}
																else
																	da=
																	{
																		val_c	: @idlista
																		val_v	: $('#input'+cc+i).val()
																		val_p	: $('#oculto'+cc+i).val()
																		val_e	: 0
																	}
																@cant.push(da)

																i++
															cont++
															cc++
														new ListaPrecio().productolistaedit @cant, (data) =>
															Singleton.get().showExito('La lista ha sido Editada exitosamente.')
															$('#appView').css('display','block')
															$('#appViewNext').empty()
															$('#btnExito').click (e) =>
																e.preventDefault
																e.stopPropagation
																@filtrar()
																false
													else
														Singleton.get().showError('La lista no ha podido ser guardada.')
														Singleton.get().hideLoading()

										if $('#estadoselect').val() is '1'
											$.ajax(
												url:"#{base_url}/index.php/services/listaPrecios/actualizar2/id/"+result[0].Id_ListaPrecio
												type:'POST'
												data: ''
												statusCode:
													302: ->
														Singleton.get().reload()
												success: (result) =>
													console.log "resultado historica"
													console.log result
													)
											if Validator is true
												datos = {
													idlista: @idlista
													nombre: $('#nombrelista').val()
													estado: $('#estadoselect').val()
													fecha: $('#fechaActual').val()
												}
												new ListaPrecio().actualizarLista datos, (data) =>
													if _.isUndefined(data.error)
														#FALTA VALIDAD SI ESTAN VACIOS LOS CHECKBOX
														cont = 0
														lproductos = Array()
														# divide el lproductos en tantas partes como categorias tenga y guarda cuantos productos tiene cada categoria.
														for c in @categorias
															contp = 0
															for p in @productos
																if p.Id_Categoria == c.Id_Categoria
																	contp++
															lproductos[cont] = contp
															cont++
														cont = 0
														cc = 0
														#arreglo cant es para guardar los resultados de los distintos checkbox
														@cant = Array()
														while cc < lproductos.length
															i = 0
															while i < lproductos[cont]
																#validar los checkbox
																if $('#check'+cc+i).is(':checked')
																	da=
																	{
																		val_c	: @idlista
																		val_v	: $('#input'+cc+i).val()
																		val_p	: $('#oculto'+cc+i).val()
																		val_e	: 1
																	}
																else
																	da=
																	{
																		val_c	: @idlista
																		val_v	: $('#input'+cc+i).val()
																		val_p	: $('#oculto'+cc+i).val()
																		val_e	: 0
																	}
																@cant.push(da)

																i++
															cont++
															cc++
														new ListaPrecio().productolistaedit @cant, (data) =>
															Singleton.get().showExito('La lista ha sido Editada exitosamente.')
															$('#appView').css('display','block')
															$('#appViewNext').empty()
															$('#btnExito').click (e) =>
																e.preventDefault
																e.stopPropagation
																@filtrar()
																false
													else
														Singleton.get().showError('La lista no ha podido ser guardada.')
														Singleton.get().hideLoading()
									)

							 
					error: (result) =>
						Singleton.get().hideLoading()	
						Singleton.get().showError('No existe el filtro')
				# Singleton.get().hideLoading()
		
		nuevalista : (e) =>
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appView').css('display','none')
			$('#appViewNext').html _.template(Tplnuevo)({})
			$('#tiposelect').css('disabled','disabled')
			$('.scroll').css('height',window.innerHeight - 75)
			$('.newTitulo').click (e) =>
				@volveriteminicial(e)

			$('#checkTodosProductos').click (e) =>
				if $('#checkTodosProductos').is(':checked') is true
					$('.chekProducto').prop('checked',true)
				else
					$('.chekProducto').prop('checked',false)

			#Fecha Actual
			$('#fechaActual').attr('value',Singleton.get().fechaActual())
			#cargar listados de productos->
			@productoModel = new ProductoModel()
			@productoModel.buscarCategorias(@cargarCategoriasEnMemoria) 
			@productoModel.buscarProductos2(@cargarProductosEnMemoria2)
			#$('#appView').css('display','none')
			$('#productoslista').html _.template(TplproductosLista)({categorias: @categorias})
			cate = 0
			for c in @categorias
				listaProd = Array()
				#creamos lista de productos agrupados por categoria
				for p in @productos
					if p.Id_Categoria == c.Id_Categoria
						listaProd.push(p)
				#agregamos los productos a su div correspondiente
				i = 0
				html = ""
				while i < listaProd.length
					html+= '<div style="width: 50%;float:left;">'
					html+= '<div style="width: 50%;float:left;">'
					html+= '<input type="checkbox" style="margin-left: -10%;" id="check'+cate+''+i+'" class="chekProducto" name="option">'
					html+= '<label class="etiquetas" style="margin-left: 16%;margin-right: -53%;width: 54%;">'+listaProd[i].nombreProducto+'</label>'
					html+= '</div>'
					html+= '<div>'
					html+= '<label class="etiquetas" style="width:3%">$</label>'
					html+= '<input type="text" id="input'+cate+''+i+'" class="precios" value=0  style="width: 35.6%; margin-top: -0.5%;"/>'
					html+= '<input type="hidden" id="oculto'+cate+''+i+'" value='+listaProd[i].Id_Producto+'>'	
					html+= '</div>'
					html+= '</div>'
					i++
				$('#cat'+c.Id_Categoria).html html
				cate++
			Singleton.get().hideLoading()
			#validamos que solo ingresen numeros en el rut
			$('.precios').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

			#instanciado lo eventos slideToggle para el modulo de filtros de centro
			$('.datos-titulo').click (e) =>
				id = e.currentTarget.id.substr(19,e.currentTarget.id.length)					
				$('#cat'+id).slideToggle 'slow'

				if $('#encabezadocategoria'+id)[0].attributes[1].value is 'datos-titulo act'
					$('#encabezadocategoria'+id).removeClass('act')
					$('#encabezadocategoria'+id).addClass('dis')
				else
					$('#encabezadocategoria'+id).removeClass('dis')
					$('#encabezadocategoria'+id).addClass('act')	
			
			#Eventos Nuevalista->
			$('#cancelarlista').click (e) =>
				@cancelar(e)
				
			$('#guardarlista').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				$.ajax(
					url:"#{base_url}/index.php/services/listaPrecios/contemporal"
					type:'POST'
					data: ''
					statusCode:
						302: ->
							Singleton.get().reload()
					success: (result) =>
						if result is "true"
							Validator = true
							if $('#nombrelista').val() is ''
								Validator = false
								Singleton.get().showInformacion('Debe ingresar un nombre a la Lista.')

							if $('#estadoselect').val() is ''
								Validator = false
								Singleton.get().showInformacion('Debe ingresar un Estado.')
							
							if Validator is true
								Singleton.get().showLoading()
								datos = {
						 			Nombre: $('#nombrelista').val()
						 			Estado: $('#estadoselect').val()
						 		}
								new ListaPrecio().guardarlista datos, (data) =>
									if $.isNumeric(Number(data))
										# FALTA VALIDAR SI ESTAN VACIOS LOS CHECKBOX
										cont = 0
										lproductos = Array()
										# divide el lproductos en tantas partes como categorias tenga y guarda cuantos productos tiene cada categoria.
										for c in @categorias
											contp = 0
											for p in @productos
												if p.Id_Categoria == c.Id_Categoria
													contp++
											lproductos[cont] = contp
											cont++
										cont = 0
										cc = 0
										#arreglo cant es para guardar los resultados de los distintos checkbox
										@cant = Array()
										while cc < lproductos.length
											i = 0
											while i < lproductos[cont]
												if $('#check'+cc+i).is(':checked')
													da=
													{
														val_c	: data
														val_v	: $('#input'+cc+i).val()
														val_p	: $('#oculto'+cc+i).val()
														val_e	: 1
													}
												else
													da=
													{
														val_c	: data
														val_v	: $('#input'+cc+i).val()
														val_p	: $('#oculto'+cc+i).val()
														val_e	: 0
													}
												@cant.push(da)

												i++
											cont++
											cc++
										new ListaPrecio().productolistainsert @cant, (data) =>
											Singleton.get().showExito('La lista ha sido guardada exitosamente.')
											$('#appView').css('display','block')
											$('#appViewNext').empty()
											$('#btnExito').click (e) =>
												e.preventDefault
												e.stopPropagation
												@filtrar()
												false
									else
										Singleton.get().showInformacion('La lista no ha podido ser guardada.')
						if result is "false"
							Singleton.get().showInformacion('Ya existe una lista temporal en el Sistema.')
							$('#btnExito').click (e) =>
								$('#appView').css('display','block')
								$('#appViewNext').empty()
								$('#btnExito').click (e) =>
									e.preventDefault
									e.stopPropagation
									@filtrar()
									false
					)
				
		eliminar: () =>
			@productoModel = new ProductoModel()
			@productoModel.buscarProductos2(@cargarProductosEnMemoria2)
			if @listaEstado is "Historica"
				Singleton.get().showInformacion('La lista no puede ser eliminada. Pertenece a la Data Histórica.')
				$('#btnExito').click (e) =>
					e.preventDefault
					e.stopPropagation
					@filtrar()

			if @listaEstado is "Activo"
				Singleton.get().showInformacion('La lista no puede ser eliminada estando en uso.')
				$('#btnExito').click (e) =>
					e.preventDefault
					e.stopPropagation
					@filtrar()

			if @listaEstado is "Temporal"
				Singleton.get().showAdvertencia()
				$('#btnAceptarAdvertencia').click (e) =>
					@cont = new Array()
					for p in @productos
						obj = 
							{
								id_lista : @idlista
								id_produ : p.Id_Producto
							}
						@cont.push(obj)
					new ListaPrecio().productolistaeliminar @cont, (data) =>
						if data is "true"
					 		new ListaPrecio().eliminarLista @idlista, (data2) =>
					 			if data2 is "true"
					 				Singleton.get().showExito('La lista ha sido eliminada exitosamente.')
					 				$('#appView').css('display','block')
					 				$('#appViewNext').empty()
					 				$('#btnExito').click (e) =>
					 					e.preventDefault
					 					e.stopPropagation
					 					@filtrar()
					 					false
					 	else
					 		Singleton.get().showError('Error al eliminar la lista')
					
		cargarCategoriasEnMemoria : (categorias) =>
				@categorias = categorias	

		cargarProductosEnMemoria : (productos) =>
				@productos = productos

		cargarProductosEnMemoria2 : (productos) =>
				@productos = productos

		cargarProductosEnMemoriahistorico : (productos) =>
				@productos = productos

		cargarProductosListaEnMemoria : (productosLista) =>
				@productosLista = productosLista
				
		cancelar: (e) =>
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appViewNext').html("")
			$('#appView').css('display','inline')
			html= html + """<option value="accion">Acciones</option>"""
			$('#accionesListas').html(html)
			@filtrar()
			Singleton.get().hideLoading()

		volveriteminicial: (e) =>
			#cuando hacen click en el hipervinculo
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appView').css('display','block')
			$('#appViewNext').empty()
			html= html + """<option value="accion">Acciones</option>"""
			$('#accionesListas').html(html)
			@filtrar()
			Singleton.get().hideLoading()

		