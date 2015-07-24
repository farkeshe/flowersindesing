(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/mantenedorEntidades/entidades.html', 'text!tpl/mantenedorEntidades/nueva.html', 'text!tpl/mantenedorEntidades/editar.html', 'text!tpl/mantenedorEntidades/resultadoEntidad.html', 'assets/js/view/paginador', 'assets/js/model/entidad'], function(Backbone, Tplentidades, Tplnueva, Tpleditar, Tplresultadosentidad, Paginador, EntidadesModel) {
    var entidades;
    return entidades = (function(superClass) {
      extend(entidades, superClass);

      function entidades() {
        this.volveriteminicial = bind(this.volveriteminicial, this);
        this.eliminar = bind(this.eliminar, this);
        this.cargareditar = bind(this.cargareditar, this);
        this.acciones = bind(this.acciones, this);
        this.clickTr = bind(this.clickTr, this);
        this.cargar = bind(this.cargar, this);
        this.filtrar = bind(this.filtrar, this);
        this.cancelar = bind(this.cancelar, this);
        this.nuevo = bind(this.nuevo, this);
        this.cargarClasificacionEnMemoria = bind(this.cargarClasificacionEnMemoria, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return entidades.__super__.constructor.apply(this, arguments);
      }

      entidades.prototype.el = 'body';

      entidades.prototype.initialize = function() {
        this.paginador = new Paginador();
        this.entidadModel = new EntidadesModel();
        this.entidadModel.buscarCategorias(this.cargarClasificacionEnMemoria);
        this.objData = {
          nombreentidad: "",
          rutentidad: "",
          tipoentidad: "vacio",
          clasificacionentidad: "vacio",
          start: this.paginador.start,
          end: '14'
        };
        return this.init();
      };

      entidades.prototype.init = function() {
        Singleton.get().showLoading();
        $('#appView').html(_.template(Tplentidades)({
          clasificacion: this.clasificacion
        }));
        this.filtrar();
        Singleton.get().hideLoading();
        $('.scroll').css('height', window.innerHeight - 75);
        $('#next').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('#previous').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('#nuevaentidad').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('#DV').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        $(document).on("focusout", "#DV", (function(_this) {
          return function(e) {
            var rut;
            e.preventDefault();
            e.stopPropagation();
            if ($('#DV').val() !== "") {
              if (!Singleton.get().ValidarRut($('#DV').val())) {
                Singleton.get().showError('El Valor Ingresado es Incorrecto');
                return $('#DV').val("");
              } else {
                rut = $('#DV').val();
                rut = Singleton.get().cleanRut(rut);
                rut = Singleton.get().formatearRut(rut);
                return $('#DV').val(rut);
              }
            }
          };
        })(this));
        $('#nuevaentidad').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.nuevo(e);
          };
        })(this));
        $("#autoc1").autocomplete({
          source: function(request, response) {
            return $.ajax({
              url: base_url + "/index.php/services/entidades/mientidad",
              type: 'POST',
              data: {
                palabra: request.term
              },
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: function(data) {
                console.log(data);
                return response($.map(data, function(item) {
                  return {
                    label: item.Nombre,
                    value: item.Nombre,
                    Rut: item.Rut_Entidad
                  };
                }));
              },
              error: function(data) {
                $('#autoc1').removeClass("ui-autocomplete-loading");
                return $('#autoc1').autocomplete("close");
              }
            });
          },
          minLength: 1,
          select: function(event, ui) {
            if (ui.item) {
              return $('#DV').val(Singleton.get().formatearRut(ui.item.Rut));
            }
          },
          open: function() {
            return $('#autoc1').removeClass("ui-autocomplete-loading");
          },
          close: function() {
            return $('#autoc1').removeClass("ui-autocomplete-loading");
          }
        });
        $('#filtrarEntidades').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.filtrar();
          };
        })(this));
        $('#next').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            Singleton.get().showLoading();
            return $.ajax({
              url: base_url + "/index.php/services/entidades/contarRegistros",
              type: 'POST',
              data: _this.objData,
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: function(result) {
                _this.paginador.setTotal(result[0].Cantidad_Total);
                _this.paginador.next();
                $('#labelPaginador').html(_this.paginador.label());
                $(_this)[0].objData.end = _this.paginador.end;
                $(_this)[0].objData.start = _this.paginador.start;
                _this.cargar();
                return Singleton.get().hideLoading();
              },
              error: function(data) {
                Singleton.get().hideLoading();
                return Singleton.get().showError('No hay datos filtrados');
              }
            });
          };
        })(this));
        return $('#previous').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            Singleton.get().showLoading();
            return $.ajax({
              url: base_url + "/index.php/services/entidades/contarRegistros",
              type: 'POST',
              data: _this.objData,
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: function(result) {
                _this.paginador.setTotal(result[0].Cantidad_Total);
                _this.paginador.previous();
                $('#labelPaginador').html(_this.paginador.label());
                $(_this)[0].objData.end = _this.paginador.end;
                $(_this)[0].objData.start = _this.paginador.start;
                _this.cargar();
                return Singleton.get().hideLoading();
              },
              error: function(data) {
                Singleton.get().hideLoading();
                return Singleton.get().showError('No hay datos filtrados');
              }
            });
          };
        })(this));
      };

      entidades.prototype.cargarClasificacionEnMemoria = function(clasificacion) {
        return this.clasificacion = clasificacion;
      };

      entidades.prototype.nuevo = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appView').css('display', 'none');
        $('#appViewNext').html(_.template(Tplnueva)({
          clasificacion: this.clasificacion
        }));
        $('#mensaje').css('display', 'none');
        Singleton.get().hideLoading();
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
        $('.newTitulo').click((function(_this) {
          return function(e) {
            return _this.volveriteminicial(e);
          };
        })(this));
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
        $('#cancelarentidad').click((function(_this) {
          return function(e) {
            return _this.cancelar(e);
          };
        })(this));
        return $('#guardarnuevaentidad').click((function(_this) {
          return function(e) {
            var Validator, datos;
            e.preventDefault();
            e.stopPropagation();
            Validator = true;
            if ($('#clasificacionaentidad').find(':selected').val() === '') {
              Singleton.get().showInformacion('Debe seleccionar una clasificación para la entidad');
              Validator = false;
            }
            if ($('#nombre').val() === '') {
              Singleton.get().showInformacion('Debe ingresar el nombre del cliente');
              Validator = false;
            }
            if ($('#rut').val() === '') {
              Singleton.get().showInformacion('Debe ingresar el rut del cliente');
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
              console.log("ACA");
              console.log(datos);
              return new EntidadesModel().guardarEntidad(datos, function(data) {
                if (_.isUndefined(data.error)) {
                  Singleton.get().showExito('La entidad ha sido guardada exitosamente.');
                  $('#appView').css('display', 'block');
                  $('#appViewNext').empty();
                  return _this.filtrar();
                } else {
                  return Singleton.get().showError('La entidad no ha podido ser guardada.');
                }
              });
            }
          };
        })(this));
      };

      entidades.prototype.cancelar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appViewNext').html("");
        $('#appView').css('display', 'inline');
        return Singleton.get().hideLoading();
      };

      entidades.prototype.filtrar = function() {
        Singleton.get().showLoading();
        this.objData = {
          nombreentidad: $('#autoc1').val(),
          rutentidad: Singleton.get().cleanRut($('#DV').val()),
          tipoentidad: $('#tipoentidad').val(),
          clasificacionentidad: $('#clasificacion').val(),
          start: this.paginador.start,
          end: '14'
        };
        return $.ajax({
          url: base_url + "/index.php/services/entidades/contarRegistros",
          type: 'POST',
          data: this.objData,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(result) {
              _this.paginador.init(0, 14, result[0].Cantidad_Total);
              $('#labelPaginador').html(_this.paginador.label());
              $(_this)[0].objData.end = _this.paginador.end;
              $(_this)[0].objData.start = _this.paginador.start;
              return _this.cargar();
            };
          })(this),
          error: (function(_this) {
            return function(result) {
              Singleton.get().showError('No existe el filtro');
              return Singleton.get().hideLoading();
            };
          })(this)
        });
      };

      entidades.prototype.cargar = function() {
        return $.ajax({
          url: base_url + "/index.php/services/entidades/filtrar",
          type: 'POST',
          data: this.objData,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(s) {
              $('#cargatabla').html(_.template(Tplresultadosentidad)({
                entidades: s
              }));
              Singleton.get().hideLoading();
              return $('#tablaBody tr').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                return _this.clickTr(e);
              });
            };
          })(this),
          error: (function(_this) {
            return function(s) {
              Singleton.get().showInformacion('No existe información para los filtros seleccionados');
              return $('#btnExito').click(function(e) {
                return _this.initialize();
              });
            };
          })(this)
        });
      };

      entidades.prototype.clickTr = function(e) {
        var html;
        e.preventDefault();
        e.stopPropagation();
        this.rutentidad = e.currentTarget.attributes[0].value;
        html = html + "<option value=\"accion\">Acciones</option>" + "<option value=\"editar\">Editar</option>" + "<option value=\"eliminar\">Eliminar</option>";
        $('#accionesentidades').html(html);
        $(e.currentTarget).addClass('active');
        $(e.currentTarget).siblings().removeClass('active');
        return $('#accionesentidades').change((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.acciones(e);
          };
        })(this));
      };

      entidades.prototype.acciones = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if ("editar" === $('#accionesentidades').find(':selected').val()) {
          Singleton.get().showLoading();
          $('#appView').css('display', 'none');
          $('#appViewNext').html(_.template(Tpleditar)({
            clasificacion: this.clasificacion
          }));
          Singleton.get().hideLoading();
          this.entidadModel.buscarEntidad(this.rutentidad, this.cargareditar);
          Singleton.get().hideLoading();
          $('#modal').remove();
          $('.newTitulo').click((function(_this) {
            return function(e) {
              return _this.volveriteminicial(e);
            };
          })(this));
          $('#telefono').keydown(function(event) {});
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {
            return;
          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              event.preventDefault();
            }
          }
          $('#cancelarentidad').click((function(_this) {
            return function(e) {
              return _this.cancelar(e);
            };
          })(this));
          $('#guardareditarentidad').click((function(_this) {
            return function(e) {
              var Validator, datosactualizar;
              e.preventDefault();
              e.stopPropagation();
              Validator = true;
              if ($('#clasificacionaentidad').find(':selected').val() === '') {
                Singleton.get().showInformacion('Debe seleccionar una clasificación para la entidad');
                Validator = false;
              }
              if ($('#nombre').val() === '') {
                Singleton.get().showInformacion('Debe ingresar el nombre del cliente');
                Validator = false;
              }
              if ($('#rut').val() === '') {
                Singleton.get().showInformacion('Debe ingresar el rut del cliente');
                Validator = false;
              }
              if (Validator === true) {
                datosactualizar = {
                  rut: _this.rutentidad,
                  nombre: $('#nombre').val(),
                  telefono: $('#telefono').val(),
                  email: $('#email').val(),
                  clasificacion: $('#clasificacionaentidad').val()
                };
                return new EntidadesModel().actualizarEntidad(datosactualizar, function(data) {
                  if (_.isUndefined(data.error)) {
                    Singleton.get().showExito('La entidad ha sido actualizado exitosamente.');
                    $('#appView').css('display', 'block');
                    $('#appViewNext').empty();
                    return _this.filtrar();
                  } else {
                    return Singleton.get().showError('la entidad no ha podido ser actualizada.');
                  }
                });
              }
            };
          })(this));
        }
        if ("eliminar" === $('#accionesentidades').find(':selected').val()) {
          return this.eliminar();
        }
      };

      entidades.prototype.cargareditar = function(data) {
        $('#rut').attr("value", Singleton.get().formatearRut(data[0].Rut_Entidad));
        $('#nombre').attr("value", data[0].Nombre);
        if (data[0].Telefono === '0') {
          $('#telefono').attr("value", "");
        } else {
          $('#telefono').attr("value", data[0].Telefono);
        }
        $('#email').attr("value", data[0].Email);
        return $('#clasificacionaentidad').attr("value", data[0].Id_ClasificacionEntidad);
      };

      entidades.prototype.eliminar = function() {
        Singleton.get().showAdvertencia();
        return $('#btnAceptarAdvertencia').click((function(_this) {
          return function(e) {
            return new EntidadesModel().eliminarEntidad(_this.rutentidad, function(data) {
              if (_.isUndefined(data.error)) {
                if (data === 'true') {
                  Singleton.get().showExito('El cliente ha sido eliminado exitosamente.');
                  $('#appView').css('display', 'block');
                  $('#appViewNext').empty();
                  return _this.filtrar();
                } else {
                  return Singleton.get().showInformacion('El cliente no puede ser eliminado, debido a que esta siendo utilizado en un pedido');
                }
              } else {
                return Singleton.get().showError('La entidad no ha podido ser eliminada.');
              }
            });
          };
        })(this));
      };

      entidades.prototype.volveriteminicial = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appView').css('display', 'block');
        $('#appViewNext').empty();
        Singleton.get().hideLoading();
        return false;
      };

      return entidades;

    })(Backbone.View);
  });

}).call(this);
