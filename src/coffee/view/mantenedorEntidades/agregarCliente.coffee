define [
	'backbone'
	'text!tpl/mantenedorEntidades/nueva.html'
	'assets/js/model/entidad'
] , (Backbone,TplViewAddCliente,EntidadesModel) ->  
	class agregarCliente extends Backbone.View
	
		# Cargamos la vista principal de la nueva cotizacion
		initialize : () =>
			@entidadModel = new EntidadesModel()
			@entidadModel.buscarCategorias (@cargarClasificacionEnMemoria)
			@init()
			
		
		init : () =>
			Singleton.get().showLoading()
			$('#modal').css('width',820)	
			$('#modal').css('height',268)	
			$('#modal').css('left' ,'40.5%')	
			$('#modal').css('top' ,'45%')
			$('#modal').css('background-color', '#f6f6f6')	
			$('#modal').html _.template(TplViewAddCliente)({clasificacion: @clasificacion})
			$('#mensaje').css('display','none')

			#validamos que solo ingresen numero en el telefono
			$('#telefono').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

			#validamos que solo ingresen numeros en el rut
			$('#rut').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

			# $('#mensaje').css('display','none')
			# document.getElementById("#mensaje").value = 'texto cambiado';
			# document.all("mensaje").innerHTML = 'texto cambiado';



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

							

			$('#guardarnuevaentidad').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				Validator = true
				#validamos los datos de la entidad===========================================================================================
				if $('#clasificacionaentidad').find(':selected').val() is ''
					Validator= false

				if $('#nombre').val() is ''
					Validator= false

				if $('#rut').val() is ''
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
					new EntidadesModel().guardarEntidad datos, (data) =>
						if _.isUndefined(data.error)
							$('#autoc1').val $('#nombre').val()
							$('#DV').val $('#rut').val()
							$('#TelefonoCliente').val $('#telefono').val()
							$('#Destinatario').empty()
							$('#DireccionDestinatario').val ''
							$('#TelefonoDestinatario').val ''
							$('#CotFlete').val '0'
							$('#validezCotizacion').val ""
							$('#validezCotizacion').attr('disabled','disabled')
							$('#horaentrega').html '<option value="">Seleccione</option>' 
							Singleton.get().setiarFlete()
							Singleton.get().showExito('La entidad ha sido guardada exitosamente.')
							$('#appView').css('display','block')
							$('#appViewNext').empty()
						else
							Singleton.get().showError('La entidad no ha podido ser guardada.')
				false

			$('#cancelarentidad').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#modal').modal('hide')
			
		#metodo que carga las clasificaciones de clientes para el selector
		cargarClasificacionEnMemoria : (clasificacion) =>
			@clasificacion = clasificacion

		verificarexistencia : (data) =>
			if $('#rut').attr("value",Singleton.get().formatearRut(data[0].Rut_Entidad)) isnt ''
				$("#mensaje").html  "&nbsp;&nbsp;El Cliente ya existe en el sistema"
				$('#mensaje').css('display','inline')
				$('#guardarnuevaentidad').css('display','none')
