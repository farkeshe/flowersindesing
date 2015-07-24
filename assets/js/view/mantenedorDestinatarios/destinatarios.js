(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/mantenedorDestinatarios/destinatarios.html', 'text!tpl/mantenedorDestinatarios/nuevo.html', 'text!tpl/mantenedorDestinatarios/resultados.html', 'text!tpl/mantenedorDestinatarios/editar.html', 'text!tpl/gestorCotizaciones/modalCliente.html', 'assets/js/view/paginador', 'assets/js/model/destinatario', 'assets/js/model/sector'], function(Backbone, Tpldestinatarios, Tplnuevo, Tplresultados, Tpleditar, TplmodalCliente, Paginador, DestinatarioModel, Sector) {
    var Destinatarios;
    return Destinatarios = (function(superClass) {
      extend(Destinatarios, superClass);

      function Destinatarios() {
        this.volveriteminicial = bind(this.volveriteminicial, this);
        this.modalAceptarCliente = bind(this.modalAceptarCliente, this);
        this.modalBuscarCliente = bind(this.modalBuscarCliente, this);
        this.showModalCliente = bind(this.showModalCliente, this);
        this.eliminar = bind(this.eliminar, this);
        this.cargaComunaTalca = bind(this.cargaComunaTalca, this);
        this.cargaProvinciaTalca = bind(this.cargaProvinciaTalca, this);
        this.cargareditar = bind(this.cargareditar, this);
        this.acciones = bind(this.acciones, this);
        this.clickTr = bind(this.clickTr, this);
        this.cargar = bind(this.cargar, this);
        this.filtrar = bind(this.filtrar, this);
        this.cargarVillas = bind(this.cargarVillas, this);
        this.cargarSectorEnMemoria = bind(this.cargarSectorEnMemoria, this);
        this.cancelar = bind(this.cancelar, this);
        this.cargarRegionesEnMemoria = bind(this.cargarRegionesEnMemoria, this);
        this.cargaComuna = bind(this.cargaComuna, this);
        this.cargaProvincias = bind(this.cargaProvincias, this);
        this.cargaComunaTalca = bind(this.cargaComunaTalca, this);
        this.cargaProvinciaTalca = bind(this.cargaProvinciaTalca, this);
        this.nuevo = bind(this.nuevo, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return Destinatarios.__super__.constructor.apply(this, arguments);
      }

      Destinatarios.prototype.el = 'body';

      Destinatarios.prototype.initialize = function() {
        this.paginador = new Paginador();
        this.destinatarioModel = new DestinatarioModel();
        this.sector = new Sector();
        this.objData = {
          nombrecliente: "",
          rutcliente: "",
          start: this.paginador.start,
          end: '14'
        };
        return this.init();
      };

      Destinatarios.prototype.init = function() {
        Singleton.get().showLoading();
        $('#appView').html(_.template(Tpldestinatarios));
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
        $('#nuevodestinatario').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          },
          'placement': 'top'
        });
        $('#nuevodestinatario').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.nuevo(e);
          };
        })(this));
        $(document).on("focusout", "#rut", (function(_this) {
          return function(e) {
            var rut;
            e.preventDefault();
            e.stopPropagation();
            if ($('#rut').val() !== "") {
              if (!Singleton.get().ValidarRut($('#rut').val())) {
                Singleton.get().showError('El Valor Ingresado es Incorrecto');
                return $('#rut').val("");
              } else {
                rut = $('#rut').val();
                rut = Singleton.get().cleanRut(rut);
                rut = Singleton.get().formatearRut(rut);
                return $('#rut').val(rut);
              }
            }
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
              return $('#rut').val(Singleton.get().formatearRut(ui.item.Rut));
            }
          },
          open: function() {
            return $('#autoc1').removeClass("ui-autocomplete-loading");
          },
          close: function() {
            return $('#autoc1').removeClass("ui-autocomplete-loading");
          }
        });
        $('#filtrarDestinatarios').click((function(_this) {
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
              url: base_url + "/index.php/services/destinatarios/contarRegistros",
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
              url: base_url + "/index.php/services/destinatarios/contarRegistros",
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

      Destinatarios.prototype.nuevo = function(e) {
        var log;
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
        $('#buscarcliente').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
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
            $('#sectorselect').html(option);
            $('#comunaselect').html(option);
            $('#comunaselect option[value=0]').attr('selected', true);
            $('#sector').val("");
            $('#idlugar').val("");
            $('#lugar').val("");
            reg = $('#regionselect').find(':selected').val();
            return _this.sector.buscarProvincia(reg, _this.cargaProvincias);
          };
        })(this));
        $('#provinciaselect').change((function(_this) {
          return function(e) {
            var pro;
            e.preventDefault();
            e.stopPropagation();
            pro = $('#provinciaselect').find(':selected').val();
            $('#sector').val("");
            $('#idlugar').val("");
            $('#lugar').val("");
            return _this.sector.buscarComuna(pro, _this.cargaComuna);
          };
        })(this));
        $('#comunaselect').change((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#sector').val("");
            $('#idlugar').val("");
            return $('#lugar').val("");
          };
        })(this));
        $(document).on("focusout", "#autoc2", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($('#autoc2').val() === "") {
              return $('#autoc3').val("");
            }
          };
        })(this));
        $(document).on("keyup", "#lugar", (function(_this) {
          return function(e) {
            if (event.keyCode !== 13) {
              e.preventDefault();
              e.stopPropagation();
              $('#sector').val("");
              $('#idlugar').val("");
            }
            return false;
          };
        })(this));
        $(document).on("focusout", "#lugar", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($('#idlugar').val() === "" && $('#lugar').val() !== "") {
              Singleton.get().showInformacion('El lugar ingresado no es válido');
              $('#sector').val("");
              return $('#lugar').val("");
            }
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
        $('#buscarcliente').click((function(_this) {
          return function(e) {
            return _this.showModalCliente(e);
          };
        })(this));
        $("#autoc2").autocomplete({
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
                    rut: $('#autoc3').attr("value", Singleton.get().formatearRut(data[0].Rut_Entidad))
                  };
                }));
              },
              error: function(data) {
                $('#autoc2').removeClass("ui-autocomplete-loading");
                return $('#autoc2').autocomplete("close");
              }
            });
          },
          minLength: 1,
          open: function() {
            return $('#autoc2').removeClass("ui-autocomplete-loading");
          },
          close: function() {
            return $('#autoc2').removeClass("ui-autocomplete-loading");
          }
        });
        log = (function(_this) {
          return function(idlugar, nombresector) {
            $('#sector').val(nombresector);
            return $('#idlugar').val(idlugar);
          };
        })(this);
        $("#lugar").autocomplete({
          source: function(request, response) {
            return $.ajax({
              url: base_url + "/index.php/services/destinatarios/milugar",
              type: 'POST',
              data: {
                palabra: request.term,
                idcomuna: $('#comunaselect').val()
              },
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: function(data) {
                return response($.map(data, function(item) {
                  return {
                    label: item.nombretipo + " - " + item.nombrelugar + " - Sector " + item.nombresector,
                    value: item.nombrelugar,
                    idlugar: item.idlugar,
                    nombresector: item.nombresector
                  };
                }));
              },
              error: function(data) {
                $('#lugar').removeClass("ui-autocomplete-loading");
                return $('#lugar').autocomplete("close");
              }
            });
          },
          minLength: 1,
          select: function(event, ui) {
            if (ui.item) {
              return log(ui.item.idlugar, ui.item.nombresector);
            }
          },
          open: function() {
            return $('#lugar').removeClass("ui-autocomplete-loading");
          },
          close: function() {
            return $('#lugar').removeClass("ui-autocomplete-loading");
          }
        });
        $('#cancelardestinatario').click((function(_this) {
          return function(e) {
            return _this.cancelar(e);
          };
        })(this));
        return $('#guardardestinatario').click((function(_this) {
          return function(e) {
            var Validator, datos;
            e.preventDefault();
            e.stopPropagation();
            Validator = true;
            if ($('#lugar').val() === '' || $('#idlugar').val() === '' || $('#sector').val() === '') {
              Singleton.get().showInformacion('Debe Buscar el lugar del destinatario');
              Validator = false;
            }
            if ($('#comunaselect').find(':selected').val() === '' || $('#comunaselect').find(':selected').val() === '0') {
              Singleton.get().showInformacion('Debe seleccionar la Comuna del destinatario');
              Validator = false;
            }
            if ($('#provinciaselect').find(':selected').val() === '' || $('#provinciaselect').find(':selected').val() === '0') {
              Singleton.get().showInformacion('Debe seleccionar la Provincia del destinatario');
              Validator = false;
            }
            if ($('#regionselect').find(':selected').val() === '') {
              Singleton.get().showInformacion('Debe seleccionar la Región del destinatario');
              Validator = false;
            }
            if ($('#direccion').val() === '') {
              Singleton.get().showInformacion('Debe ingresar la dirección del destinatario');
              Validator = false;
            }
            if ($('#nombre').val() === '') {
              Singleton.get().showInformacion('Debe ingresar el nombre del destinatario');
              Validator = false;
            }
            if ($('#autoc3').val() === '') {
              Singleton.get().showInformacion('No se ha cargado el Rut del Cliente');
              Validator = false;
            }
            if ($('#autoc2').val() === '') {
              Singleton.get().showInformacion('Debe Seleccionar un Cliente');
              Validator = false;
            }
            if (Validator === true) {
              datos = {
                nombrecliente: $('#autoc2').val(),
                rut: Singleton.get().cleanRut($('#autoc3').val()),
                nombredestinatario: $('#nombre').val(),
                direccion: $('#direccion').val(),
                telefono: $('#telefono').val(),
                idlugar: $('#idlugar').val()
              };
              return new DestinatarioModel().guardarDestinatario(datos, function(data) {
                if (_.isUndefined(data.error)) {
                  Singleton.get().showExito('El destinatario ha sido guardado exitosamente.');
                  $('#appView').css('display', 'block');
                  $('#appViewNext').empty();
                  return _this.filtrar();
                } else {
                  return Singleton.get().showError('El destinatario no ha podido ser guardado.');
                }
              });
            }
          };
        })(this));
      };

      Destinatarios.prototype.cargaProvinciaTalca = function(p) {
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

      Destinatarios.prototype.cargaComunaTalca = function(p) {
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

      Destinatarios.prototype.cargaProvincias = function(p) {
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

      Destinatarios.prototype.cargaComuna = function(p) {
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

      Destinatarios.prototype.cargarRegionesEnMemoria = function(regiones) {
        return this.regiones = regiones;
      };

      Destinatarios.prototype.cancelar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appViewNext').html("");
        $('#appView').css('display', 'inline');
        return Singleton.get().hideLoading();
      };

      Destinatarios.prototype.cargarSectorEnMemoria = function(sector) {
        return this.sector = sector;
      };

      Destinatarios.prototype.cargarVillas = function() {
        var idsector, option;
        idsector = $('#sector').val();
        option = '<option value= 1 selected="selected">' + 'Seleccione...' + '</option>';
        if (idsector !== "") {
          return $.ajax({
            url: base_url + "/index.php/services/destinatarios/buscarVillas/idsector/" + idsector,
            type: 'GET',
            async: false,
            statusCode: {
              302: function() {
                return Singleton.get().reload();
              }
            },
            success: (function(_this) {
              return function(villas) {
                var i, len, v;
                for (i = 0, len = villas.length; i < len; i++) {
                  v = villas[i];
                  option += '<option value="' + v.Id_Villa + '" selected="selected">' + v.Nombre + '</option>';
                }
                $('#villa').html(option);
                return $('#villa').attr("value", 1);
              };
            })(this),
            error: (function(_this) {
              return function(data) {
                return $('#villa').html(option);
              };
            })(this)
          });
        } else {
          return $('#villa').html(option);
        }
      };

      Destinatarios.prototype.filtrar = function() {
        Singleton.get().showLoading();
        this.objData = {
          nombrecliente: $('#autoc1').val(),
          rutcliente: Singleton.get().cleanRut($('#rut').val()),
          start: this.paginador.start,
          end: '14'
        };
        return $.ajax({
          url: base_url + "/index.php/services/destinatarios/contarRegistros",
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

      Destinatarios.prototype.cargar = function() {
        return $.ajax({
          url: base_url + "/index.php/services/destinatarios/filtrar",
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
                destinatarios: s
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

      Destinatarios.prototype.clickTr = function(e) {
        var html;
        e.preventDefault();
        e.stopPropagation();
        this.Id_Destino = e.currentTarget.attributes[0].value;
        html = html + "<option value=\"accion\">Acciones</option>" + "<option value=\"editar\">Editar</option>" + "<option value=\"eliminar\">Eliminar</option>";
        $('#accionesdestinatarios').html(html);
        $(e.currentTarget).addClass('active');
        $(e.currentTarget).siblings().removeClass('active');
        $('#accionesdestinatarios').unbind("change");
        return $('#accionesdestinatarios').change((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.acciones(e);
          };
        })(this));
      };

      Destinatarios.prototype.acciones = function(e) {
        var log;
        e.preventDefault();
        e.stopPropagation();
        if ("editar" === $('#accionesdestinatarios').find(':selected').val()) {
          Singleton.get().showLoading();
          $('#appView').css('display', 'none');
          if (_.isEmpty(this.regiones)) {
            this.sector.buscarRegiones(this.cargarRegionesEnMemoria);
          }
          $('#appViewNext').html(_.template(Tpleditar)({
            regiones: this.regiones
          }));
          this.destinatarioModel.buscarDestinatario(this.Id_Destino, this.cargareditar);
          Singleton.get().hideLoading();
          $('#modal').remove();
          $("#autoc2").autocomplete({
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
                      rut: $('#autoc3').attr("value", Singleton.get().formatearRut(data[0].Rut_Entidad))
                    };
                  }));
                },
                error: function(data) {
                  $('#autoc2').removeClass("ui-autocomplete-loading");
                  return $('#autoc2').autocomplete("close");
                }
              });
            },
            minLength: 1,
            open: function() {
              return $('#autoc2').removeClass("ui-autocomplete-loading");
            },
            close: function() {
              return $('#autoc2').removeClass("ui-autocomplete-loading");
            }
          });
          log = (function(_this) {
            return function(idlugar, nombresector) {
              $('#sector').val(nombresector);
              return $('#idlugar').val(idlugar);
            };
          })(this);
          $("#lugar").autocomplete({
            source: function(request, response) {
              return $.ajax({
                url: base_url + "/index.php/services/destinatarios/milugar",
                type: 'POST',
                data: {
                  palabra: request.term,
                  idcomuna: $('#comunaselect').val()
                },
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(data) {
                  return response($.map(data, function(item) {
                    return {
                      label: item.nombretipo + " - " + item.nombrelugar + " - Sector " + item.nombresector,
                      value: item.nombrelugar,
                      idlugar: item.idlugar,
                      nombresector: item.nombresector
                    };
                  }));
                },
                error: function(data) {
                  $('#lugar').removeClass("ui-autocomplete-loading");
                  return $('#lugar').autocomplete("close");
                }
              });
            },
            minLength: 1,
            select: function(event, ui) {
              if (ui.item) {
                return log(ui.item.idlugar, ui.item.nombresector);
              }
            },
            open: function() {
              return $('#lugar').removeClass("ui-autocomplete-loading");
            },
            close: function() {
              return $('#lugar').removeClass("ui-autocomplete-loading");
            }
          });
          $('#regionselect').change((function(_this) {
            return function(e) {
              var option, reg;
              e.preventDefault();
              e.stopPropagation();
              option = '<option value="0" selected="selected">Seleccione...</option>';
              $('#sectorselect').html(option);
              $('#comunaselect').html(option);
              $('#comunaselect option[value=0]').attr('selected', true);
              $('#sector').val("");
              $('#idlugar').val("");
              $('#lugar').val("");
              reg = $('#regionselect').find(':selected').val();
              return _this.sector.buscarProvincia(reg, _this.cargaProvincias);
            };
          })(this));
          $('#provinciaselect').change((function(_this) {
            return function(e) {
              var pro;
              e.preventDefault();
              e.stopPropagation();
              pro = $('#provinciaselect').find(':selected').val();
              $('#sector').val("");
              $('#idlugar').val("");
              $('#lugar').val("");
              return _this.sector.buscarComuna(pro, _this.cargaComuna);
            };
          })(this));
          $('#comunaselect').change((function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              $('#sector').val("");
              $('#idlugar').val("");
              return $('#lugar').val("");
            };
          })(this));
          $(document).on("focusout", "#autoc2", (function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              if ($('#autoc2').val() === "") {
                return $('#autoc3').val("");
              }
            };
          })(this));
          $(document).on("keyup", "#lugar", (function(_this) {
            return function(e) {
              if (event.keyCode !== 13) {
                e.preventDefault();
                e.stopPropagation();
                $('#sector').val("");
                $('#idlugar').val("");
              }
              return false;
            };
          })(this));
          $(document).on("focusout", "#lugar", (function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              if ($('#idlugar').val() === "" && $('#lugar').val() !== "") {
                Singleton.get().showInformacion('El lugar ingresado no es válido');
                $('#sector').val("");
                return $('#lugar').val("");
              }
            };
          })(this));
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
          $('#cancelardestinatario').click((function(_this) {
            return function(e) {
              return _this.cancelar(e);
            };
          })(this));
          $('#guardardestinatario').click((function(_this) {
            return function(e) {
              var Validator, datosactualizar;
              e.preventDefault();
              e.stopPropagation();
              Validator = true;
              if ($('#lugar').val() === '' || $('#idlugar').val() === '' || $('#sector').val() === '') {
                Singleton.get().showInformacion('Debe Buscar el lugar del destinatario');
                Validator = false;
              }
              if ($('#comunaselect').find(':selected').val() === '' || $('#comunaselect').find(':selected').val() === '0') {
                Singleton.get().showInformacion('Debe seleccionar la Comuna del destinatario');
                Validator = false;
              }
              if ($('#provinciaselect').find(':selected').val() === '' || $('#provinciaselect').find(':selected').val() === '0') {
                Singleton.get().showInformacion('Debe seleccionar la Provincia del destinatario');
                Validator = false;
              }
              if ($('#regionselect').find(':selected').val() === '') {
                Singleton.get().showInformacion('Debe seleccionar la Región del destinatario');
                Validator = false;
              }
              if ($('#direccion').val() === '') {
                Singleton.get().showInformacion('Debe ingresar la dirección del destinatario');
                Validator = false;
              }
              if ($('#nombre').val() === '') {
                Singleton.get().showInformacion('Debe ingresar el nombre del destinatario');
                Validator = false;
              }
              if ($('#autoc3').val() === '') {
                Singleton.get().showInformacion('No se ha cargado el Rut del Cliente');
                Validator = false;
              }
              if ($('#autoc2').val() === '') {
                Singleton.get().showInformacion('Debe Seleccionar un Cliente');
                Validator = false;
              }
              if (Validator === true) {
                datosactualizar = {
                  iddestino: _this.Id_Destino,
                  nombrecliente: $('#autoc2').val(),
                  rut: Singleton.get().cleanRut($('#autoc3').val()),
                  nombredestinatario: $('#nombre').val(),
                  direccion: $('#direccion').val(),
                  telefono: $('#telefono').val(),
                  idlugar: $('#idlugar').val()
                };
                return new DestinatarioModel().actualizarDestinatario(datosactualizar, function(data) {
                  if (_.isUndefined(data.error)) {
                    Singleton.get().showExito('El destinatario ha sido actualizado exitosamente.');
                    $('#appView').css('display', 'block');
                    $('#appViewNext').empty();
                    return _this.filtrar();
                  } else {
                    return Singleton.get().showError('El destinatario no ha podido ser actualizado.');
                  }
                });
              }
            };
          })(this));
        }
        if ("eliminar" === $('#accionesdestinatarios').find(':selected').val()) {
          return this.eliminar();
        }
      };

      Destinatarios.prototype.cargareditar = function(data) {
        console.log(data[0]);
        $('#autoc2').attr("value", data[0].Nombre_Cliente);
        $('#autoc3').attr("value", Singleton.get().formatearRut(data[0].Rut_Entidad));
        $('#nombre').attr("value", data[0].Nombre_Contacto);
        $('#direccion').attr("value", data[0].Direccion);
        if (data[0].Telefono === '0') {
          $('#telefono').attr("value", "");
        } else {
          $('#telefono').attr("value", data[0].Telefono);
        }
        $('#lugar').attr("value", data[0].Nombre_Lugar);
        $('#idlugar').attr("value", data[0].Id_Lugar);
        $('#sector').attr("value", data[0].Nombre_Sector);
        $('#regionselect').attr("value", data[0].REGION_ID);
        this.sector.buscarProvincia(data[0].REGION_ID, this.cargaProvinciaTalca);
        $('#provinciaselect').attr("value", data[0].PROVINCIA_ID);
        this.sector.buscarComuna(data[0].PROVINCIA_ID, this.cargaComunaTalca);
        return $('#comunaselect').attr("value", data[0].COMUNA_ID);
      };

      Destinatarios.prototype.cargaProvinciaTalca = function(p) {
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

      Destinatarios.prototype.cargaComunaTalca = function(p) {
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

      Destinatarios.prototype.eliminar = function() {
        Singleton.get().showAdvertencia();
        return $('#btnAceptarAdvertencia').click((function(_this) {
          return function(e) {
            return new DestinatarioModel().eliminarDestinatario(_this.Id_Destino, function(data) {
              if (_.isUndefined(data.error)) {
                if (data === 'true') {
                  Singleton.get().showExito('El destinatario ha sido eliminado exitosamente.');
                  $('#appView').css('display', 'block');
                  $('#appViewNext').empty();
                  return _this.filtrar();
                } else {
                  return Singleton.get().showInformacion('El destinatario no puede ser eliminado, debido a que esta siendo utilizado en un pedido');
                }
              } else {
                return Singleton.get().showError('El destinatario no ha podido ser eliminado.');
              }
            });
          };
        })(this));
      };

      Destinatarios.prototype.showModalCliente = function(e) {
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

      Destinatarios.prototype.modalBuscarCliente = function(e) {
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
                var c, i, len;
                for (i = 0, len = clientes.length; i < len; i++) {
                  c = clientes[i];
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
                var c, i, len;
                for (i = 0, len = clientes.length; i < len; i++) {
                  c = clientes[i];
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

      Destinatarios.prototype.modalAceptarCliente = function(e) {
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
                  $('#autoc2').val(cliente[0].Nombre);
                  return $('#autoc3').val(Singleton.get().formatearRut(rutCliente));
                };
              })(this),
              error: (function(_this) {
                return function(data) {
                  $('#autoc2').val("");
                  return $('#autoc3').val("");
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
                  var d, i, id, len;
                  if (destino.error !== '202') {
                    for (i = 0, len = destino.length; i < len; i++) {
                      d = destino[i];
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
                        return $('#TelefonoDestinatario').val(destino[0].Telefono);
                      }
                    });
                  } else {
                    $('#Destinatario').html("");
                    $('#idDestinatario').val("");
                    $('#DireccionDestinatario').val("");
                    return $('#TelefonoDestinatario').val("");
                  }
                };
              })(this)
            });
          }
        });
        $('#modal').modal('hide');
        $('.put-tooltips').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        return false;
      };

      Destinatarios.prototype.volveriteminicial = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appView').css('display', 'block');
        $('#appViewNext').empty();
        Singleton.get().hideLoading();
        return false;
      };

      return Destinatarios;

    })(Backbone.View);
  });

}).call(this);
