(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/gestorCotizaciones/mostrarCotizacion.html', 'assets/js/view/gestorCotizaciones/editarCotizacion'], function(Backbone, TplmostrarCotizacion, viewEditarCotizacion) {
    var mostrarCotizacion;
    return mostrarCotizacion = (function(superClass) {
      extend(mostrarCotizacion, superClass);

      function mostrarCotizacion() {
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return mostrarCotizacion.__super__.constructor.apply(this, arguments);
      }

      mostrarCotizacion.prototype.initialize = function(idCotizacion) {
        return this.init(idCotizacion);
      };

      mostrarCotizacion.prototype.init = function(idCotizacion) {
        var Contactos, item, option;
        Singleton.get().showLoading();
        Contactos = '';
        item = '';
        option = '<option value="0" selected="selected">Acciones</option>';
        return $.ajax({
          url: base_url + "/index.php/services/cotizacion/buscarCotizacion/idCotizacion/" + idCotizacion,
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(cotizacion) {
              return $.ajax({
                url: base_url + "/index.php/services/cotizacion/buscarItems/idCotizacion/" + idCotizacion,
                type: 'GET',
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(items) {
                  var i, j, len;
                  $('#modal').css('width', 1100);
                  $('#modal').css('height', 625);
                  $('#modal').css('left', '30%');
                  $('#modal').css('top', '40.5%');
                  $('#modal').html(_.template(TplmostrarCotizacion));
                  $('#histMailView').tooltip({
                    'trigger': 'hover',
                    'delay': {
                      'show': 100,
                      'hide': 100
                    }
                  });
                  option += '<option value="2" >Exportar a PDF</option>';
                  $('#CotAccionesView').html(option);
                  $('#CotAccionesView').change(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if ($('#CotAccionesView').find(':selected').val() === '2') {
                      $('#ExportarPDF').attr('action', 'index.php/services/exportar/exportarcotPDF');
                      $("#ExportarPDF").submit();
                    }
                    if ($('#CotAccionesView').find(':selected').val() === '1') {
                      Singleton.get().showAdvertencia();
                      $('#btnAceptarAdvertencia').click(function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        return $.ajax({
                          url: base_url + "/index.php/services/listadoCotizacion/recotizarCotizacion/idCotizacion/" + idCotizacion + "/idUsuario/" + (Singleton.get().idUsuarioLogueado),
                          type: 'POST',
                          statusCode: {
                            302: function() {
                              return Singleton.get().reload();
                            }
                          },
                          success: function(result) {
                            if (result[0] === 'true') {
                              Singleton.get().showExito();
                              return $('#btnExito').click(function(e) {
                                var editarCotizacion;
                                e.preventDefault();
                                e.stopPropagation();
                                $(document).unbind('click');
                                $(document).unbind('change');
                                $(document).unbind('focus');
                                $(document).unbind('focusout');
                                $(document).unbind('keyup');
                                editarCotizacion = new viewEditarCotizacion(result[1]);
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
                      $('#btnCancelarAdvertencia').click(function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        Singleton.get().showModalCotizacion(idCotizacion);
                        return false;
                      });
                    }
                    return $('#CotAccionesView option[value=0]').attr('selected', true);
                  });
                  for (j = 0, len = items.length; j < len; j++) {
                    i = items[j];
                    item += '<tr>';
                    item += '<td class="td-cantidad">';
                    item += '<input type="text" id="cantidad1View" class="cantidad" row="1" style="background-color: #ffffff;" disabled value="' + i.Cantidad + '">';
                    item += '</td>';
                    item += '<td class="td-producto">';
                    item += '<input type="text" id="producto1View" class="producto" row="1" style="width:95% !important; background-color: #ffffff;margin-left:10px;" disabled value="' + i.nombreproducto + '">';
                    item += '</td>';
                    item += '<td class="td-precioUnidad">';
                    item += '<input type="text" id="precioUnidad1View" class="precio-unidad" row="1" style="width:90% !important; background-color: #ffffff;" disabled value="' + Singleton.get().miles(i.Precio_Unitario) + '">';
                    item += '</td>';
                    item += '<td class="td-precioTotal">';
                    item += '<input type="text" id="precioTotal1View" class="precio-total" row="1" style="width:88% !important; background-color: #ffffff; margin-left:7px;" disabled value="' + Singleton.get().miles(i.Precio_Total) + '">';
                    item += '</td>';
                    item += '</tr>';
                  }
                  $('.tablaItemView tbody').html(item);
                  $('.titulocot').html('Pedido Nº ' + cotizacion[0].Id_Pedidos);
                  if (cotizacion[0].nombreCliente !== null) {
                    $('#clienteView').val(cotizacion[0].nombreCliente);
                  }
                  if (cotizacion[0].rutCliente !== null) {
                    $('#rutClienteView').val(Singleton.get().formatearRut(cotizacion[0].rutCliente));
                  }
                  if (cotizacion[0].telefonoCliente !== null) {
                    $('#telefonoClienteView').val(cotizacion[0].telefonoCliente);
                  }
                  $('#destinatarioView').val(cotizacion[0].nombredestino);
                  $('#direcciondestinatarioView').val(cotizacion[0].direcciondestino);
                  $('#telefonodestinatarioView').val(cotizacion[0].telefonodestino);
                  $('#fechapedidoView').val(cotizacion[0].Fecha_pedido);
                  $('#vendedorView').val(cotizacion[0].nombreVendedor);
                  $('#responsableView').val(cotizacion[0].Responsable);
                  $('#fechadespachoView').val(cotizacion[0].FechaHoraDespacho.substring(0, 10));
                  $('#horadespachoView').val(cotizacion[0].FechaHoraDespacho.substring(11, 16));
                  if (cotizacion[0].Observaciones_Fabricacion !== null) {
                    $('#obsfView').val(cotizacion[0].Observaciones_Fabricacion);
                  }
                  if (cotizacion[0].Observaciones_Despacho !== null) {
                    $('#obsdView').val(cotizacion[0].Observaciones_Despacho);
                  }
                  if (cotizacion[0].Observaciones !== null) {
                    $('#obsgView').val(cotizacion[0].Observaciones);
                  }
                  $('#CotFleteView').val(cotizacion[0].Total_Flete);
                  $('#CotNetoView').val(cotizacion[0].Valor_Neto);
                  $('#CotDescuentoView').val(cotizacion[0].Descuento);
                  $('#CotIvaView').val(cotizacion[0].Iva);
                  return $('#CotTotalView').val(cotizacion[0].Total);
                },
                error: function(data) {}
              });
            };
          })(this)
        });
      };

      return mostrarCotizacion;

    })(Backbone.View);
  });

}).call(this);
