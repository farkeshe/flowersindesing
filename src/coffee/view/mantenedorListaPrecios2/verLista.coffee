define [
	'backbone'
	'text!tpl/mantenedorListaPrecios/verLista.html'
	'text!tpl/mantenedorListaPrecios/editarLista.html'
	'text!tpl/mantenedorListaPrecios/articulo.html'
	'text!tpl/mantenedorListaPrecios/nuevaLista.html'
	'text!tpl/mantenedorListaPrecios/clonarLista.html'
	'text!tpl/mantenedorListaPrecios/estadoLista.html'
	'text!tpl/mantenedorListaPrecios/resultados.html'
	'assets/js/view/paginador'
] , (Backbone,TplverLista,TpleditarLista,Tplarticulo,TplnuevaLista,TplclonarLista,TplestadoLista,Tplresultados,Paginador) ->  
	class verLista extends Backbone.View
		el:('body')		

		initialize : () =>
			@paginador = new Paginador()

			@objData=
			{
				subgerencia: "vacio"
				estado: "vacio"
				tipo: "vacio"
				fi: "vacio"
				ff: "vacio"
				start: '0'
				end: '14'
			}

			@init()
			#@initPaginador()

		#controla los eventos del dropdown de acciones
		precios : (e) =>
			e.preventDefault()
			e.stopPropagation()
			if ("nueva" == $('#accionesLista').find(':selected').val())
				@nueva(e)
			if ("editar" == $('#accionesLista').find(':selected').val())
				@editar()
			if ("clonar" == $('#accionesLista').find(':selected').val())
				@clonar()
			if ("cambiar" == $('#accionesLista').find(':selected').val())
				@cambiar(e)
			if ("exportar" == $('#accionesLista').find(':selected').val())
				@showExportarExcel()
			if ("eliminar" == $('#accionesLista').find(':selected').val())
				@eliminar(e)

		#pasa los datos al formulario para exportar a excel		
		showExportarExcel : () =>
			$('#ExportarExcel').attr('action','index.php/services/exportar/exportarExcelListaPrecios')
			$("#ExportarExcel").submit()
			false

		#inicia el mantenedor de lista de precios	
		init : () =>
			Singleton.get().showLoading()
			$.ajax
				url:"#{base_url}/index.php/services/listaPrecios/subgerencia"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(d) =>
					$('#appView').html _.template(TplverLista)({subgerencia: d})
						#cuando hacen click en el hipervinculo, listado de cotizaciones
					$('.newTitulo').click (e) =>
						e.preventDefault()
						e.stopPropagation()
						Singleton.get().showLoading()
						$('#appView').css('display','block')
						$('#appViewNext').empty()
						Singleton.get().hideLoading()

					@filtrar()
					$('#next').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})		
					$('#previous').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})	
					$('#nuevalista').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})	
					$('#filtrarprecio').click (e) =>
						Singleton.get().showLoading()
						@filtrar()

					$('#accionesLista').change (e) =>
						@precios(e)

					$('#nuevalista').click (e) =>
						@nueva(e)

					$('.botonExcel').click (e) =>
						@exportar(e)
					
					if window.innerWidth is 1280
						$('.scroll').css('width',window.innerWidth - 260)
						Singleton.get().hideLoading()
					else
						$('.scroll').css('width',window.innerWidth - 251)
					$('.scroll').css('height',window.innerHeight - 75)

					$('#desde').datepicker
						dateFormat: "yy-mm-dd"
						dayNamesMin: [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa" ]
						monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ]

					$('#hasta').datepicker
						dateFormat: "yy-mm-dd"
						dayNamesMin: [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa" ]
						monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ]
					
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
							url:"#{base_url}/index.php/services/listaPrecios/contarRegistros"
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
								Singleton.get().showError('No hay datos filtrados')
					false
		#carga los datos de la tabla de la lista de precios			
		cargar : () =>
			$.ajax
				url:"#{base_url}/index.php/services/listaPrecios/"
				type:'POST'
				data: @objData
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(s) =>
					$('#cargatabla').html _.template(Tplresultados)({variable: s})
					Singleton.get().hideLoading()	
					$('#accionesLista').change (e) =>
						@precios(e)
					$('#tablaBody tr').click (e) =>
						@clickTr(e)
					$('#nuevalista').click (e) =>
						@nueva(e)
				error:(s) =>
					Singleton.get().showError('No existe el filtro')
					$('#btnError').click (e) =>
						@initialize()


		#crea el filtro para mostrar la tabla
		filtrar : () =>
			#Singleton.get().showLoading()
			fechaDesde= "vacio"
			fechaHasta= "vacio"

			if $('#desde').val() isnt ''
				fechaDesde= $('#desde').val()
			if $('#hasta').val() isnt ''
				fechaHasta= $('#hasta').val()


			@objData=
			{
				subgerencia: $('#subgerencia').val()
				estado:  $('#estado').val()
				tipo:  $('#tipo').val()
				fi: fechaDesde
				ff: fechaHasta
				start: @paginador.start
				end : '14'
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
					$('#btnError').click (e) =>
						@initialize()


			
		#crear una nueva lista de precios	
		nueva: (e) =>
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$.ajax
				url:"#{base_url}/index.php/services/listaPrecios/crearlistanueva/idSubgerenciaUsuarioLogueado/"+Singleton.get().idSubgerenciaUsuarioLogueado
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(l) =>
					Singleton.get().listaIdlistaclonada = l
					@idlista = Singleton.get().listaIdlistaclonada
					$.ajax
						url:"#{base_url}/index.php/services/listaPrecios/productos/idlista/"+Singleton.get().listaIdlistaclonada
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success:(d) =>
							$.ajax
								url:"#{base_url}/index.php/services/listaPrecios/subgerencia"
								type:'GET'
								cache: true
								statusCode:
									302: ->
										Singleton.get().reload()
								success:(s) =>
									$.ajax
										url:"#{base_url}/index.php/services/listaPrecios/guardarlistaclon/idclon/"+Singleton.get().listaIdlistaclonada+"/idlista/"+Singleton.get().listaIdlistaclonada
										type:'GET'
										statusCode:
											302: ->
												Singleton.get().reload()
										success:(g) =>
											$('#appViewNext').html _.template(TplnuevaLista)({variable: d,subgerencia: s})
											$('.newTitulo').click (e) =>
												e.preventDefault()
												e.stopPropagation()
												Singleton.get().showLoading()
												$('#appView').css('display','block')
												$('#appViewNext').empty()
												Singleton.get().hideLoading()

											@subgerencia = Singleton.get().idSubgerenciaUsuarioLogueado
											$('#subgerencianueva').attr("value",@subgerencia)
											#$('#tipolista').attr("value",@tipo)
											#$('#nombrelista').attr("value",@nombrelista)
											Singleton.get().hideLoading()
											$('.alertaroja').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})

											@idLista = Singleton.get().listaIdlistaclonada
											if window.innerWidth is 1280
												$('.scroll').css('width',window.innerWidth - 260)
											else
												$('.scroll').css('width',window.innerWidth - 251)
											$('.scroll').css('height',window.innerHeight - 75)
											$('#contenedorproductos table tbody tr').click (e) =>
												@articulonueva(e)
											$('#cancelar').click (e) =>
												e.preventDefault()
												e.stopPropagation()
												Singleton.get().showLoading()
												$('#appView').css('display','block')
												$('#appViewNext').empty()
												Singleton.get().hideLoading()
											$('#guardarnueva').click (e) =>
												@subgerencia = $('#subgerencianueva').val()
												@nombrelista = $('#nombrelista').val()
												@tipo = $('#tipolista').val()
												console.log @subgerencia
												console.log @tipo
												console.log @nombrelista
												console.log "nueva"
												console.log Singleton.get().listaIdlistaclonada
												if(@subgerencia != "vacio" and @nombrelista != "" and @tipo != "vacio")

													datos=
													{
														sub: @subgerencia
														nombre:  @nombrelista 
														tipo:  	@tipo 
														id: Singleton.get().listaIdlistaclonada
													
													}
													$.ajax
														url:"#{base_url}/index.php/services/listaPrecios/guardardatosproducto"
														type:'POST'
														data: datos
														statusCode:
															302: ->
																Singleton.get().reload()
														success:(g) =>
															Singleton.get().showExito('Datos de la lista guardados correctamente','Exito')
														error:(g) =>
															Singleton.get().showError('No se pudo guardar los datos de la lista, verifique que no esten en blanco','Error')

												else
													Singleton.get().showError('No se pudo guardar los datos de la lista, verifique que no esten en blanco','Error')
											$('#appView').css('display','none')
											Singleton.get().hideLoading()
											false

		#editar una lista de precios falta recibir la lista que se editara	
		editar: () =>
			if(@estadoactual == "Histórica" or @estadoactual == "Historica")
				Singleton.get().showInformacion('No se pueden editar listas históricas')
			else
				Singleton.get().showLoading()
				$.ajax
					url:"#{base_url}/index.php/services/listaPrecios/productos/idlista/"+@idLista
					type:'GET'
					statusCode:
						302: ->
							Singleton.get().reload()
					success:(d) =>
						$.ajax
							url:"#{base_url}/index.php/services/listaPrecios/subgerencia"
							type:'GET'
							statusCode:
								302: ->
									Singleton.get().reload()
							success:(s) =>
								$('#appViewNext').html _.template(TpleditarLista)({variable: d,subgerencia: s})
								$('.newTitulo').click (e) =>
									$('input[type=text]').removeAttr("disabled");
									$('select').removeAttr("disabled");
									e.preventDefault()
									e.stopPropagation()
									Singleton.get().showLoading()
									$('#appView').css('display','block')
									$('#appViewNext').empty()
									Singleton.get().hideLoading()
								$('#subgerencianueva').attr("value",@subgerencia)
								$('#tipolista').attr("value",@tipo)
								$('#nombrelista').attr("value",@nombrelista)
								#$(".yes").addClass('alertaroja')
								if(@estadoactual == 'Activa')
									$('input[type=text]').attr('disabled', true)
									$('select').attr('disabled', true)

								$('.alertaroja').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})

								$('#contenedorproductos table tbody tr').click (e) =>
									@articuloeditar(e)
								$('#cancelar').click (e) =>
									$('input[type=text]').removeAttr("disabled");
									$('select').removeAttr("disabled");
									e.preventDefault()
									e.stopPropagation()
									Singleton.get().showLoading()
									$('#appView').css('display','block')
									$('#appViewNext').empty()
									Singleton.get().hideLoading()

								$('#guardareditar').click (e) =>
									@subgerencia =  $('#subgerencianueva').val()
									@nombrelista = $('#nombrelista').val()
									@tipo = $('#tipolista').val()
									console.log @subgerencia
									console.log @nombrelista
									console.log @tipo
									if(@subgerencia != "vacio" and @nombrelista != "" and @tipo != "vacio")

										datos=
										{
											sub: @subgerencia
											nombre:  @nombrelista 
											tipo:  	@tipo 
											id: @idLista
										
										}
										$.ajax
											url:"#{base_url}/index.php/services/listaPrecios/guardardatosproducto"
											type:'POST'
											data: datos
											statusCode:
												302: ->
													Singleton.get().reload()
											success:(g) =>
												Singleton.get().showExito('Lista editada correctamente','Exito')
											error:(g) =>
												Singleton.get().showError('No se pudo editar la lista','Error')
								if window.innerWidth is 1280
									$('.scroll').css('width',window.innerWidth - 260)
								else
									$('.scroll').css('width',window.innerWidth - 251)
								$('.scroll').css('height',window.innerHeight - 75)
								Singleton.get().hideLoading()
							$('#appView').css('display','none')
							Singleton.get().hideLoading()

		#clonar la lista seleccionada
		clonar: () =>
			Singleton.get().showLoading()
			$.ajax
				url:"#{base_url}/index.php/services/listaPrecios/crearlista/tipo/"+@tipo+"/idsubgerencia/"+@subgerencia+"/nombre/"+@nombrelista
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(e) =>
					Singleton.get().listaIdlistaclonada = e
					$.ajax
						url:"#{base_url}/index.php/services/listaPrecios/productos/idlista/"+@idLista
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success:(d) =>
							$.ajax
								url:"#{base_url}/index.php/services/listaPrecios/subgerencia"
								type:'GET'
								statusCode:
									302: ->
										Singleton.get().reload()
								success:(s) =>
									$.ajax
										url:"#{base_url}/index.php/services/listaPrecios/guardarlistaclon/idclon/"+Singleton.get().listaIdlistaclonada+"/idlista/"+@idLista
										type:'GET'
										statusCode:
											302: ->
												Singleton.get().reload()
										success:(g) =>
											$('#appViewNext').html _.template(TplclonarLista)({variable: d,subgerencia: s})
											$('#subgerencianueva').attr("value",@subgerencia)
											$('#tipolista').attr("value",@tipo)
											$('#nombrelista').attr("value",@nombrelista)
											$('.newTitulo').click (e) =>
												e.preventDefault()
												e.stopPropagation()
												Singleton.get().showLoading()
												$('#appView').css('display','block')
												$('#appViewNext').empty()
												Singleton.get().hideLoading()
											$('.alertaroja').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
											Singleton.get().hideLoading()
											$('#contenedorproductos table tbody tr').click (e) =>
												@articulo(e)
											$('#cancelar').click (e) =>
												e.preventDefault()
												e.stopPropagation()
												Singleton.get().showLoading()
												$('#appView').css('display','block')
												$('#appViewNext').empty()
												Singleton.get().hideLoading()
											$('#guardarclonar').click (e) =>
												@subgerencia = $('#subgerencianueva').val()
												@nombrelista = $('#nombrelista').val()
												@tipo = $('#tipolista').val()
												console.log @subgerencia
												console.log @nombrelista
												console.log @tipo
												if(@subgerencia != "vacio" and @nombrelista != "" and @tipo != "vacio")

													datos=
													{
														sub: @subgerencia
														nombre:  @nombrelista 
														tipo:  	@tipo 
														id: Singleton.get().listaIdlistaclonada
													
													}
													$.ajax
														url:"#{base_url}/index.php/services/listaPrecios/guardardatosproducto"
														type:'POST'
														data: datos
														statusCode:
															302: ->
																Singleton.get().reload()
														success:(g) =>
															Singleton.get().showExito('Lista clonada correctamente','Exito')
														error:(g) =>
															Singleton.get().showError('No se pudo clonar la lista','Error')
											if window.innerWidth is 1280
												$('.scroll').css('width',window.innerWidth - 260)
											else
												$('.scroll').css('width',window.innerWidth - 251)
											$('.scroll').css('height',window.innerHeight - 75)
											Singleton.get().hideLoading()
										$('#appView').css('display','none')
										Singleton.get().hideLoading()

								
		
		#muestra el modal para cambiar el estado
		cambiar: (e) =>
			e.preventDefault()
			e.stopPropagation()
			$.ajax
				url:"#{base_url}/index.php/services/listaPrecios/productos/idlista/"+@idLista
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(res) =>
					for d in res
						if(d.cantidad == "alertaroja")
							aux = "a"	
					if(aux == "a")
						Singleton.get().showError('No se puede cambiar el estado de la lista, contiene artículos sin precio')
					else
						if(@estadoactual == 'Activa' or @estadoactual == 'Histórica')
							Singleton.get().showError('No se puede cambiar el estado de la lista seleccionada')
						else
							$.ajax
								url:"#{base_url}/index.php/services/listaPrecios/subgerencia"
								type:'GET'
								statusCode:
									302: ->
										Singleton.get().reload()
								success:(d) =>
									if txt?
										$(".nueva").attr("checked","checked");
										$(".td-radio:checkbox:not(:checked)").attr("checked", "checked");	
										$('#modal-estado').html _.template(TplestadoLista)({variable: d})
										$('#guardarestado').click (e) =>									
											@guardarestado(e)

									else
										$(".nueva").attr("checked","checked");
										$(".td-radio:checkbox:not(:checked)").attr("checked", "checked");
										$('#modal-estado').html _.template(TplestadoLista)({variable: d})		
										$('#image_confirmacion').attr("src","#{base_url}/assets/img/img_confirmacion.png")
										$('#modal-estado').modal 'show'
										$('#guardarestado').click (e) =>									
											@guardarestado(e)
									false

		#agregar color verde a los tr de las tablas cuando se selecciona 
		clickTr: (e) =>
			e.preventDefault()
			e.stopPropagation()
			@idLista = e.currentTarget.attributes[0].value
			@subgerencia =e.currentTarget.cells[0].id
			@nombrelista = e.currentTarget.cells[1].id
			@tipo =e.currentTarget.cells[2].id
			@estadoactual =e.currentTarget.cells[3].id
			Singleton.get().listaIdlistaeditar= @idLista
			html= html + """<option value="accion">Acciones</option>""" + """ <option value="exportar">Exportar Excel</option>"""+ """<option value="editar">Editar</option>"""+ """<option value="clonar">Clonar</option>""" + """<option value="cambiar">Cambiar Estado</option>"""+ """<option value="eliminar">Eliminar</option>"""
			$('#accionesLista').html(html)
			$(e.currentTarget).addClass('active')
			$(e.currentTarget).siblings().removeClass('active')
			$('#accionesLista').change (e) =>
				@precios(e)
		

		#muestra el modal para editar articulos de una lista seleccionada	
		articulo: (e) =>
			e.preventDefault()
			e.stopPropagation()
			idproducto = e.currentTarget.attributes[0].value
			Singleton.get().listaIdproducto = idproducto
			$(e.currentTarget).addClass('active')
			$(e.currentTarget).siblings().removeClass('active')
			$.ajax
				url:"#{base_url}/index.php/services/listaPrecios/cuentaarticulos/idlista/"+Singleton.get().listaIdlistaclonada+"/idproducto/"+idproducto
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(count) =>
					@contadorclonar = count[0].Cantidad_Total 
					$.ajax
						url:"#{base_url}/index.php/services/listaPrecios/articulos/idlista/"+Singleton.get().listaIdlistaclonada+"/idproducto/"+idproducto
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success:(d) =>
							if txt?			
								$('#modal-art').html _.template(Tplarticulo)({producto:idproducto,variable: d})
								$(".0").addClass('articulocero')
								$(".0").addClass('articulocero')
								$(document).on "keyup", ".bout", (e) =>
									e.preventDefault()
									e.stopPropagation()
									$('#'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).val Singleton.get().formatMiles(e.currentTarget.value)
									false

								$(document).on "focusout", ".bout", (e) =>
									e.preventDefault()
									e.stopPropagation()
									$('#'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).val Singleton.get().formatMiles(e.currentTarget.value)

								$('#0').focusout (e) =>
									$("."+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).removeClass('articulocero')

								$('#guardararticulo').click (e) =>
									@guardaArticulo(e)

							else
								$('#modal-art').html _.template(Tplarticulo)({producto:idproducto,variable: d})	
								$(".0").addClass('articulocero')
								$(document).on "focusout", ".bout", (e) =>
									e.preventDefault()
									e.stopPropagation()
									$('.'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).attr("value",Singleton.get().formatMiles(e.currentTarget.value))
									if(e.currentTarget.value != '0')
										$('.'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).removeClass('articulocero')
									else
										$('.'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).addClass('articulocero')

								$('#guardararticulo').click (e) =>
									@guardaArticulo(e)
								$('#image_confirmacion').attr("src","#{base_url}/assets/img/img_confirmacion.png")				
								$('#modal-art').modal 'show'
						error: (d) ->
							Singleton.get().hideLoading()
							Singleton.get().showInformacion('El producto seleccionado no contiene artículos asociados','Error')
		
		#carga los productos de la edición de la lista	
		articuloeditar: (e) =>
			e.preventDefault()
			e.stopPropagation()
			idproducto = e.currentTarget.attributes[0].value
			Singleton.get().listaIdproducto = idproducto
			Singleton.get().listaIdlistaeditar = @idlista
			$(e.currentTarget).addClass('active')
			$(e.currentTarget).siblings().removeClass('active')
			$.ajax
				url:"#{base_url}/index.php/services/listaPrecios/cuentaarticulos/idlista/"+@idLista+"/idproducto/"+idproducto
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(count) =>
					@contadoreditar = count[0].Cantidad_Total 
					$.ajax
						url:"#{base_url}/index.php/services/listaPrecios/articulos/idlista/"+@idLista+"/idproducto/"+idproducto
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success:(d) =>
							if txt?		
								$('#modal-art').html _.template(Tplarticulo)({producto:idproducto,variable: d})
								$(".0").addClass('articulocero')
								$(".0").addClass('articulocero')
								$(document).on "keyup", ".bout", (e) =>
									e.preventDefault()
									e.stopPropagation()
									$('#'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).val Singleton.get().formatMiles(e.currentTarget.value)
									#@setiarPrecioTotal(e.currentTarget.attributes['row'].value)
									false

								$(document).on "focusout", ".bout", (e) =>
									e.preventDefault()
									e.stopPropagation()
									$('#'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).val Singleton.get().formatMiles(e.currentTarget.value)

								$('#0').focusout (e) =>
									$("."+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).removeClass('articulocero')

								$('#guardararticulo').click (e) =>
									@guardaArticuloeditar(e,@idLista)

							else

								$('#modal-art').html _.template(Tplarticulo)({producto:idproducto,variable: d})	
								$(".0").addClass('articulocero')

								$(document).on "focusout", ".bout", (e) =>
									e.preventDefault()
									e.stopPropagation()
									$('.'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).attr("value",Singleton.get().formatMiles(e.currentTarget.value))
									if(e.currentTarget.value != '0')
										$('.'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).removeClass('articulocero')
									else
										$('.'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).addClass('articulocero')
									
								$('#guardararticulo').click (e) =>
									@guardaArticuloeditar(e,@idLista)
								$('#image_confirmacion').attr("src","#{base_url}/assets/img/img_confirmacion.png")				
								$('#modal-art').modal 'show'
						error: (d) ->
							Singleton.get().hideLoading()
							Singleton.get().showInformacion('El producto seleccionado no contiene artículos asociados','Error')
		#carga los productos de una nueva lista de precios					
		articulonueva: (e) =>
			e.preventDefault()
			e.stopPropagation()
			idproducto = e.currentTarget.attributes[0].value
			Singleton.get().listaIdproducto = idproducto
			Singleton.get().listaIdlistaeditar = @idlista
			$(e.currentTarget).addClass('active')
			$(e.currentTarget).siblings().removeClass('active')
			$.ajax
				url:"#{base_url}/index.php/services/listaPrecios/cuentaarticulos/idlista/"+@idLista+"/idproducto/"+idproducto
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(count) =>
					@contadornueva = count[0].Cantidad_Total 
					$.ajax
						url:"#{base_url}/index.php/services/listaPrecios/articulos/idlista/"+@idLista+"/idproducto/"+idproducto
						type:'GET'
						statusCode:
							302: ->
								Singleton.get().reload()
						success:(d) =>
							if txt?	
								$('#modal-art').html _.template(Tplarticulo)({producto:idproducto,variable: d})
								$(".0").addClass('articulocero')
								$(".0").addClass('articulocero')
								$(document).on "keyup", ".bout", (e) =>
									e.preventDefault()
									e.stopPropagation()
									$('#'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).val Singleton.get().formatMiles(e.currentTarget.value)
									false

								$(document).on "focusout", ".bout", (e) =>
									e.preventDefault()
									e.stopPropagation()
									$('#'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).val Singleton.get().formatMiles(e.currentTarget.value)

								$('#0').focusout (e) =>
									$("."+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).removeClass('articulocero')

								$('#guardararticulo').click (e) =>
									@guardaArticulonueva(e,@idLista)

							else
								$('#modal-art').html _.template(Tplarticulo)({producto:idproducto,variable: d})	
								$(".0").addClass('articulocero')
								
								$(document).on "focusout", ".bout", (e) =>
									e.preventDefault()
									e.stopPropagation()
									$('.'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).attr("value",Singleton.get().formatMiles(e.currentTarget.value))
									if(e.currentTarget.value != '0')
										$('.'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).removeClass('articulocero')
									else
										$('.'+e.currentTarget.parentNode.parentNode.className.split(" ")[2]).addClass('articulocero')

								$('#guardararticulo').click (e) =>
									@guardaArticulonueva(e,@idLista)	
								$('#image_confirmacion').attr("src","#{base_url}/assets/img/img_confirmacion.png")				
								$('#modal-art').modal 'show'
						error: (d) ->
							Singleton.get().hideLoading()
							Singleton.get().showInformacion('El producto seleccionado no contiene artículos asociados','Error')


		#guarda la lista editada con los articulos con su precio
		guardaArticuloeditar : (e,idlist) =>
			$('#modal-art').modal 'hide'
			Singleton.get().showLoading()
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().contadorListaPrecio = 0
			Singleton.get().contadorExitoListaPrecio = 0
			Singleton.get().contadorListaPrecio = @contadoreditar
			#se recorre el modal para leer los precios y datos de los articulos
			$("#tablaarticulos tbody tr").each (index) ->
				aux = aux+1
				$(this).find("td").eq(9).find("input").each (l,m)=>
					Singleton.get().listaIdarticulo = $(m).val()
				$(this).find("td").eq(0).find("input").each (l,m)=>
					Singleton.get().listaIdasociacion = $(m).val()
				$(this).find("td").eq(7).find("input").each (l,m)=>
					Singleton.get().listaPrecio = Singleton.get().cleanValor($(m).val())
				$(this).find("td").eq(8).find("input").each (l,m)=>
					Singleton.get().valorantiguolista =  Singleton.get().cleanValor($(m).val())
					if(Singleton.get().listaPrecio != Singleton.get().valorantiguolista)
						$.ajax
							url:"#{base_url}/index.php/services/listaPrecios/preciosarticulo"
							type:'POST'
							async:true
							data: 
								idLista:idlist
								idasosiacion:Singleton.get().listaIdasociacion
								precio:Singleton.get().listaPrecio
								idproducto: Singleton.get().listaIdproducto
								idarticulo : Singleton.get().listaIdarticulo

							statusCode:
								302: ->
									Singleton.get().reload()
							success:(result) =>
								Singleton.get().contadorExitoListaPrecio++
								xx = (Number) (Singleton.get().contadorExitoListaPrecio)
								yy = (Number) (Singleton.get().contadorListaPrecio)
								if xx == yy
									Singleton.get().mi = true
								if result isnt 'true'
									validator= false
							error: (result) =>
								validator= false
			if(aux = @contadoreditar)
				$('#modal-art').modal 'hide' #esconde el modal de articulos
				Singleton.get().hideLoading
				$('#contenedorproductos table tbody tr td').removeClass('alertaroja')
				$('#contenedorproductos table tbody tr td').removeClass('no')
				$.ajax
					url:"#{base_url}/index.php/services/listaPrecios/productos/idlista/"+idlist
					type:'GET'
					statusCode:
						302: ->
							Singleton.get().reload()
					success:(d) =>
						$.ajax
							url:"#{base_url}/index.php/services/listaPrecios/subgerencia"
							type:'GET'
							statusCode:
								302: ->
									Singleton.get().reload()
							success:(s) =>
								$('#appViewNext').html _.template(TpleditarLista)({variable: d,subgerencia: s})
								$('#subgerencia').attr("value",@subgerencia)
								$('#tipolista').attr("value",@tipo)
								$('#nombrelista').attr("value",@nombrelista)

								$('.newTitulo').click (e) =>
									e.preventDefault()
									e.stopPropagation()
									Singleton.get().showLoading()
									$('#appView').css('display','block')
									$('#appViewNext').empty()
									Singleton.get().hideLoading()

								$('#contenedorproductos table tbody tr').click (e) =>
									@articuloeditar(e)
								$('#cancelar').click (e) =>
									e.preventDefault()
									e.stopPropagation()
									Singleton.get().showLoading()
									$('#appView').css('display','block')
									$('#appViewNext').empty()
									Singleton.get().hideLoading()		
								$('#guardareditar').click (e) =>
									console.log "asdasdadsasdassda"
									@subgerencia = $('#subgerencianueva').val()
									@nombrelista = $('#nombrelista').val()
									@tipo = $('#tipolista').val()
									if(@subgerencia != "vacio" and @nombrelista != "" and @tipo != "vacio")
										datos=
										{
											sub: @subgerencia
											nombre:  @nombrelista 
											tipo:  	@tipo 
											id: Singleton.get().listaIdlistaclonada
										
										}
										$.ajax
											url:"#{base_url}/index.php/services/listaPrecios/guardardatosproducto"
											type:'POST'
											data: datos
											statusCode:
												302: ->
													Singleton.get().reload()
											success:(g) =>
												Singleton.get().showExito('Lista editada correctamente','Exito')
											error:(g) =>
												Singleton.get().showError('No se pudo editar la lista','Error')

								if(@estadoactual == 'Activa')
									$('input[type=text]').attr('disabled', true)
									$('select').attr('disabled', true)

								$('.alertaroja').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})

								if window.innerWidth is 1280
									$('.scroll').css('width',window.innerWidth - 260)
								else
									$('.scroll').css('width',window.innerWidth - 251)
								$('.scroll').css('height',window.innerHeight - 75)
								Singleton.get().hideLoading()
							Singleton.get().hideLoading()
			
		#guarda la lista nueva con los articulos con su precio
		guardaArticulonueva : (e,idlist) =>
			$('#modal-art').modal 'hide'
			Singleton.get().showLoading()
			e.preventDefault()
			e.stopPropagation()
			aux = 0
			$("#tablaarticulos tbody tr").each (index) ->
				aux = aux + 1
				$(this).find("td").eq(9).find("input").each (l,m)=>
					Singleton.get().listaIdarticulo = $(m).val()
				$(this).find("td").eq(0).find("input").each (l,m)=>
					Singleton.get().listaIdasociacion = $(m).val()
				$(this).find("td").eq(7).find("input").each (l,m)=>
					Singleton.get().listaPrecio = Singleton.get().cleanValor($(m).val())
				$(this).find("td").eq(8).find("input").each (l,m)=>
					Singleton.get().valorantiguolista =  Singleton.get().cleanValor($(m).val())
					if(Singleton.get().listaPrecio != Singleton.get().valorantiguolista)
						$.ajax
							url:"#{base_url}/index.php/services/listaPrecios/preciosarticulo"
							type:'POST'
							async:true
							data: 
								idLista:idlist
								idasosiacion:Singleton.get().listaIdasociacion
								precio:Singleton.get().listaPrecio
								idproducto: Singleton.get().listaIdproducto
								idarticulo : Singleton.get().listaIdarticulo
							success:(result) =>
							error:(result) =>

			if(aux = @contadornueva)
				$('#modal-art').modal 'hide' #esconde el modal de articulos
				Singleton.get().showLoading()
				$('#contenedorproductos table tbody tr td').removeClass('alertaroja')
				$('#contenedorproductos table tbody tr td').removeClass('no')
				$.ajax
					url:"#{base_url}/index.php/services/listaPrecios/productos/idlista/"+idlist
					type:'GET'
					success:(d) =>
						$.ajax
							url:"#{base_url}/index.php/services/listaPrecios/subgerencia"
							type:'GET'
							success:(s) =>
								Singleton.get().hideLoading()
								$('#appViewNext').html _.template(TplnuevaLista)({variable: d,subgerencia: s})
								$('#subgerencianueva').attr("value",@subgerencia)
								$('#tipolista').attr("value",@tipo)
								$('#nombrelista').attr("value",@nombrelista)
								$('.newTitulo').click (e) =>
									e.preventDefault()
									e.stopPropagation()
									Singleton.get().showLoading()
									$('#appView').css('display','block')
									$('#appViewNext').empty()
									Singleton.get().hideLoading()

								$('#contenedorproductos table tbody tr').click (e) =>
									@articulonueva(e)
								$('#cancelar').click (e) =>
									e.preventDefault()
									e.stopPropagation()
									Singleton.get().showLoading()
									$('#appView').css('display','block')
									$('#appViewNext').empty()
									Singleton.get().hideLoading()		
								$('#guardarnueva').click (e) =>
									@subgerencia = $('#subgerencianueva').val()
									@nombrelista = $('#nombrelista').val()
									@tipo = $('#tipolista').val()
									console.log @subgerencia
									console.log @tipo
									console.log @nombrelista
									console.log "IDLISTA"
									console.log Singleton.get().listaIdlistaclonada

									if(@subgerencia != "vacio" and @nombrelista != "" and @tipo != "vacio")
										datos=
										{
											sub: @subgerencia
											nombre:  @nombrelista 
											tipo:  	@tipo 
											id: Singleton.get().listaIdlistaclonada
										
										}
										$.ajax
											url:"#{base_url}/index.php/services/listaPrecios/guardardatosproducto"
											type:'POST'
											data: datos
											success:(g) =>
												Singleton.get().showExito('Lista editada correctamente','Exito')
											error:(g) =>
												Singleton.get().showError('No se pudo editar la lista','Error')

								if(@estadoactual == 'Activa')
									$('input[type=text]').attr('disabled', true)
									$('select').attr('disabled', true)

								$('.alertaroja').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})

								if window.innerWidth is 1280
									$('.scroll').css('width',window.innerWidth - 260)
								else
									$('.scroll').css('width',window.innerWidth - 251)
								$('.scroll').css('height',window.innerHeight - 75)


		#guarda la lista clonada con los articulos con su precio						
		guardaArticulo : (e) =>
			$('#modal-art').modal 'hide'
			Singleton.get().showLoading()
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading
			$("#tablaarticulos tbody tr").each ->
				aux = aux + 1
				$(this).find("td").eq(9).find("input").each (l,m)=>
					Singleton.get().listaIdarticulo = $(m).val()
				$(this).find("td").eq(0).find("input").each (l,m)=>
					Singleton.get().listaIdasociacion = $(m).val()
				$(this).find("td").eq(7).find("input").each (l,m)=>
					Singleton.get().listaPrecio = Singleton.get().cleanValor($(m).val())
				$(this).find("td").eq(8).find("input").each (l,m)=>
					Singleton.get().valorantiguolista =  Singleton.get().cleanValor($(m).val())
					if(Singleton.get().listaPrecio != Singleton.get().valorantiguolista)
						$.ajax
							url:"#{base_url}/index.php/services/listaPrecios/preciosarticulo"
							type:'POST'
							#async:false
							data: 
								idLista:Singleton.get().listaIdlistaclonada
								idasosiacion:Singleton.get().listaIdasociacion
								precio:Singleton.get().listaPrecio
								idproducto: Singleton.get().listaIdproducto
								idarticulo : Singleton.get().listaIdarticulo
							success:(result) =>
							error:(result) =>

			if(aux = @contadorclonar)
				$('#modal-art').modal 'hide' #esconde el modal de articulos
				Singleton.get().showLoading
				$('#contenedorproductos table tbody tr td').removeClass('alertaroja')
				$('#contenedorproductos table tbody tr td').removeClass('no')
				$.ajax
					url:"#{base_url}/index.php/services/listaPrecios/productos/idlista/"+Singleton.get().listaIdlistaclonada
					type:'GET'
					success:(d) =>
						$.ajax
							url:"#{base_url}/index.php/services/listaPrecios/subgerencia"
							type:'GET'
							success:(s) =>
								$('#appViewNext').html _.template(TplclonarLista)({variable: d,subgerencia: s})
								$('#subgerencianueva').attr("value",@subgerencia)
								$('#tipolista').attr("value",@tipo)
								$('#nombrelista').attr("value",@nombrelista)
								$('.newTitulo').click (e) =>
									e.preventDefault()
									e.stopPropagation()
									Singleton.get().showLoading()
									$('#appView').css('display','block')
									$('#appViewNext').empty()
									Singleton.get().hideLoading()
								$('#contenedorproductos table tbody tr').click (e) =>
									@articulo(e)
								$('#cancelar').click (e) =>
									e.preventDefault()
									e.stopPropagation()
									Singleton.get().showLoading()
									$('#appView').css('display','block')
									$('#appViewNext').empty()
									Singleton.get().hideLoading()	
								$('#guardarclonar').click (e) =>
									@subgerencia = $('#subgerencianueva').val()
									@nombrelista = $('#nombrelista').val()
									@tipo = $('#tipolista').val()
									if(@subgerencia != "vacio" and @nombrelista != "" and @tipo != "vacio")
										datos=
										{
											sub: @subgerencia
											nombre:  @nombrelista 
											tipo:  	@tipo 
											id: Singleton.get().listaIdlistaclonada
										
										}
										$.ajax
											url:"#{base_url}/index.php/services/listaPrecios/guardardatosproducto"
											type:'POST'
											data: datos
											success:(g) =>
												Singleton.get().showExito('Lista editada correctamente','Exito')
											error:(g) =>
												Singleton.get().showError('No se pudo editar la lista','Error')


								if(@estadoactual == 'Activa')
									$('input[type=text]').attr('disabled', true)
									$('select').attr('disabled', true)

								$('.alertaroja').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})

								if window.innerWidth is 1280
									$('.scroll').css('width',window.innerWidth - 260)
								else
									$('.scroll').css('width',window.innerWidth - 251)
								$('.scroll').css('height',window.innerHeight - 75)
								Singleton.get().hideLoading()
							Singleton.get().hideLoading()
								
		#guarda el estado de la lista modificada				
		guardarestado : (e) =>
			Singleton.get().showLoading()
			e.preventDefault()
			e.stopPropagation()
			i = 0
			if($("#nueva").is(':checked'))
				estadoLista = 'Activa'
				$('#modal-estado').modal 'hide'
				$.ajax
					url:"#{base_url}/index.php/services/listaPrecios/cambiarEstado/id/"+@idLista+"/estadoproducto/"+estadoLista+"/tipo/"+@tipo+"/subgerencia/"+@subgerencia+"/estadoactual/"+@estadoactual
					type:'GET'
					success:(result) =>
						Singleton.get().showExito('Estado cambiado correctamente','Exito')
						$('#btnExito').click (e) =>
							@filtrar()
					error: (result) ->
						Singleton.get().hideLoading()
						Singleton.get().showError('No se pudo cambiar el estado','Error')
			else
				Singleton.get().showError('No se pudo cambiar el estado','Error')
	
		cancelarEstado : (e) =>
			e.preventDefault()
			e.stopPropagation()
			$("#accionesLista ").val($("#accionesLista  option:first").val());
		
		#elimina una lista de precios	
		eliminar : (e) =>
			e.preventDefault()
			e.stopPropagation()

			Singleton.get().showAdvertencia('¿Está seguro de eliminar la lista?')

			if(@estadoactual == "Histórica" or @estadoactual == "Activa")
				Singleton.get().showError('No se pueden eliminar la lista seleccionada','Error')
				$("#accionesLista ").val($("#accionesLista  option:first").val());
			else
				$("#accionesLista ").val($("#accionesLista  option:first").val());
				$.ajax
					url:"#{base_url}/index.php/services/listaPrecios/eliminarLista/id/"+@idLista
					type:'DELETE'
					success:(result) =>
						Singleton.get().showExito('Lista borrada correctamente','Exito')
						#@filtrar()
						$('#btnExito').click (e) =>
							@filtrar()
					error : (result) =>
						Singleton.get().showError('La lista no pudo ser borrada','Error')
						$('#btnExito').click (e) =>
							@filtrar()
				false	

		#inicia los valores del paginador		
		#initPaginador: () =>
			# $.ajax
			# 	url:"#{base_url}/index.php/services/listaPrecios/contarRegistros"
			# 	type:'POST'
			# 	data: @objData
			# 	success: (result) =>
			#@paginador.init(0, 14,result[0].Cantidad_Total)
			#$('#labelPaginador').html @paginador.label()
			#false
