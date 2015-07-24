(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/mantenedorConsignatarios/consignatarios.html', 'text!tpl/mantenedorConsignatarios/resultadoconsignatario.html', 'text!tpl/mantenedorConsignatarios/editarconsignatario.html', 'text!tpl/mantenedorConsignatarios/nuevoconsignatario.html', 'assets/js/view/paginador', 'text!tpl/mantenedorEntidades/resultadoEntidad.html'], function(Backbone, Tplconsignatarios, Tplresultadoconsignatario, Tpleditarconsignatario, Tplnuevoconsignatario, Paginador, Tplresultadosentidad) {
    var consignatarios;
    return consignatarios = (function(superClass) {
      extend(consignatarios, superClass);

      function consignatarios() {
        this.guardarconsignatario = bind(this.guardarconsignatario, this);
        this.guardarconsignatariou = bind(this.guardarconsignatariou, this);
        this.cargar = bind(this.cargar, this);
        this.destino = bind(this.destino, this);
        this.provincia = bind(this.provincia, this);
        this.regiones = bind(this.regiones, this);
        this.eliminar = bind(this.eliminar, this);
        this.editar = bind(this.editar, this);
        this.nuevo = bind(this.nuevo, this);
        this.clickTr = bind(this.clickTr, this);
        this.consigna = bind(this.consigna, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return consignatarios.__super__.constructor.apply(this, arguments);
      }

      consignatarios.prototype.el = 'body';

      consignatarios.prototype.initialize = function() {
        this.paginador = new Paginador();
        this.objData = {
          rut: "undefined",
          start: '0',
          end: '14'
        };
        return this.init();
      };

      consignatarios.prototype.init = function() {
        var log;
        Singleton.get().showLoading();
        $('#appView').html(_.template(Tplconsignatarios)({}));
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
        $('#nuevoconsignatario').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('.alertaverde').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        this.destino();
        $('#filtrarDestino').change((function(_this) {
          return function(e) {
            Singleton.get().showLoading;
            return _this.destino(e);
          };
        })(this));
        $('#regionesselect').change((function(_this) {
          return function(e) {
            return _this.regiones(e);
          };
        })(this));
        $('#provinciaselect').change((function(_this) {
          return function(e) {
            return _this.provincia(e);
          };
        })(this));
        $('#accionesconsignatarios').change((function(_this) {
          return function(e) {
            return _this.consigna(e);
          };
        })(this));
        $('#nuevoconsignatario').click((function(_this) {
          return function(e) {
            return _this.nuevo(e);
          };
        })(this));
        $('#guardarconsignatario').click((function(_this) {
          return function(e) {
            return _this.guardarconsignatario(e);
          };
        })(this));
        $('#next').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return $.ajax({
              url: base_url + "/index.php/services/destino/contarRegistros",
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
            return $.ajax({
              url: base_url + "/index.php/services/destino/contarRegistros",
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
              url: base_url + "/index.php/services/cotizacion",
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
          $('.alertaverde').tooltip({
            'trigger': 'hover',
            'delay': {
              'show': 100,
              'hide': 100
            }
          });
        } else {
          $('.scroll').css('width', window.innerWidth - 251);
          $('.alertaverde').tooltip({
            'trigger': 'hover',
            'delay': {
              'show': 100,
              'hide': 100
            }
          });
        }
        $('.scroll').css('height', window.innerHeight - 75);
        return $('#filtrarDestino').click((function(_this) {
          return function(e) {
            Singleton.get().showLoading;
            return _this.destino(e);
          };
        })(this));
      };

      consignatarios.prototype.consigna = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if ("nuevo" === $('#accionesconsignatarios').find(':selected').val()) {
          this.nuevo(e);
        }
        if ("editar" === $('#accionesconsignatarios').find(':selected').val()) {
          this.editar(e);
        }
        if ("eliminar" === $('#accionesconsignatarios').find(':selected').val()) {
          return this.eliminar(e);
        }
      };

      consignatarios.prototype.clickTr = function(e) {
        var html;
        e.preventDefault();
        e.stopPropagation();
        this.iddestino = e.currentTarget.attributes[0].value;
        this.main = e.currentTarget.cells[0].id;
        this.nombre = e.currentTarget.cells[1].id;
        this.rutclientedestino = e.currentTarget.cells[2].id;
        this.region = e.currentTarget.cells[3].id;
        this.provinciaentidad = e.currentTarget.cells[4].id;
        this.comuna = e.currentTarget.cells[5].id;
        this.direccion = e.currentTarget.cells[6].id;
        this.telefono = e.currentTarget.cells[7].id;
        this.long = e.currentTarget.cells[8].id;
        this.lat = e.currentTarget.cells[9].id;
        this.ruta = e.currentTarget.cells[10].id;
        html = html + "<option value=\"accionesconsignatarios\">Acciones</option>" + "<option value=\"editar\">Editar</option>" + "<option value=\"eliminar\">Eliminar</option>";
        $('#accionesconsignatarios').html(html);
        $(e.currentTarget).addClass('active');
        $(e.currentTarget).siblings().removeClass('active');
        return $('#nuevodestino').click((function(_this) {
          return function(e) {
            return _this.nuevo(e);
          };
        })(this));
      };

      consignatarios.prototype.nuevo = function(e) {
        Singleton.get().showLoading();
        return $.ajax({
          url: base_url + "/index.php/services/destino/regiones",
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(s) {
              return $.ajax({
                url: base_url + "/index.php/services/destino/rutas",
                type: 'GET',
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(r) {
                  var log;
                  $('#appView').html(_.template(Tplnuevoconsignatario)({
                    regiones: s,
                    ruta: r
                  }));
                  Singleton.get().hideLoading();
                  $('#telefono').keydown(function(event) {
                    if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

                    } else {
                      if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                        return event.preventDefault();
                      }
                    }
                  });
                  $('#rutaselect').attr('disabled', true);
                  $('#guardarconsignatario').click(function(e) {
                    return _this.guardarconsignatario(e);
                  });
                  $('#cancelarconsignatariou').click(function(e) {
                    return _this.initialize();
                  });
                  $('#cancelarconsignatario').click(function(e) {
                    return _this.initialize();
                  });
                  $('#regionesselect').change(function(e) {
                    return _this.regiones(e);
                  });
                  $('#provinciaselect').change(function(e) {
                    return _this.provincia(e);
                  });
                  $("#autoc1").autocomplete({
                    source: function(request, response) {
                      return $.ajax({
                        url: base_url + "/index.php/services/cotizacion",
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
                  return log = function(rut) {
                    return $('#rutcliente').val(Singleton.get().formatearRut(rut));
                  };
                }
              });
            };
          })(this)
        });
      };

      consignatarios.prototype.editar = function(e) {
        this.auxprincipal = 0;
        Singleton.get().showLoading();
        return $.ajax({
          url: base_url + "/index.php/services/destino/regiones",
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(s) {
              return $.ajax({
                url: base_url + "/index.php/services/destino/rutas",
                type: 'GET',
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(r) {
                  return $.ajax({
                    url: (base_url + "/index.php/services/destino/obtener/id/") + _this.iddestino,
                    type: 'GET',
                    statusCode: {
                      302: function() {
                        return Singleton.get().reload();
                      }
                    },
                    success: function(des) {
                      var log;
                      _this.rutclientedestino = Singleton.get().formatearRut(_this.rutclientedestino);
                      $('#appView').html(_.template(Tpleditarconsignatario)({
                        main: _this.main,
                        ruta: r,
                        nombre: _this.nombre,
                        rut: _this.rutclientedestino,
                        direccion: _this.direccion,
                        telefono: _this.telefono,
                        long: _this.long,
                        lat: _this.lat,
                        regiones: s
                      }));
                      $('#regionesselect').attr("value", _this.region);
                      $('#provinciaselect').attr("value", _this.provinciaentidad);
                      $('#comunaselect').attr("value", _this.comuna);
                      $('#rutaselect').attr("value", _this.ruta);
                      $('#rutcliente').val(Singleton.get().formatearRut(des[0].Rut_Entidad));
                      $('#nombreconsignatario').attr("value", des[0].Nombre);
                      $('#regionesselect').attr("value", des[0].REGION_ID);
                      $('#provinciaselect').attr("value", des[0].PROVINCIA_ID);
                      $('#comunaselect').attr("value", des[0].COMUNA_ID);
                      $('#direccion').attr("value", des[0].Direccion);
                      $('#telefono').attr("value", des[0].Telefono);
                      $('#lat').attr("value", des[0].Latitud);
                      $('#long').attr("value", des[0].Longitud);
                      if (des[0].principal === '1') {
                        $(".ck").attr("checked", "checked");
                        $('#rutaselect').attr('disabled', true);
                        _this.auxprincipal = 1;
                      }
                      $('#telefono').keydown(function(event) {
                        if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

                        } else {
                          if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                            return event.preventDefault();
                          }
                        }
                      });
                      $('#guardarconsignatariou').click(function(e) {
                        return _this.guardarconsignatariou(e);
                      });
                      $('#guardarconsignatario').click(function(e) {
                        return _this.guardarconsignatario(e);
                      });
                      $('#cancelarconsignatariou').click(function(e) {
                        return _this.initialize();
                      });
                      $('#cancelarconsignatario').click(function(e) {
                        return _this.initialize();
                      });
                      $('#regionesselect').change(function(e) {
                        return _this.regiones(e);
                      });
                      $('#provinciaselect').change(function(e) {
                        return _this.provincia(e);
                      });
                      if (_this.main === "1") {
                        $(".ck").attr("checked", "checked");
                        $('.ck').attr('disabled', true);
                      }
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
                      return log = function(rut) {
                        return $('#rutcliente').val(Singleton.get().formatearRut(rut));
                      };
                    }
                  });
                }
              });
            };
          })(this)
        });
      };

      consignatarios.prototype.eliminar = function() {
        if (this.main === '1') {
          return Singleton.get().showError('No se pueden eliminar Destinos Principales');
        } else {
          Singleton.get().showAdvertencia('¿Está seguro que desea eliminar la entidad?');
          return $('#btnAceptarAdvertencia').click((function(_this) {
            return function(e) {
              return $.ajax({
                url: (base_url + "/index.php/services/destino/eliminar/id/") + _this.iddestino,
                type: 'GET',
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(c) {
                  Singleton.get().showExito('Destino eliminado correrctamente');
                  return $('#btnExito').click(function(e) {
                    return _this.initialize();
                  });
                },
                error: function(c) {
                  Singleton.get().showError('No se pudo eliminar el destino');
                  return $('#cancelarentidad').click(function(e) {
                    return _this.initialize();
                  });
                }
              });
            };
          })(this));
        }
      };

      consignatarios.prototype.regiones = function(e) {
        var option, reg;
        option = '<option value="0" selected="selected">Seleccione...</option>';
        reg = $('#regionesselect').find(':selected').val();
        return $.ajax({
          url: (base_url + "/index.php/services/destino/provincia/region/") + reg,
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(p) {
              var i, iterator, len, results;
              results = [];
              for (i = 0, len = p.length; i < len; i++) {
                iterator = p[i];
                option += '<option value="' + iterator.PROVINCIA_ID + '" selected="selected">' + iterator.PROVINCIA_NOMBRE + '</option>';
                $('#provinciaselect').html(option);
                $('#provinciaselect option[value=0]').attr('selected', true);
                $('#comunaselect').html(option);
                results.push($('#comunaselect option[value=0]').attr('selected', true));
              }
              return results;
            };
          })(this)
        });
      };

      consignatarios.prototype.provincia = function(e) {
        var option, pro;
        option = '<option value="0" selected="selected">Seleccione...</option>';
        pro = $('#provinciaselect').find(':selected').val();
        return $.ajax({
          url: (base_url + "/index.php/services/destino/comuna/provincia/") + pro,
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(p) {
              var i, iterator, len, results;
              results = [];
              for (i = 0, len = p.length; i < len; i++) {
                iterator = p[i];
                option += '<option value="' + iterator.COMUNA_ID + '" selected="selected">' + iterator.COMUNA_NOMBRE + '</option>';
                $('#comunaselect').html(option);
                $('#comunaselect option[value=0]').attr('selected', true);
                $('#comunaselect').html(option);
                results.push($('#comunaselect option[value=0]').attr('selected', true));
              }
              return results;
            };
          })(this)
        });
      };

      consignatarios.prototype.destino = function(e) {
        var rutentidad;
        rutentidad = "undefined";
        if ($('#rutcliente').val() !== "") {
          rutentidad = Singleton.get().cleanRut($('#rutcliente').val());
        }
        this.objData = {
          rut: rutentidad,
          start: this.paginador.start,
          end: '14'
        };
        return $.ajax({
          url: base_url + "/index.php/services/destino/contarRegistros",
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
              return $('#btnError').click(function(e) {
                return _this.initialize();
              });
            };
          })(this)
        });
      };

      consignatarios.prototype.cargar = function() {
        return $.ajax({
          url: base_url + "/index.php/services/destino",
          type: 'POST',
          data: this.objData,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(m) {
              $('#cargatabla').html(_.template(Tplresultadoconsignatario)({
                variable: m
              }));
              $('.1').addClass('alertaverde');
              $('.alertaverde').tooltip({
                'trigger': 'hover',
                'delay': {
                  'show': 100,
                  'hide': 100
                }
              });
              Singleton.get().hideLoading();
              $('#tablaBody tr').click(function(e) {
                return _this.clickTr(e);
              });
              $('#nuevoconsignatario').click(function(e) {
                return _this.nuevo(e);
              });
              $('#accionesconsignatarios').change(function(e) {
                return _this.destino();
              });
              return Singleton.get().hideLoading();
            };
          })(this),
          error: (function(_this) {
            return function(m) {
              Singleton.get().showError('No existe el filtro');
              return $('#btnError').click(function(e) {
                return _this.initialize();
              });
            };
          })(this)
        });
      };

      consignatarios.prototype.guardarconsignatariou = function(e) {
        var obj, principal;
        if ($(".ck").is(':checked')) {
          principal = 1;
        } else {
          principal = 0;
        }
        if ($('#nombreconsignatario').val() === "" || $('#rutcliente').val() === "") {
          return Singleton.get().showError('Ingrese Nombre y Rut del Consignatario ');
        } else {
          obj = {
            id: this.iddestino,
            rut: Singleton.get().cleanRut($('#rutcliente').val()),
            nombre: $('#nombreconsignatario').val(),
            region: $('#regionesselect').val(),
            provincia: $('#provinciaselect').val(),
            comuna: $('#comunaselect').val(),
            rutas: $('#rutaselect').val(),
            dir: $('#direccion').val(),
            telefono: $('#telefono').val(),
            long: $('#long').val(),
            lat: $('#lat').val(),
            principal: principal
          };
          return $.ajax({
            url: base_url + "/index.php/services/destino/guardardestinoprincipal",
            type: 'POST',
            data: obj,
            statusCode: {
              302: function() {
                return Singleton.get().reload();
              }
            },
            success: (function(_this) {
              return function(m) {
                if (m === 'false') {
                  if (_this.auxprincipal === 0) {
                    Singleton.get().showAdvertencia('El cliente ya tiene una ruta principal, Realmente desea cambiarla');
                  }
                  $('#btnAceptarAdvertencia').click(function(e) {
                    return $.ajax({
                      url: base_url + "/index.php/services/destino/guardardestinocambiou",
                      type: 'POST',
                      data: obj,
                      statusCode: {
                        302: function() {
                          return Singleton.get().reload();
                        }
                      },
                      success: function(g) {
                        Singleton.get().showExito('Destino actualizado correctamente', 'Exito');
                        $('#btnExito').click(function(e) {
                          return _this.initialize();
                        });
                        return $('#cancelarconsignatario').click(function(e) {
                          return _this.initialize();
                        });
                      },
                      error: function(g) {
                        Singleton.get().showError('No se pudo actualizar el Destino, verifique que sea principal', 'Error');
                        return $('#cancelarentidad').click(function(e) {
                          return _this.initialize();
                        });
                      }
                    });
                  });
                }
                if (m === 'true') {
                  return $.ajax({
                    url: base_url + "/index.php/services/destino/guardardestinou",
                    type: 'POST',
                    data: obj,
                    statusCode: {
                      302: function() {
                        return Singleton.get().reload();
                      }
                    },
                    success: function(g) {
                      Singleton.get().showExito('Destino actualizado correctamente', 'Exito');
                      $('#btnExito').click(function(e) {
                        return _this.initialize();
                      });
                      return $('#cancelarconsignatario').click(function(e) {
                        return _this.initialize();
                      });
                    },
                    error: function(g) {
                      Singleton.get().showError('No se pudo actualizar el Destino, verifique que sea principal', 'Error');
                      return $('#cancelarentidad').click(function(e) {
                        return _this.initialize();
                      });
                    }
                  });
                }
              };
            })(this),
            error: (function(_this) {
              return function(m) {
                Singleton.get().showError('No se pudo actualizar el Destino', 'Error');
                return $('#cancelarentidad').click(function(e) {
                  return _this.initialize();
                });
              };
            })(this)
          });
        }
      };

      consignatarios.prototype.guardarconsignatario = function(e) {
        var obj, principal;
        if ($(".ck").is(':checked')) {
          principal = 1;
        } else {
          principal = 0;
        }
        if ($('#nombreconsignatario').val() === "" || $('#rutcliente').val() === "") {
          return Singleton.get().showError('Ingrese Nombre y Rut del Consignatario ');
        } else {
          obj = {
            rut: Singleton.get().cleanRut($('#rutcliente').val()),
            nombre: $('#nombreconsignatario').val(),
            region: $('#regionesselect').val(),
            provincia: $('#provinciaselect').val(),
            comuna: $('#comunaselect').val(),
            rutas: $('#rutaselect').val(),
            dir: $('#direccion').val(),
            telefono: $('#telefono').val(),
            long: $('#long').val(),
            lat: $('#lat').val(),
            principal: principal
          };
          return $.ajax({
            url: base_url + "/index.php/services/destino/guardardestinoprincipal",
            type: 'POST',
            data: obj,
            statusCode: {
              302: function() {
                return Singleton.get().reload();
              }
            },
            success: (function(_this) {
              return function(m) {
                if (m === 'false') {
                  Singleton.get().showAdvertencia('El cliente ya tiene una ruta principal, Realmente desea cambiarla');
                  $('#btnAceptarAdvertencia').click(function(e) {
                    return $.ajax({
                      url: base_url + "/index.php/services/destino/guardardestinocambio",
                      type: 'POST',
                      data: obj,
                      statusCode: {
                        302: function() {
                          return Singleton.get().reload();
                        }
                      },
                      success: function(g) {
                        Singleton.get().showExito('Destino creado correctamente', 'Exito');
                        $('#btnExito').click(function(e) {
                          return _this.initialize();
                        });
                        return $('#cancelarconsignatario').click(function(e) {
                          return _this.initialize();
                        });
                      },
                      error: function(g) {
                        Singleton.get().showError('No se pudo crear el Destino', 'Error');
                        return $('#cancelarentidad').click(function(e) {
                          return _this.initialize();
                        });
                      }
                    });
                  });
                }
                if (m === 'true') {
                  return $.ajax({
                    url: base_url + "/index.php/services/destino/guardardestino",
                    type: 'POST',
                    data: obj,
                    statusCode: {
                      302: function() {
                        return Singleton.get().reload();
                      }
                    },
                    success: function(g) {
                      Singleton.get().showExito('Destino creado correctamente', 'Exito');
                      $('#btnExito').click(function(e) {
                        return _this.initialize();
                      });
                      return $('#cancelarconsignatario').click(function(e) {
                        return _this.initialize();
                      });
                    },
                    error: function(g) {
                      Singleton.get().showError('No se pudo crear el Destino', 'Error');
                      return $('#cancelarentidad').click(function(e) {
                        return _this.initialize();
                      });
                    }
                  });
                }
              };
            })(this),
            error: (function(_this) {
              return function(m) {
                Singleton.get().showError('No se pudo crear el Destino', 'Error');
                return $('#cancelarentidad').click(function(e) {
                  return _this.initialize();
                });
              };
            })(this)
          });
        }
      };

      return consignatarios;

    })(Backbone.View);
  });

}).call(this);
