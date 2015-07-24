(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/mantenedorDestinatarios/adddestinatariopedido.html', 'assets/js/model/destinatario', 'assets/js/model/sector'], function(Backbone, TplViewAddCliente, DestinatariosModel, Sector) {
    var agregarDestinatario;
    return agregarDestinatario = (function(superClass) {
      extend(agregarDestinatario, superClass);

      function agregarDestinatario() {
        this.datosdestinatario = bind(this.datosdestinatario, this);
        this.cargaComuna = bind(this.cargaComuna, this);
        this.cargaProvincias = bind(this.cargaProvincias, this);
        this.cargaComunaDefecto = bind(this.cargaComunaDefecto, this);
        this.cargaProvinciaDefecto = bind(this.cargaProvinciaDefecto, this);
        this.cargarRegionesEnMemoria = bind(this.cargarRegionesEnMemoria, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return agregarDestinatario.__super__.constructor.apply(this, arguments);
      }

      agregarDestinatario.prototype.initialize = function() {
        this.destinatarioModel = new DestinatariosModel();
        this.sector = new Sector();
        return this.init();
      };

      agregarDestinatario.prototype.init = function() {
        var log;
        Singleton.get().showLoading();
        $('#modal').css('width', 950);
        $('#modal').css('height', 370);
        $('#modal').css('left', '40.5%');
        $('#modal').css('top', '45%');
        $('#modal').css('background-color', '#f6f6f6');
        if (_.isEmpty(this.regiones)) {
          this.sector.buscarRegiones(this.cargarRegionesEnMemoria);
        }
        this.sector.buscarProvincia(7, this.cargaProvinciaDefecto);
        this.sector.buscarComuna(71, this.cargaComunaDefecto);
        $('#modal').html(_.template(TplViewAddCliente)({
          regiones: this.regiones,
          provincias: this.provincias,
          comunas: this.comunas
        }));
        $('#autoc2').val($('#autoc1').val());
        $('#autoc3').val($('#DV').val());
        $('#regionselect').attr("value", 7);
        $('#provinciaselect').attr("value", 71);
        $('#comunaselect').attr("value", 7101);
        $('#mensaje').css('display', 'none');
        $('#telefono').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
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
            $('#sector').val("");
            $('#idlugar').val("");
            $('#lugar').val("");
            if (pro !== '0' && pro !== '') {
              return _this.sector.buscarComuna(pro, _this.cargaComuna);
            } else {
              option = '<option value="0" selected="selected">Seleccione...</option>';
              return $('#comunaselect').html(option);
            }
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
        $(document).on("focus", "#lugar", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#mensaje').css('display', 'none');
            return false;
          };
        })(this));
        $(document).on("focusout", "#lugar", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($('#idlugar').val() === "" && $('#lugar').val() !== "") {
              $("#mensaje").html("&nbsp;&nbsp;El Lugar Ingresado no es valido");
              $('#mensaje').css('display', 'inline');
              $('#sector').val("");
              return $('#lugar').val("");
            }
          };
        })(this));
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
                  console.log(item.nombretipo + " - " + item.nombrelugar + " - Sector " + item.nombresector);
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
        $('#guardardestinatario').click((function(_this) {
          return function(e) {
            var Validator, datos;
            e.preventDefault();
            e.stopPropagation();
            Validator = true;
            if ($('#lugar').val() === '' || $('#idlugar').val() === '' || $('#sector').val() === '') {
              Validator = false;
            }
            if ($('#comunaselect').find(':selected').val() === '' || $('#comunaselect').find(':selected').val() === '0') {
              Validator = false;
            }
            if ($('#provinciaselect').find(':selected').val() === '' || $('#provinciaselect').find(':selected').val() === '0') {
              Validator = false;
            }
            if ($('#regionselect').find(':selected').val() === '') {
              Validator = false;
            }
            if ($('#direccion').val() === '') {
              Validator = false;
            }
            if ($('#nombre').val() === '') {
              Validator = false;
            }
            if ($('#autoc3').val() === '') {
              Validator = false;
            }
            if ($('#autoc2').val() === '') {
              Validator = false;
            }
            if (Validator === true) {
              _this.rut = Singleton.get().cleanRut($('#autoc3').val());
              datos = {
                nombrecliente: $('#autoc2').val(),
                rut: Singleton.get().cleanRut($('#autoc3').val()),
                nombredestinatario: $('#nombre').val(),
                direccion: $('#direccion').val(),
                telefono: $('#telefono').val(),
                idlugar: $('#idlugar').val()
              };
              return new DestinatariosModel().guardarDestinatario(datos, function(data) {
                var option;
                if (_.isUndefined(data.error)) {
                  option = "";
                  return $.ajax({
                    url: base_url + "/index.php/services/cotizacion/buscarDestinatario/id/" + _this.rut,
                    type: 'GET',
                    async: true,
                    statusCode: {
                      302: function() {
                        return Singleton.get().reload();
                      }
                    },
                    success: function(destino) {
                      var d, i, len;
                      if (destino.error !== '202') {
                        for (i = 0, len = destino.length; i < len; i++) {
                          d = destino[i];
                          option += '<option value="' + d.Id_Destino + '" selected="selected">' + d.Nombre_Contacto + '</option>';
                        }
                        $('#Destinatario').html(option);
                        _this.datosdestinatario();
                        Singleton.get().showExito('El destinatario ha sido guardado exitosamente.');
                        $('#appView').css('display', 'block');
                        return $('#appViewNext').empty();
                      } else {
                        $('#Destinatario').html("");
                        $('#DireccionDestinatario').val("");
                        $('#TelefonoDestinatario').val("");
                        $('#idDestinatario').val("");
                        $('#appView').css('display', 'block');
                        $('#appViewNext').empty();
                        return Singleton.get().showError('no se ha podido cargar los valores del destinatario.');
                      }
                    }
                  });
                } else {
                  return Singleton.get().showError('El destinatario no ha podido ser guardado.');
                }
              });
            }
          };
        })(this));
        return $('#cancelardestinatario').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return $('#modal').modal('hide');
          };
        })(this));
      };

      agregarDestinatario.prototype.cargarRegionesEnMemoria = function(regiones) {
        return this.regiones = regiones;
      };

      agregarDestinatario.prototype.cargaProvinciaDefecto = function(p) {
        return this.provincias = p;
      };

      agregarDestinatario.prototype.cargaComunaDefecto = function(c) {
        return this.comunas = c;
      };

      agregarDestinatario.prototype.cargaProvincias = function(p) {
        var i, iterator, len, option, results;
        option = '<option value="0" selected="selected">Seleccione...</option>';
        results = [];
        for (i = 0, len = p.length; i < len; i++) {
          iterator = p[i];
          option += '<option value="' + iterator.PROVINCIA_ID + '" selected="selected">' + iterator.PROVINCIA_NOMBRE + '</option>';
          $('#provinciaselect').html(option);
          $('#provinciaselect option[value=0]').attr('selected', true);
          results.push($('#comunaselect option[value=0]').attr('selected', true));
        }
        return results;
      };

      agregarDestinatario.prototype.cargaComuna = function(p) {
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

      agregarDestinatario.prototype.datosdestinatario = function() {
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

      return agregarDestinatario;

    })(Backbone.View);
  });

}).call(this);
