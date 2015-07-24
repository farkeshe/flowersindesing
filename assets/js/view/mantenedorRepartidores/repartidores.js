(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/mantenedorRepartidores/repartidores.html', 'assets/js/model/repartidores'], function(Backbone, Tplrepartidores, RepartidoresModel) {
    var Repartidores;
    return Repartidores = (function(superClass) {
      extend(Repartidores, superClass);

      function Repartidores() {
        this.cargarFechasEnAreglo = bind(this.cargarFechasEnAreglo, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return Repartidores.__super__.constructor.apply(this, arguments);
      }

      Repartidores.prototype.el = 'body';

      Repartidores.prototype.initialize = function() {
        this.repartidores = new RepartidoresModel();
        this.repartidores.buscarFechaRepartidores(this.cargarFechasEnAreglo);
        return this.init();
      };

      Repartidores.prototype.init = function() {
        var events, f, i, j, len, ref, seleccionados;
        $('#appView').html(_.template(Tplrepartidores)());
        $('.scroll').css('height', window.innerHeight - 75);
        $('#cantidadrepartidores').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        i = 0;
        events = new Array(1);
        seleccionados = new Array(1);
        ref = this.fechas;
        for (j = 0, len = ref.length; j < len; j++) {
          f = ref[j];
          if (f.cantidadrepartidores !== '1') {
            events[i] = f.fecha;
          }
          i++;
        }
        $('#divcalendario').datepicker({
          dateFormat: "dd/mm/yy",
          firstDay: 1,
          dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
          monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
          beforeShowDay: (function(_this) {
            return function(date) {
              var current, existe, k, len1, ref1, tooltip;
              current = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
              existe = false;
              ref1 = _this.fechas;
              for (k = 0, len1 = ref1.length; k < len1; k++) {
                f = ref1[k];
                if (f.fecha === current) {
                  tooltip = f.cantidadrepartidores;
                  existe = true;
                }
                i++;
              }
              if (existe === false) {
                tooltip = 1;
              }
              if (jQuery.inArray(current, seleccionados) === -1) {
                if (jQuery.inArray(current, events) === -1) {
                  return [true, ""];
                } else {
                  return [true, 'ui-state-highlight', tooltip + " repartidores"];
                }
              } else {
                return [true, 'ui-widget-header', tooltip + " repartidores"];
              }
            };
          })(this),
          onSelect: (function(_this) {
            return function(dateText, inst) {
              var bandera, existe, fechaclick, k, len1, ref1;
              fechaclick = inst.selectedDay + '-' + (inst.selectedMonth + 1) + '-' + inst.selectedYear;
              existe = false;
              i = 0;
              $('#cantidadrepartidores').val(1);
              ref1 = _this.fechas;
              for (k = 0, len1 = ref1.length; k < len1; k++) {
                f = ref1[k];
                if (fechaclick === f.fecha) {
                  $('#cantidadrepartidores').val(f.cantidadrepartidores);
                }
                i++;
              }
              i = 0;
              bandera = 0;
              while (i < seleccionados.length) {
                if (seleccionados[i] === fechaclick) {
                  bandera = i;
                  existe = true;
                }
                i++;
              }
              if (existe === false) {
                return seleccionados.push(fechaclick);
              } else {
                return seleccionados.splice(bandera, 1);
              }
            };
          })(this)
        });
        return $('#guardarrepartidor').click((function(_this) {
          return function() {
            var Validator, datosfechas;
            Validator = true;
            if ($('#cantidadrepartidores').val() === '') {
              Singleton.get().showInformacion('Debe ingresar cantidad de repartidores para los dias seleccionados');
              Validator = false;
            }
            if (seleccionados.length === 1) {
              Singleton.get().showInformacion('Debe seleccionar una fecha para modificar la cantidad de repartidores');
              Validator = false;
            }
            if (Validator === true) {
              datosfechas = {
                fechasselect: seleccionados
              };
              return new RepartidoresModel().obtenercantidadpedidos(datosfechas, function(data) {
                var antiguos, datos, existe, k, len1, nuevos, ref1;
                if (data === "") {
                  antiguos = new Array(1);
                  nuevos = new Array(1);
                  i = 0;
                  while (i < seleccionados.length) {
                    existe = false;
                    ref1 = _this.fechas;
                    for (k = 0, len1 = ref1.length; k < len1; k++) {
                      f = ref1[k];
                      if (seleccionados[i] === f.fecha) {
                        existe = true;
                      }
                    }
                    if (existe === true) {
                      antiguos.push(seleccionados[i]);
                    } else {
                      nuevos.push(seleccionados[i]);
                    }
                    i++;
                  }
                  datos = {
                    seleccionadosnuevos: nuevos,
                    seleccionadosantiguos: antiguos,
                    cantidadrepartidores: $('#cantidadrepartidores').val()
                  };
                  return new RepartidoresModel().guardarRepartidorFecha(datos, function(data) {
                    if (_.isUndefined(data.error)) {
                      Singleton.get().showExito('Los repartidores se han actualizado exitosamente');
                      return _this.initialize();
                    } else {
                      Singleton.get().showError('Los repartidores no han podido ser actualizados');
                      return _this.initialize();
                    }
                  });
                } else {
                  Singleton.get().showAdvertencia("Advertencia", "Existen pedidos ingresados en las fechas seleccionadas ¿Desea continuar con la modificación?");
                  return $('#btnAceptarAdvertencia').click(function(e) {
                    var l, len2, ref2;
                    e.preventDefault();
                    e.stopPropagation();
                    antiguos = new Array(1);
                    nuevos = new Array(1);
                    i = 0;
                    while (i < seleccionados.length) {
                      existe = false;
                      ref2 = _this.fechas;
                      for (l = 0, len2 = ref2.length; l < len2; l++) {
                        f = ref2[l];
                        if (seleccionados[i] === f.fecha) {
                          existe = true;
                        }
                      }
                      if (existe === true) {
                        antiguos.push(seleccionados[i]);
                      } else {
                        nuevos.push(seleccionados[i]);
                      }
                      i++;
                    }
                    datos = {
                      seleccionadosnuevos: nuevos,
                      seleccionadosantiguos: antiguos,
                      cantidadrepartidores: $('#cantidadrepartidores').val()
                    };
                    return new RepartidoresModel().guardarRepartidorFecha(datos, function(data) {
                      if (_.isUndefined(data.error)) {
                        Singleton.get().showExito('Los repartidores se han actualizado exitosamente');
                        return _this.initialize();
                      } else {
                        Singleton.get().showError('Los repartidores no han podido ser actualizados');
                        return _this.initialize();
                      }
                    });
                  });
                }
              });
            }
          };
        })(this));
      };

      Repartidores.prototype.cargarFechasEnAreglo = function(fechas) {
        return this.fechas = fechas;
      };

      return Repartidores;

    })(Backbone.View);
  });

}).call(this);
