(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/gestorCotizaciones/editarCotizacion.html', 'text!tpl/gestorCotizaciones/modalMensaje.html', 'text!tpl/gestorCotizaciones/modalCliente.html', 'text!tpl/gestorCotizaciones/modalConsultorCotizacionesEdicion.html', 'text!tpl/gestorCotizaciones/modalListaPrecio.html', 'text!tpl/gestorCotizaciones/addRowEdicion.html'], function(Backbone, TpleditarCotizacion, TplmodalMensaje, TplmodalCliente, TplmodalConsultorCotizaciones, TplmodalListaPrecio, TpladdRow) {
    var editarCotizacion;
    return editarCotizacion = (function(superClass) {
      extend(editarCotizacion, superClass);

      function editarCotizacion() {
        this.cargarCotizacion = bind(this.cargarCotizacion, this);
        this.btnGuardar = bind(this.btnGuardar, this);
        this.modalAceptarProducto = bind(this.modalAceptarProducto, this);
        this.modalBuscarProducto = bind(this.modalBuscarProducto, this);
        this.datosdestinatario = bind(this.datosdestinatario, this);
        this.modalAceptarCliente = bind(this.modalAceptarCliente, this);
        this.modalBuscarCliente = bind(this.modalBuscarCliente, this);
        this.cargarVendedor = bind(this.cargarVendedor, this);
        this.agregarFila = bind(this.agregarFila, this);
        this.setiarhorasdespacho = bind(this.setiarhorasdespacho, this);
        this.showModalCliente = bind(this.showModalCliente, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return editarCotizacion.__super__.constructor.apply(this, arguments);
      }

      editarCotizacion.prototype.initialize = function(idCotizacion) {
        Singleton.get().contLin = 0;
        Singleton.get().mailMensajeModal = '';
        Singleton.get().mailAsuntoModal = '';
        Singleton.get().CountRowDelete = 0;
        this.idCotizacion = idCotizacion;
        return this.init();
      };

      editarCotizacion.prototype.init = function() {
        var ano, dia, fecha, log, mes;
        Singleton.get().showLoading();
        $('#appView').css('display', 'none');
        $('#appViewNext').html(_.template(TpleditarCotizacion)({}));
        $('.scroll').css('height', window.innerHeight - 75);
        $('.nexttitulo').html('Editar Pedido Nº ' + this.idCotizacion);
        $('.newTitulo').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            Singleton.get().showLoading();
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            return Singleton.get().hideLoading();
          };
        })(this));
        if (Singleton.get().idPerfilUsuarioLogueado === '4' || Singleton.get().idPerfilUsuarioLogueado === '5') {
          $('#CotDescuentoEdicion').attr('disabled', 'disabled');
        }
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
        $("#fechaCotizacionEditar").attr('value', dia + '/' + mes + '/' + ano);
        this.cargarVendedor();
        this.cargarCotizacion();
        $('.cantidadEdicion').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        $('.precio-unidadEdicion').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        $('#CotFleteEdicion').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        $('#CotDescuentoEdicion').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        $('#btnFiltro').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('#newMail').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('#histMail').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('#buscarClienteEditar').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('#bntAddRow').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('#btnAddDestinatario').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('#btnAddCliente').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('.btnfiltroArticulo').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('.btnfiltro-producto').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('.btnfiltro-precio').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('#validezCotizacionEditar').datepicker({
          firstDay: 1,
          dateFormat: "dd/mm/yy",
          dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
          monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
          onSelect: (function(_this) {
            return function(dateText, inst) {
              return $.ajax({
                url: base_url + "/index.php/services/cotizacion/obtenerfechahora/",
                type: 'GET',
                async: false,
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(fechahora) {
                  var aux, fechadespacho, fechainvertida, fechasistema, horasistema;
                  aux = Singleton.get().invertirFecha(fechahora.slice(0, 10), 'I');
                  fechasistema = aux.slice(0, 4);
                  fechasistema += aux.slice(5, 7);
                  fechasistema += aux.slice(8, 10);
                  horasistema = fechahora.slice(11, 13);
                  fechainvertida = Singleton.get().invertirFecha($('#validezCotizacionEditar').val(), 'I');
                  fechadespacho = fechainvertida.slice(0, 4);
                  fechadespacho += fechainvertida.slice(5, 7);
                  fechadespacho += fechainvertida.slice(8, 10);
                  if (parseInt(fechasistema) <= parseInt(fechadespacho)) {
                    fecha = Singleton.get().invertirFecha($('#validezCotizacionEditar').val(), 'I');
                    $.ajax({
                      url: base_url + "/index.php/services/cotizacion/buscardisponibilidad/fecha/" + fecha,
                      type: 'GET',
                      async: false,
                      statusCode: {
                        302: function() {
                          return Singleton.get().reload();
                        }
                      },
                      success: function(disponibilidad) {
                        if (disponibilidad.error !== '202') {
                          return _this.disponibilidad = disponibilidad;
                        } else {
                          return _this.disponibilidad = "";
                        }
                      },
                      error: function(data) {}
                    });
                    $.ajax({
                      url: base_url + "/index.php/services/repartidores/obtenerrepartidoresdia/fecha/" + fecha,
                      type: 'GET',
                      async: false,
                      statusCode: {
                        302: function() {
                          return Singleton.get().reload();
                        }
                      },
                      success: function(repartidoresdia) {
                        if (repartidoresdia.error !== '202') {
                          return _this.repartidoresdia = repartidoresdia[0].Cantidad_Repartidores;
                        } else {
                          return _this.repartidoresdia = repartidoresdia = 1;
                        }
                      }
                    });
                    _this.setiarhorasdespacho();
                  } else {
                    Singleton.get().showInformacion('La fecha ingresada no es valida');
                    $('#validezCotizacionEditar').val("");
                    $('#horaentregaEditar').html('<option value="">Seleccione</option>');
                  }
                  return false;
                }
              });
            };
          })(this)
        });
        $(document).on("focusout", ".productoEdicion", function(e) {
          var i;
          console.log('pasa x aqui');
          i = 1;
          e.preventDefault();
          e.stopPropagation();
          if ($('#idproducto' + e.currentTarget.attributes['row'].value).val() === "" && $('#producto' + e.currentTarget.attributes['row'].value).val() !== "") {
            Singleton.get().showInformacion('El producto ingresado no es valido');
            $('#producto' + e.currentTarget.attributes['row'].value).val("");
            $('#precioUnidad' + e.currentTarget.attributes['row'].value).val("");
            Singleton.get().setiarPrecioTotalEditar(e.currentTarget.attributes['row'].value);
          }
          while (i <= Singleton.get().contLin) {
            if (i !== parseInt(e.currentTarget.attributes['row'].value)) {
              if ($('#idproducto' + e.currentTarget.attributes['row'].value).val() === $('#idproducto' + i).val() && $('#idproducto' + e.currentTarget.attributes['row'].value).val() !== "") {
                Singleton.get().showInformacion('El producto ingresado ya existe en el pedido');
                $('#idproducto' + e.currentTarget.attributes['row'].value).val("");
                $('#producto' + e.currentTarget.attributes['row'].value).val("");
                $('#precioUnidad' + e.currentTarget.attributes['row'].value).val("");
                Singleton.get().setiarPrecioTotalEditar(e.currentTarget.attributes['row'].value);
              }
            }
            i++;
          }
          return false;
        });
        $(document).on("keyup", ".productoEdicion", function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (event.keyCode !== 13) {
            $('#idproducto' + e.currentTarget.attributes['row'].value).val("");
          }
          return false;
        });
        $(document).on("change", '#horaentregaEditar', (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return $.ajax({
              url: base_url + "/index.php/services/cotizacion/obtenerfechahora/",
              type: 'GET',
              async: false,
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: function(fechahora) {
                var aux, fechadespacho, fechainvertida, fechasistema, horasistema, minutossistema;
                aux = Singleton.get().invertirFecha(fechahora.slice(0, 10), 'I');
                fechasistema = aux.slice(0, 4);
                fechasistema += aux.slice(5, 7);
                fechasistema += aux.slice(8, 10);
                horasistema = fechahora.slice(11, 13);
                minutossistema = fechahora.slice(14, 16);
                fechainvertida = Singleton.get().invertirFecha($('#validezCotizacionEditar').val(), 'I');
                fechadespacho = fechainvertida.slice(0, 4);
                fechadespacho += fechainvertida.slice(5, 7);
                fechadespacho += fechainvertida.slice(8, 10);
                if (parseInt(fechasistema) === parseInt(fechadespacho)) {
                  if (parseInt(horasistema) > parseInt($('#horaentregaEditar').val().substr(0, 2))) {
                    Singleton.get().showInformacion('Combinacion de Fecha y Hora no valida');
                    $('#horaentregaEditar').val("");
                  } else {
                    if (parseInt(horasistema) === parseInt($('#horaentregaEditar').val().substr(0, 2)) && parseInt(minutossistema) > 30) {
                      Singleton.get().showInformacion('Combinacion de Fecha y Hora no valida');
                      $('#horaentregaEditar').val("");
                    }
                  }
                }
                return false;
              }
            });
          };
        })(this));
        $(document).on("click", ".clsEliminarFilaEdicion", function(e) {
          var objFila;
          e.preventDefault();
          e.stopPropagation();
          objFila = $(this).parents().get(1);
          $(objFila).remove();
          if ($(this).parents().get(1).attributes['iditem'].value !== 'New') {
            Singleton.get().RowDelete[Singleton.get().CountRowDelete] = $(this).parents().get(1).attributes['iditem'].value;
            Singleton.get().CountRowDelete += 1;
          }
          return false;
        });
        $(document).on("click", ".updateTfootEdicion", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            Singleton.get().setiarDescuentoEditar();
            return false;
          };
        })(this));
        $(document).on("click", ".btnfiltro-producto", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#btnFiltro').removeClass('btnfiltrograndeDis');
            $('#btnFiltro').addClass('btnfiltrograndeAct');
            $('#btnFiltro').popover('hide');
            $('#' + Singleton.get().idBtnFiltroArticulo).removeClass('btnfiltroDis');
            $('#' + Singleton.get().idBtnFiltroArticulo).addClass('btnfiltroAct');
            $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
            $('#modal').css('width', 475);
            $('#modal').css('height', 465);
            $('#modal').css('top', '50%');
            $('#modal').css('left', '55.5%');
            $('#modal').css('background-color', '#f6f6f6');
            $('#modal').html(_.template(TplmodalCliente));
            $('#tituloCliente').html('Elegir Producto');
            $('#Head1').html('Producto');
            $('#Head2').html('Id');
            $('#modal').modal('show');
            Singleton.get().rowBtnFiltroProducto = e.currentTarget.attributes['row'].value;
            $('#btnModalBuscarCliente').click(function(e) {
              return _this.modalBuscarProducto(e);
            });
            $('#inputModalBuscarCliente').keypress(function(e) {
              if (event.keyCode === 13) {
                return _this.modalBuscarProducto(e);
              }
            });
            $('#btnModalclienteAceptar').click(function(e) {
              return _this.modalAceptarProducto(e);
            });
            return false;
          };
        })(this));
        $(document).on("focus", ".productoEdicion", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            Singleton.get().inFocusIdProducto = e.currentTarget.value;
            return false;
          };
        })(this));
        $(document).on("keyup", ".cantidadEdicion", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            Singleton.get().setiarPrecioTotalEditar(e.currentTarget.attributes['row'].value);
            return false;
          };
        })(this));
        $(document).on("focusout", ".cantidadEdicion", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            Singleton.get().setiarPrecioTotalEditar(e.currentTarget.attributes['row'].value);
            return false;
          };
        })(this));
        $(document).on("keyup", ".precio-unidadEdicion", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#precioUnidad' + e.currentTarget.attributes['row'].value).val(Singleton.get().formatMiles(e.currentTarget.value));
            Singleton.get().setiarPrecioTotalEditar(e.currentTarget.attributes['row'].value);
            return false;
          };
        })(this));
        $(document).on("focusout", ".precio-unidadEdicion", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#precioUnidad' + e.currentTarget.attributes['row'].value).val(Singleton.get().formatMiles(e.currentTarget.value));
            Singleton.get().setiarPrecioTotalEditar(e.currentTarget.attributes['row'].value);
            return false;
          };
        })(this));
        $(document).on("keyup", "#CotFleteEdicion", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#CotFleteEdicion').val(Singleton.get().formatMiles($('#CotFleteEdicion').val()));
            Singleton.get().setiarNetoEditar();
            return false;
          };
        })(this));
        $(document).on("focusout", "#CotFleteEdicion", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($('#CotFleteEdicion').val() !== '') {
              if (!$.isNumeric(Singleton.get().cleanValor($('#CotFleteEdicion').val()))) {
                Singleton.get().showError('El Valor del Flete Ingresado es Incorrecto');
                $('#CotFleteEdicion').val('0');
              } else {
                $('#CotFleteEdicion').val(Singleton.get().formatMiles($('#CotFleteEdicion').val()));
                Singleton.get().setiarNetoEditar();
              }
            }
            return false;
          };
        })(this));
        $(document).on("keyup", "#CotDescuentoEdicion", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (Number(Singleton.get().cleanValor($('#CotDescuentoEdicion').val())) > 100) {
              Singleton.get().showError('El Porcentaje Ingresado Es Incorrecto');
              $('#CotDescuentoEdicion').val('0');
            } else {
              $('#CotDescuentoEdicion').val(Singleton.get().formatMiles($('#CotDescuentoEdicion').val()));
              Singleton.get().setiarDescuentoEditar();
            }
            return false;
          };
        })(this));
        $(document).on("focusout", "#CotDescuentoEdicion", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($('#CotDescuentoEdicion').val() !== '') {
              if (!$.isNumeric(Singleton.get().cleanValor($('#CotDescuentoEdicion').val()))) {
                Singleton.get().showError('El % de Descuento Ingresado es Incorrecto');
                $('#CotDescuentoEdicion').val('0');
              } else {
                if (Number(Singleton.get().cleanValor($('#CotDescuentoEdicion').val())) > 100) {
                  Singleton.get().showError('El Porcentaje Ingresado Es Incorrecto');
                  $('#CotDescuentoEdicion').val('0');
                } else {
                  $('#CotDescuentoEdicion').val(Singleton.get().formatMiles($('#CotDescuentoEdicion').val()));
                  Singleton.get().setiarDescuentoEditar();
                }
              }
            }
            return false;
          };
        })(this));
        $(document).on("focusout", "#autoc1Editar", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($('#autoc1Editar').val() === '') {
              $('#DVEditar').val('');
              $('#TelefonoClienteEditar').val('');
              $('#DestinatarioEditar').empty();
              $('#DireccionDestinatarioEditar').val('');
              $('#TelefonoDestinatarioEditar').val('');
              $('#CotFleteEdicion').val('0');
              $('#validezCotizacionEditar').val("");
              $('#validezCotizacionEditar').attr('disabled', 'disabled');
              $('#horaentregaEditar').html('<option value="">Seleccione</option>');
              Singleton.get().setiarFleteEditar();
            }
            return false;
          };
        })(this));
        $(document).on("keyup", "#autoc1Editar", (function(_this) {
          return function(e) {
            if (event.keyCode !== 13) {
              e.preventDefault();
              e.stopPropagation();
              $('#DVEditar').val('');
              $('#TelefonoClienteEditar').val('');
              $('#DestinatarioEditar').empty();
              $('#DireccionDestinatarioEditar').val('');
              $('#TelefonoDestinatarioEditar').val('');
              $('#CotFleteEdicion').val('0');
              $('#validezCotizacionEditar').val("");
              $('#validezCotizacionEditar').attr('disabled', 'disabled');
              $('#horaentregaEditar').html('<option value="">Seleccione</option>');
              Singleton.get().setiarFleteEditar();
            }
            return false;
          };
        })(this));
        $('#bntAddRow').click((function(_this) {
          return function(e) {
            return _this.agregarFila(e);
          };
        })(this));
        $('#btnAddCliente').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return Singleton.get().showModalAddClienteEditar();
          };
        })(this));
        $('#btnAddDestinatario').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($('#DVEditar').val() !== '') {
              return Singleton.get().showModalAddDestinatarioEditar();
            } else {
              return Singleton.get().showInformacion('Debe seleccionar un cliente');
            }
          };
        })(this));
        $('#buscarClienteEditar').click((function(_this) {
          return function(e) {
            return _this.showModalCliente(e);
          };
        })(this));
        $('#guardar').click((function(_this) {
          return function(e) {
            return _this.btnGuardar(e);
          };
        })(this));
        $('#DestinatarioEditar').change((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.datosdestinatario();
          };
        })(this));
        $('#cancelar').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            Singleton.get().showLoading();
            $('#appView').css('display', 'block');
            $('#appViewNext').empty();
            return Singleton.get().hideLoading();
          };
        })(this));
        log = (function(_this) {
          return function(rut, nombre, telefono) {
            var option;
            $('#DVEditar').val(Singleton.get().formatearRut(rut));
            $('#autoc1Editar').val(nombre);
            $('#TelefonoClienteEditar').val(telefono);
            option = '';
            return $.ajax({
              url: base_url + "/index.php/services/cotizacion/buscarDestinatario/id/" + rut,
              type: 'GET',
              async: false,
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: function(destino) {
                var d, j, len;
                if (destino.error !== '202') {
                  for (j = 0, len = destino.length; j < len; j++) {
                    d = destino[j];
                    option += '<option value="' + d.Id_Destino + '" selected="selected">' + d.Nombre_Contacto + '</option>';
                  }
                  $('#DestinatarioEditar').html(option);
                  return _this.datosdestinatario();
                } else {
                  $('#DestinatarioEditar').html("");
                  $('#DireccionDestinatarioEditar').val("");
                  $('#TelefonoDestinatarioEditar').val("");
                  $('#idDestinatarioEditar').val("");
                  $('#CotFleteEdicion').val(0);
                  return Singleton.get().setiarFleteEditar();
                }
              },
              error: function(data) {
                $('#DestinatarioEditar').html("");
                $('#DireccionDestinatarioEditar').val("");
                $('#TelefonoDestinatarioEditar').val("");
                $('#idDestinatarioEditar').val("");
                $('#CotFleteEdicion').val(0);
                return Singleton.get().setiarFleteEditar();
              }
            });
          };
        })(this);
        return $("#autoc1Editar").autocomplete({
          source: function(request, response) {
            return $.ajax({
              url: base_url + "/index.php/services/cotizacion",
              type: 'POST',
              data: {
                palabra: request.term
              },
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: (function(_this) {
                return function(data) {
                  return response($.map(data, function(item) {
                    return {
                      label: item.Nombre,
                      value: item.Nombre,
                      rut: item.Rut_Entidad,
                      telefono: item.Telefono
                    };
                  }));
                };
              })(this),
              error: function(data) {
                $('#autoc1Editar').removeClass("ui-autocomplete-loading");
                $('#autoc1Editar').autocomplete("close");
                $('#tablaContactos tbody').empty();
                $('#DVEditar').val('');
                return $('#TelefonoClienteEditar').val('');
              }
            });
          },
          minLength: 1,
          select: function(event, ui) {
            if (ui.item) {
              return log(ui.item.rut, ui.item.value, ui.item.telefono);
            }
          },
          open: function() {
            return $('#autoc1Editar').removeClass("ui-autocomplete-loading");
          },
          close: function() {
            return $('#autoc1Editar').removeClass("ui-autocomplete-loading");
          }
        }, false);
      };

      editarCotizacion.prototype.showModalCliente = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('#btnFiltro').removeClass('btnfiltrograndeDis');
        $('#btnFiltro').addClass('btnfiltrograndeAct');
        $('#btnFiltro').popover('hide');
        $('#' + Singleton.get().idBtnFiltroArticulo).removeClass('btnfiltroDis');
        $('#' + Singleton.get().idBtnFiltroArticulo).addClass('btnfiltroAct');
        $('#' + Singleton.get().idBtnFiltroArticulo).popover('destroy');
        $('#modal').css('width', 490);
        $('#modal').css('height', 465);
        $('#modal').css('top', '50%');
        $('#modal').css('left', '55.5%');
        $('#modal').css('background-color', '#f6f6f6');
        $('#modal').html(_.template(TplmodalCliente)({}));
        $('#tituloCliente').html('Elegir Cliente');
        $('#Head1').html('Nombre');
        $('#Head2').html('Rut');
        $('#modal').modal('show');
        $('#btnModalBuscarCliente').click((function(_this) {
          return function(e) {
            return _this.modalBuscarCliente(e);
          };
        })(this));
        $('#inputModalBuscarCliente').keypress((function(_this) {
          return function(e) {
            if (event.keyCode === 13) {
              return _this.modalBuscarCliente(e);
            }
          };
        })(this));
        $('#btnModalclienteAceptar').click((function(_this) {
          return function(e) {
            return _this.modalAceptarCliente(e);
          };
        })(this));
        return false;
      };

      editarCotizacion.prototype.setiarhorasdespacho = function() {
        var d, existe, hora, htmlhoras, i, j, k, len, len1, ref, s, sectoresocupadoshora;
        htmlhoras = '<option value="">Seleccione</option>';
        hora = new Array(1);
        hora[0] = "<option>09:30</option>";
        hora[1] = "<option>10:30</option>";
        hora[2] = "<option>11:30</option>";
        hora[3] = "<option>12:30</option>";
        hora[4] = "<option>13:30</option>";
        hora[5] = "<option>14:30</option>";
        hora[6] = "<option>15:30</option>";
        hora[7] = "<option>16:30</option>";
        hora[8] = "<option>17:30</option>";
        hora[9] = "<option>18:30</option>";
        hora[10] = "<option>19:30</option>";
        if (this.disponibilidad === "") {
          i = 0;
          while (i < 11) {
            htmlhoras = htmlhoras + hora[i];
            i++;
          }
          $('#horaentregaEditar').html(htmlhoras);
        } else {
          i = 0;
          while (i < 11) {
            sectoresocupadoshora = [];
            ref = this.disponibilidad;
            for (j = 0, len = ref.length; j < len; j++) {
              d = ref[j];
              if (parseInt(d.FechaHoraDespacho.slice(11, 13)) === parseInt(hora[i].slice(8, 11))) {
                sectoresocupadoshora.push(d.Id_Sector);
              }
            }
            existe = false;
            for (k = 0, len1 = sectoresocupadoshora.length; k < len1; k++) {
              s = sectoresocupadoshora[k];
              if (Singleton.get().idsector === s) {
                existe = true;
              }
            }
            if (existe === true) {
              htmlhoras = htmlhoras + hora[i];
            } else {
              if (sectoresocupadoshora.length < this.repartidoresdia) {
                htmlhoras = htmlhoras + hora[i];
              }
            }
            i++;
          }
          $('#horaentregaEditar').html(htmlhoras);
        }
        return false;
      };

      editarCotizacion.prototype.agregarFila = function(e) {
        var Validator, idUsuario;
        e.preventDefault();
        e.stopPropagation();
        Validator = true;
        $("#tablaItem tbody tr").each(function(index) {
          return $(this).children("td").each(function(index2) {
            switch (index2) {
              case 0:
                if ($(this)[0].firstElementChild.value === '') {
                  Singleton.get().showInformacion('Existe Una Cantidad Sin Ingresar');
                  Validator = false;
                  break;
                }
                if (!$.isNumeric($(this)[0].firstElementChild.value)) {
                  Singleton.get().showError('Existe Una Cantidad Incorrecta');
                  Validator = false;
                  break;
                }
                break;
              case 1:
                if ($(this)[0].firstElementChild.value === '') {
                  Singleton.get().showInformacion('Existe Un Producto Sin Ingresar');
                  Validator = false;
                  break;
                }
                break;
              case 2:
                if ($(this)[0].firstElementChild.value === '') {
                  Singleton.get().showInformacion('Existe Un Precio Unidad Sin Ingresar');
                  Validator = false;
                  break;
                }
                if (!$.isNumeric(Singleton.get().cleanValor($(this)[0].firstElementChild.value))) {
                  Singleton.get().showError('Existe Un Precio Unidad Incorrecto');
                  Validator = false;
                  break;
                }
            }
          });
        });
        if (Validator === true) {
          Singleton.get().contLin++;
          $('#tablaItem').find("tbody").append(_.template(TpladdRow)({
            contLin: Singleton.get().contLin,
            newItem: 'New'
          }));
          $('.precio-unidadEdicion').attr('disabled', 'disabled');
          $('.cantidadEdicion').keydown(function(event) {
            if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

            } else {
              if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                return event.preventDefault();
              }
            }
          });
          $('.precio-unidadEdicion').keydown(function(event) {
            if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

            } else {
              if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                return event.preventDefault();
              }
            }
          });
          idUsuario = Singleton.get().idUsuarioLogueado;
          $(".productoEdicion").autocomplete({
            source: function(request, response) {
              return $.ajax({
                url: base_url + "/index.php/services/restricciones/buscarProducto/nombre/" + request.term,
                type: 'GET',
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(data) {
                  return response($.map(data, function(item) {
                    return {
                      label: item.Nombre,
                      value: item.Nombre,
                      id: item.Id_Producto,
                      precio: item.Precio
                    };
                  }));
                },
                error: function(data) {
                  $('.productoEdicion').removeClass("ui-autocomplete-loading");
                  return $('.productoEdicion').autocomplete("close");
                }
              });
            },
            minLength: 1,
            select: function(event, ui) {
              var indice;
              if (ui.item) {
                indice = event.target.id.split("producto");
                $('#idproducto' + indice[1]).val(ui.item.id);
                $('#precioUnidad' + indice[1]).val(Singleton.get().formatMiles(ui.item.precio));
                return Singleton.get().setiarPrecioTotalEditar(indice[1]);
              }
            },
            open: function() {
              return $('.productoEdicion').removeClass("ui-autocomplete-loading");
            },
            close: function() {
              return $('.productoEdicion').removeClass("ui-autocomplete-loading");
            }
          });
          $('.btnfiltro-producto').tooltip({
            'trigger': 'hover',
            'delay': {
              'show': 100,
              'hide': 100
            }
          });
        }
        return false;
      };

      editarCotizacion.prototype.cargarVendedor = function() {
        var idSubgerencia, idSupervisor, idUsuario, perfil, usuariolog;
        idUsuario = Singleton.get().idUsuarioLogueado;
        perfil = Singleton.get().perfilUsuarioLogueado;
        usuariolog = Singleton.get().nombreUsuarioLogueado;
        idSupervisor = Singleton.get().idSupervisorUsuarioLogueado;
        idSubgerencia = Singleton.get().idSubgerenciaUsuarioLogueado;
        $('#cotVendedor').attr('disabled', 'disabled');
        $('#nomVendedorEditar').val(usuariolog);
        $.ajax({
          url: base_url + "/index.php/services/cotizacion/buscarUsuario/id/" + idSupervisor,
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(usuario) {
              if (usuario.error !== '202') {
                $('#cotResponsableEditar').val(usuario[0].Nombre);
                return $('#idResponsableEditar').val(idSupervisor);
              } else {
                $('#cotResponsableEditar').val(usuariolog);
                return $('#idResponsableEditar').val(idUsuario);
              }
            };
          })(this),
          error: (function(_this) {
            return function(data) {
              $('#cotResponsableEditar').val(usuariolog);
              return $('#idResponsableEditar').val(idUsuario);
            };
          })(this)
        });
        return false;
      };

      editarCotizacion.prototype.modalBuscarCliente = function(e) {
        var idCliente, radioOption;
        e.preventDefault();
        e.stopPropagation();
        idCliente = $('#inputModalBuscarCliente').val();
        radioOption = '';
        if ($.isNumeric(idCliente)) {
          $('#inputModalBuscarCliente').val(Singleton.get().formatearRut(idCliente));
          $.ajax({
            url: base_url + "/index.php/services/cotizacion/buscarRut/id/" + idCliente,
            type: 'GET',
            statusCode: {
              302: function() {
                return Singleton.get().reload();
              }
            },
            success: (function(_this) {
              return function(clientes) {
                var c, j, len;
                for (j = 0, len = clientes.length; j < len; j++) {
                  c = clientes[j];
                  radioOption += '<tr>';
                  radioOption += '<td class="td-radio"><input type="radio" name="tabla" value="' + c.Rut_Entidad + '"></td>';
                  radioOption += '<td class="td-nombre">' + c.Nombre + '</td>';
                  radioOption += '<td>' + Singleton.get().formatearRut(c.Rut_Entidad) + '</td>';
                  radioOption += '</tr>';
                }
                return $('#tablaModalMostrarClientes tbody').html(radioOption);
              };
            })(this),
            error: (function(_this) {
              return function(data) {
                return $('#tablaModalMostrarClientes tbody').empty();
              };
            })(this)
          });
        } else {
          $.ajax({
            url: base_url + "/index.php/services/cotizacion",
            type: 'POST',
            data: {
              palabra: idCliente
            },
            statusCode: {
              302: function() {
                return Singleton.get().reload();
              }
            },
            success: (function(_this) {
              return function(clientes) {
                var c, j, len;
                for (j = 0, len = clientes.length; j < len; j++) {
                  c = clientes[j];
                  radioOption += '<tr>';
                  radioOption += '<td class="td-radio"><input type="radio" name="tabla" value="' + c.Rut_Entidad + '"></td>';
                  radioOption += '<td class="td-nombre">' + c.Nombre + '</td>';
                  radioOption += '<td>' + Singleton.get().formatearRut(c.Rut_Entidad) + '</td>';
                  radioOption += '</tr>';
                }
                return $('#tablaModalMostrarClientes tbody').html(radioOption);
              };
            })(this),
            error: (function(_this) {
              return function(data) {
                return $('#tablaModalMostrarClientes tbody').empty();
              };
            })(this)
          });
        }
        return false;
      };

      editarCotizacion.prototype.modalAceptarCliente = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $("#tablaModalMostrarClientes tbody tr").each(function(index) {
          var nombreCiente, option, rutCliente;
          if ($(this).children("td")[0].childNodes[0].checked === true) {
            rutCliente = $(this).children("td")[0].firstElementChild.value;
            nombreCiente = $(this).children("td")[1].textContent;
            $('#DVEditar').val(Singleton.get().formatearRut(rutCliente));
            option = '';
            $.ajax({
              url: base_url + "/index.php/services/cotizacion/buscarRut/id/" + rutCliente,
              type: 'GET',
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: (function(_this) {
                return function(cliente) {
                  $('#autoc1Editar').val(cliente[0].Nombre);
                  return $('#TelefonoClienteEditar').val(cliente[0].Telefono);
                };
              })(this),
              error: (function(_this) {
                return function(data) {};
              })(this)
            });
            return $.ajax({
              url: base_url + "/index.php/services/cotizacion/buscarDestinatario/id/" + rutCliente,
              type: 'GET',
              async: false,
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: (function(_this) {
                return function(destino) {
                  var d, id, j, len;
                  if (destino.error !== '202') {
                    for (j = 0, len = destino.length; j < len; j++) {
                      d = destino[j];
                      option += '<option value="' + d.Id_Destino + '" selected="selected">' + d.Nombre_Contacto + '</option>';
                    }
                    $('#DestinatarioEditar').html(option);
                    id = $('#DestinatarioEditar').val();
                    return $.ajax({
                      url: base_url + "/index.php/services/cotizacion/buscardatosDestinatario/id/" + id,
                      type: 'GET',
                      async: false,
                      statusCode: {
                        302: function() {
                          return Singleton.get().reload();
                        }
                      },
                      success: function(destino) {
                        $('#idDestinatarioEditar').val(id);
                        $('#DireccionDestinatarioEditar').val(destino[0].Direccion);
                        if (destino[0].Telefono !== '0') {
                          $('#TelefonoDestinatarioEditar').val(destino[0].Telefono);
                        } else {
                          $('#TelefonoDestinatarioEditar').val("");
                        }
                        $('#CotFleteEdicion').val(destino[0].PrecioFlete);
                        $('#validezCotizacionEditar').val("");
                        $('#horaentregaEditar').html('<option value="">Seleccione</option>');
                        $('#validezCotizacionEditar').removeAttr('disabled');
                        return Singleton.get().idsector = destino[0].Id_Sector;
                      }
                    });
                  } else {
                    $('#DestinatarioEditar').html("");
                    $('#idDestinatarioEditar').val("");
                    $('#DireccionDestinatarioEditar').val("");
                    $('#TelefonoDestinatarioEditar').val("");
                    return $('#CotFleteEdicion').val("0");
                  }
                };
              })(this),
              error: (function(_this) {
                return function(data) {
                  $('#DestinatarioEditar').html("");
                  $('#idDestinatarioEditar').val("");
                  $('#DireccionDestinatarioEditar').val("");
                  return $('#TelefonoDestinatarioEditar').val("");
                };
              })(this)
            });
          }
        });
        $('#modal').modal('hide');
        Singleton.get().setiarFleteEditar();
        $('.put-tooltips').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        return false;
      };

      editarCotizacion.prototype.datosdestinatario = function() {
        var id;
        id = $('#DestinatarioEditar').val();
        $.ajax({
          url: base_url + "/index.php/services/cotizacion/buscardatosDestinatario/id/" + id,
          type: 'GET',
          async: false,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(destino) {
              $('#idDestinatarioEditar').val(id);
              $('#DireccionDestinatarioEditar').val(destino[0].Direccion);
              if (destino[0].Telefono !== '0') {
                $('#TelefonoDestinatarioEditar').val(destino[0].Telefono);
              } else {
                $('#TelefonoDestinatarioEditar').val("");
              }
              $('#CotFleteEdicion').val(destino[0].PrecioFlete);
              $('#validezCotizacionEditar').val("");
              $('#horaentregaEditar').html('<option value="">Seleccione</option>');
              $('#validezCotizacionEditar').removeAttr('disabled');
              Singleton.get().idsector = destino[0].Id_Sector;
              return Singleton.get().setiarFleteEditar();
            };
          })(this),
          error: (function(_this) {
            return function(data) {};
          })(this)
        });
        return false;
      };

      editarCotizacion.prototype.modalBuscarProducto = function(e) {
        var nombreProducto, radioOption;
        e.preventDefault();
        e.stopPropagation();
        nombreProducto = $('#inputModalBuscarCliente').val();
        radioOption = '';
        $.ajax({
          url: base_url + "/index.php/services/restricciones/buscarProducto/nombre/" + nombreProducto,
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(productos) {
              var j, len, p;
              for (j = 0, len = productos.length; j < len; j++) {
                p = productos[j];
                radioOption += '<tr>';
                radioOption += '<td class="td-radio"><input type="radio" name="tabla" value="' + p.Id_Producto + '"></td>';
                radioOption += '<td class="td-nombre">' + p.Nombre + '</td>';
                radioOption += '<td>' + p.Id_Producto + '</td>';
                radioOption += '<td visibility: hidden>' + p.Precio + '</td>';
                radioOption += '</tr>';
              }
              return $('#tablaModalMostrarClientes tbody').html(radioOption);
            };
          })(this),
          error: (function(_this) {
            return function(data) {
              return $('#tablaModalMostrarClientes tbody').empty();
            };
          })(this)
        });
        return false;
      };

      editarCotizacion.prototype.modalAceptarProducto = function(e) {
        var i, idPro, iguales;
        i = 0;
        iguales = 0;
        e.preventDefault();
        e.stopPropagation();
        idPro = '';
        $("#tablaModalMostrarClientes tbody tr").each(function(index) {
          var nombre, precio;
          if ($(this).children("td")[0].childNodes[0].checked === true) {
            idPro = $(this).children("td")[2].textContent;
            nombre = $(this).children("td")[1].textContent;
            precio = $(this).children("td")[3].textContent;
            $('#producto' + Singleton.get().rowBtnFiltroProducto).val(nombre);
            $('#idproducto' + Singleton.get().rowBtnFiltroProducto).val(idPro);
            $('#producto' + Singleton.get().rowBtnFiltroProducto).css('background-color', '#ffffff');
            $('#precioUnidad' + Singleton.get().rowBtnFiltroProducto).val(Singleton.get().formatMiles(precio));
            Singleton.get().setiarPrecioTotalEditar(Singleton.get().rowBtnFiltroProducto);
            while (i <= Singleton.get().contLin) {
              if (i !== parseInt(Singleton.get().rowBtnFiltroProducto)) {
                if ($('#idproducto' + Singleton.get().rowBtnFiltroProducto).val() === $('#idproducto' + i).val() && $('#idproducto' + Singleton.get().rowBtnFiltroProducto).val() !== "") {
                  $('#idproducto' + Singleton.get().rowBtnFiltroProducto).val("");
                  $('#producto' + Singleton.get().rowBtnFiltroProducto).val("");
                  $('#precioUnidad' + Singleton.get().rowBtnFiltroProducto).val("");
                  Singleton.get().setiarPrecioTotalEditar(Singleton.get().rowBtnFiltroProducto);
                  iguales = 1;
                }
              }
              i++;
            }
            if (iguales === 1) {
              return Singleton.get().showInformacion('El producto ingresado ya existe en el pedido');
            } else {
              return $('#modal').modal('hide');
            }
          }
        });
        return false;
      };

      editarCotizacion.prototype.btnGuardar = function(e) {
        var Validator, restriccion;
        e.preventDefault();
        e.stopPropagation();
        Validator = true;
        restriccion = true;
        Singleton.get().CountItemsExito = 0;
        Singleton.get().CountItemsSave = 0;
        $('#btnFiltro').popover('hide');
        if ($('#autoc1Editar').val() === '') {
          Singleton.get().showInformacion('Debe Seleccionar un Cliente');
          Validator = false;
        }
        if ($('#DestinatarioEditar option').length === 0) {
          Singleton.get().showInformacion('No existen destinatarios asociados al Cliente');
          Validator = false;
        }
        if ($('#validezCotizacionEditar').val() === '') {
          Singleton.get().showInformacion('Debe Seleccionar un Fecha de Despacho');
          Validator = false;
        }
        if ($('#horaentregaEditar').find(':selected').val() === '') {
          Singleton.get().showInformacion('Debe Seleccionar una hora de Despacho');
          Validator = false;
        }
        $("#tablaItem tbody tr").each(function(index) {
          Singleton.get().CountItemsSave += 1;
          return $(this).children("td").each(function(index2) {
            switch (index2) {
              case 0:
                if ($(this)[0].firstElementChild.value === '') {
                  Singleton.get().showInformacion('Existe Una Cantidad Sin Ingresar');
                  Validator = false;
                  break;
                }
                if (!$.isNumeric($(this)[0].firstElementChild.value)) {
                  Singleton.get().showError('Existe Una Cantidad Incorrecta');
                  Validator = false;
                  break;
                }
                break;
              case 1:
                if ($('#idproducto' + (index + 1)).val() === '0') {
                  $('#producto' + (index + 1)).css('background-color', '#f5c0bb');
                  Singleton.get().showInformacion('Existe productos inactivos en el pedido');
                  Validator = false;
                  break;
                }
                if ($(this)[0].firstElementChild.value === '') {
                  Singleton.get().showInformacion('Existe Un Producto Sin Ingresar');
                  Validator = false;
                  break;
                }
                break;
              case 2:
                if ($(this)[0].firstElementChild.value === '') {
                  Singleton.get().showInformacion('Existe Una Precio de Unidad Sin Ingresar');
                  Validator = false;
                  break;
                }
                if (!$.isNumeric(Singleton.get().cleanValor($(this)[0].firstElementChild.value))) {
                  Singleton.get().showError('Existe Un Precio de unidad Incorrecto');
                  Validator = false;
                  break;
                }
            }
          });
        });
        if ($('#CotFleteEdicion').val() === '') {
          $('#CotFleteEdicion').val('0');
        }
        if ($('#CotDescuentoEdicion').val() === '') {
          $('#CotDescuentoEdicion').val('0');
        }
        if (Singleton.get().CountItemsSave === 0) {
          Singleton.get().showError('Debe existir un detalle de cotizacion');
          Validator = false;
        }
        if (Validator === true && restriccion === true) {
          Singleton.get().showLoading('Guardando Información ...');
          $.ajax({
            url: base_url + "/index.php/services/cotizacion/actualizarCotizacion",
            type: 'POST',
            data: {
              Id_Clase: '1',
              Id_Pedidos: this.idCotizacion,
              Cliente: $('#autoc1Editar').val(),
              Rut_Entidad: Singleton.get().cleanRut($('#DVEditar').val()),
              Fecha_Ped: Singleton.get().invertirFecha($('#fechaCotizacionEditar').val(), 'I'),
              Id_Destinatario: $('#DestinatarioEditar').val(),
              FechaHoraDespacho: Singleton.get().invertirFecha($('#validezCotizacionEditar').val(), 'I') + ' ' + $('#horaentregaEditar').val(),
              Id_Vendedor: Singleton.get().idUsuarioLogueado,
              Responsable: $('#idResponsableEditar').val(),
              Total_Flete: Singleton.get().cleanValor($('#CotFleteEdicion').val()),
              Valor_Neto: Singleton.get().cleanValor($('#CotNeto').val()),
              Descuento: $('#CotDescuentoEdicion').val(),
              Iva: Singleton.get().cleanValor($('#CotIva').val()),
              Total: Singleton.get().cleanValor($('#CotTotal').val()),
              Observaciones_Fabricacion: $('#obsfabr').val(),
              Observaciones_Generales: $('#obsgen').val(),
              Observaciones_Despacho: $('#obsdesp').val(),
              Id_Subgerencia: Singleton.get().idSubgerenciaUsuarioLogueado
            },
            statusCode: {
              302: function() {
                return Singleton.get().reload();
              }
            },
            success: (function(_this) {
              return function(result) {
                var cantidad, i, id, jObject, precio, producto, valorTotal;
                if (result === true) {
                  if (Singleton.get().RowDelete.length !== 0) {
                    jObject = {};
                    for (i in Singleton.get().RowDelete) {
                      jObject[i] = Singleton.get().RowDelete[i];
                    }
                    jObject = JSON.stringify(jObject);
                    $.ajax({
                      url: base_url + "/index.php/services/cotizacion/deleteRowItem",
                      type: 'POST',
                      data: {
                        jObject: jObject
                      }
                    });
                  }
                  id = _this.idCotizacion;
                  cantidad = 0;
                  producto = '';
                  precio = 0;
                  valorTotal = 0;
                  return $("#tablaItem tbody tr").each(function(index) {
                    var idItem;
                    idItem = $(this)[0].attributes['iditem'].value;
                    $(this).children("td").each(function(index2) {
                      switch (index2) {
                        case 0:
                          return cantidad = $(this)[0].firstElementChild.value;
                        case 1:
                          if (idItem === 'New') {
                            return producto = $(this)[0].childNodes[4].attributes[4].value;
                          } else {
                            return producto = $(this)[0].childNodes[2].attributes[2].value;
                          }
                          break;
                        case 2:
                          return precio = $(this)[0].firstElementChild.value;
                        case 3:
                          return valorTotal = $(this)[0].firstElementChild.value;
                      }
                    });
                    return $.ajax({
                      url: base_url + "/index.php/services/cotizacion/actualizarItemTracking",
                      type: 'POST',
                      data: {
                        Id_Pedido: id,
                        Id_ItemPedido: idItem,
                        Cantidad: cantidad,
                        Id_Producto: producto,
                        Precio_Unitario: Singleton.get().cleanValor(precio),
                        Precio_Total: Singleton.get().cleanValor(valorTotal),
                        Id_Usuario: Singleton.get().idUsuarioLogueado
                      },
                      statusCode: {
                        302: function() {
                          return Singleton.get().reload();
                        }
                      },
                      success: (function(_this) {
                        return function(result) {
                          if (result === 'true') {
                            Singleton.get().CountItemsExito += 1;
                          }
                          if (Singleton.get().CountItemsExito === Singleton.get().CountItemsSave) {
                            Singleton.get().showExito();
                            return $('#btnExito').click(function(e) {
                              e.preventDefault();
                              e.stopPropagation();
                              return Singleton.get().cargarListadoCotizacion();
                            });
                          }
                        };
                      })(this),
                      error: (function(_this) {
                        return function(data) {
                          return Singleton.get().showError('Error 1');
                        };
                      })(this)
                    });
                  });
                } else {
                  return Singleton.get().showError('Error 2');
                }
              };
            })(this),
            error: (function(_this) {
              return function(data) {
                return Singleton.get().showError('Error 3');
              };
            })(this)
          });
        }
        return false;
      };

      editarCotizacion.prototype.cargarCotizacion = function() {
        var checkContacto, option, row;
        checkContacto = '';
        option = '<option value="0" selected="selected">Seleccione</option>';
        row = '';
        $.ajax({
          url: base_url + "/index.php/services/cotizacion/buscarCotizacion/idCotizacion/" + this.idCotizacion,
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(cotizacion) {
              return $.ajax({
                url: base_url + "/index.php/services/cotizacion/buscarItems/idCotizacion/" + _this.idCotizacion,
                type: 'GET',
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(items) {
                  var hora, i, idRut, idUsuario, j, len;
                  for (j = 0, len = items.length; j < len; j++) {
                    i = items[j];
                    Singleton.get().contLin++;
                    row += '<tr iditem="' + i.Id_ItemPedido + '">';
                    row += '<td class="td-cantidad">';
                    row += '<input type="text" id="cantidadEdicion' + Singleton.get().contLin + '" class="cantidadEdicion" row="' + Singleton.get().contLin + '" value="' + i.Cantidad + '">';
                    row += '</td>';
                    row += '<td class="td-producto">';
                    row += '<input type="text" id="producto' + Singleton.get().contLin + '" class="productoEdicion" row="' + Singleton.get().contLin + '" value="' + i.nombreproducto + '">';
                    if (i.estadoproducto === 'Activo') {
                      row += '<input type="hidden"  id="idproducto' + Singleton.get().contLin + '" value="' + i.Id_Producto + '">';
                    } else {
                      row += '<input type="hidden"  id="idproducto' + Singleton.get().contLin + '" value="' + 0 + '">';
                    }
                    row += '<div class="btnfiltro-producto" row="' + Singleton.get().contLin + '" title="Buscador de Productos"></div>';
                    row += '</td>';
                    row += '<td class="td-precioUnidad">';
                    row += '<input type="text" id="precioUnidad' + Singleton.get().contLin + '" class="precio-unidadEdicion" row="' + Singleton.get().contLin + '" value="' + Singleton.get().miles(i.Precio_Unitario) + '">';
                    row += '</td>';
                    row += '<td class="td-precioTotal">';
                    row += '<input type="text" id="precioTotal' + Singleton.get().contLin + '" class="precio-total" row="' + Singleton.get().contLin + '" disabled value="' + Singleton.get().miles(i.Precio_Total) + '">';
                    row += '</td>';
                    row += '<td class="td-delete">';
                    row += '<div class="clsEliminarFilaEdicion updateTfootEdicion" id="btndelete" row="' + Singleton.get().contLin + '"> </div>';
                    row += '</td>';
                    row += '</tr>';
                    $('#tablaItem tbody').append(row);
                    row = '';
                    $('.cantidadEdicion').keydown(function(event) {
                      if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

                      } else {
                        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                          return event.preventDefault();
                        }
                      }
                    });
                    $('.precio-unidadEdicion').keydown(function(event) {
                      if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

                      } else {
                        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                          return event.preventDefault();
                        }
                      }
                    });
                    $(document).on("focus", ".productoEdicion", function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      $(this).css('background-color', '#ffffff');
                      return false;
                    });
                    idUsuario = Singleton.get().idUsuarioLogueado;
                    $(".productoEdicion").autocomplete({
                      source: function(request, response) {
                        return $.ajax({
                          url: base_url + "/index.php/services/restricciones/buscarProducto/nombre/" + request.term,
                          type: 'GET',
                          statusCode: {
                            302: function() {
                              return Singleton.get().reload();
                            }
                          },
                          success: function(data) {
                            return response($.map(data, function(item) {
                              return {
                                label: item.Nombre,
                                value: item.Nombre,
                                id: item.Id_Producto,
                                precio: item.Precio
                              };
                            }));
                          },
                          error: function(data) {
                            $('.productoEdicion').removeClass("ui-autocomplete-loading");
                            return $('.productoEdicion').autocomplete("close");
                          }
                        });
                      },
                      minLength: 1,
                      select: function(event, ui) {
                        var indice;
                        if (ui.item) {
                          indice = event.target.id.split("producto");
                          $('#idproducto' + indice[1]).val(ui.item.id);
                          $('#precioUnidad' + indice[1]).val(Singleton.get().formatMiles(ui.item.precio));
                          return Singleton.get().setiarPrecioTotalEditar(indice[1]);
                        }
                      },
                      open: function() {
                        return $('.productoEdicion').removeClass("ui-autocomplete-loading");
                      },
                      close: function() {
                        return $('.productoEdicion').removeClass("ui-autocomplete-loading");
                      }
                    });
                    idRut = new String($('#DVEditar').val()).substr(0, 2) + new String($('#DVEditar').val()).substr(3, 3) + new String($('#DVEditar').val()).substr(7, 3);
                    option = '<option value="0" selected="selected">Seleccione</option>';
                    $('.btnfiltro-producto').tooltip({
                      'trigger': 'hover',
                      'delay': {
                        'show': 100,
                        'hide': 100
                      }
                    });
                  }
                  if (cotizacion[0].rutCliente !== null) {
                    $('#DVEditar').val(Singleton.get().formatearRut(cotizacion[0].rutCliente));
                  }
                  if (cotizacion[0].nombreCliente !== null) {
                    $('#autoc1Editar').val(cotizacion[0].nombreCliente);
                  }
                  if (cotizacion[0].telefonoCliente !== '0') {
                    $('#TelefonoClienteEditar').val(cotizacion[0].telefonoCliente);
                  } else {
                    $('#TelefonoClienteEditar').val("");
                  }
                  if (cotizacion[0].direcciondestino !== null) {
                    $('#DireccionDestinatarioEditar').val(cotizacion[0].direcciondestino);
                  }
                  if (cotizacion[0].telefonodestino !== '0') {
                    $('#TelefonoDestinatarioEditar').val(cotizacion[0].telefonodestino);
                  } else {
                    $('#TelefonoDestinatarioEditar').val("");
                  }
                  if (cotizacion[0].FechaHoraDespacho.substring(11, 16) !== null) {
                    hora = new Array(1);
                    hora[0] = "<option>09:30</option>";
                    hora[1] = "<option>10:30</option>";
                    hora[2] = "<option>11:30</option>";
                    hora[3] = "<option>12:30</option>";
                    hora[4] = "<option>13:30</option>";
                    hora[5] = "<option>14:30</option>";
                    hora[6] = "<option>15:30</option>";
                    hora[7] = "<option>16:30</option>";
                    hora[8] = "<option>17:30</option>";
                    i = 0;
                    while (i < 9) {
                      if (parseInt(cotizacion[0].FechaHoraDespacho.substring(11, 13)) === parseInt(hora[i].substring(8, 10))) {
                        $("#horaentregaEditar").html(hora[i]);
                      }
                      i++;
                    }
                  }
                  if (cotizacion[0].Observaciones_Fabricacion !== null) {
                    $('#obsfabr').val(cotizacion[0].Observaciones_Fabricacion);
                  }
                  if (cotizacion[0].Observaciones_Despacho !== null) {
                    $('#obsdesp').val(cotizacion[0].Observaciones_Despacho);
                  }
                  if (cotizacion[0].Observaciones !== null) {
                    $('#obsgen').val(cotizacion[0].Observaciones);
                  }
                  if (cotizacion[0].Total_Flete !== null) {
                    $('#CotFleteEdicion').val(Singleton.get().miles(cotizacion[0].Total_Flete));
                  }
                  $('#CotNeto').val(Singleton.get().miles(cotizacion[0].Valor_Neto));
                  $('#CotDescuentoEdicion').val(cotizacion[0].Descuento);
                  $('#CotIva').val(Singleton.get().miles(cotizacion[0].Iva));
                  $('#CotTotal').val(Singleton.get().miles(cotizacion[0].Total));
                  $('#validezCotizacionEditar').val(Singleton.get().invertirFecha(cotizacion[0].FechaHoraDespacho.substring(0, 10)));
                  if (cotizacion[0].rutCliente !== null) {
                    $.ajax({
                      url: base_url + "/index.php/services/cotizacion/buscarDestinatario/id/" + cotizacion[0].rutCliente,
                      type: 'GET',
                      statusCode: {
                        302: function() {
                          return Singleton.get().reload();
                        }
                      },
                      success: function(destino) {
                        var d, k, len1;
                        for (k = 0, len1 = destino.length; k < len1; k++) {
                          d = destino[k];
                          option += '<option value="' + d.Id_Destino + '" selected="selected">' + d.Nombre_Contacto + '</option>';
                        }
                        $('#DestinatarioEditar').html(option);
                        return $('#DestinatarioEditar option[value=' + cotizacion[0].Id_Destinatario + ']').attr('selected', true);
                      },
                      error: function(data) {
                        return $('#DestinatarioEditar').empty();
                      }
                    });
                  }
                  $('#appView').css('display', 'none');
                  $('.precio-unidadEdicion').attr('disabled', 'disabled');
                  return Singleton.get().hideLoading();
                }
              });
            };
          })(this)
        });
        return false;
      };

      return editarCotizacion;

    })(Backbone.View);
  });

}).call(this);
