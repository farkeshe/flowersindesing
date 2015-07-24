(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/historialCotizaciones/trackingList.html', 'text!tpl/historialCotizaciones/trackingFiltro.html'], function(Backbone, TplviewtrackingList, TplviewtrackingFiltro) {
    var tracking;
    return tracking = (function(superClass) {
      extend(tracking, superClass);

      function tracking() {
        this.cargarUsuarios = bind(this.cargarUsuarios, this);
        this.cargarClases = bind(this.cargarClases, this);
        this.cargarPedidos = bind(this.cargarPedidos, this);
        this.filtrar = bind(this.filtrar, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return tracking.__super__.constructor.apply(this, arguments);
      }

      tracking.prototype.initialize = function() {
        return this.init();
      };

      tracking.prototype.init = function() {
        Singleton.get().showLoading();
        $('#appView').html(_.template(TplviewtrackingFiltro)({}));
        $('.scroll').css('height', window.innerHeight - 75);
        if (Singleton.get().idPerfilUsuarioLogueado !== '2' && Singleton.get().idPerfilUsuarioLogueado !== '1') {
          $('#trackingUsuario').attr('disabled', 'disabled');
        }
        $('#fechaDesde').datepicker({
          dateFormat: "dd/mm/yy",
          dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
          monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        });
        $('#fechaHasta').datepicker({
          dateFormat: "dd/mm/yy",
          dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
          monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        });
        $('#trackingFiltrar').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            _this.filtrar();
            return false;
          };
        })(this));
        this.cargarPedidos();
        this.cargarClases();
        this.cargarUsuarios();
        if (Singleton.get().idPedidoTracking !== 0) {
          return this.filtrar();
        } else {
          return Singleton.get().hideLoading();
        }
      };

      tracking.prototype.filtrar = function() {
        var aux, fechaDesde, fechaHasta, idClase, idPedido, idUsuario, row;
        fechaDesde = '';
        fechaHasta = '';
        row = '';
        if (Singleton.get().idPedidoTracking === 0) {
          Singleton.get().showLoading();
          Singleton.get().idPedidoTracking = $('#trackingPedido').val();
        }
        idClase = $('#trackingClase').find(':selected').val();
        idUsuario = $('#trackingUsuario').find(':selected').val();
        if ($('#fechaDesde').val() !== '') {
          fechaDesde = Singleton.get().invertirFecha($('#fechaDesde').val(), 'I');
        }
        if ($('#fechaHasta').val() !== '') {
          fechaHasta = Singleton.get().invertirFecha($('#fechaHasta').val(), 'I');
        }
        if (fechaHasta < fechaDesde) {
          aux = fechaDesde;
          fechaDesde = fechaHasta;
          fechaHasta = aux;
        }
        idPedido = Singleton.get().idPedidoTracking;
        $.ajax({
          url: base_url + "/index.php/services/trackingPedido/filtrarTracking",
          data: {
            idPedido: idPedido,
            idClase: idClase,
            idUsuarioFiltro: idUsuario,
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta,
            idUsuario: Singleton.get().idUsuarioLogueado,
            idPerfil: Singleton.get().idPerfilUsuarioLogueado
          },
          type: 'POST',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(result) {
              var i, len, r;
              $('#trackingPedido option[value=' + idPedido + ']').attr('selected', true);
              $('#filtroResultados').html(_.template(TplviewtrackingList)({}));
              for (i = 0, len = result.length; i < len; i++) {
                r = result[i];
                row += '<tr>';
                row += '<td style="width: 12.5%;">' + r.Id_Pedido + '</td>';
                row += '<td style="width: 12.5%;">' + Singleton.get().invertirFecha(r.Fecha) + '</td>';
                row += '<td style="width: 12.5%;">' + r.Clase + '</td>';
                row += '<td style="width: 12.5%;">' + r.User + '</td>';
                row += '<td style="width: 12.5%;">' + r.Tipo_Accion + '</td>';
                row += '</tr>';
              }
              $('#tablaBodyListadoTracking').html(row);
              return Singleton.get().hideLoading();
            };
          })(this),
          error: (function(_this) {
            return function(data) {
              $('#filtroResultados').empty();
              return Singleton.get().showInformacion('No existe información para los filtros seleccionados');
            };
          })(this)
        });
        Singleton.get().idPedidoTracking = 0;
        return false;
      };

      tracking.prototype.cargarPedidos = function() {
        var option;
        option = '<option value="0" selected="selected">Seleccione</option>';
        $.ajax({
          url: base_url + "/index.php/services/trackingPedido/cargarPedidos/idPerfil/" + (Singleton.get().idPerfilUsuarioLogueado) + "/idUsuario/" + (Singleton.get().idUsuarioLogueado),
          type: 'GET',
          async: false,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(pedidos) {
              var P, i, len;
              for (i = 0, len = pedidos.length; i < len; i++) {
                P = pedidos[i];
                option += '<option value="' + P.Id_Pedidos + '" selected="selected">' + P.Id_Pedidos + '</option>';
              }
              $('#trackingPedido').html(option);
              return $('#trackingPedido option[value=0]').attr('selected', true);
            };
          })(this),
          error: (function(_this) {
            return function(data) {
              $('#trackingPedido').html('<option value="0" selected="selected">Seleccione</option>');
              return $('#trackingPedido option[value=0]').attr('selected', true);
            };
          })(this)
        });
        return false;
      };

      tracking.prototype.cargarClases = function() {
        var option;
        option = '<option value="0" selected="selected">Seleccione</option>';
        $.ajax({
          url: base_url + "/index.php/services/listadoCotizacion/cargarFiltroClase",
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(clases) {
              var c, i, len;
              for (i = 0, len = clases.length; i < len; i++) {
                c = clases[i];
                option += '<option value="' + c.Id_Clase + '" selected="selected">' + c.Nombre + '</option>';
              }
              $('#trackingClase').html(option);
              return $('#trackingClase option[value=0]').attr('selected', true);
            };
          })(this),
          error: (function(_this) {
            return function(data) {
              $('#trackingClase').html('<option value="0" selected="selected">Seleccione</option>');
              return $('#trackingClase option[value=0]').attr('selected', true);
            };
          })(this)
        });
        return false;
      };

      tracking.prototype.cargarUsuarios = function() {
        var option;
        option = '<option value="0" selected="selected">Seleccione</option>';
        $.ajax({
          url: base_url + "/index.php/services/trackingPedido/cargarUsuarios",
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(usuarios) {
              var i, len, u;
              for (i = 0, len = usuarios.length; i < len; i++) {
                u = usuarios[i];
                option += '<option value="' + u.Id_Usuario + '" selected="selected">' + u.User + '</option>';
              }
              $('#trackingUsuario').html(option);
              return $('#trackingUsuario option[value=0]').attr('selected', true);
            };
          })(this),
          error: (function(_this) {
            return function(data) {
              $('#trackingUsuario').html('<option value="0" selected="selected">Seleccione</option>');
              return $('#trackingUsuario option[value=0]').attr('selected', true);
            };
          })(this)
        });
        return false;
      };

      return tracking;

    })(Backbone.View);
  });

}).call(this);
