(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/mantenedorContactos/contactos.html', 'text!tpl/mantenedorContactos/resultados.html', 'text!tpl/mantenedorContactos/nuevo.html', 'assets/js/view/paginador'], function(Backbone, Tplcontactos, Tplresultados, Tplnuevo, Paginador) {
    var verLista;
    return verLista = (function(superClass) {
      extend(verLista, superClass);

      function verLista() {
        this.nuevo = bind(this.nuevo, this);
        this.filtrar = bind(this.filtrar, this);
        this.cargar = bind(this.cargar, this);
        this.init = bind(this.init, this);
        this.acciones = bind(this.acciones, this);
        this.initialize = bind(this.initialize, this);
        return verLista.__super__.constructor.apply(this, arguments);
      }

      verLista.prototype.el = 'body';

      verLista.prototype.initialize = function() {
        this.paginador = new Paginador();
        this.objData = {
          subgerencia: "vacio",
          estado: "vacio",
          tipo: "vacio",
          fi: "vacio",
          ff: "vacio",
          start: '0',
          end: '14'
        };
        return this.init();
      };

      verLista.prototype.acciones = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if ("nueva" === $('#accionescontacto').find(':selected').val()) {
          this.nuevo();
        }
        if ("editar" === $('#accionescontacto').find(':selected').val()) {
          this.editar();
        }
        if ("eliminar" === $('#accionesLista').find(':selected').val()) {
          return this.eliminar();
        }
      };

      verLista.prototype.init = function() {
        var log;
        Singleton.get().showLoading();
        $('#appView').html(_.template(Tplcontactos));
        Singleton.get().hideLoading();
        $('#nuevocontacto').click((function(_this) {
          return function(e) {
            return _this.nuevo();
          };
        })(this));
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
        $('#nuevalista').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        if (window.innerWidth === 1280) {
          $('.scroll').css('width', window.innerWidth - 260);
          Singleton.get().hideLoading();
        } else {
          $('.scroll').css('width', window.innerWidth - 251);
        }
        $('.scroll').css('height', window.innerHeight - 75);
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
        $('#previous').click((function(_this) {
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
                return response($.map(data, function(item) {
                  return {
                    label: item.Nombre,
                    value: item.Nombre,
                    rut: item.Rut_Entidad
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
              return log(ui.item.rut);
            }
          },
          open: function() {
            return $('#autoc1').removeClass("ui-autocomplete-loading");
          },
          close: function() {
            return $('#autoc1').removeClass("ui-autocomplete-loading");
          }
        });
        log = function(rut) {
          return $('#rutcliente').val(Singleton.get().formatearRut(rut));
        };
        if (window.innerWidth === 1280) {
          $('.scroll').css('width', window.innerWidth - 260);
        } else {
          $('.scroll').css('width', window.innerWidth - 251);
        }
        $('.scroll').css('height', window.innerHeight - 75);
        return $('#filtrarUsuarios').click((function(_this) {
          return function(e) {
            return _this.filtrar();
          };
        })(this));
      };

      verLista.prototype.cargar = function() {
        return $.ajax({
          url: base_url + "/index.php/services/listaPrecios/",
          type: 'POST',
          data: this.objData,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(s) {
              $('#cargatabla').html(_.template(Tplresultados)({
                variable: s
              }));
              Singleton.get().hideLoading();
              $('#accionesLista').change(function(e) {
                return _this.precios(e);
              });
              $('#tablaBody tr').click(function(e) {
                return _this.clickTr(e);
              });
              return $('#nuevalista').click(function(e) {
                return _this.nueva(e);
              });
            };
          })(this),
          error: (function(_this) {
            return function(s) {
              Singleton.get().showError('No existe el filtro');
              return $('#btnError').click(function(e) {
                return _this.initialize();
              });
            };
          })(this)
        });
      };

      verLista.prototype.filtrar = function() {
        var fechaDesde, fechaHasta;
        fechaDesde = "vacio";
        fechaHasta = "vacio";
        if ($('#desde').val() !== '') {
          fechaDesde = $('#desde').val();
        }
        if ($('#hasta').val() !== '') {
          fechaHasta = $('#hasta').val();
        }
        this.objData = {
          subgerencia: $('#subgerencia').val(),
          estado: $('#estado').val(),
          tipo: $('#tipo').val(),
          fi: fechaDesde,
          ff: fechaHasta,
          start: this.paginador.start,
          end: '14'
        };
        return $.ajax({
          url: base_url + "/index.php/services/listaPrecios/contarRegistros",
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
              Singleton.get().hideLoading();
              Singleton.get().showError('No existe el filtro');
              return $('#btnError').click(function(e) {
                return _this.initialize();
              });
            };
          })(this)
        });
      };

      verLista.prototype.nuevo = function() {
        Singleton.get().showLoading();
        $.ajax({
          url: base_url + "/index.php/services/destino/regiones",
          type: 'GET',
          cache: true,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(s) {
              $('#appViewNext').html(_.template(Tplnuevo)({
                regiones: s
              }));
              $('.newTitulo').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                Singleton.get().showLoading();
                $('#appView').css('display', 'block');
                $('#appViewNext').empty();
                return Singleton.get().hideLoading();
              });
              return $('#appView').css('display', 'none');
            };
          })(this)
        });
        return Singleton.get().hideLoading();
      };

      return verLista;

    })(Backbone.View);
  });

}).call(this);
