define [
	'backbone'
	'text!tpl/mantenedorEntidades/entidades.html'
	'text!tpl/mantenedorEntidades/nueva.html'
	'text!tpl/mantenedorEntidades/editar.html'
	'text!tpl/mantenedorEntidades/resultadoEntidad.html'
	'assets/js/view/paginador'
	'assets/js/model/entidad'
] , (Backbone,Tplentidades,Tplnueva,Tpleditar,Tplresultadosentidad,Paginador,EntidadesModel) ->  
	class entidades extends Backbone.View
		el:('body')		

		initialize : () =>
			@paginador = new Paginador()
			@entidadModel = new EntidadesModel()
			@entidadModel.buscarCategorias (@cargarClasificacionEnMemoria)

			@objData=
			{
				nombreentidad 	: ""
				rutentidad 	: ""
				tipoentidad 	: "vacio"
				clasificacionentidad 	: "vacio"
				start		    : @paginador.start
				end 		    : '14'
			}

			@init()
			#@initPaginador()

		init : () =>
			Singleton.get().showLoading()
			$('#appView').html _.template(Tplentidades)({clasificacion: @clasificacion})
			@filtrar()
			Singleton.get().hideLoading()

			$('.scroll').css('height',window.innerHeight - 75)

			#setiamos los tooltips
			$('#next').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})		
			$('#previous').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})
			#setiamos los tooltips agregar entidad
			$('#nuevaentidad').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})

			$('#DV').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

			$(document).on "focusout", "#DV", (e) =>
				e.preventDefault()
				e.stopPropagation()
				if $('#DV').val() isnt ""
					if(!Singleton.get().ValidarRut($('#DV').val()))
						Singleton.get().showError('El Valor Ingresado es Incorrecto')
						$('#DV').val ""
					else
						rut = $('#DV').val()
						rut = Singleton.get().cleanRut(rut)
						rut = Singleton.get().formatearRut(rut)
						$('#DV').val rut

			$('#nuevaentidad').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				@nuevo(e)

			#autocompleta el buscador nombre
			$("#autoc1").autocomplete
				source: (request, response) ->
					$.ajax
						url:"#{base_url}/index.php/services/entidades/mientidad"
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
								#Rut: $('#DV').attr("value","")
								Rut: item.Rut_Entidad
							)
						error: (data) ->
							$('#autoc1').removeClass("ui-autocomplete-loading")
							$('#autoc1').autocomplete( "close" );

				minLength: 1,
				#
				select: (event, ui) ->
					if ui.item
						$('#DV').val(Singleton.get().formatearRut(ui.item.Rut))
				#
				open: ->
					$('#autoc1').removeClass("ui-autocomplete-loading")
				close: ->
					$('#autoc1').removeClass("ui-autocomplete-loading")


			$('#filtrarEntidades').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				@filtrar()


			#paginador next
			$('#next').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showLoading()
				$.ajax
					url:"#{base_url}/index.php/services/entidades/contarRegistros"
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


			#paginador previo
			$('#previous').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showLoading()
				$.ajax
					url:"#{base_url}/index.php/services/entidades/contarRegistros"
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



		#metodo que carga las clasificaciones de clientes para el selector
		cargarClasificacionEnMemoria : (clasificacion) =>
			@clasificacion = clasificacion

		nuevo : (e) =>
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appView').css('display','none')
			$('#appViewNext').html _.template(Tplnueva)({clasificacion: @clasificacion})
			$('#mensaje').css('display','none')
			Singleton.get().hideLoading()


			$(document).on "focusout", "#rut", (e) =>
				e.preventDefault()
				e.stopPropagation()
				if $('#rut').val() isnt ""
					if(!Singleton.get().ValidarRut($('#rut').val())) 
						$("#mensaje").html  "&nbsp;&nbsp;El rut ingresado es incorrecto"
						$('#mensaje').css('display','inline')
						$('#rut').val ""
					else
						rut = $('#rut').val()
						rut = Singleton.get().cleanRut(rut)
						rut = Singleton.get().formatearRut(rut)
						if rut.substring(0,1)  is '0'
							$('#rut').val  rut.substring(1,rut.lenght)
						else
							$('#rut').val rut
						@entidadModel.buscarEntidad(Singleton.get().cleanRut(rut),@verificarexistencia)

			$(document).on "focus","#rut", (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#mensaje').css('display','none')
				$('#guardarnuevaentidad').css('display','inline')
				false

			$('.newTitulo').click (e) =>
				@volveriteminicial(e)

			#validamos que solo ingresen numeros en el telefono
			$('#telefono').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

			$('#rut').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

			$('#cancelarentidad').click (e) =>
				@cancelar(e)


			$('#guardarnuevaentidad').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				Validator = true
				#validamos los datos de la entidad===========================================================================================
				if $('#clasificacionaentidad').find(':selected').val() is ''
					Singleton.get().showInformacion('Debe seleccionar una clasificación para la entidad')
					Validator= false

				if $('#nombre').val() is ''
					Singleton.get().showInformacion('Debe ingresar el nombre del cliente')
					Validator= false

				if $('#rut').val() is ''
					Singleton.get().showInformacion('Debe ingresar el rut del cliente')
					Validator= false

				if Validator is true
					datos = {
						Rut: Singleton.get().cleanRut($('#rut').val())
						Nombre : $('#nombre').val()
						Telefono : $('#telefono').val()
						Email : $('#email').val()
						Tipo: $('#tipoentidad').val()
						Clasificacion : $('#clasificacionaentidad').val()
					}
					console.log "ACA"
					console.log  datos
					new EntidadesModel().guardarEntidad datos, (data) =>
						if _.isUndefined(data.error)
							Singleton.get().showExito('La entidad ha sido guardada exitosamente.')
							$('#appView').css('display','block')
							$('#appViewNext').empty()
							@filtrar()
						else
							Singleton.get().showError('La entidad no ha podido ser guardada.')


		cancelar: (e) =>					
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appViewNext').html("")
			$('#appView').css('display','inline')
			Singleton.get().hideLoading()


		#crea el filtro para mostrar la tabla
		filtrar : () =>
			Singleton.get().showLoading()

			@objData=
			{
				nombreentidad 	: $('#autoc1').val()
				rutentidad 	: Singleton.get().cleanRut($('#DV').val())
				tipoentidad 	: $('#tipoentidad').val()
				clasificacionentidad 	: $('#clasificacion').val()
				start		    : @paginador.start
				end 		    : '14'
			}
			
			$.ajax
				url:"#{base_url}/index.php/services/entidades/contarRegistros"
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
					Singleton.get().showError('No existe el filtro')
					Singleton.get().hideLoading()

		#carga los datos de la tabla de entidades	
		cargar : () =>
			$.ajax
				url:"#{base_url}/index.php/services/entidades/filtrar"
				type:'POST'
				data: @objData
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(s) =>
					$('#cargatabla').html _.template(Tplresultadosentidad)({entidades: s})
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
			@rutentidad = e.currentTarget.attributes[0].value
			html= html + """<option value="accion">Acciones</option>""" + """<option value="editar">Editar</option>"""+ """<option value="eliminar">Eliminar</option>"""
			$('#accionesentidades').html(html)
			$(e.currentTarget).addClass('active')
			$(e.currentTarget).siblings().removeClass('active')
			$('#accionesentidades').change (e) =>
				e.preventDefault()
				e.stopPropagation()
				@acciones(e)


		acciones : (e) =>
			e.preventDefault()
			e.stopPropagation()
			if ("editar" == $('#accionesentidades').find(':selected').val())
				Singleton.get().showLoading()
				$('#appView').css('display','none')
				$('#appViewNext').html _.template(Tpleditar)({clasificacion: @clasificacion})
				Singleton.get().hideLoading()
				@entidadModel.buscarEntidad(@rutentidad,@cargareditar)
				Singleton.get().hideLoading()
				$('#modal').remove()

				$('.newTitulo').click (e) =>
					@volveriteminicial(e)

				$('#telefono').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

				$('#cancelarentidad').click (e) =>
					@cancelar(e)


				$('#guardareditarentidad').click (e) =>
					e.preventDefault()
					e.stopPropagation()

					Validator = true
					#validamos los datos de la entidad===========================================================================================
					if $('#clasificacionaentidad').find(':selected').val() is ''
						Singleton.get().showInformacion('Debe seleccionar una clasificación para la entidad')
						Validator= false

					if $('#nombre').val() is ''
						Singleton.get().showInformacion('Debe ingresar el nombre del cliente')
						Validator= false

					if $('#rut').val() is ''
						Singleton.get().showInformacion('Debe ingresar el rut del cliente')
						Validator= false

					if Validator is true
						datosactualizar = {
							rut: @rutentidad
							nombre: $('#nombre').val()
							telefono: $('#telefono').val()
							email: $('#email').val()
							clasificacion: $('#clasificacionaentidad').val()
						}
						new EntidadesModel().actualizarEntidad datosactualizar, (data) =>
							if _.isUndefined(data.error)
								Singleton.get().showExito('La entidad ha sido actualizado exitosamente.')
								$('#appView').css('display','block')
								$('#appViewNext').empty()
								@filtrar()
							else
								Singleton.get().showError('la entidad no ha podido ser actualizada.')


			if ("eliminar" == $('#accionesentidades').find(':selected').val())
				@eliminar()


		cargareditar : (data) =>
			$('#rut').attr("value",Singleton.get().formatearRut(data[0].Rut_Entidad))
			$('#nombre').attr("value",data[0].Nombre)
			if data[0].Telefono is '0'
				$('#telefono').attr("value","")
			else
				$('#telefono').attr("value",data[0].Telefono)
			$('#email').attr("value",data[0].Email)
			$('#clasificacionaentidad').attr("value",data[0].Id_ClasificacionEntidad)



		eliminar: () =>
			Singleton.get().showAdvertencia()
			$('#btnAceptarAdvertencia').click (e) =>
				new EntidadesModel().eliminarEntidad @rutentidad, (data) =>
					if _.isUndefined(data.error)
						if data is 'true'
							Singleton.get().showExito('El cliente ha sido eliminado exitosamente.')
							$('#appView').css('display','block')
							$('#appViewNext').empty()
							@filtrar()
						else
							Singleton.get().showInformacion('El cliente no puede ser eliminado, debido a que esta siendo utilizado en un pedido')
					else
						Singleton.get().showError('La entidad no ha podido ser eliminada.')

		volveriteminicial: (e) =>
			#cuando hacen click en el hipervinculo
			e.preventDefault()
			e.stopPropagation()
			Singleton.get().showLoading()
			$('#appView').css('display','block')
			$('#appViewNext').empty()
			Singleton.get().hideLoading()
			false

