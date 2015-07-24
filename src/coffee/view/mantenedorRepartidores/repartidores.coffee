define [
	'backbone'
	'text!tpl/mantenedorRepartidores/repartidores.html'
	'assets/js/model/repartidores'
] , (Backbone,Tplrepartidores,RepartidoresModel) ->  
	class Repartidores extends Backbone.View
		el:('body')		

		initialize : () =>
			@repartidores = new RepartidoresModel()
			@repartidores.buscarFechaRepartidores(@cargarFechasEnAreglo)
			@init()

		init : () =>
			$('#appView').html _.template(Tplrepartidores)()
			#cargamos las fechas en el areglo para cargarlas en el datepicker
			$('.scroll').css('height',window.innerHeight - 75)
			$('#cantidadrepartidores').keydown (event) ->
				if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39)
					return
				else
					event.preventDefault()  if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)

			i = 0
			events = new Array(1)
			seleccionados= new Array(1)
			for f in @fechas
				if f.cantidadrepartidores isnt '1'
					events[i] = f.fecha
				i++

			$('#divcalendario').datepicker(
				dateFormat: "dd/mm/yy"
				firstDay: 1
				dayNamesMin: [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa" ]
				monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ]
				beforeShowDay: (date) =>
					# obtenemos la fecha de ca elemento del calendario
					current = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
					#seteamos el tooltip
					existe = false
					for f in @fechas
						if f.fecha is current
							tooltip = f.cantidadrepartidores
							existe = true
						i++
					if existe is false
						tooltip = 1
					#seteamos los estilos y los tooltip importante
					(if jQuery.inArray(current, seleccionados) is -1 then (if jQuery.inArray(current, events) is -1 then [true, ""] else [true,'ui-state-highlight',tooltip+" repartidores"]) else [true,'ui-widget-header',tooltip+" repartidores"]) 
					


				onSelect: (dateText, inst) =>
					fechaclick= inst.selectedDay+'-'+(inst.selectedMonth+1)+'-'+inst.selectedYear
					existe = false
					#setiamos la cantidad de repartidores
					i = 0
					$('#cantidadrepartidores').val 1
					for f in @fechas
						if fechaclick is f.fecha
							$('#cantidadrepartidores').val f.cantidadrepartidores
						i++

					#verificamos i ya estaba seleccionado
					i = 0
					bandera = 0
					while i < seleccionados.length
						if seleccionados[i] == fechaclick
							bandera = i
							existe = true
						i++
					#adherimos a repartidores seleccionados para modificar fecha
					if existe is false
						seleccionados.push fechaclick
					else
						seleccionados.splice(bandera,1)
			)

			$('#guardarrepartidor').click () =>
					Validator = true
					#validamos los datos del destino===========================================================================================
					if $('#cantidadrepartidores').val() is ''
						Singleton.get().showInformacion('Debe ingresar cantidad de repartidores para los dias seleccionados')
						Validator= false

					if seleccionados.length is 1
						Singleton.get().showInformacion('Debe seleccionar una fecha para modificar la cantidad de repartidores')
						Validator= false

					if Validator is true
						datosfechas = {
							fechasselect : seleccionados
						}
						new RepartidoresModel().obtenercantidadpedidos datosfechas , (data) =>
							if data is ""
								antiguos = new Array(1)
								nuevos= new Array(1)
								#verificamos cuales datos son nuevos y antiguos-----------------------------------------------
								i = 0
								while i < seleccionados.length
									existe = false
									for f in @fechas
										if seleccionados[i] is f.fecha
											existe = true
									if existe is true
										antiguos.push seleccionados[i]
									else
										nuevos.push seleccionados[i]
									i++
								#---------------------------------------------------------------------------------------------
								datos = {
									seleccionadosnuevos: nuevos
									seleccionadosantiguos: antiguos
									cantidadrepartidores: $('#cantidadrepartidores').val()
								}
								new RepartidoresModel().guardarRepartidorFecha datos, (data) =>
									if _.isUndefined(data.error)
										Singleton.get().showExito('Los repartidores se han actualizado exitosamente')
										@initialize()
									else
										Singleton.get().showError('Los repartidores no han podido ser actualizados')
										@initialize()
							else
								Singleton.get().showAdvertencia("Advertencia","Existen pedidos ingresados en las fechas seleccionadas ¿Desea continuar con la modificación?")
								$('#btnAceptarAdvertencia').click (e) =>
									e.preventDefault()
									e.stopPropagation()
									antiguos = new Array(1)
									nuevos= new Array(1)
									#verificamos cuales datos son nuevos y antiguos-----------------------------------------------
									i = 0
									while i < seleccionados.length
										existe = false
										for f in @fechas
											if seleccionados[i] is f.fecha
												existe = true
										if existe is true
											antiguos.push seleccionados[i]
										else
											nuevos.push seleccionados[i]
										i++
									#---------------------------------------------------------------------------------------------
									datos = {
										seleccionadosnuevos: nuevos
										seleccionadosantiguos: antiguos
										cantidadrepartidores: $('#cantidadrepartidores').val()
									}
									new RepartidoresModel().guardarRepartidorFecha datos, (data) =>
										if _.isUndefined(data.error)
											Singleton.get().showExito('Los repartidores se han actualizado exitosamente')
											@initialize()
										else
											Singleton.get().showError('Los repartidores no han podido ser actualizados')
											@initialize()

			
		cargarFechasEnAreglo : (fechas) =>
			@fechas = fechas
		