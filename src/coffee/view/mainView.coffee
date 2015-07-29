define [
	'backbone'
	'assets/js/view/gestorCotizaciones/nuevaCotizacion'
	'text!tpl/menu/menu.html'
	'text!tpl/modal/wait.html'
	'text!tpl/modal/exito.html'
	'text!tpl/modal/error.html'
	'text!tpl/modal/advertencia.html'
	'text!tpl/modal/informacion.html'
	'assets/js/view/mantenedorEntidades/entidades'
	'assets/js/view/mantenedorListaPrecios/listaprecios'
	'assets/js/model/usuario'
	'assets/js/view/listadoCotizaciones/viewList'
	'assets/js/view/mantenedorConsignatarios/consignatarios'
	'assets/js/view/mantenedorUsuarios/usuarios'
	'assets/js/view/gestorCotizaciones/mostrarCotizacion'
	'assets/js/view/historialCotizaciones/tracking'
	'assets/js/view/mantenedorContactos/contactos'
	'assets/js/view/mantenedorProductos/productos'
	'assets/js/view/mantenedorDestinatarios/destinatarios'
	'assets/js/view/mantenedorEntidades/agregarCliente'
	'assets/js/view/mantenedorEntidades/agregarClienteEditar'
	'assets/js/view/mantenedorDestinatarios/agregarDestinatario'
	'assets/js/view/mantenedorDestinatarios/agregarDestinatarioEditar'
	'assets/js/view/mantenedorSectores/sectores'
	'assets/js/view/mantenedorLugares/lugares'
	'assets/js/view/mantenedorRepartidores/repartidores'
	'assets/js/view/mantenedorCategoria/categoria'
],(Backbone,nuevaCotizacionView, TplMenu, TplWait, TplExito, TplError, TplAdvertencia,TplInformacion,entidades,verLista, usuarioModel,viewList,consignatarios,usuarios, ViewCotizacion, viewTracking,contactos,productos,destinatarios,ViewAddCliente,ViewAddClienteEditar,ViewAddDestinatario,ViewAddDestinatarioEditar,sectores,lugares,Repartidores,categoria) ->


	class mainView extends Backbone.View 
		el:('body')		 
		events:
			'click #headCot'			:	'headCot'
			'click #headMant'			:	'headMant'

		initialize : () =>
			@init()

		init : () =>
			#ocultamos el div que contiene el template de logueo  con efecto slide
			$('#appLogin').hide("slide",{ direction: "left" },400)
			
			#cargamos la clase de usuario y el menu con efecto slide
			$('#appMain').html _.template(TplMenu)
			$('#appMain').show("slide",{ direction: "left" },1500)
			$('#barraizq').show("slide",{ direction: "down" },1700)

			#variables publicas para la creacion de la nueva cotización
			@idBtnFiltroArticulo = 0
			@rowBtnFiltroProducto = 0
			@rowBtnListaPrecio = 0
			@idCotizacionListado = 0
			@idVendedorListado = 0
			@contLin = 1
			@CountItemsSave = 0
			@CountItemsExito = 0
			@CountRowDelete = 0
			#array que contiene los item que el usuario a eliminado al momento de editar
			@RowDelete = Array()
			#variable para saber el id del producto al momento de entrar el focus al text
			@inFocusIdProducto= ''
			#variables publicas para guardar el asunto y el mensaje
			@mailAsuntoModal= ''
			@mailMensajeModal= ''
			#variable que contiene el id del pedido para visualiza su tracking
			@idPedidoTracking = 0

			#variables resitrcciones
			@restriccioncentros = 0
			@restriccionlistas = 0
			@restriccionusuario = 0
			#=====================================================================================================

			#id para la lista de precio
			@listaIdlistaclonada
			@listaIdasociacion
			@listaPrecio
			@listaIdnueva
			@valorantiguolista
			@contadorListaPrecio = 0
			@contadorExitoListaPrecio = 0
			@listaIdarticulo = 0
			@listaIdproducto = 0
			@idsector = 0
			@mi = false

			#instanciamos la clase usuario con su metodo thisLogged para obtener lo datos del usuario autentificado
			usuario = new usuarioModel()
			#llamamos a la funcion viewData para obtener el objeto
			usuario.thisLogged(@viewData) 
			#para marcar el submenu seleccionado
			$('.itemsMenu').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				$('#barraizq').find('.active').removeClass('active')
				$(e.currentTarget).addClass('active')


			#evento de cada item menu==================================================================================================================
			$('#NuevaCotizacion').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				#oculto el popover de la nueva cotización
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================
				#limpiamos los eventos del formulario antes de instanciarlo
				$(document).unbind('click')
				$(document).unbind('change')
				$(document).unbind('focus')
				$(document).unbind('focusout')
				$(document).unbind('keyup')

				$('#appView').css('display','block')
				$('#appViewNext').empty()
				@nuevaCotizacion= new nuevaCotizacionView()
				false

			$('#ListadoCotizacion').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				#oculto el popover de la nueva cotización
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				@ListadoCotizacion= new viewList()
				false

			$('#entidades').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				#oculto el popover de la nueva cotización
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				@entidades = new entidades()
				false

			$('#sectores').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				$(document).unbind('click')
				$(document).unbind('change')
				$(document).unbind('focus')
				$(document).unbind('focusout')
				$(document).unbind('keyup')
				#oculto el popover de la nueva cotización
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				@sectores = new sectores()
				false

			$('#lugares').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				$(document).unbind('click')
				$(document).unbind('change')
				$(document).unbind('focus')
				$(document).unbind('focusout')
				$(document).unbind('keyup')
				#oculto el popover de la nueva cotización
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				@lugares = new lugares()
				false

			$('#repartidores').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				$(document).unbind('click')
				$(document).unbind('change')
				$(document).unbind('focus')
				$(document).unbind('focusout')
				$(document).unbind('keyup')
				#oculto el popover de la nueva cotización
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				@repartidores = new Repartidores()
				false

			$('#listaprecios').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				$(document).unbind('click')
				$(document).unbind('change')
				$(document).unbind('focus')
				$(document).unbind('focusout')
				$(document).unbind('keyup')
				#oculto el popover de la nueva cotización
				console.log "ACA ESTOY"
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				@verLista = new verLista()
				false

			$('#logOut').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				#oculto el popover de la nueva cotización
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================

				#terminamos la session
				$.ajax
					url:"#{base_url}/index.php/services/login/logOut"
					type:'GET'
					async:false
					statusCode:
						302: ->
							Singleton.get().reload()
					success:(data) =>
						#recargamos la pagina
						window.location.reload()
				false

			$('#consignatarios').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				#oculto el popover de la nueva cotización
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				@consignatarios = new consignatarios()
				false


			$('#usuarios').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				#oculto el popover de la nueva cotización
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				@usuarios = new usuarios()
				false

			$('#trackingCotizacion').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				#oculto el popover de la nueva cotización
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				@tracking = new viewTracking()
				false

			$('#contactos').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				#oculto el popover de la nueva cotización
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				@contactos = new contactos()
				false


			$('#destinatarios').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				#oculto el popover de la nueva cotización
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				@destinatarios = new destinatarios()
				false


			$('#productos').click (e) =>
				e.preventDefault()
				e.stopPropagation()

				#oculto el popover de la nueva cotización
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				@productos = new productos()
				false

			$('#mcategoria').click (e) =>
				e.preventDefault()
				e.stopPropagation()
				$(document).unbind('click')
				$(document).unbind('change')
				$(document).unbind('focus')
				$(document).unbind('focusout')
				$(document).unbind('keyup')
				#oculto el popover de la nueva cotización
				$('#btnFiltro').popover 'hide'
				#=============================================================================================
				#ocultamos el popover de la tabla detalles si es que estubiera visualizado
				$('#'+Singleton.get().idBtnFiltroArticulo).popover 'destroy'
				#=============================================================================================
				$('#appView').css('display','block')
				$('#appViewNext').empty()
				@categoria = new categoria()
				false

			#==========================================================================================================================================


		viewData :(logged) =>
			$('#menuUsuario').html logged.usuario
			@idUsuarioLogueado= logged.id_usuario
			@perfilUsuarioLogueado= logged.perfil
			@nombreUsuarioLogueado= logged.usuario
			@idPerfilUsuarioLogueado= logged.id_perfil
			@idSubgerenciaUsuarioLogueado= logged.Id_Sucursal
			@idSupervisorUsuarioLogueado= logged.id_supervisor

			#bloqueamos los mantenedores de lugares y sectores cuando se logee un usuario que no sea gerente ni administrador
			if @idPerfilUsuarioLogueado isnt  '1' and @idPerfilUsuarioLogueado isnt  '2'
				$('#sectores').css('display','none')
				$('#lugares').css('display','none')
				$('#repartidores').css('display','none')
				$('#listaprecios').css('display','none')
			false


		#permite la iteraccion de las flechas del menu agregando y removiendo clases.
		headCot : (e) =>
			e.preventDefault()
			e.stopPropagation()
			
			tipo= $('#menuCotizaciones')[0].attributes[1].value
			if tipo is 'accordion-seccion head-dis'
				$('#menuCotizaciones').removeClass('head-dis')
				$('#menuCotizaciones').addClass('head-act')
			else
				$('#menuCotizaciones').removeClass('head-act')
				$('#menuCotizaciones').addClass('head-dis')

			$('#menuMantenedores').removeClass('head-act')
			$('#menuMantenedores').addClass('head-dis')
			false
		headMant :(e) =>
			e.preventDefault()
			e.stopPropagation()
			
			tipo= $('#menuMantenedores')[0].attributes[1].value
			if tipo is 'accordion-seccion head-dis'
				$('#menuMantenedores').removeClass('head-dis')
				$('#menuMantenedores').addClass('head-act')
			else
				$('#menuMantenedores').removeClass('head-act')
				$('#menuMantenedores').addClass('head-dis')
			$('#menuCotizaciones').removeClass('head-act')
			$('#menuCotizaciones').addClass('head-dis')
			false
		#fin de iteraccion de flechas


		# Despliega la ventana modal de Loading
		showLoading : (titulo, txt) =>			
			if txt?				
				$('#modal').html _.template(TplWait)({ titulo : titulo, mensaje : txt })
			else
				$('#modal').html _.template(TplWait)({ titulo : 'Espere', mensaje : 'Cargando Información ...' })
			$('#image_wait').attr("src","#{base_url}/assets/img/spinner.gif")
			$('#modal').css('width',450)	
			$('#modal').css('height',170)	
			$('#modal').css('left','55.5%')
			$('#modal').css('top' ,'50%')	
			$('#modal').modal ({
			'show' : true
			'backdrop' : 'static'
			'keyboard' : false
			})
			false

		# Oculta la ventana modal de Loading
		hideLoading : () =>
			$('#modal').modal 'hide'
			#$("#modal").on "hidden", ->
				#$('#modal').removeAttr('style')
				
			false

		# Despliega la ventana modal de Exito
		showExito : (txt) =>					
			if txt?				
				$('#modal').html _.template(TplExito)({ titulo : '&Eacute;xito', mensaje : txt })
			else
				$('#modal').html _.template(TplExito)({ titulo : '&Eacute;xito', mensaje : 'La operaci&oacute;n ha concluido exitosamente.' })					
			$('#image_exito').attr("src","#{base_url}/assets/img/img_exito.png")
			$('#modal').css('width',450)	
			$('#modal').css('height',170)
			$('#modal').css('left','55.5%')	
			$('#modal').css('top' ,'50%')
			$('#modal').modal ({
			'show' : true
			'backdrop' : 'static'
			'keyboard' : false
			})
			false

		# Despliega la ventana modal de Error
		showError : (txt, titulo) =>			
			if txt?		
				if titulo?				
					$('#modal').html _.template(TplError)({ titulo : titulo, mensaje : txt })
				else		
					$('#modal').html _.template(TplError)({ titulo : 'Error', mensaje : txt })				
			else
				$('#modal').html _.template(TplError)({ titulo : 'Error', mensaje : 'La operaci&oacute;n a concluido con errores.' })		
			$('#image_error').attr("src","#{base_url}/assets/img/img_error.png")
			$('#modal').css('width',450)	
			$('#modal').css('height',170)
			$('#modal').css('left','55.5%')	
			$('#modal').css('top' ,'50%')
			$('#modal').modal ({
			'show' : true
			'backdrop' : 'static'
			'keyboard' : false
			})
			false

		# Despliega la ventana modal de Informacion
		showInformacion : (txt, titulo) =>			
			if txt?		
				if titulo?				
					$('#modal').html _.template(TplInformacion)({ titulo : titulo, mensaje : txt })
				else		
					$('#modal').html _.template(TplInformacion)({ titulo : 'Informaci&oacute;n', mensaje : txt })				
			else
				$('#modal').html _.template(TplInformacion)({ titulo : 'Informaci&oacute;n', mensaje : 'La operaci&oacute;n a concluido exitosamente.' })		
			$('#image_informacion').attr("src","#{base_url}/assets/img/img_info.png")
			$('#modal').css('width',450)	
			$('#modal').css('height',170)
			$('#modal').css('left','55.5%')	
			$('#modal').css('top' ,'50%')
			$('#modal').modal ({
			'show' : true
			'backdrop' : 'static'
			'keyboard' : false
			})
			false

		# Despliega la ventana modal de Advertencia
		showAdvertencia : (titulo, txt) =>				
			if txt?				
				$('#modal').html _.template(TplAdvertencia)({ titulo : titulo, mensaje : txt })
			else
				$('#modal').html _.template(TplAdvertencia)({ titulo : 'Advertencia', mensaje : '¿Esta seguro que desea realizar la operaci&oacute;n?.' })		
			$('#image_advertencia').attr("src","#{base_url}/assets/img/img_advertencia.png")
			$('#modal').css('width',450)	
			$('#modal').css('height',170)
			$('#modal').css('left','55.5%')	
			$('#modal').css('top' ,'50%')
			$('#modal').modal ({
			'show' : true
			'backdrop' : 'static'
			'keyboard' : false
			})
			false


		# Despliega la ventana modal de emitir pedido
		showInformacionmitir : (titulo, txt) =>				
			if txt?				
				$('#modal').html _.template(TplAdvertencia)({ titulo : titulo, mensaje : txt })
			else
				$('#modal').html _.template(TplAdvertencia)({ titulo : 'Informaci&oacute;n', mensaje : ' Los datos se han guardado correctamente ¿el pedido ha sido pagado?.' })		
			$('#image_advertencia').attr("src","#{base_url}/assets/img/img_info.png")
			$('#modal').css('width',450)	
			$('#modal').css('height',170)
			$('#modal').css('left','55.5%')	
			$('#modal').css('top' ,'50%')
			$('#modal').modal ({
			'show' : true
			'backdrop' : 'static'
			'keyboard' : false
			})
			false

		#formatea el rut
		formatearRut :(rut) =>
			ag = rut.split("").reverse()
			total = 0
			n = 2
			i = 0
			r1= ''
			r2= ''
			r3= ''
				
			while i < ag.length
				total += ag[i] * n
				((if (n is 7) then n = 2 else n++))
				i++
			resto = 11 - (total % 11)
			if resto < 10 
				resto = resto
			else if resto > 10
				resto = '0'
			else 
				resto = 'K'

			if rut.length is 8
				r1= new String(rut).substr(0, 2)  
				r2= new String(rut).substr(2, 3)  
				r3= new String(rut).substr(5, 7)  
			else
				r1= '0' + new String(rut).substr(0, 1)  
				r2= new String(rut).substr(1, 3)  
				r3= new String(rut).substr(4, 6)     

			return(r1+'.'+r2+'.'+r3+'-'+resto)
			false
			
		miles :(entero) =>
			result = ''
			entero= new String(entero)
			while (entero.length > 3)
				result = '.' + entero.substr(entero.length - 3) + result
				entero = entero.substring(0, entero.length - 3)
				
			result = entero + result
			return result
			false	

		formatMiles :(valor) =>
			num = valor.replace(/\./g, "")
			num = num.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g, "$1.")
			num = num.split("").reverse().join("").replace(/^[\.]/, "")
			return num
			false

		fechaActual: () =>
			fecha= new Date()
			dia= fecha.getDate()
			mes= fecha.getMonth() + 1
			ano= fecha.getFullYear()
			if dia<10
				dia= '0' + dia
			if mes<10
				mes= '0' + mes

			return dia+'/'+mes+'/'+ano
		
		invertirFecha : (fecha,t) =>
			if t is 'I'
				newFech= new String(fecha).substr(6, 4)+'-'+new String(fecha).substr(3, 2)+'-'+new String(fecha).substr(0, 2)
			else
				if fecha.length >10
					newFech= new String(fecha).substr(8, 2)+'/'+new String(fecha).substr(5, 2)+'/'+new String(fecha).substr(0, 4)+' '+new String(fecha).substr(11, 8)
				else
					newFech= new String(fecha).substr(8, 2)+'/'+new String(fecha).substr(5, 2)+'/'+new String(fecha).substr(0, 4)
			return newFech
			false

		cleanRut : (rut) =>
			rut = rut.substr(0,rut.length)
			rut = rut.replace(".","")
			rut = rut.replace(".","")
			rut = rut.replace(".","")
			rut = rut.split("-")[0]
			return rut
			false

		cleanValor : (valor) =>
			x= 0
			newValor= ''
			while x < valor.length
				if new String(valor).substr(x, 1) isnt '.'
					newValor+= new String(valor).substr(x, 1)
				x++
			return newValor
			false

		oldMewCliente: (rut) =>
			Resultado= 0
			$.ajax
				url:"#{base_url}/index.php/services/cotizacion/clienteNewOld/id/#{rut}"
				type:'GET'
				async: false
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (result) =>
					Resultado= Number(result[0].Resultado)
			return Resultado
			false

		restriccionEmitir : () =>
			idUsuario= Singleton.get().idUsuarioLogueado
			valor= 0
			$.ajax
				url:"#{base_url}/index.php/services/restricciones/restriccionEmitir/id/#{idUsuario}"
				type:'GET'
				async: false
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (emitir) =>
					valor= Number(emitir[0].Valor)
			return valor
			false

		cargarListadoCotizacion: () =>
			$('#appView').css('display','block')
			$('#appViewNext').empty()
			@ListadoCotizacion= new viewList()
			false

		showModalCotizacion:(idCotizacion)=>
			mostrarCotizacion = new ViewCotizacion(idCotizacion)
			false

		showModalAddCliente: () =>
			new ViewAddCliente()
			false

		showModalAddDestinatario: () =>
			new ViewAddDestinatario()
			false

		showModalAddClienteEditar: () =>
			new ViewAddClienteEditar()
			false

		showModalAddDestinatarioEditar: () =>
			new ViewAddDestinatarioEditar()
			false

		ValidarRut: (rut) =>
			rut = @cleanRut(rut)
			aux =  Number (rut.length)
			if(aux < 7 )
				return false
			else
				rut = @formatearRut(rut)
				rutaux = rut
				rut = @cleanRut(rut)+"-"+rut.split("-")[1]
				if (!@getrut(rut)) 
					return false
				else
					return true
				false

		getrut :(partes) =>
			partes = partes.split("-")
			numero = partes[0].toString()
			dv = partes[1]
			if partes[1]
			  if numero.length is 0 or numero.length > 8
			    return false
			  else
			    return true  if @getDV(numero).toString() is dv.toUpperCase()
			false

		getDV :(numero) =>
		  nuevo_numero = numero.split("").reverse().join("")
		  i = 0
		  j = 2
		  suma = 0

		  while i < nuevo_numero.length
		    suma += (parseInt(nuevo_numero.charAt(i)) * j)
		    i++
		    ((if (j is 7) then j = 2 else j++))
		  n_dv = 11 - (suma % 11)
		  (if (n_dv is 11) then 0 else ((if (n_dv is 10) then "K" else n_dv)))


		setiarPrecioTotal: (row) =>
			validator= true

			if $('#CotDescuento').val() is ''
				$('#CotDescuento').val '0'

			if $('#CotTotal').val() is ''		
				 $('#CotTotal').val '0'
			
			if $('#cantidad'+row).val() is '' or $('#precioUnidad'+row).val() is ''
				$('#precioTotal'+row).val ''

			if $('#cantidad'+row).val() isnt ''			
				if !$.isNumeric($('#cantidad'+row).val())
					$('#cantidad'+row).val '0'
					Singleton.get().showError('La Cantidad Ingresada es Incorrecta')
					validator= false
			else
				validator= false

			if Singleton.get().cleanValor($('#precioUnidad'+row).val()) isnt ''	
				if !$.isNumeric(Singleton.get().cleanValor($('#precioUnidad'+row).val()))
					$('#precioUnidad'+row).val '0'
					Singleton.get().showError('El Precio Ingresado es Incorrecto')
					validator= false
			else
				validator= false

			if validator is true
				$('#precioTotal'+row).val Singleton.get().miles(Number(Singleton.get().cleanValor($('#precioUnidad'+row).val())) * Number($('#cantidad'+row).val()))
			else
				$('#precioTotal'+row).val '0'	

			@setiarDescuento()
			false

		setiarDescuento: () =>
			valorDescuento= 0
			valorDescuento= $('#CotDescuento').val()
 			
			if valorDescuento is ''
				$('#CotDescuento').val '0'
			@setiarFlete()

		setiarFlete: () =>
			valorFlete= 0
			valorFlete= $('#CotFlete').val()
 			
			if valorFlete is ''
				$('#CotFlete').val '0'
			@setiarTotalGeneral()

		#obtenemos el total general
		setiarTotalGeneral: () =>
			flete = 0
			total= 0
			descuento = 0
			totalgeneral= 0
			#obtenemos el valor neto
			$("#tablaItem tbody tr").each (index) ->
				$(this).children("td").each (index2) ->
					switch index2
						when 3
							total+= Number(Singleton.get().cleanValor($(this)[0].firstElementChild.value))

			if $('#CotFlete').val() isnt ''
				flete= Singleton.get().cleanValor($('#CotFlete').val())

			if $('#CotDescuento').val() isnt ''
				descuento = Singleton.get().cleanValor($('#CotDescuento').val())

			#setiamos el valor del total  general el cual es el valor del flete mas los totales de cada item
			descuento = (Number(total)+Number(flete))*(Number(descuento)/100)
			$('#CotTotal').val Singleton.get().miles(Number(total)+Number(flete)-Number(Math.round(descuento)))
			@obtenerIvaNeto()

		obtenerIvaNeto: () =>
			neto = 0
			iva = 0
			$.ajax
				url:"#{base_url}/index.php/services/cotizacion/valorIVA"
				type:'GET'
				async: false
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (valoriva) =>
					neto = Singleton.get().cleanValor($('#CotTotal').val())/(Number(valoriva)/100+1)
					iva = Singleton.get().cleanValor($('#CotTotal').val())*Number(valoriva)/100
					$('#CotNeto').val Singleton.get().miles(Number(Math.round(neto)))
					$('#CotIva').val Singleton.get().miles(Number(Math.round(iva)))


		setiarPrecioTotalEditar: (row) =>
			validator= true

			if $('#CotDescuentoEdicion').val() is ''
				$('#CotDescuentoEdicion').val '0'

			if $('#CotTotal').val() is ''		
				 $('#CotTotal').val '0'
			
			if $('#cantidadEdicion'+row).val() is '' or $('#precioUnidad'+row).val() is ''
				$('#precioTotal'+row).val ''

			if $('#cantidadEdicion'+row).val() isnt ''		
				if !$.isNumeric($('#cantidadEdicion'+row).val())
					$('#cantidadEdicion'+row).val '0'
					Singleton.get().showError('La Cantidad Ingresada es Incorrecta')
					validator= false
			else
				validator= false

			if Singleton.get().cleanValor($('#precioUnidad'+row).val()) isnt ''	
				if !$.isNumeric(Singleton.get().cleanValor($('#precioUnidad'+row).val()))
					$('#precioUnidad'+row).val '0'
					Singleton.get().showError('El Precio Ingresado es Incorrecto')
					validator= false
			else
				validator= false

			if validator is true
				$('#precioTotal'+row).val Singleton.get().miles(Number(Singleton.get().cleanValor($('#precioUnidad'+row).val())) * Number($('#cantidadEdicion'+row).val()))
			else
				$('#precioTotal'+row).val '0'	

			@setiarDescuentoEditar()
			false

		setiarDescuentoEditar: () =>
			valorDescuento= 0
			valorDescuento= $('#CotDescuentoEdicion').val()
 			
			if valorDescuento is ''
				$('#CotDescuentoEdicion').val '0'
			@setiarFleteEditar()

		setiarFleteEditar: () =>
			valorFlete= 0
			valorFlete= $('#CotFleteEdicion').val()
 			
			if valorFlete is ''
				$('#CotFleteEdicion').val '0'
			@setiarTotalGeneralEditar()

		#obtenemos el total general
		setiarTotalGeneralEditar: () =>
			flete = 0
			total= 0
			descuento = 0
			totalgeneral= 0
			#obtenemos el valor neto
			$("#tablaItem tbody tr").each (index) ->
				$(this).children("td").each (index2) ->
					switch index2
						when 3
							total+= Number(Singleton.get().cleanValor($(this)[0].firstElementChild.value))

			if $('#CotFleteEdicion').val() isnt ''
				flete= Singleton.get().cleanValor($('#CotFleteEdicion').val())

			if $('#CotDescuentoEdicion').val() isnt ''
				descuento = Singleton.get().cleanValor($('#CotDescuentoEdicion').val())

			#setiamos el valor del total  general el cual es el valor del flete mas los totales de cada item
			descuento = (Number(total)+Number(flete))*(Number(descuento)/100)
			$('#CotTotal').val Singleton.get().miles(Number(total)+Number(flete)-Number(Math.round(descuento)))
			@obtenerIvaNetoEditar()

		obtenerIvaNetoEditar: () =>
			neto = 0
			iva = 0
			$.ajax
				url:"#{base_url}/index.php/services/cotizacion/valorIVA"
				type:'GET'
				async: false
				statusCode:
					302: ->
						Singleton.get().reload()
				success: (valoriva) =>
					neto = Singleton.get().cleanValor($('#CotTotal').val())/(Number(valoriva)/100+1)
					iva = Singleton.get().cleanValor($('#CotTotal').val())*Number(valoriva)/100
					$('#CotNeto').val Singleton.get().miles(Number(Math.round(neto)))
					$('#CotIva').val Singleton.get().miles(Number(Math.round(iva)))

		#manejamos la session de usuario
		reload :() =>
			@createCookie('session_out','true',7)
			window.location.reload(false)
			false

		createCookie:(name,value,days) =>
			if days
				date = new Date()
				date.setTime date.getTime() + (days * 24 * 60 * 60 * 1000)
				expires = "; expires=" + date.toGMTString()
			else
				expires = ""
			document.cookie = name + "=" + value + expires + "; path=/"
			false
