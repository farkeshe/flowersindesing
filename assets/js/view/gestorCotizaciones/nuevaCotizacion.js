(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/gestorCotizaciones/nuevaCotizacion.html', 'text!tpl/gestorCotizaciones/modalMensaje.html', 'text!tpl/gestorCotizaciones/modalCliente.html', 'text!tpl/gestorCotizaciones/modalConsultorCotizaciones.html', 'text!tpl/gestorCotizaciones/modalListaPrecio.html', 'text!tpl/gestorCotizaciones/addRow.html'], function(Backbone, TplnuevaCotizacion, TplmodalMensaje, TplmodalCliente, TplmodalConsultorCotizaciones, TplmodalListaPrecio, TpladdRow) {
    var nuevaCotizacion;
    return nuevaCotizacion = (function(superClass) {
      extend(nuevaCotizacion, superClass);

      function nuevaCotizacion() {
        this.btnGuardar = bind(this.btnGuardar, this);
        this.modalAceptarProducto = bind(this.modalAceptarProducto, this);
        this.modalBuscarProducto = bind(this.modalBuscarProducto, this);
        this.modalAceptarCliente = bind(this.modalAceptarCliente, this);
        this.modalBuscarCliente = bind(this.modalBuscarCliente, this);
        this.datosdestinatario = bind(this.datosdestinatario, this);
        this.cargarVendedor = bind(this.cargarVendedor, this);
        this.agregarFila = bind(this.agregarFila, this);
        this.showModalCliente = bind(this.showModalCliente, this);
        this.setiarhorasdespacho = bind(this.setiarhorasdespacho, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return nuevaCotizacion.__super__.constructor.apply(this, arguments);
      }

      nuevaCotizacion.prototype.initialize = function() {
        Singleton.get().contLin = 1;
        Singleton.get().mailMensajeModal = '';
        Singleton.get().mailAsuntoModal = '';
        return this.init();
      };

      nuevaCotizacion.prototype.init = function() {
        var log;
        Singleton.get().showLoading();
        $('#appView').html(_.template(TplnuevaCotizacion)({}));
        $('.scroll').css('height', window.innerHeight - 75);
        $('#modal').css('display', 'none');
        $('#validezCotizacion').attr('disabled', 'disabled');
        $('.precio-unidad').attr('disabled', 'disabled');
        if (Singleton.get().idPerfilUsuarioLogueado === '4' || Singleton.get().idPerfilUsuarioLogueado === '5') {
          $('#CotDescuento').attr('disabled', 'disabled');
        }
        $.ajax({
          url: base_url + "/index.php/services/cotizacion/obtenerfechahora/",
          type: 'GET',
          async: false,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(fechahora) {
              var ano, aux, dia, mes;
              aux = Singleton.get().invertirFecha(fechahora.slice(0, 10), 'I');
              ano = aux.slice(0, 4);
              mes = aux.slice(5, 7);
              dia = aux.slice(8, 10);
              return $("#fechaCotizacion").attr('value', dia + '/' + mes + '/' + ano);
            };
          })(this)
        });
        this.cargarVendedor();
        $('.cantidad').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        $('.precio-unidad').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        $('#CotFlete').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        $('#CotDescuento').keydown(function(event) {
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
        $('#buscarCliente').tooltip({
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
        Singleton.get().hideLoading();
        $('#validezCotizacion').datepicker({
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
                  var aux, fecha, fechadespacho, fechainvertida, fechasistema, horasistema;
                  aux = Singleton.get().invertirFecha(fechahora.slice(0, 10), 'I');
                  fechasistema = aux.slice(0, 4);
                  fechasistema += aux.slice(5, 7);
                  fechasistema += aux.slice(8, 10);
                  horasistema = fechahora.slice(11, 13);
                  fechainvertida = Singleton.get().invertirFecha($('#validezCotizacion').val(), 'I');
                  fechadespacho = fechainvertida.slice(0, 4);
                  fechadespacho += fechainvertida.slice(5, 7);
                  fechadespacho += fechainvertida.slice(8, 10);
                  if (parseInt(fechasistema) <= parseInt(fechadespacho)) {
                    fecha = Singleton.get().invertirFecha($('#validezCotizacion').val(), 'I');
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
                          return _this.repartidoresdia = repartidoresdia = 2;
                        }
                      }
                    });
                    _this.setiarhorasdespacho();
                  } else {
                    Singleton.get().showInformacion('La fecha ingresada no es valida');
                    $('#validezCotizacion').val("");
                    $('#horaentrega').html('<option value="">Seleccione</option>');
                  }
                  return false;
                }
              });
            };
          })(this)
        });
        $('#fechaCotizacion').datepicker({
          firstDay: 1,
          dateFormat: "dd/mm/yy",
          dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
          monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        });
        $(document).on("focusout", ".producto", function(e) {
          var i;
          i = 1;
          e.preventDefault();
          e.stopPropagation();
          if ($('#idProducto' + e.currentTarget.attributes['row'].value).val() === "" && $('#producto' + e.currentTarget.attributes['row'].value).val() !== "") {
            Singleton.get().showInformacion('El producto ingresado no es valido');
            $('#producto' + e.currentTarget.attributes['row'].value).val("");
            $('#precioUnidad' + e.currentTarget.attributes['row'].value).val("");
            Singleton.get().setiarPrecioTotal(e.currentTarget.attributes['row'].value);
          }
          while (i <= Singleton.get().contLin) {
            if (i !== parseInt(e.currentTarget.attributes['row'].value)) {
              if ($('#idProducto' + e.currentTarget.attributes['row'].value).val() === $('#idProducto' + i).val() && $('#idProducto' + e.currentTarget.attributes['row'].value).val() !== "") {
                Singleton.get().showInformacion('El producto ingresado ya existe en el pedido');
                $('#idProducto' + e.currentTarget.attributes['row'].value).val("");
                $('#producto' + e.currentTarget.attributes['row'].value).val("");
                $('#precioUnidad' + e.currentTarget.attributes['row'].value).val("");
                Singleton.get().setiarPrecioTotal(e.currentTarget.attributes['row'].value);
              }
            }
            i++;
          }
          return false;
        });
        $(document).on("keyup", ".producto", function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (event.keyCode !== 13) {
            $('#idProducto' + e.currentTarget.attributes['row'].value).val("");
          }
          return false;
        });
        $(document).on("click", ".clsEliminarFila", function(e) {
          var objFila;
          e.preventDefault();
          e.stopPropagation();
          objFila = $(this).parents().get(1);
          $(objFila).remove();
          return false;
        });
        $(document).on("click", ".updateTfoot", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            Singleton.get().setiarDescuento();
            return false;
          };
        })(this));
        $(document).on("change", '#horaentrega', (function(_this) {
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
                fechainvertida = Singleton.get().invertirFecha($('#validezCotizacion').val(), 'I');
                fechadespacho = fechainvertida.slice(0, 4);
                fechadespacho += fechainvertida.slice(5, 7);
                fechadespacho += fechainvertida.slice(8, 10);
                if (parseInt(fechasistema) === parseInt(fechadespacho)) {
                  if (parseInt(horasistema) > parseInt($('#horaentrega').val().substr(0, 2))) {
                    Singleton.get().showInformacion('Combinacion de Fecha y Hora no valida');
                    $('#horaentrega').val("");
                  } else {
                    if (parseInt(horasistema) === parseInt($('#horaentrega').val().substr(0, 2)) && parseInt(minutossistema) > 30) {
                      Singleton.get().showInformacion('Combinacion de Fecha y Hora no valida');
                      $('#horaentrega').val("");
                    }
                  }
                }
                return false;
              }
            });
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
            $('#modal').css('width', 490);
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
        $(document).on("focus", ".producto", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            Singleton.get().inFocusIdProducto = e.currentTarget.value;
            return false;
          };
        })(this));
        $(document).on("keyup", ".cantidad", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            Singleton.get().setiarPrecioTotal(e.currentTarget.attributes['row'].value);
            return false;
          };
        })(this));
        $(document).on("focusout", ".cantidad", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            Singleton.get().setiarPrecioTotal(e.currentTarget.attributes['row'].value);
            return false;
          };
        })(this));
        $(document).on("keyup", ".precio-unidad", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#precioUnidad' + e.currentTarget.attributes['row'].value).val(Singleton.get().formatMiles(e.currentTarget.value));
            Singleton.get().setiarPrecioTotal(e.currentTarget.attributes['row'].value);
            return false;
          };
        })(this));
        $(document).on("focusout", ".precio-unidad", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#precioUnidad' + e.currentTarget.attributes['row'].value).val(Singleton.get().formatMiles(e.currentTarget.value));
            Singleton.get().setiarPrecioTotal(e.currentTarget.attributes['row'].value);
            return false;
          };
        })(this));
        $(document).on("keyup", "#CotFlete", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#CotFlete').val(Singleton.get().formatMiles($('#CotFlete').val()));
            Singleton.get().setiarFlete();
            return false;
          };
        })(this));
        $(document).on("focusout", "#CotFlete", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($('#CotFlete').val() !== '') {
              if (!$.isNumeric(Singleton.get().cleanValor($('#CotFlete').val()))) {
                Singleton.get().showError('El Valor del Flete Ingresado es Incorrecto');
                $('#CotFlete').val('0');
              } else {
                $('#CotFlete').val(Singleton.get().formatMiles($('#CotFlete').val()));
                Singleton.get().setiarFlete();
              }
            }
            return false;
          };
        })(this));
        $(document).on("keyup", "#CotDescuento", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (Number(Singleton.get().cleanValor($('#CotDescuento').val())) > 100) {
              Singleton.get().showError('El Porcentaje Ingresado Es Incorrecto');
              $('#CotDescuento').val('0');
            } else {
              $('#CotDescuento').val(Singleton.get().formatMiles($('#CotDescuento').val()));
              Singleton.get().setiarDescuento();
            }
            return false;
          };
        })(this));
        $(document).on("focusout", "#CotDescuento", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($('#CotDescuento').val() !== '') {
              if (!$.isNumeric(Singleton.get().cleanValor($('#CotDescuento').val()))) {
                Singleton.get().showError('El % de Descuento Ingresado es Incorrecto');
                $('#CotDescuento').val('0');
              } else {
                if (Number(Singleton.get().cleanValor($('#CotDescuento').val())) > 100) {
                  Singleton.get().showError('El Porcentaje Ingresado Es Incorrecto');
                  $('#CotDescuento').val('0');
                } else {
                  $('#CotDescuento').val(Singleton.get().formatMiles($('#CotDescuento').val()));
                  Singleton.get().setiarDescuento();
                }
              }
            }
            return false;
          };
        })(this));
        $(document).on("focusout", "#autoc1", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($('#autoc1').val() === '') {
              $('#DV').val('');
              $('#TelefonoCliente').val('');
              $('#Destinatario').empty();
              $('#DireccionDestinatario').val('');
              $('#TelefonoDestinatario').val('');
              $('#CotFlete').val('0');
              $('#validezCotizacion').val("");
              $('#validezCotizacion').attr('disabled', 'disabled');
              $('#horaentrega').html('<option value="">Seleccione</option>');
              Singleton.get().setiarFlete();
            }
            return false;
          };
        })(this));
        $(document).on("keyup", "#autoc1", (function(_this) {
          return function(e) {
            if (event.keyCode !== 13) {
              e.preventDefault();
              e.stopPropagation();
              $('#DV').val('');
              $('#TelefonoCliente').val('');
              $('#Destinatario').empty();
              $('#DireccionDestinatario').val('');
              $('#TelefonoDestinatario').val('');
              $('#CotFlete').val('0');
              $('#validezCotizacion').val("");
              $('#validezCotizacion').attr('disabled', 'disabled');
              $('#horaentrega').html('<option value="">Seleccione</option>');
              Singleton.get().setiarFlete();
            }
            return false;
          };
        })(this));
        $('#bntAddRow').click((function(_this) {
          return function(e) {
            return _this.agregarFila(e);
          };
        })(this));
        $('#buscarCliente').click((function(_this) {
          return function(e) {
            return _this.showModalCliente(e);
          };
        })(this));
        $('#guardar').click((function(_this) {
          return function(e) {
            return _this.btnGuardar(e);
          };
        })(this));
        $('#Destinatario').change((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.datosdestinatario();
          };
        })(this));
        $('#btnAddCliente').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return Singleton.get().showModalAddCliente();
          };
        })(this));
        $('#btnAddDestinatario').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($('#DV').val() !== '') {
              return Singleton.get().showModalAddDestinatario();
            } else {
              return Singleton.get().showInformacion('Debe seleccionar un cliente');
            }
          };
        })(this));
        log = (function(_this) {
          return function(rut, nombre, telefono) {
            var option;
            $('#DV').val(Singleton.get().formatearRut(rut));
            $('#autoc1').val(nombre);
            $('#TelefonoCliente').val(telefono);
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
                  $('#Destinatario').html(option);
                  return _this.datosdestinatario();
                } else {
                  $('#Destinatario').html("");
                  $('#DireccionDestinatario').val("");
                  $('#TelefonoDestinatario').val("");
                  $('#idDestinatario').val("");
                  $('#CotFlete').val(0);
                  return Singleton.get().setiarFlete();
                }
              },
              error: function(data) {
                $('#Destinatario').html("");
                $('#DireccionDestinatario').val("");
                $('#TelefonoDestinatario').val("");
                $('#idDestinatario').val("");
                $('#CotFlete').val(0);
                return Singleton.get().setiarFlete();
              }
            });
          };
        })(this);
        $("#autoc1").autocomplete({
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
                $('#autoc1').removeClass("ui-autocomplete-loading");
                $('#autoc1').autocomplete("close");
                $('#DV').val('');
                $('#TelefonoCliente').val('');
                $('#Destinatario').html('');
                $('#DireccionDestinatario').val('');
                return $('#TelefonoDestinatario').val('');
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
            return $('#autoc1').removeClass("ui-autocomplete-loading");
          },
          close: function() {
            return $('#autoc1').removeClass("ui-autocomplete-loading");
          }
        }, false);
        return $("#producto1").autocomplete({
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
                $('#producto1').removeClass("ui-autocomplete-loading");
                return $('#producto1').autocomplete("close");
              }
            });
          },
          minLength: 1,
          select: function(event, ui) {
            $('#precioTotal1').val(0);
            if (ui.item) {
              $('#idProducto1').val(ui.item.id);
              $('#producto1').val(ui.item.value);
              $('#precioUnidad1').val(Singleton.get().formatMiles(ui.item.precio));
              return Singleton.get().setiarPrecioTotal(1);
            }
          },
          open: function() {
            return $('#producto1').removeClass("ui-autocomplete-loading");
          },
          close: function() {
            return $('#producto1').removeClass("ui-autocomplete-loading");
          }
        });
      };

      nuevaCotizacion.prototype.setiarhorasdespacho = function() {
        var d, existe, hora, htmlhoras, i, j, k, len, len1, ref, s, sectoresocupadoshora;
        htmlhoras = '<option value="">Seleccione</option>';
        hora = new Array(1);
        hora[0] = "<option>09:30</option>";
        hora[1] = "<option>10:00</option>";
        hora[2] = "<option>10:30</option>";
        hora[3] = "<option>11:00</option>";
        hora[4] = "<option>11:30</option>";
        hora[5] = "<option>12:00</option>";
        hora[6] = "<option>12:30</option>";
        hora[7] = "<option>13:00</option>";
        hora[8] = "<option>13:30</option>";
        hora[9] = "<option>14:00</option>";
        hora[10] = "<option>14:30</option>";
        hora[11] = "<option>15:00</option>";
        hora[12] = "<option>15:30</option>";
        hora[13] = "<option>16:00</option>";
        hora[14] = "<option>16:30</option>";
        hora[15] = "<option>17:00</option>";
        hora[16] = "<option>17:30</option>";
        hora[17] = "<option>18:00</option>";
        hora[18] = "<option>18:30</option>";
        hora[19] = "<option>19:00</option>";
        hora[20] = "<option>19:30</option>";
        if (this.disponibilidad === "") {
          i = 0;
          while (i < 21) {
            htmlhoras = htmlhoras + hora[i];
            i++;
          }
          $('#horaentrega').html(htmlhoras);
        } else {
          i = 0;
          while (i < 21) {
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
          $('#horaentrega').html(htmlhoras);
        }
        return false;
      };

      nuevaCotizacion.prototype.showModalCliente = function(e) {
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

      nuevaCotizacion.prototype.agregarFila = function(e) {
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
                  Singleton.get().showInformacion('Existe Un Precio de Unidad Sin Ingresar');
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
        if (Validator === true) {
          Singleton.get().contLin++;
          $('#tablaItem').find("tbody").append(_.template(TpladdRow)({
            contLin: Singleton.get().contLin,
            newItem: 'New'
          }));
          $('.precio-unidad').attr('disabled', 'disabled');
          $('.cantidad').keydown(function(event) {
            if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

            } else {
              if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                return event.preventDefault();
              }
            }
          });
          $('.precio-unidad').keydown(function(event) {
            if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

            } else {
              if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                return event.preventDefault();
              }
            }
          });
          idUsuario = Singleton.get().idUsuarioLogueado;
          $(".producto").autocomplete({
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
                  $('.producto').removeClass("ui-autocomplete-loading");
                  return $('.producto').autocomplete("close");
                }
              });
            },
            minLength: 1,
            select: function(event, ui) {
              var indice, indice2;
              indice2 = event.target.id.split("producto");
              $('#precioTotal' + indice2[1]).val(0);
              if (ui.item) {
                indice = event.target.id.split("producto");
                $('#idProducto' + indice[1]).val(ui.item.id);
                $('#producto' + indice[1]).val(ui.item.value);
                $('#precioUnidad' + indice[1]).val(Singleton.get().formatMiles(ui.item.precio));
                return Singleton.get().setiarPrecioTotal(indice[1]);
              }
            },
            open: function() {
              return $('.producto').removeClass("ui-autocomplete-loading");
            },
            close: function() {
              return $('.producto').removeClass("ui-autocomplete-loading");
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

      nuevaCotizacion.prototype.cargarVendedor = function() {
        var idSubgerencia, idSupervisor, idUsuario, perfil, usuariolog;
        idUsuario = Singleton.get().idUsuarioLogueado;
        perfil = Singleton.get().perfilUsuarioLogueado;
        usuariolog = Singleton.get().nombreUsuarioLogueado;
        idSupervisor = Singleton.get().idSupervisorUsuarioLogueado;
        idSubgerencia = Singleton.get().idSubgerenciaUsuarioLogueado;
        $('#cotVendedor').attr('disabled', 'disabled');
        $('#nomVendedor').val(usuariolog);
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
                $('#cotResponsable').val(usuario[0].Nombre);
                return $('#idResponsable').val(idSupervisor);
              } else {
                $('#cotResponsable').val(usuariolog);
                return $('#idResponsable').val(idUsuario);
              }
            };
          })(this),
          error: (function(_this) {
            return function(data) {
              $('#cotResponsable').val(usuariolog);
              return $('#idResponsable').val(idUsuario);
            };
          })(this)
        });
        return false;
      };

      nuevaCotizacion.prototype.datosdestinatario = function() {
        var id;
        id = $('#Destinatario').val();
        return $.ajax({
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
              $('#idDestinatario').val(id);
              $('#DireccionDestinatario').val(destino[0].Direccion);
              if (destino[0].Telefono !== '0') {
                $('#TelefonoDestinatario').val(destino[0].Telefono);
              } else {
                $('#TelefonoDestinatario').val("");
              }
              $('#CotFlete').val(destino[0].PrecioFlete);
              $('#validezCotizacion').val("");
              $('#horaentrega').html('<option value="">Seleccione</option>');
              $('#validezCotizacion').removeAttr('disabled');
              Singleton.get().idsector = destino[0].Id_Sector;
              return Singleton.get().setiarFlete();
            };
          })(this),
          error: (function(_this) {
            return function(data) {};
          })(this)
        });
      };

      false;

      nuevaCotizacion.prototype.modalBuscarCliente = function(e) {
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

      nuevaCotizacion.prototype.modalAceptarCliente = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $("#tablaModalMostrarClientes tbody tr").each(function(index) {
          var nombreCiente, option, rutCliente;
          if ($(this).children("td")[0].childNodes[0].checked === true) {
            rutCliente = $(this).children("td")[0].firstElementChild.value;
            nombreCiente = $(this).children("td")[1].textContent;
            $('#DV').val(Singleton.get().formatearRut(rutCliente));
            option = '';
            $.ajax({
              url: base_url + "/index.php/services/cotizacion/buscarRut/id/" + rutCliente,
              type: 'GET',
              async: false,
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: (function(_this) {
                return function(cliente) {
                  $('#autoc1').val(cliente[0].Nombre);
                  return $('#TelefonoCliente').val(cliente[0].Telefono);
                };
              })(this),
              error: (function(_this) {
                return function(data) {
                  $('#autoc1').val("");
                  return $('#TelefonoCliente').val("");
                };
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
                    $('#Destinatario').html(option);
                    id = $('#Destinatario').val();
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
                        $('#idDestinatario').val(id);
                        $('#DireccionDestinatario').val(destino[0].Direccion);
                        if (destino[0].Telefono !== '0') {
                          $('#TelefonoDestinatario').val(destino[0].Telefono);
                        } else {
                          $('#TelefonoDestinatario').val("");
                        }
                        $('#validezCotizacion').val("");
                        $('#horaentrega').html('<option value="">Seleccione</option>');
                        $('#validezCotizacion').removeAttr('disabled');
                        Singleton.get().idsector = destino[0].Id_Sector;
                        return $('#CotFlete').val(destino[0].PrecioFlete);
                      }
                    });
                  } else {
                    $('#Destinatario').html("");
                    $('#idDestinatario').val("");
                    $('#DireccionDestinatario').val("");
                    $('#TelefonoDestinatario').val("");
                    return $('#CotFlete').val("0");
                  }
                };
              })(this)
            });
          }
        });
        $('#modal').modal('hide');
        Singleton.get().setiarFlete();
        $('.put-tooltips').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        return false;
      };

      nuevaCotizacion.prototype.modalBuscarProducto = function(e) {
        var nombreProducto, radioOption;
        e.preventDefault();
        e.stopPropagation();
        nombreProducto = $('#inputModalBuscarCliente').val();
        radioOption = '';
        $.ajax({
          url: (base_url + "/index.php/services/restricciones/buscarProducto/nombre/") + nombreProducto,
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

      nuevaCotizacion.prototype.modalAceptarProducto = function(e) {
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
            $('#precioUnidad' + Singleton.get().rowBtnFiltroProducto).val(Singleton.get().formatMiles(precio));
            $('#idProducto' + Singleton.get().rowBtnFiltroProducto).val(idPro);
            Singleton.get().setiarPrecioTotal(Singleton.get().rowBtnFiltroProducto);
            while (i <= Singleton.get().contLin) {
              if (i !== parseInt(Singleton.get().rowBtnFiltroProducto)) {
                if ($('#idProducto' + Singleton.get().rowBtnFiltroProducto).val() === $('#idProducto' + i).val() && $('#idProducto' + Singleton.get().rowBtnFiltroProducto).val() !== "") {
                  $('#idProducto' + Singleton.get().rowBtnFiltroProducto).val("");
                  $('#producto' + Singleton.get().rowBtnFiltroProducto).val("");
                  $('#precioUnidad' + Singleton.get().rowBtnFiltroProducto).val("");
                  Singleton.get().setiarPrecioTotal(Singleton.get().rowBtnFiltroProducto);
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

      nuevaCotizacion.prototype.btnGuardar = function(e) {
        var Validator, restriccion;
        e.preventDefault();
        e.stopPropagation();
        Validator = true;
        restriccion = true;
        Singleton.get().CountItemsExito = 0;
        Singleton.get().CountItemsSave = 0;
        $('#btnFiltro').popover('hide');
        if ($('#horaentrega').find(':selected').val() === '') {
          Singleton.get().showInformacion('Debe Seleccionar una hora de Despacho');
          Validator = false;
        }
        if ($('#validezCotizacion').val() === '') {
          Singleton.get().showInformacion('Debe Seleccionar un Fecha de Despacho');
          Validator = false;
        }
        if ($('#Destinatario option').length === 0) {
          Singleton.get().showInformacion('No existen destinatarios asociados al Cliente');
          Validator = false;
        }
        if ($('#autoc1').val() === '') {
          Singleton.get().showInformacion('Debe Seleccionar un Cliente');
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
        if ($('#CotFlete').val() === '') {
          $('#CotFlete').val('0');
        }
        if ($('#CotDescuento').val() === '') {
          $('#CotDescuento').val('0');
        }
        if (Singleton.get().CountItemsSave === 0) {
          Singleton.get().showError('Debe existir un detalle de cotizacion');
          Validator = false;
        }
        if (Validator === true && restriccion === true) {
          Singleton.get().showLoading('Guardando Información ...');
          $.ajax({
            url: base_url + "/index.php/services/cotizacion/grabarCotizacion",
            type: 'POST',
            data: {
              Id_Clase: '1',
              Cliente: $('#autoc1').val(),
              Rut_Entidad: Singleton.get().cleanRut($('#DV').val()),
              Fecha_Ped: Singleton.get().invertirFecha($('#fechaCotizacion').val(), 'I'),
              Id_Destinatario: $('#idDestinatario').val(),
              FechaHoraDespacho: Singleton.get().invertirFecha($('#validezCotizacion').val(), 'I') + ' ' + $('#horaentrega').val(),
              Id_Vendedor: Singleton.get().idUsuarioLogueado,
              Responsable: $('#idResponsable').val(),
              Total_Flete: Singleton.get().cleanValor($('#CotFlete').val()),
              Valor_Neto: Singleton.get().cleanValor($('#CotNeto').val()),
              Descuento: $('#CotDescuento').val(),
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
              return function(id) {
                var cantidad, precio, producto, valorTotal;
                if ($.isNumeric(id)) {
                  cantidad = 0;
                  producto = '';
                  precio = 0;
                  valorTotal = 0;
                  return $("#tablaItem tbody tr").each(function(index) {
                    $(this).children("td").each(function(index2) {
                      switch (index2) {
                        case 0:
                          return cantidad = $(this)[0].firstElementChild.value;
                        case 1:
                          return producto = $(this)[0].childNodes[6].attributes[4].value;
                        case 2:
                          return precio = $(this)[0].firstElementChild.value;
                        case 3:
                          return valorTotal = $(this)[0].firstElementChild.value;
                      }
                    });
                    return $.ajax({
                      url: base_url + "/index.php/services/cotizacion/grabarItemTracking",
                      type: 'POST',
                      data: {
                        Id_Pedido: id,
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
                            Singleton.get().showInformacionmitir();
                            $('#btnAceptarAdvertencia').click(function(e) {
                              var clase, idCotizacion, idUsuario;
                              e.preventDefault();
                              e.stopPropagation();
                              idUsuario = Singleton.get().idUsuarioLogueado;
                              idCotizacion = id;
                              clase = '3';
                              return $.ajax({
                                url: base_url + "/index.php/services/listadoCotizacion/cambiarClase/idCotizacion/" + idCotizacion + "/clase/" + clase + "/idUsuario/" + idUsuario,
                                type: 'PUT',
                                statusCode: {
                                  302: function() {
                                    return Singleton.get().reload();
                                  }
                                },
                                success: function(result) {
                                  if (result === 'true') {
                                    Singleton.get().showExito();
                                    return $('#btnExito').click(function(e) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      $('#NuevaCotizacion').removeClass('active');
                                      $('#ListadoCotizacion').addClass('active');
                                      Singleton.get().cargarListadoCotizacion();
                                      Singleton.get().showLoading();
                                      return false;
                                    });
                                  } else {
                                    return Singleton.get().showError('Error en la conexión con la base de datos');
                                  }
                                },
                                error: function(data) {
                                  return Singleton.get().showError('Error en la conexión con la base de datos');
                                }
                              });
                            });
                            return $('#btnCancelarAdvertencia').click(function(e) {
                              e.preventDefault();
                              e.stopPropagation();
                              $('#NuevaCotizacion').removeClass('active');
                              $('#ListadoCotizacion').addClass('active');
                              return Singleton.get().cargarListadoCotizacion();
                            });
                          }
                        };
                      })(this),
                      error: (function(_this) {
                        return function(data) {
                          return Singleton.get().showError('Error en la conexión con la base de datos');
                        };
                      })(this)
                    });
                  });
                } else {
                  return Singleton.get().showError('Error en la conexión con la base de datos');
                }
              };
            })(this),
            error: (function(_this) {
              return function(data) {
                return Singleton.get().showError('Error en la conexión con la base de datos');
              };
            })(this)
          });
        }
        return false;
      };

      return nuevaCotizacion;

    })(Backbone.View);
  });

}).call(this);
