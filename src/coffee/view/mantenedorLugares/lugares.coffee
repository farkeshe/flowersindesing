define [
	'backbone'
	'text!tpl/mantenedorLugares/lugares.html'
	'text!tpl/mantenedorLugares/resultados.html'
	'text!tpl/mantenedorLugares/editar.html'
	'text!tpl/mantenedorLugares/nuevo.html'
	'assets/js/view/paginador'
	'assets/js/model/sector'
	'assets/js/model/lugar'
] , (Backbone,Tpllugares,Tplresultados,Tpleditar,Tplnuevo,Paginador,Sector,Lugar) ->  
	class Lugares extends Backbone.View
		el:('body')		

		initialize : () =>
			@paginador = new Paginador()
			@sector = new Sector()
			@lugar = new Lugar()
			@init()

		init : () =>
			Singleton.get().showLoading()
			#cargamos los tipos en los filtros
			if _.isEmpty(@tipo)
				@lugar.buscarTipos(@cargarTiposEnMemoria)
			$('#appView').html _.template(Tpllugares)({tipos: @tipos})
			$('.scroll').css('height',window.innerHeight - 75)
			#seteamos los filtros de comuna y sectores en talca
			$('#filtrocomuna').val "Talca"
			@lugar.buscarSectores(7101,@cargaSectorTalcafiltro)
			@filtrar()
			Singleton.get().hideLoading()

			#setiamos los tooltip
			$('#nuevolugar').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			$('#next').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})		
			$('#previous').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})

			$('#nuevolugar').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				@nuevo(e)

			$('#filtrar').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				@filtrar()

			$(document).on "keyup", "#filtrocomuna", (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#filtrosector').html '<option value="0" selected="selected">Seleccione...</option>'


			#paginador next
			$('#next').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showLoading()
				$.ajax
					url:"#{base_url}/index.php/services/lugares/contarRegistros"
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
					url:"#{base_url}/index.php/services/lugares/contarRegistros"
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

			#funcion que envia el id del cliente
			log = (idcomuna) =>
				# option= '<option value="0" selected="selected">Seleccione...</option>'
				# $('#filtrosector').html option
				# $('#filtrosector option[value=0]').attr('selected',true)
				console.log 'idcomuna'+idcomuna
				@lugar.buscarSectores(idcomuna,@cargaSectorTalcafiltro)

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
								idcomuna   : item.COMUNA_ID		
							)
						error: (data) ->
							$('#filtrocomuna').removeClass("ui-autocomplete-loading")
							$('#filtrocomuna').autocomplete( "close" );

				minLength: 1,
				select: (event, ui) ->
					if ui.item
						log(ui.item.idcomuna)
				open: ->
					$('#filtrocomuna').removeClass("ui-autocomplete-loading")
				close: ->
					$('#filtrocomuna').removeClass("ui-autocomplete-loading")

		#crea el filtro para mostrar la tabla
		filtrar : () =>
			Singleton.get().showLoading()
			@objData=
			{
				comuna   		: $('#filtrocomuna').val()
				idsector   		: $('#filtrosector').val()
				idtipo   		: $('#tipo').val()
				start		    : @paginador.start
				end 		    : '14'
			}
			$.ajax
				url:"#{base_url}/index.php/services/lugares/contarRegistros"
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

		#carga los datos de la tabla de lugares
		cargar : () =>
			$.ajax
				url:"#{base_url}/index.php/services/lugares/filtrar"
				type:'POST'
				data: @objData
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(s) =>
					$('#cargatabla').html _.template(Tplresultados)({lugares: s})
					Singleton.get().hideLoading()	
					$('#tablaBody tr').click (e) =>
						e.preventDefault()
						e.stopPropagation()
						@clickTr(e)
				error:(s) =>
					Singleton.get().showInformacion('No existe información para los filtros seleccionados')
					$('#btnExito').click (e) =>
						@initialize()


		#metodo que realiza el manejo de ingreso de un nuevo lugar
		nuevo : (e) =>
			e.preventDefault()
			e.stopPropagation()
			# Singleton.get().showLoading()
			$('#appView').css('display','none')

			#cargamos las regiones y los tipos en memoria
			if _.isEmpty(@regiones)
				@sector.buscarRegiones(@cargarRegionesEnMemoria)
			if _.isEmpty(@tipo)
				@lugar.buscarTipos(@cargarTiposEnMemoria)

			#cargamos las regiones y los tipos en el template
			$('#appViewNext').html _.template(Tplnuevo)({regiones: @regiones; tipos: @tipos})

			#cargamos por defecto la comuna de talca y los sectores de talca
			$('#regionselect').attr("value",7)
			@sector.buscarProvincia(7,@cargaProvinciaTalca)
			$('#provinciaselect').attr("value",71)
			@sector.buscarComuna(71,@cargaComunaTalca)
			$('#comunaselect').attr("value",7101)
			@lugar.buscarSectores(7101,@cargaSectorTalca)
			Singleton.get().hideLoading()

			$('.newTitulo').click (e) =>
				@volveriteminicial(e)

			$('#regionselect').change (e) =>
				e.preventDefault()
				e.stopPropagation()
				option= '<option value="0" selected="selected">Seleccione...</option>'
				$('#sectorselect').html option
				$('#comunaselect').html option
				$('#comunaselect option[value=0]').attr('selected',true)
				reg = $('#regionselect').find(':selected').val()
				if reg isnt '0' and reg isnt ''
					@sector.buscarProvincia(reg,@cargaProvincias)
				else
					$('#provinciaselect').html option
					$('#comunaselect').html option
					$('#sectorselect').html option

			$('#provinciaselect').change (e) =>
				e.preventDefault()
				e.stopPropagation()
				pro = $('#provinciaselect').find(':selected').val()
				if pro isnt '0' and pro isnt ''
					@sector.buscarComuna(pro,@cargaComuna)
				else
					option= '<option value="0" selected="selected">Seleccione...</option>'
					$('#comunaselect').html option
					$('#sectorselect').html option

			$('#comunaselect').change (e) =>
				e.preventDefault()
				e.stopPropagation()
				option= '<option value="0" selected="selected">Seleccione...</option>'
				$('#sectorselect').html option
				com = $('#comunaselect').find(':selected').val()
				@lugar.buscarSectores(com,@cargaSector)

			$('#guardarlugar').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Validator = true
				#realizamos el resto de las validaciones
				if $('#tiposelect').find(':selected').val() is '' or $('#tiposelect').find(':selected').val() is '0'
					Singleton.get().showInformacion('Debe asignar un tipo al nuevo lugar')
					Validator= false

				if $('#sectorselect').find(':selected').val() is '' or $('#sectorselect').find(':selected').val() is '0'
					Singleton.get().showInformacion('Debe asignar sector al lugar')
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

				if $('#nombrelugar').val() is ''
					Singleton.get().showInformacion('Debe ingresar un nombre al lugar')
					Validator= false
				#===================================================================================================================================
				if Validator is true
					#validamos que no existe otro lugar con el mismo nombre y tipo en el mismo sector
					@lugar.buscarLugarExistente($('#nombrelugar').val(),$('#tiposelect').val(),$('#sectorselect').val(),@verificarlugares)
					if @cantidad isnt 0
						Singleton.get().showInformacion('Ya existe un lugar con ese nombre y tipo para ese sector')
						$('#nombrelugar').val ""
					else
						datos = {
							Nombre: $('#nombrelugar').val()
							Id_Sector : $('#sectorselect').val()
							Id_Tipo : $('#tiposelect').val()
						}
						new Lugar().guardarLugar datos, (data) =>
							if _.isUndefined(data.error)
								Singleton.get().showExito('El lugar ha sido guardado exitosamente.')
								$('#appView').css('display','block')
								$('#appViewNext').empty()
								@filtrar()
							else
								Singleton.get().showError('El lugar no ha podido ser guardado.')

			$('#cancelarlugar').click (e) =>
				@cancelar(e)

		#agregar color rojo a los tr de las tablas cuando se selecciona 
		clickTr: (e) =>
			e.preventDefault()
			e.stopPropagation()
			@idlugar = e.currentTarget.attributes[0].value
			html= html + """<option value="accion">Acciones</option>""" + """<option value="editar">Editar</option>"""+ """<option value="eliminar">Eliminar</option>"""
			$('#accionesLugares').html(html)
			$(e.currentTarget).addClass('active')
			$(e.currentTarget).siblings().removeClass('active')
			$('#accionesLugares').unbind "change"
			$('#accionesLugares').change (e) =>
				e.preventDefault()
				e.stopPropagation()
				@acciones(e)

		acciones : (e) =>
			Validator= true
			e.preventDefault()
			e.stopPropagation()
			if ("editar" == $('#accionesLugares').find(':selected').val())
				Singleton.get().showLoading()
				#cargamos las regiones y los tipos en memoria sin no estan 
				if _.isEmpty(@regiones)
					@sector.buscarRegiones(@cargarRegionesEnMemoria)
				if _.isEmpty(@tipo)
					@lugar.buscarTipos(@cargarTiposEnMemoria)

				#cargamos las regiones y los tipos en el template
				$('#appView').css('display','none')
				$('#appViewNext').html _.template(Tpleditar)({regiones: @regiones; tipos: @tipos})
				@lugar.buscarLugar(@idlugar,@cargareditar)

				$('.newTitulo').click (e) =>
					@volveriteminicial(e)

				$('#regionselect').change (e) =>
					e.preventDefault()
					e.stopPropagation()
					option= '<option value="0" selected="selected">Seleccione...</option>'
					$('#sectorselect').html option
					$('#comunaselect').html option
					$('#comunaselect option[value=0]').attr('selected',true)
					reg = $('#regionselect').find(':selected').val()
					if reg isnt '0' and reg isnt ''
						@sector.buscarProvincia(reg,@cargaProvincias)
					else
						$('#provinciaselect').html option
						$('#comunaselect').html option
						$('#sectorselect').html option

				$('#provinciaselect').change (e) =>
					e.preventDefault()
					e.stopPropagation()
					pro = $('#provinciaselect').find(':selected').val()
					if pro isnt '0' and pro isnt ''
						@sector.buscarComuna(pro,@cargaComuna)
					else
						option= '<option value="0" selected="selected">Seleccione...</option>'
						$('#comunaselect').html option
						$('#sectorselect').html option

				$('#comunaselect').change (e) =>
					e.preventDefault()
					e.stopPropagation()
					option= '<option value="0" selected="selected">Seleccione...</option>'
					$('#sectorselect').html option
					com = $('#comunaselect').find(':selected').val()
					@lugar.buscarSectores(com,@cargaSector)

				$('#guardarlugar').click (e) =>
					e.preventDefault()
					e.stopPropagation()
					Validator = true
					#realizamos el resto de las validaciones
					if $('#tiposelect').find(':selected').val() is '' or $('#tiposelect').find(':selected').val() is '0'
						Singleton.get().showInformacion('Debe asignar un tipo al nuevo lugar')
						Validator= false

					if $('#sectorselect').find(':selected').val() is '' or $('#sectorselect').find(':selected').val() is '0'
						Singleton.get().showInformacion('Debe asignar sector al lugar')
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

					if $('#nombrelugar').val() is ''
						Singleton.get().showInformacion('Debe ingresar un nombre al lugar')
						Validator= false
					#===================================================================================================================================
					if Validator is true
						#validamos que no existe otro lugar con el mismo nombre y tipo en el mismo sector
						@lugar.buscarLugarExistente($('#nombrelugar').val(),$('#tiposelect').val(),$('#sectorselect').val(),@verificarlugares)
						if @cantidad isnt 0
							Singleton.get().showInformacion('Ya existe un lugar con ese nombre y tipo para ese sector')
							$('#nombrelugar').val ""
						else
							datos = {
								idlugar: @idlugar
								Nombre: $('#nombrelugar').val()
								Id_Sector : $('#sectorselect').val()
								Id_Tipo : $('#tiposelect').val()
							}
							new Lugar().actualizarLugar datos, (data) =>
								if _.isUndefined(data.error)
									Singleton.get().showExito('El lugar ha sido actualizado exitosamente.')
									$('#appView').css('display','block')
									$('#appViewNext').empty()
									@filtrar()
								else
									Singleton.get().showError('El lugar no ha podido ser actualizado.')
 
				$('#cancelarlugar').click (e) =>
					@cancelar(e)
															
			if ("eliminar" == $('#accionesLugares').find(':selected').val())
				@eliminar()

		cargareditar : (data) =>
			@sectorid =data[0].Id_Sector
			$('#nombrelugar').val data[0].Nombre
			$('#tiposelect').val data[0].Id_Tipo
			@lugar.buscarzona(data[0].Id_Sector,@cargareditarzona)

		#cargamos la zona del sector
		cargareditarzona : (data) =>
			$('#regionselect').attr("value",data[0].IdRegion)
			@sector.buscarProvincia(data[0].IdRegion,@cargaProvinciaTalca)
			$('#provinciaselect').attr("value",data[0].IdProvincia)
			@sector.buscarComuna(data[0].IdProvincia,@cargaComunaTalca)
			$('#comunaselect').attr("value",data[0].IdComuna)
			@lugar.buscarSectores(data[0].IdComuna,@cargaSectorTalca)
			$('#sectorselect').attr("value",@sectorid)
			Singleton.get().hideLoading()

		eliminar: () =>
			Singleton.get().showAdvertencia()
			$('#btnAceptarAdvertencia').click (e) =>
				new Lugar().eliminarLugar @idlugar, (data) =>
					if _.isUndefined(data.error)
							if data is 'true'
								Singleton.get().showExito('El lugar ha sido eliminado exitosamente.')
								$('#appView').css('display','block')
								$('#appViewNext').empty()
								@filtrar()
							else
								Singleton.get().showInformacion('El lugar no puede ser eliminado, debido a que actualmente esta siendo ocupado')
								$('#appView').css('display','block')
								$('#appViewNext').empty()
					else
						Singleton.get().showError('El lugar no ha podido ser eliminado.')

		verificarlugares: (cantidad) =>
			@cantidad = parseInt(cantidad[0].c)

		# Busca las regiones y las mantiene en memoria
		cargarRegionesEnMemoria : (regiones) => 
			@regiones = regiones
		# Busca las regiones y las mantiene en memoria
		cargarProvinciasEnMemoria : (regiones) => 
			@provincias = regiones
		# Busca las regiones y las mantiene en memoria
		cargarComunasEnMemoria : (regiones) => 
			@comunas = regiones

		cargarTiposEnMemoria : (tipos) => 
			@tipos = tipos

		volveriteminicial: (e) =>
			#cuando hacen click en el hipervinculo
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appView').css('display','block')
			$('#appViewNext').empty()
			Singleton.get().hideLoading()

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

		#carga las comunas segun la region seleccionada				
		cargaSectorTalcafiltro : (p) =>
			option= '<option value="0" selected="selected">Seleccione...</option>'
			for iterator in p
				option+= '<option value="' + iterator.Id_Sector+ '" selected="selected">' + iterator.Nombre + '</option>'
			$('#filtrosector').html option
			$('#filtrosector option[value=0]').attr('selected',true)

		#carga los sectores de la comuna indicada			
		cargaSectorTalca : (p) =>
			option= '<option value="0" selected="selected">Seleccione...</option>'
			if p isnt ''
				for iterator in p
					option+= '<option value="' + iterator.Id_Sector+ '" selected="selected">' + iterator.Nombre + '</option>'
			$('#sectorselect').html option
			$('#sectorselect option[value=0]').attr('selected',true)

		#---------------------------------------------------------------------------------------------------------------------------------------------------------

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

		#carga las comunas segun la region seleccionada				
		cargaSector: (p) =>
			Singleton.get().showLoading()
			option= '<option value="0" selected="selected">Seleccione...</option>'
			if p isnt ''
				for iterator in p
					option+= '<option value="' +iterator.Id_Sector+ '" selected="selected">' +iterator.Nombre + '</option>'
			$('#sectorselect').html option
			$('#sectorselect option[value=0]').attr('selected',true)
			Singleton.get().hideLoading()

		cancelar: (e) =>					
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appViewNext').html("")
			$('#appView').css('display','inline')
			Singleton.get().hideLoading()