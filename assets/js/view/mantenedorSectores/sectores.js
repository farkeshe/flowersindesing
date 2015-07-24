(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/mantenedorSectores/sectores.html', 'text!tpl/mantenedorSectores/resultados.html', 'text!tpl/mantenedorSectores/editar.html', 'text!tpl/mantenedorSectores/nuevo.html', 'assets/js/view/paginador', 'assets/js/model/sector'], function(Backbone, Tplsectores, Tplresultados, Tpleditar, Tplnuevo, Paginador, Sector) {
    var Sectores;
    return Sectores = (function(superClass) {
      extend(Sectores, superClass);

      function Sectores() {
        this.eliminar = bind(this.eliminar, this);
        this.cargareditarzona = bind(this.cargareditarzona, this);
        this.cargareditar = bind(this.cargareditar, this);
        this.acciones = bind(this.acciones, this);
        this.clickTr = bind(this.clickTr, this);
        this.cargar = bind(this.cargar, this);
        this.filtrar = bind(this.filtrar, this);
        this.cargaComuna = bind(this.cargaComuna, this);
        this.cargaProvincias = bind(this.cargaProvincias, this);
        this.cargarComunasEnMemoria = bind(this.cargarComunasEnMemoria, this);
        this.cargarProvinciasEnMemoria = bind(this.cargarProvinciasEnMemoria, this);
        this.cargarRegionesEnMemoria = bind(this.cargarRegionesEnMemoria, this);
        this.volveriteminicial = bind(this.volveriteminicial, this);
        this.cancelar = bind(this.cancelar, this);
        this.cargaComunaTalca = bind(this.cargaComunaTalca, this);
        this.cargaProvinciaTalca = bind(this.cargaProvinciaTalca, this);
        this.verificarsectores = bind(this.verificarsectores, this);
        this.nuevo = bind(this.nuevo, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return Sectores.__super__.constructor.apply(this, arguments);
      }

      Sectores.prototype.el = 'body';

      Sectores.prototype.initialize = function() {
        this.paginador = new Paginador();
        this.sector = new Sector();
        this.objData = {
          nombreproducto: "",
          Id_Categoria: "",
          start: this.paginador.start,
          end: '14'
        };
        return this.init();
      };

      Sectores.prototype.init = function() {
        Singleton.get().showLoading();
        $('#appView').html(_.template(Tplsectores)({}));
        $('.scroll').css('height', window.innerHeight - 75);
        this.filtrar();
        Singleton.get().hideLoading();
        $('#nuevosector').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
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
        $('#nuevosector').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.nuevo(e);
          };
        })(this));
        $('#filtrar').click((function(_this) {
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
              url: base_url + "/index.php/services/sectores/contarRegistros",
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
              url: base_url + "/index.php/services/sectores/contarRegistros",
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
        return $("#filtrocomuna").autocomplete({
          source: function(request, response) {
            return $.ajax({
              url: base_url + "/index.php/services/sectores/micomuna",
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
                    label: item.COMUNA_NOMBRE,
                    value: item.COMUNA_NOMBRE
                  };
                }));
              },
              error: function(data) {
                $('#filtrocomuna').removeClass("ui-autocomplete-loading");
                return $('#filtrocomuna').autocomplete("close");
              }
            });
          },
          minLength: 1,
          open: function() {
            return $('#filtrocomuna').removeClass("ui-autocomplete-loading");
          },
          close: function() {
            return $('#filtrocomuna').removeClass("ui-autocomplete-loading");
          }
        });
      };

      Sectores.prototype.nuevo = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appView').css('display', 'none');
        if (_.isEmpty(this.regiones)) {
          this.sector.buscarRegiones(this.cargarRegionesEnMemoria);
        }
        $('#appViewNext').html(_.template(Tplnuevo)({
          regiones: this.regiones
        }));
        $('#precioflete').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        $('.newTitulo').click((function(_this) {
          return function(e) {
            return _this.volveriteminicial(e);
          };
        })(this));
        $('#regionselect').attr("value", 7);
        this.sector.buscarProvincia(7, this.cargaProvinciaTalca);
        $('#provinciaselect').attr("value", 71);
        this.sector.buscarComuna(71, this.cargaComunaTalca);
        $('#comunaselect').attr("value", 7101);
        Singleton.get().hideLoading();
        $('#regionselect').change((function(_this) {
          return function(e) {
            var option, reg;
            e.preventDefault();
            e.stopPropagation();
            option = '<option value="0" selected="selected">Seleccione...</option>';
            $('#comunaselect').html(option);
            $('#comunaselect option[value=0]').attr('selected', true);
            reg = $('#regionselect').find(':selected').val();
            if (reg !== '0' && reg !== '') {
              return _this.sector.buscarProvincia(reg, _this.cargaProvincias);
            } else {
              $('#provinciaselect').html(option);
              return $('#comunaselect').html(option);
            }
          };
        })(this));
        $('#provinciaselect').change((function(_this) {
          return function(e) {
            var option, pro;
            e.preventDefault();
            e.stopPropagation();
            pro = $('#provinciaselect').find(':selected').val();
            if (pro !== '0' && pro !== '') {
              return _this.sector.buscarComuna(pro, _this.cargaComuna);
            } else {
              option = '<option value="0" selected="selected">Seleccione...</option>';
              return $('#comunaselect').html(option);
            }
          };
        })(this));
        $('#guardarsector').click((function(_this) {
          return function(e) {
            var Validator, datos;
            e.preventDefault();
            e.stopPropagation();
            Validator = true;
            if ($('#precioflete').val() === '') {
              Singleton.get().showInformacion('Debe ingresar un precio de flete para el sector');
              Validator = false;
            }
            if ($('#comunaselect').find(':selected').val() === '' || $('#comunaselect').find(':selected').val() === '0') {
              Singleton.get().showInformacion('Debe asignar una comuna al sector');
              Validator = false;
            }
            if ($('#provinciaselect').find(':selected').val() === '' || $('#provinciaselect').find(':selected').val() === '0') {
              Singleton.get().showInformacion('Debe asignar una provincia al sector');
              Validator = false;
            }
            if ($('#regionselect').find(':selected').val() === '' || $('#regionselect').find(':selected').val() === '0') {
              Singleton.get().showInformacion('Debe asignar una región al sector');
              Validator = false;
            }
            if ($('#nombresector').val() === '') {
              Singleton.get().showInformacion('Debe ingresar un nombre al sector');
              Validator = false;
            }
            if (Validator === true) {
              _this.sector.buscarSectorExistente($('#nombresector').val(), $('#comunaselect').val(), _this.verificarsectores);
              if (_this.cantidad !== 0) {
                Singleton.get().showInformacion('Ya existe un sector con ese nombre para la ciudad');
                return $('#nombresector').val("");
              } else {
                datos = {
                  Nombre: $('#nombresector').val(),
                  Id_Comuna: $('#comunaselect').val(),
                  PrecioFlete: $('#precioflete').val()
                };
                return new Sector().guardarSector(datos, function(data) {
                  if (_.isUndefined(data.error)) {
                    Singleton.get().showExito('El sector ha sido guardado exitosamente.');
                    $('#appView').css('display', 'block');
                    $('#appViewNext').empty();
                    return _this.filtrar();
                  } else {
                    return Singleton.get().showError('El sector no ha podido ser guardado.');
                  }
                });
              }
            }
          };
        })(this));
        return $('#cancelarsector').click((function(_this) {
          return function(e) {
            return _this.cancelar(e);
          };
        })(this));
      };

      Sectores.prototype.verificarsectores = function(cantidad) {
        return this.cantidad = parseInt(cantidad[0].c);
      };

      Sectores.prototype.cargaProvinciaTalca = function(p) {
        var i, iterator, len, option, results;
        option = '<option value="0" selected="selected">Seleccione...</option>';
        results = [];
        for (i = 0, len = p.length; i < len; i++) {
          iterator = p[i];
          option += '<option value="' + iterator.PROVINCIA_ID + '" selected="selected">' + iterator.PROVINCIA_NOMBRE + '</option>';
          $('#provinciaselect').html(option);
          results.push($('#provinciaselect option[value=0]').attr('selected', true));
        }
        return results;
      };

      Sectores.prototype.cargaComunaTalca = function(p) {
        var i, iterator, len, option, results;
        option = '<option value="0" selected="selected">Seleccione...</option>';
        results = [];
        for (i = 0, len = p.length; i < len; i++) {
          iterator = p[i];
          option += '<option value="' + iterator.COMUNA_ID + '" selected="selected">' + iterator.COMUNA_NOMBRE + '</option>';
          $('#comunaselect').html(option);
          results.push($('#comunaselect option[value=0]').attr('selected', true));
        }
        return results;
      };

      Sectores.prototype.cancelar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appViewNext').html("");
        $('#appView').css('display', 'inline');
        return Singleton.get().hideLoading();
      };

      Sectores.prototype.volveriteminicial = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appView').css('display', 'block');
        $('#appViewNext').empty();
        return Singleton.get().hideLoading();
      };

      Sectores.prototype.cargarRegionesEnMemoria = function(regiones) {
        return this.regiones = regiones;
      };

      Sectores.prototype.cargarProvinciasEnMemoria = function(regiones) {
        return this.provincias = regiones;
      };

      Sectores.prototype.cargarComunasEnMemoria = function(regiones) {
        return this.comunas = regiones;
      };

      Sectores.prototype.cargaProvincias = function(p) {
        var i, iterator, len, option;
        Singleton.get().showLoading();
        option = '<option value="0" selected="selected">Seleccione...</option>';
        for (i = 0, len = p.length; i < len; i++) {
          iterator = p[i];
          option += '<option value="' + iterator.PROVINCIA_ID + '" selected="selected">' + iterator.PROVINCIA_NOMBRE + '</option>';
          $('#provinciaselect').html(option);
        }
        $('#provinciaselect option[value=0]').attr('selected', true);
        $('#comunaselect option[value=0]').attr('selected', true);
        return Singleton.get().hideLoading();
      };

      Sectores.prototype.cargaComuna = function(p) {
        var i, iterator, len, option;
        Singleton.get().showLoading();
        option = '<option value="0" selected="selected">Seleccione...</option>';
        for (i = 0, len = p.length; i < len; i++) {
          iterator = p[i];
          option += '<option value="' + iterator.COMUNA_ID + '" selected="selected">' + iterator.COMUNA_NOMBRE + '</option>';
          $('#comunaselect').html(option);
        }
        $('#comunaselect option[value=0]').attr('selected', true);
        return Singleton.get().hideLoading();
      };

      Sectores.prototype.filtrar = function() {
        Singleton.get().showLoading();
        this.objData = {
          comuna: $('#filtrocomuna').val(),
          start: this.paginador.start,
          end: '14'
        };
        return $.ajax({
          url: base_url + "/index.php/services/sectores/contarRegistros",
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
              return Singleton.get().showError('No existe el filtro');
            };
          })(this)
        });
      };

      Sectores.prototype.cargar = function() {
        return $.ajax({
          url: base_url + "/index.php/services/sectores/filtrar",
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
                sectores: s
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

      Sectores.prototype.clickTr = function(e) {
        var html;
        e.preventDefault();
        e.stopPropagation();
        console.log(e);
        this.idsector = e.currentTarget.attributes[0].value;
        console.log(e.currentTarget.attributes[0].value);
        html = html + "<option value=\"accion\">Acciones</option>" + "<option value=\"editar\">Editar</option>" + "<option value=\"eliminar\">Eliminar</option>";
        $('#accionesSectores').html(html);
        $(e.currentTarget).addClass('active');
        $(e.currentTarget).siblings().removeClass('active');
        $('#accionesSectores').unbind("change");
        return $('#accionesSectores').change((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.acciones(e);
          };
        })(this));
      };

      Sectores.prototype.acciones = function(e) {
        var Validator;
        Validator = true;
        e.preventDefault();
        e.stopPropagation();
        if ("editar" === $('#accionesSectores').find(':selected').val()) {
          Singleton.get().showLoading();
          if (_.isEmpty(this.regiones)) {
            this.sector.buscarRegiones(this.cargarRegionesEnMemoria);
            console.log(this.sector.buscarRegiones(this.cargarRegionesEnMemoria));
          }
          $('#appView').css('display', 'none');
          $('#appViewNext').html(_.template(Tpleditar)({
            regiones: this.regiones
          }));
          this.sector.buscarSector(this.idsector, this.cargareditar);
          $('#preciofleteEditar').keydown(function(event) {
            if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

            } else {
              if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                return event.preventDefault();
              }
            }
          });
          $('.newTitulo').click((function(_this) {
            return function(e) {
              return _this.volveriteminicial(e);
            };
          })(this));
          $('#regionselect').change((function(_this) {
            return function(e) {
              var option, reg;
              e.preventDefault();
              e.stopPropagation();
              option = '<option value="0" selected="selected">Seleccione...</option>';
              $('#comunaselect').html(option);
              $('#comunaselect option[value=0]').attr('selected', true);
              reg = $('#regionselect').find(':selected').val();
              if (reg !== '0' && reg !== '') {
                return _this.sector.buscarProvincia(reg, _this.cargaProvincias);
              } else {
                $('#provinciaselect').html(option);
                return $('#comunaselect').html(option);
              }
            };
          })(this));
          $('#provinciaselect').change((function(_this) {
            return function(e) {
              var option, pro;
              e.preventDefault();
              e.stopPropagation();
              pro = $('#provinciaselect').find(':selected').val();
              if (pro !== '0' && pro !== '') {
                return _this.sector.buscarComuna(pro, _this.cargaComuna);
              } else {
                option = '<option value="0" selected="selected">Seleccione...</option>';
                return $('#comunaselect').html(option);
              }
            };
          })(this));
          $('#guardarsectorEditar').click((function(_this) {
            return function(e) {
              var datos;
              e.preventDefault();
              e.stopPropagation();
              Validator = true;
              if ($('#preciofleteEditar').val() === '') {
                Singleton.get().showInformacion('Debe ingresar un precio de flete para el sector');
                Validator = false;
              }
              if ($('#comunaselect').find(':selected').val() === '' || $('#comunaselect').find(':selected').val() === '0') {
                Singleton.get().showInformacion('Debe asignar una comuna al sector');
                Validator = false;
              }
              if ($('#provinciaselect').find(':selected').val() === '' || $('#provinciaselect').find(':selected').val() === '0') {
                Singleton.get().showInformacion('Debe asignar una provincia al sector');
                Validator = false;
              }
              if ($('#regionselect').find(':selected').val() === '' || $('#regionselect').find(':selected').val() === '0') {
                Singleton.get().showInformacion('Debe asignar una región al sector');
                Validator = false;
              }
              if ($('#nombresectorEditar').val() === '') {
                Singleton.get().showInformacion('Debe ingresar un nombre al sector');
                Validator = false;
              }
              if (Validator === true) {
                _this.sector.buscarSectorExistente($('#nombresectorEditar').val(), $('#comunaselect').val(), _this.verificarsectores);
                if (_this.cantidad !== 0 && _this.nombreoriginal !== $('#nombresectorEditar').val()) {
                  Singleton.get().showInformacion('Ya existe un sector con ese nombre para la ciudad');
                  return $('#nombresectorEditar').val("");
                } else {
                  datos = {
                    idsector: _this.idsector,
                    Nombre: $('#nombresectorEditar').val(),
                    Id_Comuna: $('#comunaselect').val(),
                    PrecioFlete: $('#preciofleteEditar').val()
                  };
                  return new Sector().actualizarSector(datos, function(data) {
                    if (_.isUndefined(data.error)) {
                      Singleton.get().showExito('El sector ha sido actualizado exitosamente.');
                      $('#appView').css('display', 'block');
                      $('#appViewNext').empty();
                      return _this.filtrar();
                    } else {
                      return Singleton.get().showError('El sector no ha podido ser actualizado.');
                    }
                  });
                }
              }
            };
          })(this));
          $('#cancelarsectorEditar').click((function(_this) {
            return function(e) {
              return _this.cancelar(e);
            };
          })(this));
        }
        if ("eliminar" === $('#accionesSectores').find(':selected').val()) {
          return this.eliminar();
        }
      };

      Sectores.prototype.cargareditar = function(data) {
        this.comunaId = data[0].COMUNA_ID;
        $('#nombresectorEditar').attr("value", data[0].Nombre);
        this.nombreoriginal = $('#nombresectorEditar').val();
        $('#preciofleteEditar').attr("value", data[0].PrecioFlete);
        return this.sector.buscarzona(data[0].COMUNA_ID, this.cargareditarzona);
      };

      Sectores.prototype.cargareditarzona = function(data) {
        $('#regionselect').attr("value", data[0].IdRegion);
        this.sector.buscarProvincia(data[0].IdRegion, this.cargaProvinciaTalca);
        $('#provinciaselect').attr("value", data[0].IdProvincia);
        this.sector.buscarComuna(data[0].IdProvincia, this.cargaComunaTalca);
        $('#comunaselect').attr("value", this.comunaId);
        return Singleton.get().hideLoading();
      };

      Sectores.prototype.eliminar = function() {
        Singleton.get().showAdvertencia();
        return $('#btnAceptarAdvertencia').click((function(_this) {
          return function(e) {
            return new Sector().eliminarSector(_this.idsector, function(data) {
              if (_.isUndefined(data.error)) {
                if (data === 'true') {
                  Singleton.get().showExito('El sector ha sido eliminado exitosamente.');
                  $('#appView').css('display', 'block');
                  $('#appViewNext').empty();
                  return _this.filtrar();
                } else {
                  return Singleton.get().showInformacion('El sector no puede ser eliminado, debido a que esta siendo utilizado actualmente');
                }
              } else {
                return Singleton.get().showError('El sector no ha podido ser eliminado.');
              }
            });
          };
        })(this));
      };

      return Sectores;

    })(Backbone.View);
  });

}).call(this);
