define [
	'backbone'
	'text!tpl/mantenedorSectores/sectores.html'
	'text!tpl/mantenedorSectores/resultados.html'
	'text!tpl/mantenedorSectores/editar.html'
	'text!tpl/mantenedorSectores/nuevo.html'
	'assets/js/view/paginador'
	'assets/js/model/sector'
] , (Backbone,Tplsectores,Tplresultados,Tpleditar,Tplnuevo,Paginador,Sector) ->  
	class Sectores extends Backbone.View
		el:('body')		

		initialize : () =>
			@paginador = new Paginador()
			@sector = new Sector()
			@objData=
			{
				nombreproducto 	: ""
				Id_Categoria 	: ""
				start			: @paginador.start
				end 			: '14'
			}
			@init()

			# Busca las regiones y las mantiene en memoria
			#@initPaginador()
		init : () =>
			Singleton.get().showLoading()
			$('#appView').html _.template(Tplsectores)({})
			$('.scroll').css('height',window.innerHeight - 75)
			@filtrar()
			Singleton.get().hideLoading()

			#setiamos los tooltip
			$('#nuevosector').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#next').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})		
			$('#previous').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})

			$('#nuevosector').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				@nuevo(e)

			$('#filtrar').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				@filtrar()

			#paginador next
			$('#next').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showLoading()
				$.ajax
					url:"#{base_url}/index.php/services/sectores/contarRegistros"
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

			#paginador previous
			$('#previous').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showLoading()
				$.ajax
					url:"#{base_url}/index.php/services/sectores/contarRegistros"
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


			#autocompleta el buscador de comunas
			$("#filtrocomuna").autocomplete
				source: (request, response) ->
					$.ajax
						url:"#{base_url}/index.php/services/sectores/micomuna"
						type:'POST'
						data: 
							palabra: request.term
						statusCode:
							302: ->
								Singleton.get().reload()
						success: (data) ->
							response $.map(data, (item) ->
								label: item.COMUNA_NOMBRE
								value: item.COMUNA_NOMBRE
							)
						error: (data) ->
							$('#filtrocomuna').removeClass("ui-autocomplete-loading")
							$('#filtrocomuna').autocomplete( "close" );

				minLength: 1,
				open: ->
					$('#filtrocomuna').removeClass("ui-autocomplete-loading")
				close: ->
					$('#filtrocomuna').removeClass("ui-autocomplete-loading")


		#metodo que realiza el manejo de ingreso de un nuevo sector
		nuevo : (e) =>
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appView').css('display','none')

			if _.isEmpty(@regiones)
				@sector.buscarRegiones(@cargarRegionesEnMemoria)

			$('#appViewNext').html _.template(Tplnuevo)(regiones: @regiones)	
			#restriccion para que solo ingresen numeros en el precio
			$('#precioflete').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

			$('.newTitulo').click (e) =>
				@volveriteminicial(e)

			#cargamos por defecto la comuna de talca
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
					$('#comunaselect').html option
					$('#comunaselect option[value=0]').attr('selected',true)
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
					if pro isnt '0' and pro isnt ''
						@sector.buscarComuna(pro,@cargaComuna)
					else
						option= '<option value="0" selected="selected">Seleccione...</option>'
						$('#comunaselect').html option

			$('#guardarsector').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Validator = true
				#realizamos el esto de las validaciones
				if $('#precioflete').val() is ''
					Singleton.get().showInformacion('Debe ingresar un precio de flete para el sector')
					Validator= false

				if $('#comunaselect').find(':selected').val() is '' or $('#comunaselect').find(':selected').val() is '0'
					Singleton.get().showInformacion('Debe asignar una comuna al sector')
					Validator= false

				if $('#provinciaselect').find(':selected').val() is '' or $('#provinciaselect').find(':selected').val() is '0'
					Singleton.get().showInformacion('Debe asignar una provincia al sector')
					Validator= false

				if $('#regionselect').find(':selected').val() is '' or $('#regionselect').find(':selected').val() is '0'
					Singleton.get().showInformacion('Debe asignar una región al sector')
					Validator= false

				if $('#nombresector').val() is ''
					Singleton.get().showInformacion('Debe ingresar un nombre al sector')
					Validator= false
				#===================================================================================================================================
				if Validator is true 
					@sector.buscarSectorExistente($('#nombresector').val(),$('#comunaselect').val(),@verificarsectores)
					#validamos que no existe otro sector con el mismo nombre en la misma comuna
					if @cantidad isnt 0
						Singleton.get().showInformacion('Ya existe un sector con ese nombre para la ciudad')
						$('#nombresector').val ""
					else
						datos = {
							Nombre: $('#nombresector').val()
							Id_Comuna : $('#comunaselect').val()
							PrecioFlete : $('#precioflete').val()
						}
						new Sector().guardarSector datos, (data) =>
							if _.isUndefined(data.error)
								Singleton.get().showExito('El sector ha sido guardado exitosamente.')
								$('#appView').css('display','block')
								$('#appViewNext').empty()
								@filtrar()
							else
								Singleton.get().showError('El sector no ha podido ser guardado.')
						
			$('#cancelarsector').click (e) =>
				@cancelar(e)
				
			
		verificarsectores: (cantidad) =>
			@cantidad = parseInt(cantidad[0].c)

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

		cancelar: (e) =>					
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appViewNext').html("")
			$('#appView').css('display','inline')
			Singleton.get().hideLoading()

		volveriteminicial: (e) =>
			#cuando hacen click en el hipervinculo
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appView').css('display','block')
			$('#appViewNext').empty()
			Singleton.get().hideLoading()

		# Busca las regiones y las mantiene en memoria
		cargarRegionesEnMemoria : (regiones) => 
			@regiones = regiones
		# Busca las regiones y las mantiene en memoria
		cargarProvinciasEnMemoria : (regiones) => 
			@provincias = regiones
		# Busca las regiones y las mantiene en memoria
		cargarComunasEnMemoria : (regiones) => 
			@comunas = regiones

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

		#carga las comunas segun la region seleccionada				
		cargaComuna : (p) =>
			Singleton.get().showLoading()
			option= '<option value="0" selected="selected">Seleccione...</option>'
			for iterator in p
				option+= '<option value="' + iterator.COMUNA_ID+ '" selected="selected">' + iterator.COMUNA_NOMBRE + '</option>'
				$('#comunaselect').html option
			$('#comunaselect option[value=0]').attr('selected',true)
			Singleton.get().hideLoading()


		#crea el filtro para mostrar la tabla
		filtrar : () =>
			Singleton.get().showLoading()

			@objData=
			{
				comuna   		: $('#filtrocomuna').val()
				start		    : @paginador.start
				end 		    : '14'
			}
			
			$.ajax
				url:"#{base_url}/index.php/services/sectores/contarRegistros"
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
					# Singleton.get().hideLoading()
					@cargar()
				error: (result) =>
					Singleton.get().hideLoading()	
					Singleton.get().showError('No existe el filtro')


		#carga los datos de la tabla de sectores
		cargar : () =>
			$.ajax
				url:"#{base_url}/index.php/services/sectores/filtrar"
				type:'POST'
				data: @objData
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(s) =>
					$('#cargatabla').html _.template(Tplresultados)({sectores: s})
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
			console.log e
			@idsector = e.currentTarget.attributes[0].value
			console.log e.currentTarget.attributes[0].value
			html= html + """<option value="accion">Acciones</option>""" + """<option value="editar">Editar</option>"""+ """<option value="eliminar">Eliminar</option>"""
			$('#accionesSectores').html(html)
			$(e.currentTarget).addClass('active')
			$(e.currentTarget).siblings().removeClass('active')
			$('#accionesSectores').unbind "change"
			$('#accionesSectores').change (e) =>
				e.preventDefault()
				e.stopPropagation()
				@acciones(e)

		acciones : (e) =>
			Validator= true
			e.preventDefault()
			e.stopPropagation()
			if ("editar" == $('#accionesSectores').find(':selected').val())
				Singleton.get().showLoading()
				if _.isEmpty(@regiones)
					@sector.buscarRegiones(@cargarRegionesEnMemoria)
					console.log @sector.buscarRegiones(@cargarRegionesEnMemoria)
				$('#appView').css('display','none')
				# $('#appViewNext').html _.template(Tpleditar)({categorias: @categorias})
				$('#appViewNext').html _.template(Tpleditar)({regiones: @regiones})
				@sector.buscarSector(@idsector,@cargareditar)

				#restriccion para que solo ingresen numeros en el precio
				$('#preciofleteEditar').keydown (event) ->
					if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
						return
					else
						event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

				$('.newTitulo').click (e) =>
						@volveriteminicial(e)

				$('#regionselect').change (e) =>
					e.preventDefault()
					e.stopPropagation()
					option= '<option value="0" selected="selected">Seleccione...</option>'
					$('#comunaselect').html option
					$('#comunaselect option[value=0]').attr('selected',true)
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
					if pro isnt '0' and pro isnt ''
						@sector.buscarComuna(pro,@cargaComuna)
					else
						option= '<option value="0" selected="selected">Seleccione...</option>'
						$('#comunaselect').html option

				$('#guardarsectorEditar').click (e) =>
					e.preventDefault()
					e.stopPropagation()
					Validator = true
					#realizamos el esto de las validaciones
					if $('#preciofleteEditar').val() is ''
						Singleton.get().showInformacion('Debe ingresar un precio de flete para el sector')
						Validator= false

					if $('#comunaselect').find(':selected').val() is '' or $('#comunaselect').find(':selected').val() is '0'
						Singleton.get().showInformacion('Debe asignar una comuna al sector')
						Validator= false

					if $('#provinciaselect').find(':selected').val() is '' or $('#provinciaselect').find(':selected').val() is '0'
						Singleton.get().showInformacion('Debe asignar una provincia al sector')
						Validator= false

					if $('#regionselect').find(':selected').val() is '' or $('#regionselect').find(':selected').val() is '0'
						Singleton.get().showInformacion('Debe asignar una región al sector')
						Validator= false

					if $('#nombresectorEditar').val() is ''
						Singleton.get().showInformacion('Debe ingresar un nombre al sector')
						Validator= false
					#===================================================================================================================================
					if Validator is true
						@sector.buscarSectorExistente($('#nombresectorEditar').val(),$('#comunaselect').val(),@verificarsectores)
						#validamos que no existe otro sector con el mismo nombre en la misma comuna y que no sea el mismo
						if @cantidad isnt 0 and @nombreoriginal isnt $('#nombresectorEditar').val()
							Singleton.get().showInformacion('Ya existe un sector con ese nombre para la ciudad')
							$('#nombresectorEditar').val ""
						else
							datos = {
								idsector : @idsector
								Nombre: $('#nombresectorEditar').val()
								Id_Comuna : $('#comunaselect').val()
								PrecioFlete : $('#preciofleteEditar').val()
							}
							new Sector().actualizarSector datos, (data) =>
								if _.isUndefined(data.error)
									Singleton.get().showExito('El sector ha sido actualizado exitosamente.')
									$('#appView').css('display','block')
									$('#appViewNext').empty()
									@filtrar()
								else
									Singleton.get().showError('El sector no ha podido ser actualizado.')
 
				$('#cancelarsectorEditar').click (e) =>
					@cancelar(e)
															
			if ("eliminar" == $('#accionesSectores').find(':selected').val())
				@eliminar()

		cargareditar : (data) =>
			@comunaId = data[0].COMUNA_ID
			$('#nombresectorEditar').attr("value",data[0].Nombre)
			@nombreoriginal = $('#nombresectorEditar').val()
			$('#preciofleteEditar').attr("value",data[0].PrecioFlete)
			@sector.buscarzona(data[0].COMUNA_ID,@cargareditarzona)

		#cargamos la zona del sector
		cargareditarzona : (data) =>
			$('#regionselect').attr("value",data[0].IdRegion)
			@sector.buscarProvincia(data[0].IdRegion,@cargaProvinciaTalca)
			$('#provinciaselect').attr("value",data[0].IdProvincia)
			@sector.buscarComuna(data[0].IdProvincia,@cargaComunaTalca)
			$('#comunaselect').attr("value",@comunaId)
			Singleton.get().hideLoading()

		eliminar: () =>
			Singleton.get().showAdvertencia()
			$('#btnAceptarAdvertencia').click (e) =>
				new Sector().eliminarSector @idsector, (data) =>
					if _.isUndefined(data.error)
						if data is 'true'
							Singleton.get().showExito('El sector ha sido eliminado exitosamente.')
							$('#appView').css('display','block')
							$('#appViewNext').empty()
							@filtrar()
						else
							Singleton.get().showInformacion('El sector no puede ser eliminado, debido a que esta siendo utilizado actualmente')
					else
						Singleton.get().showError('El sector no ha podido ser eliminado.')
