define [
	'backbone'
	'text!tpl/mantenedorContactos/contactos.html'
	'text!tpl/mantenedorContactos/resultados.html'
	'text!tpl/mantenedorContactos/nuevo.html'
	'assets/js/view/paginador'
] , (Backbone,Tplcontactos,Tplresultados,Tplnuevo,Paginador) ->  
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
	
		acciones : (e) =>
			e.preventDefault()
			e.stopPropagation()
			if ("nueva" == $('#accionescontacto').find(':selected').val())
				@nuevo()
			if ("editar" == $('#accionescontacto').find(':selected').val())
				@editar()
			if ("eliminar" == $('#accionesLista').find(':selected').val())
				@eliminar()


		init : () =>
			Singleton.get().showLoading()
			$('#appView').html _.template(Tplcontactos)
			Singleton.get().hideLoading()
			$('#nuevocontacto').click (e) =>
				@nuevo()
			$('.newTitulo').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				Singleton.get().showLoading()
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				Singleton.get().hideLoading()

			$('#next').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})		
			$('#previous').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})	
			$('#nuevalista').tooltip({'trigger':'hover','delay':{'show':100,'hide':100}})	

			if window.innerWidth is 1280
					$('.scroll').css('width',window.innerWidth - 260)
					Singleton.get().hideLoading()
			else
				$('.scroll').css('width',window.innerWidth - 251)
			$('.scroll').css('height',window.innerHeight - 75)

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
							response $.map(data, (item) ->
								label: item.Nombre
								value: item.Nombre
								rut: item.Rut_Entidad
							)
						error: (data) ->
							$('#autoc1').removeClass("ui-autocomplete-loading")
							$('#autoc1').autocomplete( "close" );

				minLength: 1,

				select: (event, ui) ->
					if ui.item
						log(ui.item.rut)
				open: ->
					$('#autoc1').removeClass("ui-autocomplete-loading")
				close: ->
					$('#autoc1').removeClass("ui-autocomplete-loading")
			#Arregla el rut generado del autocompletar			
			log = (rut) ->
				$('#rutcliente').val Singleton.get().formatearRut(rut)
			if window.innerWidth is 1280
				$('.scroll').css('width',window.innerWidth - 260)
				#Singleton.get().hideLoading()
			else
				$('.scroll').css('width',window.innerWidth - 251)
			$('.scroll').css('height',window.innerHeight - 75)
				#Singleton.get().hideLoading()	
			$('#filtrarUsuarios').click (e) =>
				@filtrar()	

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


		nuevo : () =>
			Singleton.get().showLoading()
			$.ajax
				url:"#{base_url}/index.php/services/destino/regiones"
				type:'GET'
				cache: true
				statusCode:
					302: ->
						Singleton.get().reload()
				success:(s) =>
					$('#appViewNext').html _.template(Tplnuevo)({regiones: s})
					$('.newTitulo').click (e) =>
						e.preventDefault()
						e.stopPropagation()
						Singleton.get().showLoading()
						$('#appView').css('display','block')
						$('#appViewNext').empty()
						Singleton.get().hideLoading()
					$('#appView').css('display','none')
			Singleton.get().hideLoading()