(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'assets/js/view/gestorCotizaciones/nuevaCotizacion', 'text!tpl/menu/menu.html', 'text!tpl/modal/wait.html', 'text!tpl/modal/exito.html', 'text!tpl/modal/error.html', 'text!tpl/modal/advertencia.html', 'text!tpl/modal/informacion.html', 'assets/js/view/mantenedorEntidades/entidades', 'assets/js/view/mantenedorListaPrecios/listaprecios', 'assets/js/model/usuario', 'assets/js/view/listadoCotizaciones/viewList', 'assets/js/view/mantenedorConsignatarios/consignatarios', 'assets/js/view/mantenedorUsuarios/usuarios', 'assets/js/view/gestorCotizaciones/mostrarCotizacion', 'assets/js/view/historialCotizaciones/tracking', 'assets/js/view/mantenedorContactos/contactos', 'assets/js/view/mantenedorProductos/productos', 'assets/js/view/mantenedorDestinatarios/destinatarios', 'assets/js/view/mantenedorEntidades/agregarCliente', 'assets/js/view/mantenedorEntidades/agregarClienteEditar', 'assets/js/view/mantenedorDestinatarios/agregarDestinatario', 'assets/js/view/mantenedorDestinatarios/agregarDestinatarioEditar', 'assets/js/view/mantenedorSectores/sectores', 'assets/js/view/mantenedorLugares/lugares', 'assets/js/view/mantenedorRepartidores/repartidores', 'assets/js/view/mantenedorCategoria/categoria'], function(Backbone, nuevaCotizacionView, TplMenu, TplWait, TplExito, TplError, TplAdvertencia, TplInformacion, entidades, verLista, usuarioModel, viewList, consignatarios, usuarios, ViewCotizacion, viewTracking, contactos, productos, destinatarios, ViewAddCliente, ViewAddClienteEditar, ViewAddDestinatario, ViewAddDestinatarioEditar, sectores, lugares, Repartidores, categoria) {
    var mainView;
    return mainView = (function(superClass) {
      extend(mainView, superClass);

      function mainView() {
        this.createCookie = bind(this.createCookie, this);
        this.reload = bind(this.reload, this);
        this.obtenerIvaNetoEditar = bind(this.obtenerIvaNetoEditar, this);
        this.setiarTotalGeneralEditar = bind(this.setiarTotalGeneralEditar, this);
        this.setiarFleteEditar = bind(this.setiarFleteEditar, this);
        this.setiarDescuentoEditar = bind(this.setiarDescuentoEditar, this);
        this.setiarPrecioTotalEditar = bind(this.setiarPrecioTotalEditar, this);
        this.obtenerIvaNeto = bind(this.obtenerIvaNeto, this);
        this.setiarTotalGeneral = bind(this.setiarTotalGeneral, this);
        this.setiarFlete = bind(this.setiarFlete, this);
        this.setiarDescuento = bind(this.setiarDescuento, this);
        this.setiarPrecioTotal = bind(this.setiarPrecioTotal, this);
        this.getDV = bind(this.getDV, this);
        this.getrut = bind(this.getrut, this);
        this.ValidarRut = bind(this.ValidarRut, this);
        this.showModalAddDestinatarioEditar = bind(this.showModalAddDestinatarioEditar, this);
        this.showModalAddClienteEditar = bind(this.showModalAddClienteEditar, this);
        this.showModalAddDestinatario = bind(this.showModalAddDestinatario, this);
        this.showModalAddCliente = bind(this.showModalAddCliente, this);
        this.showModalCotizacion = bind(this.showModalCotizacion, this);
        this.cargarListadoCotizacion = bind(this.cargarListadoCotizacion, this);
        this.restriccionEmitir = bind(this.restriccionEmitir, this);
        this.oldMewCliente = bind(this.oldMewCliente, this);
        this.cleanValor = bind(this.cleanValor, this);
        this.cleanRut = bind(this.cleanRut, this);
        this.invertirFecha = bind(this.invertirFecha, this);
        this.fechaActual = bind(this.fechaActual, this);
        this.formatMiles = bind(this.formatMiles, this);
        this.miles = bind(this.miles, this);
        this.formatearRut = bind(this.formatearRut, this);
        this.showInformacionmitir = bind(this.showInformacionmitir, this);
        this.showAdvertencia = bind(this.showAdvertencia, this);
        this.showInformacion = bind(this.showInformacion, this);
        this.showError = bind(this.showError, this);
        this.showExito = bind(this.showExito, this);
        this.hideLoading = bind(this.hideLoading, this);
        this.showLoading = bind(this.showLoading, this);
        this.headMant = bind(this.headMant, this);
        this.headCot = bind(this.headCot, this);
        this.viewData = bind(this.viewData, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return mainView.__super__.constructor.apply(this, arguments);
      }

      mainView.prototype.el = 'body';

      mainView.prototype.events = {
        'click #headCot': 'headCot',
        'click #headMant': 'headMant'
      };

      mainView.prototype.initialize = function() {
        return this.init();
      };

      mainView.prototype.init = function() {
        var usuario;
        $('#appLogin').hide("slide", {
          direction: "left"
        }, 400);
        $('#appMain').html(_.template(TplMenu));
        $('#appMain').show("slide", {
          direction: "left"
        }, 1500);
        $('#barraizq').show("slide", {
          direction: "down"
        }, 1700);
        this.idBtnFiltroArticulo = 0;
        this.rowBtnFiltroProducto = 0;
        this.rowBtnListaPrecio = 0;
        this.idCotizacionListado = 0;
        this.idVendedorListado = 0;
        this.contLin = 1;
        this.CountItemsSave = 0;
        this.CountItemsExito = 0;
        this.CountRowDelete = 0;
        this.RowDelete = Array();
        this.inFocusIdProducto = '';
        this.mailAsuntoModal = '';
        this.mailMensajeModal = '';
        this.idPedidoTracking = 0;
        this.restriccioncentros = 0;
        this.restriccionlistas = 0;
        this.restriccionusuario = 0;
        this.listaIdlistaclonada;
        this.listaIdasociacion;
        this.listaPrecio;
        this.listaIdnueva;
        this.valorantiguolista;
        this.contadorListaPrecio = 0;
        this.contadorExitoListaPrecio = 0;
        this.listaIdarticulo = 0;
        this.listaIdproducto = 0;
        this.idsector = 0;
        this.mi = false;
        usuario = new usuarioModel();
        usuario.thisLogged(this.viewData);
        $('.itemsMenu').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#barraizq').find('.active').removeClass('active');
            return $(e.currentTarget).addClass('active');
          };
        })(this));
        $('#NuevaCotizacion').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $(document).unbind('click');
            $(document).unbind('change');
            $(document).unbind('focus');
            $(document).unbind('focusout');
            $(document).unbind('keyup');
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            _this.nuevaCotizacion = new nuevaCotizacionView();
            return false;
          };
        })(this));
        $('#ListadoCotizacion').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            _this.ListadoCotizacion = new viewList();
            return false;
          };
        })(this));
        $('#entidades').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            _this.entidades = new entidades();
            return false;
          };
        })(this));
        $('#sectores').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(document).unbind('click');
            $(document).unbind('change');
            $(document).unbind('focus');
            $(document).unbind('focusout');
            $(document).unbind('keyup');
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            _this.sectores = new sectores();
            return false;
          };
        })(this));
        $('#lugares').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(document).unbind('click');
            $(document).unbind('change');
            $(document).unbind('focus');
            $(document).unbind('focusout');
            $(document).unbind('keyup');
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            _this.lugares = new lugares();
            return false;
          };
        })(this));
        $('#repartidores').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(document).unbind('click');
            $(document).unbind('change');
            $(document).unbind('focus');
            $(document).unbind('focusout');
            $(document).unbind('keyup');
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            _this.repartidores = new Repartidores();
            return false;
          };
        })(this));
        $('#listaprecios').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(document).unbind('click');
            $(document).unbind('change');
            $(document).unbind('focus');
            $(document).unbind('focusout');
            $(document).unbind('keyup');
            console.log("ACA ESTOY");
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            _this.verLista = new verLista();
            return false;
          };
        })(this));
        $('#logOut').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $.ajax({
              url: base_url + "/index.php/services/login/logOut",
              type: 'GET',
              async: false,
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: function(data) {
                return window.location.reload();
              }
            });
            return false;
          };
        })(this));
        $('#consignatarios').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            _this.consignatarios = new consignatarios();
            return false;
          };
        })(this));
        $('#usuarios').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            _this.usuarios = new usuarios();
            return false;
          };
        })(this));
        $('#trackingCotizacion').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            _this.tracking = new viewTracking();
            return false;
          };
        })(this));
        $('#contactos').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            _this.contactos = new contactos();
            return false;
          };
        })(this));
        $('#destinatarios').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            _this.destinatarios = new destinatarios();
            return false;
          };
        })(this));
        $('#productos').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            _this.productos = new productos();
            return false;
          };
        })(this));
        return $('#mcategoria').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(document).unbind('click');
            $(document).unbind('change');
            $(document).unbind('focus');
            $(document).unbind('focusout');
            $(document).unbind('keyup');
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            _this.categoria = new categoria();
            return false;
          };
        })(this));
      };

      mainView.prototype.viewData = function(logged) {
        $('#menuUsuario').html(logged.usuario);
        this.idUsuarioLogueado = logged.id_usuario;
        this.perfilUsuarioLogueado = logged.perfil;
        this.nombreUsuarioLogueado = logged.usuario;
        this.idPerfilUsuarioLogueado = logged.id_perfil;
        this.idSubgerenciaUsuarioLogueado = logged.Id_Sucursal;
        this.idSupervisorUsuarioLogueado = logged.id_supervisor;
        if (this.idPerfilUsuarioLogueado !== '1' && this.idPerfilUsuarioLogueado !== '2') {
          $('#sectores').css('display', 'none');
          $('#lugares').css('display', 'none');
          $('#repartidores').css('display', 'none');
          $('#listaprecios').css('display', 'none');
        }
        return false;
      };

      mainView.prototype.headCot = function(e) {
        var tipo;
        e.preventDefault();
        e.stopPropagation();
        tipo = $('#menuCotizaciones')[0].attributes[1].value;
        if (tipo === 'accordion-seccion head-dis') {
          $('#menuCotizaciones').removeClass('head-dis');
          $('#menuCotizaciones').addClass('head-act');
        } else {
          $('#menuCotizaciones').removeClass('head-act');
          $('#menuCotizaciones').addClass('head-dis');
        }
        $('#menuMantenedores').removeClass('head-act');
        $('#menuMantenedores').addClass('head-dis');
        return false;
      };

      mainView.prototype.headMant = function(e) {
        var tipo;
        e.preventDefault();
        e.stopPropagation();
        tipo = $('#menuMantenedores')[0].attributes[1].value;
        if (tipo === 'accordion-seccion head-dis') {
          $('#menuMantenedores').removeClass('head-dis');
          $('#menuMantenedores').addClass('head-act');
        } else {
          $('#menuMantenedores').removeClass('head-act');
          $('#menuMantenedores').addClass('head-dis');
        }
        $('#menuCotizaciones').removeClass('head-act');
        $('#menuCotizaciones').addClass('head-dis');
        return false;
      };

      mainView.prototype.showLoading = function(titulo, txt) {
        if (txt != null) {
          $('#modal').html(_.template(TplWait)({
            titulo: titulo,
            mensaje: txt
          }));
        } else {
          $('#modal').html(_.template(TplWait)({
            titulo: 'Espere',
            mensaje: 'Cargando Información ...'
          }));
        }
        $('#image_wait').attr("src", base_url + "/assets/img/spinner.gif");
        $('#modal').css('width', 450);
        $('#modal').css('height', 170);
        $('#modal').css('left', '55.5%');
        $('#modal').css('top', '50%');
        $('#modal').modal({
          'show': true,
          'backdrop': 'static',
          'keyboard': false
        });
        return false;
      };

      mainView.prototype.hideLoading = function() {
        $('#modal').modal('hide');
        return false;
      };

      mainView.prototype.showExito = function(txt) {
        if (txt != null) {
          $('#modal').html(_.template(TplExito)({
            titulo: '&Eacute;xito',
            mensaje: txt
          }));
        } else {
          $('#modal').html(_.template(TplExito)({
            titulo: '&Eacute;xito',
            mensaje: 'La operaci&oacute;n ha concluido exitosamente.'
          }));
        }
        $('#image_exito').attr("src", base_url + "/assets/img/img_exito.png");
        $('#modal').css('width', 450);
        $('#modal').css('height', 170);
        $('#modal').css('left', '55.5%');
        $('#modal').css('top', '50%');
        $('#modal').modal({
          'show': true,
          'backdrop': 'static',
          'keyboard': false
        });
        return false;
      };

      mainView.prototype.showError = function(txt, titulo) {
        if (txt != null) {
          if (titulo != null) {
            $('#modal').html(_.template(TplError)({
              titulo: titulo,
              mensaje: txt
            }));
          } else {
            $('#modal').html(_.template(TplError)({
              titulo: 'Error',
              mensaje: txt
            }));
          }
        } else {
          $('#modal').html(_.template(TplError)({
            titulo: 'Error',
            mensaje: 'La operaci&oacute;n a concluido con errores.'
          }));
        }
        $('#image_error').attr("src", base_url + "/assets/img/img_error.png");
        $('#modal').css('width', 450);
        $('#modal').css('height', 170);
        $('#modal').css('left', '55.5%');
        $('#modal').css('top', '50%');
        $('#modal').modal({
          'show': true,
          'backdrop': 'static',
          'keyboard': false
        });
        return false;
      };

      mainView.prototype.showInformacion = function(txt, titulo) {
        if (txt != null) {
          if (titulo != null) {
            $('#modal').html(_.template(TplInformacion)({
              titulo: titulo,
              mensaje: txt
            }));
          } else {
            $('#modal').html(_.template(TplInformacion)({
              titulo: 'Informaci&oacute;n',
              mensaje: txt
            }));
          }
        } else {
          $('#modal').html(_.template(TplInformacion)({
            titulo: 'Informaci&oacute;n',
            mensaje: 'La operaci&oacute;n a concluido exitosamente.'
          }));
        }
        $('#image_informacion').attr("src", base_url + "/assets/img/img_info.png");
        $('#modal').css('width', 450);
        $('#modal').css('height', 170);
        $('#modal').css('left', '55.5%');
        $('#modal').css('top', '50%');
        $('#modal').modal({
          'show': true,
          'backdrop': 'static',
          'keyboard': false
        });
        return false;
      };

      mainView.prototype.showAdvertencia = function(titulo, txt) {
        if (txt != null) {
          $('#modal').html(_.template(TplAdvertencia)({
            titulo: titulo,
            mensaje: txt
          }));
        } else {
          $('#modal').html(_.template(TplAdvertencia)({
            titulo: 'Advertencia',
            mensaje: '¿Esta seguro que desea realizar la operaci&oacute;n?.'
          }));
        }
        $('#image_advertencia').attr("src", base_url + "/assets/img/img_advertencia.png");
        $('#modal').css('width', 450);
        $('#modal').css('height', 170);
        $('#modal').css('left', '55.5%');
        $('#modal').css('top', '50%');
        $('#modal').modal({
          'show': true,
          'backdrop': 'static',
          'keyboard': false
        });
        return false;
      };

      mainView.prototype.showInformacionmitir = function(titulo, txt) {
        if (txt != null) {
          $('#modal').html(_.template(TplAdvertencia)({
            titulo: titulo,
            mensaje: txt
          }));
        } else {
          $('#modal').html(_.template(TplAdvertencia)({
            titulo: 'Informaci&oacute;n',
            mensaje: ' Los datos se han guardado correctamente ¿el pedido ha sido pagado?.'
          }));
        }
        $('#image_advertencia').attr("src", base_url + "/assets/img/img_info.png");
        $('#modal').css('width', 450);
        $('#modal').css('height', 170);
        $('#modal').css('left', '55.5%');
        $('#modal').css('top', '50%');
        $('#modal').modal({
          'show': true,
          'backdrop': 'static',
          'keyboard': false
        });
        return false;
      };

      mainView.prototype.formatearRut = function(rut) {
        var ag, i, n, r1, r2, r3, resto, total;
        ag = rut.split("").reverse();
        total = 0;
        n = 2;
        i = 0;
        r1 = '';
        r2 = '';
        r3 = '';
        while (i < ag.length) {
          total += ag[i] * n;
          if (n === 7) {
            n = 2;
          } else {
            n++;
          }
          i++;
        }
        resto = 11 - (total % 11);
        if (resto < 10) {
          resto = resto;
        } else if (resto > 10) {
          resto = '0';
        } else {
          resto = 'K';
        }
        if (rut.length === 8) {
          r1 = new String(rut).substr(0, 2);
          r2 = new String(rut).substr(2, 3);
          r3 = new String(rut).substr(5, 7);
        } else {
          r1 = '0' + new String(rut).substr(0, 1);
          r2 = new String(rut).substr(1, 3);
          r3 = new String(rut).substr(4, 6);
        }
        return r1 + '.' + r2 + '.' + r3 + '-' + resto;
        return false;
      };

      mainView.prototype.miles = function(entero) {
        var result;
        result = '';
        entero = new String(entero);
        while (entero.length > 3) {
          result = '.' + entero.substr(entero.length - 3) + result;
          entero = entero.substring(0, entero.length - 3);
        }
        result = entero + result;
        return result;
        return false;
      };

      mainView.prototype.formatMiles = function(valor) {
        var num;
        num = valor.replace(/\./g, "");
        num = num.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g, "$1.");
        num = num.split("").reverse().join("").replace(/^[\.]/, "");
        return num;
        return false;
      };

      mainView.prototype.fechaActual = function() {
        var ano, dia, fecha, mes;
        fecha = new Date();
        dia = fecha.getDate();
        mes = fecha.getMonth() + 1;
        ano = fecha.getFullYear();
        if (dia < 10) {
          dia = '0' + dia;
        }
        if (mes < 10) {
          mes = '0' + mes;
        }
        return dia + '/' + mes + '/' + ano;
      };

      mainView.prototype.invertirFecha = function(fecha, t) {
        var newFech;
        if (t === 'I') {
          newFech = new String(fecha).substr(6, 4) + '-' + new String(fecha).substr(3, 2) + '-' + new String(fecha).substr(0, 2);
        } else {
          if (fecha.length > 10) {
            newFech = new String(fecha).substr(8, 2) + '/' + new String(fecha).substr(5, 2) + '/' + new String(fecha).substr(0, 4) + ' ' + new String(fecha).substr(11, 8);
          } else {
            newFech = new String(fecha).substr(8, 2) + '/' + new String(fecha).substr(5, 2) + '/' + new String(fecha).substr(0, 4);
          }
        }
        return newFech;
        return false;
      };

      mainView.prototype.cleanRut = function(rut) {
        rut = rut.substr(0, rut.length);
        rut = rut.replace(".", "");
        rut = rut.replace(".", "");
        rut = rut.replace(".", "");
        rut = rut.split("-")[0];
        return rut;
        return false;
      };

      mainView.prototype.cleanValor = function(valor) {
        var newValor, x;
        x = 0;
        newValor = '';
        while (x < valor.length) {
          if (new String(valor).substr(x, 1) !== '.') {
            newValor += new String(valor).substr(x, 1);
          }
          x++;
        }
        return newValor;
        return false;
      };

      mainView.prototype.oldMewCliente = function(rut) {
        var Resultado;
        Resultado = 0;
        $.ajax({
          url: base_url + "/index.php/services/cotizacion/clienteNewOld/id/" + rut,
          type: 'GET',
          async: false,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(result) {
              return Resultado = Number(result[0].Resultado);
            };
          })(this)
        });
        return Resultado;
        return false;
      };

      mainView.prototype.restriccionEmitir = function() {
        var idUsuario, valor;
        idUsuario = Singleton.get().idUsuarioLogueado;
        valor = 0;
        $.ajax({
          url: base_url + "/index.php/services/restricciones/restriccionEmitir/id/" + idUsuario,
          type: 'GET',
          async: false,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(emitir) {
              return valor = Number(emitir[0].Valor);
            };
          })(this)
        });
        return valor;
        return false;
      };

      mainView.prototype.cargarListadoCotizacion = function() {
        $('#appView').css('display', 'block');
        $('#appViewNext').empty();
        this.ListadoCotizacion = new viewList();
        return false;
      };

      mainView.prototype.showModalCotizacion = function(idCotizacion) {
        var mostrarCotizacion;
        mostrarCotizacion = new ViewCotizacion(idCotizacion);
        return false;
      };

      mainView.prototype.showModalAddCliente = function() {
        new ViewAddCliente();
        return false;
      };

      mainView.prototype.showModalAddDestinatario = function() {
        new ViewAddDestinatario();
        return false;
      };

      mainView.prototype.showModalAddClienteEditar = function() {
        new ViewAddClienteEditar();
        return false;
      };

      mainView.prototype.showModalAddDestinatarioEditar = function() {
        new ViewAddDestinatarioEditar();
        return false;
      };

      mainView.prototype.ValidarRut = function(rut) {
        var aux, rutaux;
        rut = this.cleanRut(rut);
        aux = Number(rut.length);
        if (aux < 7) {
          return false;
        } else {
          rut = this.formatearRut(rut);
          rutaux = rut;
          rut = this.cleanRut(rut) + "-" + rut.split("-")[1];
          if (!this.getrut(rut)) {
            return false;
          } else {
            return true;
          }
          return false;
        }
      };

      mainView.prototype.getrut = function(partes) {
        var dv, numero;
        partes = partes.split("-");
        numero = partes[0].toString();
        dv = partes[1];
        if (partes[1]) {
          if (numero.length === 0 || numero.length > 8) {
            return false;
          } else {
            if (this.getDV(numero).toString() === dv.toUpperCase()) {
              return true;
            }
          }
        }
        return false;
      };

      mainView.prototype.getDV = function(numero) {
        var i, j, n_dv, nuevo_numero, suma;
        nuevo_numero = numero.split("").reverse().join("");
        i = 0;
        j = 2;
        suma = 0;
        while (i < nuevo_numero.length) {
          suma += parseInt(nuevo_numero.charAt(i)) * j;
          i++;
          if (j === 7) {
            j = 2;
          } else {
            j++;
          }
        }
        n_dv = 11 - (suma % 11);
        if (n_dv === 11) {
          return 0;
        } else {
          if (n_dv === 10) {
            return "K";
          } else {
            return n_dv;
          }
        }
      };

      mainView.prototype.setiarPrecioTotal = function(row) {
        var validator;
        validator = true;
        if ($('#CotDescuento').val() === '') {
          $('#CotDescuento').val('0');
        }
        if ($('#CotTotal').val() === '') {
          $('#CotTotal').val('0');
        }
        if ($('#cantidad' + row).val() === '' || $('#precioUnidad' + row).val() === '') {
          $('#precioTotal' + row).val('');
        }
        if ($('#cantidad' + row).val() !== '') {
          if (!$.isNumeric($('#cantidad' + row).val())) {
            $('#cantidad' + row).val('0');
            Singleton.get().showError('La Cantidad Ingresada es Incorrecta');
            validator = false;
          }
        } else {
          validator = false;
        }
        if (Singleton.get().cleanValor($('#precioUnidad' + row).val()) !== '') {
          if (!$.isNumeric(Singleton.get().cleanValor($('#precioUnidad' + row).val()))) {
            $('#precioUnidad' + row).val('0');
            Singleton.get().showError('El Precio Ingresado es Incorrecto');
            validator = false;
          }
        } else {
          validator = false;
        }
        if (validator === true) {
          $('#precioTotal' + row).val(Singleton.get().miles(Number(Singleton.get().cleanValor($('#precioUnidad' + row).val())) * Number($('#cantidad' + row).val())));
        } else {
          $('#precioTotal' + row).val('0');
        }
        this.setiarDescuento();
        return false;
      };

      mainView.prototype.setiarDescuento = function() {
        var valorDescuento;
        valorDescuento = 0;
        valorDescuento = $('#CotDescuento').val();
        if (valorDescuento === '') {
          $('#CotDescuento').val('0');
        }
        return this.setiarFlete();
      };

      mainView.prototype.setiarFlete = function() {
        var valorFlete;
        valorFlete = 0;
        valorFlete = $('#CotFlete').val();
        if (valorFlete === '') {
          $('#CotFlete').val('0');
        }
        return this.setiarTotalGeneral();
      };

      mainView.prototype.setiarTotalGeneral = function() {
        var descuento, flete, total, totalgeneral;
        flete = 0;
        total = 0;
        descuento = 0;
        totalgeneral = 0;
        $("#tablaItem tbody tr").each(function(index) {
          return $(this).children("td").each(function(index2) {
            switch (index2) {
              case 3:
                return total += Number(Singleton.get().cleanValor($(this)[0].firstElementChild.value));
            }
          });
        });
        if ($('#CotFlete').val() !== '') {
          flete = Singleton.get().cleanValor($('#CotFlete').val());
        }
        if ($('#CotDescuento').val() !== '') {
          descuento = Singleton.get().cleanValor($('#CotDescuento').val());
        }
        descuento = (Number(total) + Number(flete)) * (Number(descuento) / 100);
        $('#CotTotal').val(Singleton.get().miles(Number(total) + Number(flete) - Number(Math.round(descuento))));
        return this.obtenerIvaNeto();
      };

      mainView.prototype.obtenerIvaNeto = function() {
        var iva, neto;
        neto = 0;
        iva = 0;
        return $.ajax({
          url: base_url + "/index.php/services/cotizacion/valorIVA",
          type: 'GET',
          async: false,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(valoriva) {
              neto = Singleton.get().cleanValor($('#CotTotal').val()) / (Number(valoriva) / 100 + 1);
              iva = Singleton.get().cleanValor($('#CotTotal').val()) * Number(valoriva) / 100;
              $('#CotNeto').val(Singleton.get().miles(Number(Math.round(neto))));
              return $('#CotIva').val(Singleton.get().miles(Number(Math.round(iva))));
            };
          })(this)
        });
      };

      mainView.prototype.setiarPrecioTotalEditar = function(row) {
        var validator;
        validator = true;
        if ($('#CotDescuentoEdicion').val() === '') {
          $('#CotDescuentoEdicion').val('0');
        }
        if ($('#CotTotal').val() === '') {
          $('#CotTotal').val('0');
        }
        if ($('#cantidadEdicion' + row).val() === '' || $('#precioUnidad' + row).val() === '') {
          $('#precioTotal' + row).val('');
        }
        if ($('#cantidadEdicion' + row).val() !== '') {
          if (!$.isNumeric($('#cantidadEdicion' + row).val())) {
            $('#cantidadEdicion' + row).val('0');
            Singleton.get().showError('La Cantidad Ingresada es Incorrecta');
            validator = false;
          }
        } else {
          validator = false;
        }
        if (Singleton.get().cleanValor($('#precioUnidad' + row).val()) !== '') {
          if (!$.isNumeric(Singleton.get().cleanValor($('#precioUnidad' + row).val()))) {
            $('#precioUnidad' + row).val('0');
            Singleton.get().showError('El Precio Ingresado es Incorrecto');
            validator = false;
          }
        } else {
          validator = false;
        }
        if (validator === true) {
          $('#precioTotal' + row).val(Singleton.get().miles(Number(Singleton.get().cleanValor($('#precioUnidad' + row).val())) * Number($('#cantidadEdicion' + row).val())));
        } else {
          $('#precioTotal' + row).val('0');
        }
        this.setiarDescuentoEditar();
        return false;
      };

      mainView.prototype.setiarDescuentoEditar = function() {
        var valorDescuento;
        valorDescuento = 0;
        valorDescuento = $('#CotDescuentoEdicion').val();
        if (valorDescuento === '') {
          $('#CotDescuentoEdicion').val('0');
        }
        return this.setiarFleteEditar();
      };

      mainView.prototype.setiarFleteEditar = function() {
        var valorFlete;
        valorFlete = 0;
        valorFlete = $('#CotFleteEdicion').val();
        if (valorFlete === '') {
          $('#CotFleteEdicion').val('0');
        }
        return this.setiarTotalGeneralEditar();
      };

      mainView.prototype.setiarTotalGeneralEditar = function() {
        var descuento, flete, total, totalgeneral;
        flete = 0;
        total = 0;
        descuento = 0;
        totalgeneral = 0;
        $("#tablaItem tbody tr").each(function(index) {
          return $(this).children("td").each(function(index2) {
            switch (index2) {
              case 3:
                return total += Number(Singleton.get().cleanValor($(this)[0].firstElementChild.value));
            }
          });
        });
        if ($('#CotFleteEdicion').val() !== '') {
          flete = Singleton.get().cleanValor($('#CotFleteEdicion').val());
        }
        if ($('#CotDescuentoEdicion').val() !== '') {
          descuento = Singleton.get().cleanValor($('#CotDescuentoEdicion').val());
        }
        descuento = (Number(total) + Number(flete)) * (Number(descuento) / 100);
        $('#CotTotal').val(Singleton.get().miles(Number(total) + Number(flete) - Number(Math.round(descuento))));
        return this.obtenerIvaNetoEditar();
      };

      mainView.prototype.obtenerIvaNetoEditar = function() {
        var iva, neto;
        neto = 0;
        iva = 0;
        return $.ajax({
          url: base_url + "/index.php/services/cotizacion/valorIVA",
          type: 'GET',
          async: false,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(valoriva) {
              neto = Singleton.get().cleanValor($('#CotTotal').val()) / (Number(valoriva) / 100 + 1);
              iva = Singleton.get().cleanValor($('#CotTotal').val()) * Number(valoriva) / 100;
              $('#CotNeto').val(Singleton.get().miles(Number(Math.round(neto))));
              return $('#CotIva').val(Singleton.get().miles(Number(Math.round(iva))));
            };
          })(this)
        });
      };

      mainView.prototype.reload = function() {
        this.createCookie('session_out', 'true', 7);
        window.location.reload(false);
        return false;
      };

      mainView.prototype.createCookie = function(name, value, days) {
        var date, expires;
        if (days) {
          date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toGMTString();
        } else {
          expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
        return false;
      };

      return mainView;

    })(Backbone.View);
  });

}).call(this);
