define [
	'backbone'
	'text!tpl/historialCotizaciones/trackingList.html'
	'text!tpl/historialCotizaciones/trackingFiltro.html'

] , (Backbone,TplviewtrackingList, TplviewtrackingFiltro) ->  
	class tracking extends Backbone.View

		# Cargamos la vista principal de la lista de cotizaciones
		initialize : () =>
			@init()
		init : () =>
			Singleton.get().showLoading()

			#cargamos el template=====================================================================================================================
			$('#appView').html _.template(TplviewtrackingFiltro)({})
			#==========================================================================================================================================			
			$('.scroll').css('height',window.innerHeight - 75)

			
			#si el perfil de usuario es distinto a gerente desactivamos el filtro de usuarios.
			if Singleton.get().idPerfilUsuarioLogueado isnt '2' and Singleton.get().idPerfilUsuarioLogueado isnt '1'
				$('#trackingUsuario').attr('disabled', 'disabled');

			$('#fechaDesde').datepicker
				dateFormat: "dd/mm/yy"
				dayNamesMin: [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa" ]
				monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ]

			$('#fechaHasta').datepicker
				dateFormat: "dd/mm/yy"
				dayNamesMin: [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa" ]
				monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ]


			$('#trackingFiltrar').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				@filtrar()
				false

			# $('#trackingPedido').change (e) =>
			# 	@cargarItems()
			# 	false

			#cargamos los id de los pedidos
			@cargarPedidos()

		# 	#cargamos las clases
			@cargarClases()

			#cargamos los usuarios
			@cargarUsuarios()

			if Singleton.get().idPedidoTracking isnt 0
				@filtrar()
			else
				Singleton.get().hideLoading()

		filtrar: () =>

			fechaDesde= ''
			fechaHasta= ''
			row= ''

			if Singleton.get().idPedidoTracking is 0
				Singleton.get().showLoading()
				Singleton.get().idPedidoTracking= $('#trackingPedido').val()
			
			idClase= $('#trackingClase').find(':selected').val()
			idUsuario= $('#trackingUsuario').find(':selected').val()

			if $('#fechaDesde').val() isnt ''
				fechaDesde= Singleton.get().invertirFecha($('#fechaDesde').val(),'I')
			if $('#fechaHasta').val() isnt ''
				fechaHasta= Singleton.get().invertirFecha($('#fechaHasta').val(),'I')

			if fechaHasta < fechaDesde
				aux = fechaDesde
				fechaDesde = fechaHasta
				fechaHasta = aux

			idPedido= Singleton.get().idPedidoTracking

			$.ajax
				url:"#{base_url}/index.php/services/trackingPedido/filtrarTracking"
				data:
					idPedido: idPedido
					idClase: idClase
					idUsuarioFiltro:idUsuario
					fechaDesde:fechaDesde
					fechaHasta:fechaHasta
					idUsuario: Singleton.get().idUsuarioLogueado
					idPerfil: Singleton.get().idPerfilUsuarioLogueado
				type:'POST'
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (result) =>
					$('#trackingPedido option[value='+idPedido+']').attr('selected',true)

					#cargamos el template	
					$('#filtroResultados').html _.template(TplviewtrackingList)({})
					for r in result
						row+='<tr>'
						row+='<td style="width: 12.5%;">'+r.Id_Pedido+'</td>'
						row+='<td style="width: 12.5%;">'+Singleton.get().invertirFecha(r.Fecha)+'</td>'
						row+='<td style="width: 12.5%;">'+r.Clase+'</td>'
						row+='<td style="width: 12.5%;">'+r.User+'</td>'
						row+='<td style="width: 12.5%;">'+r.Tipo_Accion+'</td>'
						row+='</tr>'
					$('#tablaBodyListadoTracking').html row
					
					Singleton.get().hideLoading()
				error:(data) =>
					$('#filtroResultados').empty()
					Singleton.get().showInformacion('No existe información para los filtros seleccionados')

			#reestablecemos la variable a 0 para el siguiente filtro
			Singleton.get().idPedidoTracking = 0
			false

		cargarPedidos:() =>
			option= '<option value="0" selected="selected">Seleccione</option>'
			$.ajax
				url:"#{base_url}/index.php/services/trackingPedido/cargarPedidos/idPerfil/#{Singleton.get().idPerfilUsuarioLogueado}/idUsuario/#{Singleton.get().idUsuarioLogueado}"
				type:'GET'
				async: false
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (pedidos) =>
					for P in pedidos
						option+= '<option value="' + P.Id_Pedidos + '" selected="selected">' + P.Id_Pedidos + '</option>'
					$('#trackingPedido').html option
					$('#trackingPedido option[value=0]').attr('selected',true)
				error: (data) =>
					$('#trackingPedido').html '<option value="0" selected="selected">Seleccione</option>'
					$('#trackingPedido option[value=0]').attr('selected',true)
			false

		# cargarItems:()=>
		# 	idPedido= $('#trackingPedido').find(':selected').val()
		# 	option= '<option value="0" selected="selected">Seleccione</option>'
		# 	$.ajax
		# 		url:"#{base_url}/index.php/services/trackingPedido/cargarItems/id/#{idPedido}"
		# 		type:'GET'
		# 		success: (items) =>
		# 			for i in items
		# 				option+= '<option value="' + i.Id_ItemPedido + '" selected="selected">' + i.Id_ItemPedido + '</option>'
		# 			$('#trackingItem').html option
		# 			$('#trackingItem option[value=0]').attr('selected',true)
		# 		error: (data) =>
		# 			$('#trackingItem').html '<option value="0" selected="selected">Seleccione</option>'
		# 			$('#trackingItem option[value=0]').attr('selected',true)
		# 	false

		cargarClases:()=>
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
					$('#trackingClase').html option
					$('#trackingClase option[value=0]').attr('selected',true)
				error: (data) =>
					$('#trackingClase').html '<option value="0" selected="selected">Seleccione</option>'
					$('#trackingClase option[value=0]').attr('selected',true)
			false

		cargarUsuarios:()=>
			option= '<option value="0" selected="selected">Seleccione</option>'
			$.ajax
				url:"#{base_url}/index.php/services/trackingPedido/cargarUsuarios"
				type:'GET'
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (usuarios) =>
					for u in usuarios
						option+= '<option value="' + u.Id_Usuario + '" selected="selected">' + u.User + '</option>'
					$('#trackingUsuario').html option
					$('#trackingUsuario option[value=0]').attr('selected',true)
				error: (data) =>
					$('#trackingUsuario').html '<option value="0" selected="selected">Seleccione</option>'
					$('#trackingUsuario option[value=0]').attr('selected',true)
			false


			