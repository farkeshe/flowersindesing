(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/mantenedorEntidades/nueva.html', 'assets/js/model/entidad'], function(Backbone, TplViewAddCliente, EntidadesModel) {
    var agregarClienteEditar;
    return agregarClienteEditar = (function(superClass) {
      extend(agregarClienteEditar, superClass);

      function agregarClienteEditar() {
        this.verificarexistencia = bind(this.verificarexistencia, this);
        this.cargarClasificacionEnMemoria = bind(this.cargarClasificacionEnMemoria, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return agregarClienteEditar.__super__.constructor.apply(this, arguments);
      }

      agregarClienteEditar.prototype.initialize = function() {
        this.entidadModel = new EntidadesModel();
        this.entidadModel.buscarCategorias(this.cargarClasificacionEnMemoria);
        return this.init();
      };

      agregarClienteEditar.prototype.init = function() {
        Singleton.get().showLoading();
        $('#modal').css('width', 820);
        $('#modal').css('height', 268);
        $('#modal').css('left', '40.5%');
        $('#modal').css('top', '45%');
        $('#modal').css('background-color', '#f6f6f6');
        $('#modal').html(_.template(TplViewAddCliente)({
          clasificacion: this.clasificacion
        }));
        $('#mensaje').css('display', 'none');
        $('#telefono').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        $('#rut').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        $(document).on("focusout", "#rut", (function(_this) {
          return function(e) {
            var rut;
            e.preventDefault();
            e.stopPropagation();
            if ($('#rut').val() !== "") {
              if (!Singleton.get().ValidarRut($('#rut').val())) {
                $("#mensaje").html("&nbsp;&nbsp;El rut ingresado es incorrecto");
                $('#mensaje').css('display', 'inline');
                return $('#rut').val("");
              } else {
                rut = $('#rut').val();
                rut = Singleton.get().cleanRut(rut);
                rut = Singleton.get().formatearRut(rut);
                if (rut.substring(0, 1) === '0') {
                  $('#rut').val(rut.substring(1, rut.lenght));
                } else {
                  $('#rut').val(rut);
                }
                return _this.entidadModel.buscarEntidad(Singleton.get().cleanRut(rut), _this.verificarexistencia);
              }
            }
          };
        })(this));
        $(document).on("focus", "#rut", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#mensaje').css('display', 'none');
            $('#guardarnuevaentidad').css('display', 'inline');
            return false;
          };
        })(this));
        $('#guardarnuevaentidad').click((function(_this) {
          return function(e) {
            var Validator, datos;
            e.preventDefault();
            e.stopPropagation();
            Validator = true;
            if ($('#clasificacionaentidad').find(':selected').val() === '') {
              Validator = false;
            }
            if ($('#nombre').val() === '') {
              Validator = false;
            }
            if ($('#rut').val() === '') {
              Validator = false;
            }
            if (Validator === true) {
              datos = {
                Rut: Singleton.get().cleanRut($('#rut').val()),
                Nombre: $('#nombre').val(),
                Telefono: $('#telefono').val(),
                Email: $('#email').val(),
                Tipo: $('#tipoentidad').val(),
                Clasificacion: $('#clasificacionaentidad').val()
              };
              new EntidadesModel().guardarEntidad(datos, function(data) {
                if (_.isUndefined(data.error)) {
                  $('#autoc1Editar').val($('#nombre').val());
                  $('#DVEditar').val($('#rut').val());
                  $('#TelefonoClienteEditar').val($('#telefono').val());
                  $('#DestinatarioEditar').empty();
                  $('#DireccionDestinatarioEditar').val('');
                  $('#TelefonoDestinatarioEditar').val('');
                  $('#CotFleteEdicion').val('0');
                  $('#validezCotizacionEditar').val("");
                  $('#validezCotizacionEditar').attr('disabled', 'disabled');
                  $('#horaentregaEditar').html('<option value="">Seleccione</option>');
                  Singleton.get().setiarFleteEditar();
                  return Singleton.get().showExito('La entidad ha sido guardada exitosamente.');
                } else {
                  return Singleton.get().showError('La entidad no ha podido ser guardada.');
                }
              });
            }
            return false;
          };
        })(this));
        return $('#cancelarentidad').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return $('#modal').modal('hide');
          };
        })(this));
      };

      agregarClienteEditar.prototype.cargarClasificacionEnMemoria = function(clasificacion) {
        return this.clasificacion = clasificacion;
      };

      agregarClienteEditar.prototype.verificarexistencia = function(data) {
        if ($('#rut').attr("value", Singleton.get().formatearRut(data[0].Rut_Entidad)) !== '') {
          $("#mensaje").html("&nbsp;&nbsp;El Cliente ya existe en el sistema");
          $('#mensaje').css('display', 'inline');
          return $('#guardarnuevaentidad').css('display', 'none');
        }
      };

      return agregarClienteEditar;

    })(Backbone.View);
  });

}).call(this);
