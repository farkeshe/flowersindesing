(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/mantenedorLugares/lugares.html', 'text!tpl/mantenedorLugares/resultados.html', 'text!tpl/mantenedorLugares/editar.html', 'text!tpl/mantenedorLugares/nuevo.html', 'assets/js/view/paginador', 'assets/js/model/sector', 'assets/js/model/lugar'], function(Backbone, Tpllugares, Tplresultados, Tpleditar, Tplnuevo, Paginador, Sector, Lugar) {
    var Lugares;
    return Lugares = (function(superClass) {
      extend(Lugares, superClass);

      function Lugares() {
        this.cancelar = bind(this.cancelar, this);
        this.cargaSector = bind(this.cargaSector, this);
        this.cargaComuna = bind(this.cargaComuna, this);
        this.cargaProvincias = bind(this.cargaProvincias, this);
        this.cargaSectorTalca = bind(this.cargaSectorTalca, this);
        this.cargaSectorTalcafiltro = bind(this.cargaSectorTalcafiltro, this);
        this.cargaComunaTalca = bind(this.cargaComunaTalca, this);
        this.cargaProvinciaTalca = bind(this.cargaProvinciaTalca, this);
        this.volveriteminicial = bind(this.volveriteminicial, this);
        this.cargarTiposEnMemoria = bind(this.cargarTiposEnMemoria, this);
        this.cargarComunasEnMemoria = bind(this.cargarComunasEnMemoria, this);
        this.cargarProvinciasEnMemoria = bind(this.cargarProvinciasEnMemoria, this);
        this.cargarRegionesEnMemoria = bind(this.cargarRegionesEnMemoria, this);
        this.verificarlugares = bind(this.verificarlugares, this);
        this.eliminar = bind(this.eliminar, this);
        this.cargareditarzona = bind(this.cargareditarzona, this);
        this.cargareditar = bind(this.cargareditar, this);
        this.acciones = bind(this.acciones, this);
        this.clickTr = bind(this.clickTr, this);
        this.nuevo = bind(this.nuevo, this);
        this.cargar = bind(this.cargar, this);
        this.filtrar = bind(this.filtrar, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return Lugares.__super__.constructor.apply(this, arguments);
      }

      Lugares.prototype.el = 'body';

      Lugares.prototype.initialize = function() {
        this.paginador = new Paginador();
        this.sector = new Sector();
        this.lugar = new Lugar();
        return this.init();
      };

      Lugares.prototype.init = function() {
        var log;
        Singleton.get().showLoading();
        if (_.isEmpty(this.tipo)) {
          this.lugar.buscarTipos(this.cargarTiposEnMemoria);
        }
        $('#appView').html(_.template(Tpllugares)({
          tipos: this.tipos
        }));
        $('.scroll').css('height', window.innerHeight - 75);
        $('#filtrocomuna').val("Talca");
        this.lugar.buscarSectores(7101, this.cargaSectorTalcafiltro);
        this.filtrar();
        Singleton.get().hideLoading();
        $('#nuevolugar').tooltip({
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
        $('#nuevolugar').click((function(_this) {
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
        $(document).on("keyup", "#filtrocomuna", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return $('#filtrosector').html('<option value="0" selected="selected">Seleccione...</option>');
          };
        })(this));
        $('#next').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            Singleton.get().showLoading();
            return $.ajax({
              url: base_url + "/index.php/services/lugares/contarRegistros",
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
              url: base_url + "/index.php/services/lugares/contarRegistros",
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
        log = (function(_this) {
          return function(idcomuna) {
            console.log('idcomuna' + idcomuna);
            return _this.lugar.buscarSectores(idcomuna, _this.cargaSectorTalcafiltro);
          };
        })(this);
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
                    value: item.COMUNA_NOMBRE,
                    idcomuna: item.COMUNA_ID
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
          select: function(event, ui) {
            if (ui.item) {
              return log(ui.item.idcomuna);
            }
          },
          open: function() {
            return $('#filtrocomuna').removeClass("ui-autocomplete-loading");
          },
          close: function() {
            return $('#filtrocomuna').removeClass("ui-autocomplete-loading");
          }
        });
      };

      Lugares.prototype.filtrar = function() {
        Singleton.get().showLoading();
        this.objData = {
          comuna: $('#filtrocomuna').val(),
          idsector: $('#filtrosector').val(),
          idtipo: $('#tipo').val(),
          start: this.paginador.start,
          end: '14'
        };
        return $.ajax({
          url: base_url + "/index.php/services/lugares/contarRegistros",
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

      Lugares.prototype.cargar = function() {
        return $.ajax({
          url: base_url + "/index.php/services/lugares/filtrar",
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
                lugares: s
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

      Lugares.prototype.nuevo = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('#appView').css('display', 'none');
        if (_.isEmpty(this.regiones)) {
          this.sector.buscarRegiones(this.cargarRegionesEnMemoria);
        }
        if (_.isEmpty(this.tipo)) {
          this.lugar.buscarTipos(this.cargarTiposEnMemoria);
        }
        $('#appViewNext').html(_.template(Tplnuevo)({
          regiones: this.regiones,
          tipos: this.tipos
        }));
        $('#regionselect').attr("value", 7);
        this.sector.buscarProvincia(7, this.cargaProvinciaTalca);
        $('#provinciaselect').attr("value", 71);
        this.sector.buscarComuna(71, this.cargaComunaTalca);
        $('#comunaselect').attr("value", 7101);
        this.lugar.buscarSectores(7101, this.cargaSectorTalca);
        Singleton.get().hideLoading();
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
            $('#sectorselect').html(option);
            $('#comunaselect').html(option);
            $('#comunaselect option[value=0]').attr('selected', true);
            reg = $('#regionselect').find(':selected').val();
            if (reg !== '0' && reg !== '') {
              return _this.sector.buscarProvincia(reg, _this.cargaProvincias);
            } else {
              $('#provinciaselect').html(option);
              $('#comunaselect').html(option);
              return $('#sectorselect').html(option);
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
              $('#comunaselect').html(option);
              return $('#sectorselect').html(option);
            }
          };
        })(this));
        $('#comunaselect').change((function(_this) {
          return function(e) {
            var com, option;
            e.preventDefault();
            e.stopPropagation();
            option = '<option value="0" selected="selected">Seleccione...</option>';
            $('#sectorselect').html(option);
            com = $('#comunaselect').find(':selected').val();
            return _this.lugar.buscarSectores(com, _this.cargaSector);
          };
        })(this));
        $('#guardarlugar').click((function(_this) {
          return function(e) {
            var Validator, datos;
            e.preventDefault();
            e.stopPropagation();
            Validator = true;
            if ($('#tiposelect').find(':selected').val() === '' || $('#tiposelect').find(':selected').val() === '0') {
              Singleton.get().showInformacion('Debe asignar un tipo al nuevo lugar');
              Validator = false;
            }
            if ($('#sectorselect').find(':selected').val() === '' || $('#sectorselect').find(':selected').val() === '0') {
              Singleton.get().showInformacion('Debe asignar sector al lugar');
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
            if ($('#nombrelugar').val() === '') {
              Singleton.get().showInformacion('Debe ingresar un nombre al lugar');
              Validator = false;
            }
            if (Validator === true) {
              _this.lugar.buscarLugarExistente($('#nombrelugar').val(), $('#tiposelect').val(), $('#sectorselect').val(), _this.verificarlugares);
              if (_this.cantidad !== 0) {
                Singleton.get().showInformacion('Ya existe un lugar con ese nombre y tipo para ese sector');
                return $('#nombrelugar').val("");
              } else {
                datos = {
                  Nombre: $('#nombrelugar').val(),
                  Id_Sector: $('#sectorselect').val(),
                  Id_Tipo: $('#tiposelect').val()
                };
                return new Lugar().guardarLugar(datos, function(data) {
                  if (_.isUndefined(data.error)) {
                    Singleton.get().showExito('El lugar ha sido guardado exitosamente.');
                    $('#appView').css('display', 'block');
                    $('#appViewNext').empty();
                    return _this.filtrar();
                  } else {
                    return Singleton.get().showError('El lugar no ha podido ser guardado.');
                  }
                });
              }
            }
          };
        })(this));
        return $('#cancelarlugar').click((function(_this) {
          return function(e) {
            return _this.cancelar(e);
          };
        })(this));
      };

      Lugares.prototype.clickTr = function(e) {
        var html;
        e.preventDefault();
        e.stopPropagation();
        this.idlugar = e.currentTarget.attributes[0].value;
        html = html + "<option value=\"accion\">Acciones</option>" + "<option value=\"editar\">Editar</option>" + "<option value=\"eliminar\">Eliminar</option>";
        $('#accionesLugares').html(html);
        $(e.currentTarget).addClass('active');
        $(e.currentTarget).siblings().removeClass('active');
        $('#accionesLugares').unbind("change");
        return $('#accionesLugares').change((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.acciones(e);
          };
        })(this));
      };

      Lugares.prototype.acciones = function(e) {
        var Validator;
        Validator = true;
        e.preventDefault();
        e.stopPropagation();
        if ("editar" === $('#accionesLugares').find(':selected').val()) {
          Singleton.get().showLoading();
          if (_.isEmpty(this.regiones)) {
            this.sector.buscarRegiones(this.cargarRegionesEnMemoria);
          }
          if (_.isEmpty(this.tipo)) {
            this.lugar.buscarTipos(this.cargarTiposEnMemoria);
          }
          $('#appView').css('display', 'none');
          $('#appViewNext').html(_.template(Tpleditar)({
            regiones: this.regiones,
            tipos: this.tipos
          }));
          this.lugar.buscarLugar(this.idlugar, this.cargareditar);
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
              $('#sectorselect').html(option);
              $('#comunaselect').html(option);
              $('#comunaselect option[value=0]').attr('selected', true);
              reg = $('#regionselect').find(':selected').val();
              if (reg !== '0' && reg !== '') {
                return _this.sector.buscarProvincia(reg, _this.cargaProvincias);
              } else {
                $('#provinciaselect').html(option);
                $('#comunaselect').html(option);
                return $('#sectorselect').html(option);
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
                $('#comunaselect').html(option);
                return $('#sectorselect').html(option);
              }
            };
          })(this));
          $('#comunaselect').change((function(_this) {
            return function(e) {
              var com, option;
              e.preventDefault();
              e.stopPropagation();
              option = '<option value="0" selected="selected">Seleccione...</option>';
              $('#sectorselect').html(option);
              com = $('#comunaselect').find(':selected').val();
              return _this.lugar.buscarSectores(com, _this.cargaSector);
            };
          })(this));
          $('#guardarlugar').click((function(_this) {
            return function(e) {
              var datos;
              e.preventDefault();
              e.stopPropagation();
              Validator = true;
              if ($('#tiposelect').find(':selected').val() === '' || $('#tiposelect').find(':selected').val() === '0') {
                Singleton.get().showInformacion('Debe asignar un tipo al nuevo lugar');
                Validator = false;
              }
              if ($('#sectorselect').find(':selected').val() === '' || $('#sectorselect').find(':selected').val() === '0') {
                Singleton.get().showInformacion('Debe asignar sector al lugar');
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
              if ($('#nombrelugar').val() === '') {
                Singleton.get().showInformacion('Debe ingresar un nombre al lugar');
                Validator = false;
              }
              if (Validator === true) {
                _this.lugar.buscarLugarExistente($('#nombrelugar').val(), $('#tiposelect').val(), $('#sectorselect').val(), _this.verificarlugares);
                if (_this.cantidad !== 0) {
                  Singleton.get().showInformacion('Ya existe un lugar con ese nombre y tipo para ese sector');
                  return $('#nombrelugar').val("");
                } else {
                  datos = {
                    idlugar: _this.idlugar,
                    Nombre: $('#nombrelugar').val(),
                    Id_Sector: $('#sectorselect').val(),
                    Id_Tipo: $('#tiposelect').val()
                  };
                  return new Lugar().actualizarLugar(datos, function(data) {
                    if (_.isUndefined(data.error)) {
                      Singleton.get().showExito('El lugar ha sido actualizado exitosamente.');
                      $('#appView').css('display', 'block');
                      $('#appViewNext').empty();
                      return _this.filtrar();
                    } else {
                      return Singleton.get().showError('El lugar no ha podido ser actualizado.');
                    }
                  });
                }
              }
            };
          })(this));
          $('#cancelarlugar').click((function(_this) {
            return function(e) {
              return _this.cancelar(e);
            };
          })(this));
        }
        if ("eliminar" === $('#accionesLugares').find(':selected').val()) {
          return this.eliminar();
        }
      };

      Lugares.prototype.cargareditar = function(data) {
        this.sectorid = data[0].Id_Sector;
        $('#nombrelugar').val(data[0].Nombre);
        $('#tiposelect').val(data[0].Id_Tipo);
        return this.lugar.buscarzona(data[0].Id_Sector, this.cargareditarzona);
      };

      Lugares.prototype.cargareditarzona = function(data) {
        $('#regionselect').attr("value", data[0].IdRegion);
        this.sector.buscarProvincia(data[0].IdRegion, this.cargaProvinciaTalca);
        $('#provinciaselect').attr("value", data[0].IdProvincia);
        this.sector.buscarComuna(data[0].IdProvincia, this.cargaComunaTalca);
        $('#comunaselect').attr("value", data[0].IdComuna);
        this.lugar.buscarSectores(data[0].IdComuna, this.cargaSectorTalca);
        $('#sectorselect').attr("value", this.sectorid);
        return Singleton.get().hideLoading();
      };

      Lugares.prototype.eliminar = function() {
        Singleton.get().showAdvertencia();
        return $('#btnAceptarAdvertencia').click((function(_this) {
          return function(e) {
            return new Lugar().eliminarLugar(_this.idlugar, function(data) {
              if (_.isUndefined(data.error)) {
                if (data === 'true') {
                  Singleton.get().showExito('El lugar ha sido eliminado exitosamente.');
                  $('#appView').css('display', 'block');
                  $('#appViewNext').empty();
                  return _this.filtrar();
                } else {
                  Singleton.get().showInformacion('El lugar no puede ser eliminado, debido a que actualmente esta siendo ocupado');
                  $('#appView').css('display', 'block');
                  return $('#appViewNext').empty();
                }
              } else {
                return Singleton.get().showError('El lugar no ha podido ser eliminado.');
              }
            });
          };
        })(this));
      };

      Lugares.prototype.verificarlugares = function(cantidad) {
        return this.cantidad = parseInt(cantidad[0].c);
      };

      Lugares.prototype.cargarRegionesEnMemoria = function(regiones) {
        return this.regiones = regiones;
      };

      Lugares.prototype.cargarProvinciasEnMemoria = function(regiones) {
        return this.provincias = regiones;
      };

      Lugares.prototype.cargarComunasEnMemoria = function(regiones) {
        return this.comunas = regiones;
      };

      Lugares.prototype.cargarTiposEnMemoria = function(tipos) {
        return this.tipos = tipos;
      };

      Lugares.prototype.volveriteminicial = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appView').css('display', 'block');
        $('#appViewNext').empty();
        return Singleton.get().hideLoading();
      };

      Lugares.prototype.cargaProvinciaTalca = function(p) {
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

      Lugares.prototype.cargaComunaTalca = function(p) {
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

      Lugares.prototype.cargaSectorTalcafiltro = function(p) {
        var i, iterator, len, option;
        option = '<option value="0" selected="selected">Seleccione...</option>';
        for (i = 0, len = p.length; i < len; i++) {
          iterator = p[i];
          option += '<option value="' + iterator.Id_Sector + '" selected="selected">' + iterator.Nombre + '</option>';
        }
        $('#filtrosector').html(option);
        return $('#filtrosector option[value=0]').attr('selected', true);
      };

      Lugares.prototype.cargaSectorTalca = function(p) {
        var i, iterator, len, option;
        option = '<option value="0" selected="selected">Seleccione...</option>';
        if (p !== '') {
          for (i = 0, len = p.length; i < len; i++) {
            iterator = p[i];
            option += '<option value="' + iterator.Id_Sector + '" selected="selected">' + iterator.Nombre + '</option>';
          }
        }
        $('#sectorselect').html(option);
        return $('#sectorselect option[value=0]').attr('selected', true);
      };

      Lugares.prototype.cargaProvincias = function(p) {
        var i, iterator, len, option;
        Singleton.get().showLoading();
        option = '<option value="0" selected="selected">Seleccione...</option>';
        for (i = 0, len = p.length; i < len; i++) {
          iterator = p[i];
          option += '<option value="' + iterator.PROVINCIA_ID + '" selected="selected">' + iterator.PROVINCIA_NOMBRE + '</option>';
          $('#provinciaselect').html(option);
          $('#provinciaselect option[value=0]').attr('selected', true);
          $('#comunaselect option[value=0]').attr('selected', true);
        }
        return Singleton.get().hideLoading();
      };

      Lugares.prototype.cargaComuna = function(p) {
        var i, iterator, len, option;
        Singleton.get().showLoading();
        option = '<option value="0" selected="selected">Seleccione...</option>';
        for (i = 0, len = p.length; i < len; i++) {
          iterator = p[i];
          option += '<option value="' + iterator.COMUNA_ID + '" selected="selected">' + iterator.COMUNA_NOMBRE + '</option>';
          $('#comunaselect').html(option);
          $('#comunaselect option[value=0]').attr('selected', true);
        }
        return Singleton.get().hideLoading();
      };

      Lugares.prototype.cargaSector = function(p) {
        var i, iterator, len, option;
        Singleton.get().showLoading();
        option = '<option value="0" selected="selected">Seleccione...</option>';
        if (p !== '') {
          for (i = 0, len = p.length; i < len; i++) {
            iterator = p[i];
            option += '<option value="' + iterator.Id_Sector + '" selected="selected">' + iterator.Nombre + '</option>';
          }
        }
        $('#sectorselect').html(option);
        $('#sectorselect option[value=0]').attr('selected', true);
        return Singleton.get().hideLoading();
      };

      Lugares.prototype.cancelar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appViewNext').html("");
        $('#appView').css('display', 'inline');
        return Singleton.get().hideLoading();
      };

      return Lugares;

    })(Backbone.View);
  });

}).call(this);
