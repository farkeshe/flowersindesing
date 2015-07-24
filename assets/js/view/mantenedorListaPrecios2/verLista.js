(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/mantenedorListaPrecios/verLista.html', 'text!tpl/mantenedorListaPrecios/editarLista.html', 'text!tpl/mantenedorListaPrecios/articulo.html', 'text!tpl/mantenedorListaPrecios/nuevaLista.html', 'text!tpl/mantenedorListaPrecios/clonarLista.html', 'text!tpl/mantenedorListaPrecios/estadoLista.html', 'text!tpl/mantenedorListaPrecios/resultados.html', 'assets/js/view/paginador'], function(Backbone, TplverLista, TpleditarLista, Tplarticulo, TplnuevaLista, TplclonarLista, TplestadoLista, Tplresultados, Paginador) {
    var verLista;
    return verLista = (function(superClass) {
      extend(verLista, superClass);

      function verLista() {
        this.eliminar = bind(this.eliminar, this);
        this.cancelarEstado = bind(this.cancelarEstado, this);
        this.guardarestado = bind(this.guardarestado, this);
        this.guardaArticulo = bind(this.guardaArticulo, this);
        this.guardaArticulonueva = bind(this.guardaArticulonueva, this);
        this.guardaArticuloeditar = bind(this.guardaArticuloeditar, this);
        this.articulonueva = bind(this.articulonueva, this);
        this.articuloeditar = bind(this.articuloeditar, this);
        this.articulo = bind(this.articulo, this);
        this.clickTr = bind(this.clickTr, this);
        this.cambiar = bind(this.cambiar, this);
        this.clonar = bind(this.clonar, this);
        this.editar = bind(this.editar, this);
        this.nueva = bind(this.nueva, this);
        this.filtrar = bind(this.filtrar, this);
        this.cargar = bind(this.cargar, this);
        this.init = bind(this.init, this);
        this.showExportarExcel = bind(this.showExportarExcel, this);
        this.precios = bind(this.precios, this);
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

      verLista.prototype.precios = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if ("nueva" === $('#accionesLista').find(':selected').val()) {
          this.nueva(e);
        }
        if ("editar" === $('#accionesLista').find(':selected').val()) {
          this.editar();
        }
        if ("clonar" === $('#accionesLista').find(':selected').val()) {
          this.clonar();
        }
        if ("cambiar" === $('#accionesLista').find(':selected').val()) {
          this.cambiar(e);
        }
        if ("exportar" === $('#accionesLista').find(':selected').val()) {
          this.showExportarExcel();
        }
        if ("eliminar" === $('#accionesLista').find(':selected').val()) {
          return this.eliminar(e);
        }
      };

      verLista.prototype.showExportarExcel = function() {
        $('#ExportarExcel').attr('action', 'index.php/services/exportar/exportarExcelListaPrecios');
        $("#ExportarExcel").submit();
        return false;
      };

      verLista.prototype.init = function() {
        Singleton.get().showLoading();
        return $.ajax({
          url: base_url + "/index.php/services/listaPrecios/subgerencia",
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(d) {
              $('#appView').html(_.template(TplverLista)({
                subgerencia: d
              }));
              $('.newTitulo').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                Singleton.get().showLoading();
                $('#appView').css('display', 'block');
                $('#appViewNext').empty();
                return Singleton.get().hideLoading();
              });
              _this.filtrar();
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
              $('#filtrarprecio').click(function(e) {
                Singleton.get().showLoading();
                return _this.filtrar();
              });
              $('#accionesLista').change(function(e) {
                return _this.precios(e);
              });
              $('#nuevalista').click(function(e) {
                return _this.nueva(e);
              });
              $('.botonExcel').click(function(e) {
                return _this.exportar(e);
              });
              if (window.innerWidth === 1280) {
                $('.scroll').css('width', window.innerWidth - 260);
                Singleton.get().hideLoading();
              } else {
                $('.scroll').css('width', window.innerWidth - 251);
              }
              $('.scroll').css('height', window.innerHeight - 75);
              $('#desde').datepicker({
                dateFormat: "yy-mm-dd",
                dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
              });
              $('#hasta').datepicker({
                dateFormat: "yy-mm-dd",
                dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
              });
              $('#next').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                Singleton.get().showLoading();
                return $.ajax({
                  url: base_url + "/index.php/services/listaPrecios/contarRegistros",
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
              });
              $('#previous').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                Singleton.get().showLoading();
                return $.ajax({
                  url: base_url + "/index.php/services/listaPrecios/contarRegistros",
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
                    return Singleton.get().showError('No hay datos filtrados');
                  }
                });
              });
              return false;
            };
          })(this)
        });
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

      verLista.prototype.nueva = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        return $.ajax({
          url: (base_url + "/index.php/services/listaPrecios/crearlistanueva/idSubgerenciaUsuarioLogueado/") + Singleton.get().idSubgerenciaUsuarioLogueado,
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(l) {
              Singleton.get().listaIdlistaclonada = l;
              _this.idlista = Singleton.get().listaIdlistaclonada;
              return $.ajax({
                url: (base_url + "/index.php/services/listaPrecios/productos/idlista/") + Singleton.get().listaIdlistaclonada,
                type: 'GET',
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(d) {
                  return $.ajax({
                    url: base_url + "/index.php/services/listaPrecios/subgerencia",
                    type: 'GET',
                    cache: true,
                    statusCode: {
                      302: function() {
                        return Singleton.get().reload();
                      }
                    },
                    success: function(s) {
                      return $.ajax({
                        url: (base_url + "/index.php/services/listaPrecios/guardarlistaclon/idclon/") + Singleton.get().listaIdlistaclonada + "/idlista/" + Singleton.get().listaIdlistaclonada,
                        type: 'GET',
                        statusCode: {
                          302: function() {
                            return Singleton.get().reload();
                          }
                        },
                        success: function(g) {
                          $('#appViewNext').html(_.template(TplnuevaLista)({
                            variable: d,
                            subgerencia: s
                          }));
                          $('.newTitulo').click(function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            Singleton.get().showLoading();
                            $('#appView').css('display', 'block');
                            $('#appViewNext').empty();
                            return Singleton.get().hideLoading();
                          });
                          _this.subgerencia = Singleton.get().idSubgerenciaUsuarioLogueado;
                          $('#subgerencianueva').attr("value", _this.subgerencia);
                          Singleton.get().hideLoading();
                          $('.alertaroja').tooltip({
                            'trigger': 'hover',
                            'delay': {
                              'show': 100,
                              'hide': 100
                            }
                          });
                          _this.idLista = Singleton.get().listaIdlistaclonada;
                          if (window.innerWidth === 1280) {
                            $('.scroll').css('width', window.innerWidth - 260);
                          } else {
                            $('.scroll').css('width', window.innerWidth - 251);
                          }
                          $('.scroll').css('height', window.innerHeight - 75);
                          $('#contenedorproductos table tbody tr').click(function(e) {
                            return _this.articulonueva(e);
                          });
                          $('#cancelar').click(function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            Singleton.get().showLoading();
                            $('#appView').css('display', 'block');
                            $('#appViewNext').empty();
                            return Singleton.get().hideLoading();
                          });
                          $('#guardarnueva').click(function(e) {
                            var datos;
                            _this.subgerencia = $('#subgerencianueva').val();
                            _this.nombrelista = $('#nombrelista').val();
                            _this.tipo = $('#tipolista').val();
                            console.log(_this.subgerencia);
                            console.log(_this.tipo);
                            console.log(_this.nombrelista);
                            console.log("nueva");
                            console.log(Singleton.get().listaIdlistaclonada);
                            if (_this.subgerencia !== "vacio" && _this.nombrelista !== "" && _this.tipo !== "vacio") {
                              datos = {
                                sub: _this.subgerencia,
                                nombre: _this.nombrelista,
                                tipo: _this.tipo,
                                id: Singleton.get().listaIdlistaclonada
                              };
                              return $.ajax({
                                url: base_url + "/index.php/services/listaPrecios/guardardatosproducto",
                                type: 'POST',
                                data: datos,
                                statusCode: {
                                  302: function() {
                                    return Singleton.get().reload();
                                  }
                                },
                                success: function(g) {
                                  return Singleton.get().showExito('Datos de la lista guardados correctamente', 'Exito');
                                },
                                error: function(g) {
                                  return Singleton.get().showError('No se pudo guardar los datos de la lista, verifique que no esten en blanco', 'Error');
                                }
                              });
                            } else {
                              return Singleton.get().showError('No se pudo guardar los datos de la lista, verifique que no esten en blanco', 'Error');
                            }
                          });
                          $('#appView').css('display', 'none');
                          Singleton.get().hideLoading();
                          return false;
                        }
                      });
                    }
                  });
                }
              });
            };
          })(this)
        });
      };

      verLista.prototype.editar = function() {
        if (this.estadoactual === "Histórica" || this.estadoactual === "Historica") {
          return Singleton.get().showInformacion('No se pueden editar listas históricas');
        } else {
          Singleton.get().showLoading();
          return $.ajax({
            url: (base_url + "/index.php/services/listaPrecios/productos/idlista/") + this.idLista,
            type: 'GET',
            statusCode: {
              302: function() {
                return Singleton.get().reload();
              }
            },
            success: (function(_this) {
              return function(d) {
                return $.ajax({
                  url: base_url + "/index.php/services/listaPrecios/subgerencia",
                  type: 'GET',
                  statusCode: {
                    302: function() {
                      return Singleton.get().reload();
                    }
                  },
                  success: function(s) {
                    $('#appViewNext').html(_.template(TpleditarLista)({
                      variable: d,
                      subgerencia: s
                    }));
                    $('.newTitulo').click(function(e) {
                      $('input[type=text]').removeAttr("disabled");
                      $('select').removeAttr("disabled");
                      e.preventDefault();
                      e.stopPropagation();
                      Singleton.get().showLoading();
                      $('#appView').css('display', 'block');
                      $('#appViewNext').empty();
                      return Singleton.get().hideLoading();
                    });
                    $('#subgerencianueva').attr("value", _this.subgerencia);
                    $('#tipolista').attr("value", _this.tipo);
                    $('#nombrelista').attr("value", _this.nombrelista);
                    if (_this.estadoactual === 'Activa') {
                      $('input[type=text]').attr('disabled', true);
                      $('select').attr('disabled', true);
                    }
                    $('.alertaroja').tooltip({
                      'trigger': 'hover',
                      'delay': {
                        'show': 100,
                        'hide': 100
                      }
                    });
                    $('#contenedorproductos table tbody tr').click(function(e) {
                      return _this.articuloeditar(e);
                    });
                    $('#cancelar').click(function(e) {
                      $('input[type=text]').removeAttr("disabled");
                      $('select').removeAttr("disabled");
                      e.preventDefault();
                      e.stopPropagation();
                      Singleton.get().showLoading();
                      $('#appView').css('display', 'block');
                      $('#appViewNext').empty();
                      return Singleton.get().hideLoading();
                    });
                    $('#guardareditar').click(function(e) {
                      var datos;
                      _this.subgerencia = $('#subgerencianueva').val();
                      _this.nombrelista = $('#nombrelista').val();
                      _this.tipo = $('#tipolista').val();
                      console.log(_this.subgerencia);
                      console.log(_this.nombrelista);
                      console.log(_this.tipo);
                      if (_this.subgerencia !== "vacio" && _this.nombrelista !== "" && _this.tipo !== "vacio") {
                        datos = {
                          sub: _this.subgerencia,
                          nombre: _this.nombrelista,
                          tipo: _this.tipo,
                          id: _this.idLista
                        };
                        return $.ajax({
                          url: base_url + "/index.php/services/listaPrecios/guardardatosproducto",
                          type: 'POST',
                          data: datos,
                          statusCode: {
                            302: function() {
                              return Singleton.get().reload();
                            }
                          },
                          success: function(g) {
                            return Singleton.get().showExito('Lista editada correctamente', 'Exito');
                          },
                          error: function(g) {
                            return Singleton.get().showError('No se pudo editar la lista', 'Error');
                          }
                        });
                      }
                    });
                    if (window.innerWidth === 1280) {
                      $('.scroll').css('width', window.innerWidth - 260);
                    } else {
                      $('.scroll').css('width', window.innerWidth - 251);
                    }
                    $('.scroll').css('height', window.innerHeight - 75);
                    return Singleton.get().hideLoading();
                  }
                }, $('#appView').css('display', 'none'), Singleton.get().hideLoading());
              };
            })(this)
          });
        }
      };

      verLista.prototype.clonar = function() {
        Singleton.get().showLoading();
        return $.ajax({
          url: (base_url + "/index.php/services/listaPrecios/crearlista/tipo/") + this.tipo + "/idsubgerencia/" + this.subgerencia + "/nombre/" + this.nombrelista,
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(e) {
              Singleton.get().listaIdlistaclonada = e;
              return $.ajax({
                url: (base_url + "/index.php/services/listaPrecios/productos/idlista/") + _this.idLista,
                type: 'GET',
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(d) {
                  return $.ajax({
                    url: base_url + "/index.php/services/listaPrecios/subgerencia",
                    type: 'GET',
                    statusCode: {
                      302: function() {
                        return Singleton.get().reload();
                      }
                    },
                    success: function(s) {
                      return $.ajax({
                        url: (base_url + "/index.php/services/listaPrecios/guardarlistaclon/idclon/") + Singleton.get().listaIdlistaclonada + "/idlista/" + _this.idLista,
                        type: 'GET',
                        statusCode: {
                          302: function() {
                            return Singleton.get().reload();
                          }
                        },
                        success: function(g) {
                          $('#appViewNext').html(_.template(TplclonarLista)({
                            variable: d,
                            subgerencia: s
                          }));
                          $('#subgerencianueva').attr("value", _this.subgerencia);
                          $('#tipolista').attr("value", _this.tipo);
                          $('#nombrelista').attr("value", _this.nombrelista);
                          $('.newTitulo').click(function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            Singleton.get().showLoading();
                            $('#appView').css('display', 'block');
                            $('#appViewNext').empty();
                            return Singleton.get().hideLoading();
                          });
                          $('.alertaroja').tooltip({
                            'trigger': 'hover',
                            'delay': {
                              'show': 100,
                              'hide': 100
                            }
                          });
                          Singleton.get().hideLoading();
                          $('#contenedorproductos table tbody tr').click(function(e) {
                            return _this.articulo(e);
                          });
                          $('#cancelar').click(function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            Singleton.get().showLoading();
                            $('#appView').css('display', 'block');
                            $('#appViewNext').empty();
                            return Singleton.get().hideLoading();
                          });
                          $('#guardarclonar').click(function(e) {
                            var datos;
                            _this.subgerencia = $('#subgerencianueva').val();
                            _this.nombrelista = $('#nombrelista').val();
                            _this.tipo = $('#tipolista').val();
                            console.log(_this.subgerencia);
                            console.log(_this.nombrelista);
                            console.log(_this.tipo);
                            if (_this.subgerencia !== "vacio" && _this.nombrelista !== "" && _this.tipo !== "vacio") {
                              datos = {
                                sub: _this.subgerencia,
                                nombre: _this.nombrelista,
                                tipo: _this.tipo,
                                id: Singleton.get().listaIdlistaclonada
                              };
                              return $.ajax({
                                url: base_url + "/index.php/services/listaPrecios/guardardatosproducto",
                                type: 'POST',
                                data: datos,
                                statusCode: {
                                  302: function() {
                                    return Singleton.get().reload();
                                  }
                                },
                                success: function(g) {
                                  return Singleton.get().showExito('Lista clonada correctamente', 'Exito');
                                },
                                error: function(g) {
                                  return Singleton.get().showError('No se pudo clonar la lista', 'Error');
                                }
                              });
                            }
                          });
                          if (window.innerWidth === 1280) {
                            $('.scroll').css('width', window.innerWidth - 260);
                          } else {
                            $('.scroll').css('width', window.innerWidth - 251);
                          }
                          $('.scroll').css('height', window.innerHeight - 75);
                          return Singleton.get().hideLoading();
                        }
                      }, $('#appView').css('display', 'none'), Singleton.get().hideLoading());
                    }
                  });
                }
              });
            };
          })(this)
        });
      };

      verLista.prototype.cambiar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return $.ajax({
          url: (base_url + "/index.php/services/listaPrecios/productos/idlista/") + this.idLista,
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(res) {
              var aux, d, j, len;
              for (j = 0, len = res.length; j < len; j++) {
                d = res[j];
                if (d.cantidad === "alertaroja") {
                  aux = "a";
                }
              }
              if (aux === "a") {
                return Singleton.get().showError('No se puede cambiar el estado de la lista, contiene artículos sin precio');
              } else {
                if (_this.estadoactual === 'Activa' || _this.estadoactual === 'Histórica') {
                  return Singleton.get().showError('No se puede cambiar el estado de la lista seleccionada');
                } else {
                  return $.ajax({
                    url: base_url + "/index.php/services/listaPrecios/subgerencia",
                    type: 'GET',
                    statusCode: {
                      302: function() {
                        return Singleton.get().reload();
                      }
                    },
                    success: function(d) {
                      if (typeof txt !== "undefined" && txt !== null) {
                        $(".nueva").attr("checked", "checked");
                        $(".td-radio:checkbox:not(:checked)").attr("checked", "checked");
                        $('#modal-estado').html(_.template(TplestadoLista)({
                          variable: d
                        }));
                        $('#guardarestado').click(function(e) {
                          return _this.guardarestado(e);
                        });
                      } else {
                        $(".nueva").attr("checked", "checked");
                        $(".td-radio:checkbox:not(:checked)").attr("checked", "checked");
                        $('#modal-estado').html(_.template(TplestadoLista)({
                          variable: d
                        }));
                        $('#image_confirmacion').attr("src", base_url + "/assets/img/img_confirmacion.png");
                        $('#modal-estado').modal('show');
                        $('#guardarestado').click(function(e) {
                          return _this.guardarestado(e);
                        });
                      }
                      return false;
                    }
                  });
                }
              }
            };
          })(this)
        });
      };

      verLista.prototype.clickTr = function(e) {
        var html;
        e.preventDefault();
        e.stopPropagation();
        this.idLista = e.currentTarget.attributes[0].value;
        this.subgerencia = e.currentTarget.cells[0].id;
        this.nombrelista = e.currentTarget.cells[1].id;
        this.tipo = e.currentTarget.cells[2].id;
        this.estadoactual = e.currentTarget.cells[3].id;
        Singleton.get().listaIdlistaeditar = this.idLista;
        html = html + "<option value=\"accion\">Acciones</option>" + " <option value=\"exportar\">Exportar Excel</option>" + "<option value=\"editar\">Editar</option>" + "<option value=\"clonar\">Clonar</option>" + "<option value=\"cambiar\">Cambiar Estado</option>" + "<option value=\"eliminar\">Eliminar</option>";
        $('#accionesLista').html(html);
        $(e.currentTarget).addClass('active');
        $(e.currentTarget).siblings().removeClass('active');
        return $('#accionesLista').change((function(_this) {
          return function(e) {
            return _this.precios(e);
          };
        })(this));
      };

      verLista.prototype.articulo = function(e) {
        var idproducto;
        e.preventDefault();
        e.stopPropagation();
        idproducto = e.currentTarget.attributes[0].value;
        Singleton.get().listaIdproducto = idproducto;
        $(e.currentTarget).addClass('active');
        $(e.currentTarget).siblings().removeClass('active');
        return $.ajax({
          url: (base_url + "/index.php/services/listaPrecios/cuentaarticulos/idlista/") + Singleton.get().listaIdlistaclonada + "/idproducto/" + idproducto,
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(count) {
              _this.contadorclonar = count[0].Cantidad_Total;
              return $.ajax({
                url: (base_url + "/index.php/services/listaPrecios/articulos/idlista/") + Singleton.get().listaIdlistaclonada + "/idproducto/" + idproducto,
                type: 'GET',
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(d) {
                  if (typeof txt !== "undefined" && txt !== null) {
                    $('#modal-art').html(_.template(Tplarticulo)({
                      producto: idproducto,
                      variable: d
                    }));
                    $(".0").addClass('articulocero');
                    $(".0").addClass('articulocero');
                    $(document).on("keyup", ".bout", function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      $('#' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).val(Singleton.get().formatMiles(e.currentTarget.value));
                      return false;
                    });
                    $(document).on("focusout", ".bout", function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      return $('#' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).val(Singleton.get().formatMiles(e.currentTarget.value));
                    });
                    $('#0').focusout(function(e) {
                      return $("." + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).removeClass('articulocero');
                    });
                    return $('#guardararticulo').click(function(e) {
                      return _this.guardaArticulo(e);
                    });
                  } else {
                    $('#modal-art').html(_.template(Tplarticulo)({
                      producto: idproducto,
                      variable: d
                    }));
                    $(".0").addClass('articulocero');
                    $(document).on("focusout", ".bout", function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      $('.' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).attr("value", Singleton.get().formatMiles(e.currentTarget.value));
                      if (e.currentTarget.value !== '0') {
                        return $('.' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).removeClass('articulocero');
                      } else {
                        return $('.' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).addClass('articulocero');
                      }
                    });
                    $('#guardararticulo').click(function(e) {
                      return _this.guardaArticulo(e);
                    });
                    $('#image_confirmacion').attr("src", base_url + "/assets/img/img_confirmacion.png");
                    return $('#modal-art').modal('show');
                  }
                },
                error: function(d) {
                  Singleton.get().hideLoading();
                  return Singleton.get().showInformacion('El producto seleccionado no contiene artículos asociados', 'Error');
                }
              });
            };
          })(this)
        });
      };

      verLista.prototype.articuloeditar = function(e) {
        var idproducto;
        e.preventDefault();
        e.stopPropagation();
        idproducto = e.currentTarget.attributes[0].value;
        Singleton.get().listaIdproducto = idproducto;
        Singleton.get().listaIdlistaeditar = this.idlista;
        $(e.currentTarget).addClass('active');
        $(e.currentTarget).siblings().removeClass('active');
        return $.ajax({
          url: (base_url + "/index.php/services/listaPrecios/cuentaarticulos/idlista/") + this.idLista + "/idproducto/" + idproducto,
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(count) {
              _this.contadoreditar = count[0].Cantidad_Total;
              return $.ajax({
                url: (base_url + "/index.php/services/listaPrecios/articulos/idlista/") + _this.idLista + "/idproducto/" + idproducto,
                type: 'GET',
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(d) {
                  if (typeof txt !== "undefined" && txt !== null) {
                    $('#modal-art').html(_.template(Tplarticulo)({
                      producto: idproducto,
                      variable: d
                    }));
                    $(".0").addClass('articulocero');
                    $(".0").addClass('articulocero');
                    $(document).on("keyup", ".bout", function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      $('#' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).val(Singleton.get().formatMiles(e.currentTarget.value));
                      return false;
                    });
                    $(document).on("focusout", ".bout", function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      return $('#' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).val(Singleton.get().formatMiles(e.currentTarget.value));
                    });
                    $('#0').focusout(function(e) {
                      return $("." + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).removeClass('articulocero');
                    });
                    return $('#guardararticulo').click(function(e) {
                      return _this.guardaArticuloeditar(e, _this.idLista);
                    });
                  } else {
                    $('#modal-art').html(_.template(Tplarticulo)({
                      producto: idproducto,
                      variable: d
                    }));
                    $(".0").addClass('articulocero');
                    $(document).on("focusout", ".bout", function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      $('.' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).attr("value", Singleton.get().formatMiles(e.currentTarget.value));
                      if (e.currentTarget.value !== '0') {
                        return $('.' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).removeClass('articulocero');
                      } else {
                        return $('.' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).addClass('articulocero');
                      }
                    });
                    $('#guardararticulo').click(function(e) {
                      return _this.guardaArticuloeditar(e, _this.idLista);
                    });
                    $('#image_confirmacion').attr("src", base_url + "/assets/img/img_confirmacion.png");
                    return $('#modal-art').modal('show');
                  }
                },
                error: function(d) {
                  Singleton.get().hideLoading();
                  return Singleton.get().showInformacion('El producto seleccionado no contiene artículos asociados', 'Error');
                }
              });
            };
          })(this)
        });
      };

      verLista.prototype.articulonueva = function(e) {
        var idproducto;
        e.preventDefault();
        e.stopPropagation();
        idproducto = e.currentTarget.attributes[0].value;
        Singleton.get().listaIdproducto = idproducto;
        Singleton.get().listaIdlistaeditar = this.idlista;
        $(e.currentTarget).addClass('active');
        $(e.currentTarget).siblings().removeClass('active');
        return $.ajax({
          url: (base_url + "/index.php/services/listaPrecios/cuentaarticulos/idlista/") + this.idLista + "/idproducto/" + idproducto,
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(count) {
              _this.contadornueva = count[0].Cantidad_Total;
              return $.ajax({
                url: (base_url + "/index.php/services/listaPrecios/articulos/idlista/") + _this.idLista + "/idproducto/" + idproducto,
                type: 'GET',
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(d) {
                  if (typeof txt !== "undefined" && txt !== null) {
                    $('#modal-art').html(_.template(Tplarticulo)({
                      producto: idproducto,
                      variable: d
                    }));
                    $(".0").addClass('articulocero');
                    $(".0").addClass('articulocero');
                    $(document).on("keyup", ".bout", function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      $('#' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).val(Singleton.get().formatMiles(e.currentTarget.value));
                      return false;
                    });
                    $(document).on("focusout", ".bout", function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      return $('#' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).val(Singleton.get().formatMiles(e.currentTarget.value));
                    });
                    $('#0').focusout(function(e) {
                      return $("." + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).removeClass('articulocero');
                    });
                    return $('#guardararticulo').click(function(e) {
                      return _this.guardaArticulonueva(e, _this.idLista);
                    });
                  } else {
                    $('#modal-art').html(_.template(Tplarticulo)({
                      producto: idproducto,
                      variable: d
                    }));
                    $(".0").addClass('articulocero');
                    $(document).on("focusout", ".bout", function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      $('.' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).attr("value", Singleton.get().formatMiles(e.currentTarget.value));
                      if (e.currentTarget.value !== '0') {
                        return $('.' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).removeClass('articulocero');
                      } else {
                        return $('.' + e.currentTarget.parentNode.parentNode.className.split(" ")[2]).addClass('articulocero');
                      }
                    });
                    $('#guardararticulo').click(function(e) {
                      return _this.guardaArticulonueva(e, _this.idLista);
                    });
                    $('#image_confirmacion').attr("src", base_url + "/assets/img/img_confirmacion.png");
                    return $('#modal-art').modal('show');
                  }
                },
                error: function(d) {
                  Singleton.get().hideLoading();
                  return Singleton.get().showInformacion('El producto seleccionado no contiene artículos asociados', 'Error');
                }
              });
            };
          })(this)
        });
      };

      verLista.prototype.guardaArticuloeditar = function(e, idlist) {
        var aux;
        $('#modal-art').modal('hide');
        Singleton.get().showLoading();
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().contadorListaPrecio = 0;
        Singleton.get().contadorExitoListaPrecio = 0;
        Singleton.get().contadorListaPrecio = this.contadoreditar;
        $("#tablaarticulos tbody tr").each(function(index) {
          var aux;
          aux = aux + 1;
          $(this).find("td").eq(9).find("input").each((function(_this) {
            return function(l, m) {
              return Singleton.get().listaIdarticulo = $(m).val();
            };
          })(this));
          $(this).find("td").eq(0).find("input").each((function(_this) {
            return function(l, m) {
              return Singleton.get().listaIdasociacion = $(m).val();
            };
          })(this));
          $(this).find("td").eq(7).find("input").each((function(_this) {
            return function(l, m) {
              return Singleton.get().listaPrecio = Singleton.get().cleanValor($(m).val());
            };
          })(this));
          return $(this).find("td").eq(8).find("input").each((function(_this) {
            return function(l, m) {
              Singleton.get().valorantiguolista = Singleton.get().cleanValor($(m).val());
              if (Singleton.get().listaPrecio !== Singleton.get().valorantiguolista) {
                return $.ajax({
                  url: base_url + "/index.php/services/listaPrecios/preciosarticulo",
                  type: 'POST',
                  async: true,
                  data: {
                    idLista: idlist,
                    idasosiacion: Singleton.get().listaIdasociacion,
                    precio: Singleton.get().listaPrecio,
                    idproducto: Singleton.get().listaIdproducto,
                    idarticulo: Singleton.get().listaIdarticulo
                  },
                  statusCode: {
                    302: function() {
                      return Singleton.get().reload();
                    }
                  },
                  success: function(result) {
                    var validator, xx, yy;
                    Singleton.get().contadorExitoListaPrecio++;
                    xx = Number((Singleton.get().contadorExitoListaPrecio));
                    yy = Number((Singleton.get().contadorListaPrecio));
                    if (xx === yy) {
                      Singleton.get().mi = true;
                    }
                    if (result !== 'true') {
                      return validator = false;
                    }
                  },
                  error: function(result) {
                    var validator;
                    return validator = false;
                  }
                });
              }
            };
          })(this));
        });
        if ((aux = this.contadoreditar)) {
          $('#modal-art').modal('hide');
          Singleton.get().hideLoading;
          $('#contenedorproductos table tbody tr td').removeClass('alertaroja');
          $('#contenedorproductos table tbody tr td').removeClass('no');
          return $.ajax({
            url: (base_url + "/index.php/services/listaPrecios/productos/idlista/") + idlist,
            type: 'GET',
            statusCode: {
              302: function() {
                return Singleton.get().reload();
              }
            },
            success: (function(_this) {
              return function(d) {
                return $.ajax({
                  url: base_url + "/index.php/services/listaPrecios/subgerencia",
                  type: 'GET',
                  statusCode: {
                    302: function() {
                      return Singleton.get().reload();
                    }
                  },
                  success: function(s) {
                    $('#appViewNext').html(_.template(TpleditarLista)({
                      variable: d,
                      subgerencia: s
                    }));
                    $('#subgerencia').attr("value", _this.subgerencia);
                    $('#tipolista').attr("value", _this.tipo);
                    $('#nombrelista').attr("value", _this.nombrelista);
                    $('.newTitulo').click(function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      Singleton.get().showLoading();
                      $('#appView').css('display', 'block');
                      $('#appViewNext').empty();
                      return Singleton.get().hideLoading();
                    });
                    $('#contenedorproductos table tbody tr').click(function(e) {
                      return _this.articuloeditar(e);
                    });
                    $('#cancelar').click(function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      Singleton.get().showLoading();
                      $('#appView').css('display', 'block');
                      $('#appViewNext').empty();
                      return Singleton.get().hideLoading();
                    });
                    $('#guardareditar').click(function(e) {
                      var datos;
                      console.log("asdasdadsasdassda");
                      _this.subgerencia = $('#subgerencianueva').val();
                      _this.nombrelista = $('#nombrelista').val();
                      _this.tipo = $('#tipolista').val();
                      if (_this.subgerencia !== "vacio" && _this.nombrelista !== "" && _this.tipo !== "vacio") {
                        datos = {
                          sub: _this.subgerencia,
                          nombre: _this.nombrelista,
                          tipo: _this.tipo,
                          id: Singleton.get().listaIdlistaclonada
                        };
                        return $.ajax({
                          url: base_url + "/index.php/services/listaPrecios/guardardatosproducto",
                          type: 'POST',
                          data: datos,
                          statusCode: {
                            302: function() {
                              return Singleton.get().reload();
                            }
                          },
                          success: function(g) {
                            return Singleton.get().showExito('Lista editada correctamente', 'Exito');
                          },
                          error: function(g) {
                            return Singleton.get().showError('No se pudo editar la lista', 'Error');
                          }
                        });
                      }
                    });
                    if (_this.estadoactual === 'Activa') {
                      $('input[type=text]').attr('disabled', true);
                      $('select').attr('disabled', true);
                    }
                    $('.alertaroja').tooltip({
                      'trigger': 'hover',
                      'delay': {
                        'show': 100,
                        'hide': 100
                      }
                    });
                    if (window.innerWidth === 1280) {
                      $('.scroll').css('width', window.innerWidth - 260);
                    } else {
                      $('.scroll').css('width', window.innerWidth - 251);
                    }
                    $('.scroll').css('height', window.innerHeight - 75);
                    return Singleton.get().hideLoading();
                  }
                }, Singleton.get().hideLoading());
              };
            })(this)
          });
        }
      };

      verLista.prototype.guardaArticulonueva = function(e, idlist) {
        var aux;
        $('#modal-art').modal('hide');
        Singleton.get().showLoading();
        e.preventDefault();
        e.stopPropagation();
        aux = 0;
        $("#tablaarticulos tbody tr").each(function(index) {
          aux = aux + 1;
          $(this).find("td").eq(9).find("input").each((function(_this) {
            return function(l, m) {
              return Singleton.get().listaIdarticulo = $(m).val();
            };
          })(this));
          $(this).find("td").eq(0).find("input").each((function(_this) {
            return function(l, m) {
              return Singleton.get().listaIdasociacion = $(m).val();
            };
          })(this));
          $(this).find("td").eq(7).find("input").each((function(_this) {
            return function(l, m) {
              return Singleton.get().listaPrecio = Singleton.get().cleanValor($(m).val());
            };
          })(this));
          return $(this).find("td").eq(8).find("input").each((function(_this) {
            return function(l, m) {
              Singleton.get().valorantiguolista = Singleton.get().cleanValor($(m).val());
              if (Singleton.get().listaPrecio !== Singleton.get().valorantiguolista) {
                return $.ajax({
                  url: base_url + "/index.php/services/listaPrecios/preciosarticulo",
                  type: 'POST',
                  async: true,
                  data: {
                    idLista: idlist,
                    idasosiacion: Singleton.get().listaIdasociacion,
                    precio: Singleton.get().listaPrecio,
                    idproducto: Singleton.get().listaIdproducto,
                    idarticulo: Singleton.get().listaIdarticulo
                  },
                  success: function(result) {},
                  error: function(result) {}
                });
              }
            };
          })(this));
        });
        if ((aux = this.contadornueva)) {
          $('#modal-art').modal('hide');
          Singleton.get().showLoading();
          $('#contenedorproductos table tbody tr td').removeClass('alertaroja');
          $('#contenedorproductos table tbody tr td').removeClass('no');
          return $.ajax({
            url: (base_url + "/index.php/services/listaPrecios/productos/idlista/") + idlist,
            type: 'GET',
            success: (function(_this) {
              return function(d) {
                return $.ajax({
                  url: base_url + "/index.php/services/listaPrecios/subgerencia",
                  type: 'GET',
                  success: function(s) {
                    Singleton.get().hideLoading();
                    $('#appViewNext').html(_.template(TplnuevaLista)({
                      variable: d,
                      subgerencia: s
                    }));
                    $('#subgerencianueva').attr("value", _this.subgerencia);
                    $('#tipolista').attr("value", _this.tipo);
                    $('#nombrelista').attr("value", _this.nombrelista);
                    $('.newTitulo').click(function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      Singleton.get().showLoading();
                      $('#appView').css('display', 'block');
                      $('#appViewNext').empty();
                      return Singleton.get().hideLoading();
                    });
                    $('#contenedorproductos table tbody tr').click(function(e) {
                      return _this.articulonueva(e);
                    });
                    $('#cancelar').click(function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      Singleton.get().showLoading();
                      $('#appView').css('display', 'block');
                      $('#appViewNext').empty();
                      return Singleton.get().hideLoading();
                    });
                    $('#guardarnueva').click(function(e) {
                      var datos;
                      _this.subgerencia = $('#subgerencianueva').val();
                      _this.nombrelista = $('#nombrelista').val();
                      _this.tipo = $('#tipolista').val();
                      console.log(_this.subgerencia);
                      console.log(_this.tipo);
                      console.log(_this.nombrelista);
                      console.log("IDLISTA");
                      console.log(Singleton.get().listaIdlistaclonada);
                      if (_this.subgerencia !== "vacio" && _this.nombrelista !== "" && _this.tipo !== "vacio") {
                        datos = {
                          sub: _this.subgerencia,
                          nombre: _this.nombrelista,
                          tipo: _this.tipo,
                          id: Singleton.get().listaIdlistaclonada
                        };
                        return $.ajax({
                          url: base_url + "/index.php/services/listaPrecios/guardardatosproducto",
                          type: 'POST',
                          data: datos,
                          success: function(g) {
                            return Singleton.get().showExito('Lista editada correctamente', 'Exito');
                          },
                          error: function(g) {
                            return Singleton.get().showError('No se pudo editar la lista', 'Error');
                          }
                        });
                      }
                    });
                    if (_this.estadoactual === 'Activa') {
                      $('input[type=text]').attr('disabled', true);
                      $('select').attr('disabled', true);
                    }
                    $('.alertaroja').tooltip({
                      'trigger': 'hover',
                      'delay': {
                        'show': 100,
                        'hide': 100
                      }
                    });
                    if (window.innerWidth === 1280) {
                      $('.scroll').css('width', window.innerWidth - 260);
                    } else {
                      $('.scroll').css('width', window.innerWidth - 251);
                    }
                    return $('.scroll').css('height', window.innerHeight - 75);
                  }
                });
              };
            })(this)
          });
        }
      };

      verLista.prototype.guardaArticulo = function(e) {
        var aux;
        $('#modal-art').modal('hide');
        Singleton.get().showLoading();
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading;
        $("#tablaarticulos tbody tr").each(function() {
          var aux;
          aux = aux + 1;
          $(this).find("td").eq(9).find("input").each((function(_this) {
            return function(l, m) {
              return Singleton.get().listaIdarticulo = $(m).val();
            };
          })(this));
          $(this).find("td").eq(0).find("input").each((function(_this) {
            return function(l, m) {
              return Singleton.get().listaIdasociacion = $(m).val();
            };
          })(this));
          $(this).find("td").eq(7).find("input").each((function(_this) {
            return function(l, m) {
              return Singleton.get().listaPrecio = Singleton.get().cleanValor($(m).val());
            };
          })(this));
          return $(this).find("td").eq(8).find("input").each((function(_this) {
            return function(l, m) {
              Singleton.get().valorantiguolista = Singleton.get().cleanValor($(m).val());
              if (Singleton.get().listaPrecio !== Singleton.get().valorantiguolista) {
                return $.ajax({
                  url: base_url + "/index.php/services/listaPrecios/preciosarticulo",
                  type: 'POST',
                  data: {
                    idLista: Singleton.get().listaIdlistaclonada,
                    idasosiacion: Singleton.get().listaIdasociacion,
                    precio: Singleton.get().listaPrecio,
                    idproducto: Singleton.get().listaIdproducto,
                    idarticulo: Singleton.get().listaIdarticulo
                  },
                  success: function(result) {},
                  error: function(result) {}
                });
              }
            };
          })(this));
        });
        if ((aux = this.contadorclonar)) {
          $('#modal-art').modal('hide');
          Singleton.get().showLoading;
          $('#contenedorproductos table tbody tr td').removeClass('alertaroja');
          $('#contenedorproductos table tbody tr td').removeClass('no');
          return $.ajax({
            url: (base_url + "/index.php/services/listaPrecios/productos/idlista/") + Singleton.get().listaIdlistaclonada,
            type: 'GET',
            success: (function(_this) {
              return function(d) {
                return $.ajax({
                  url: base_url + "/index.php/services/listaPrecios/subgerencia",
                  type: 'GET',
                  success: function(s) {
                    $('#appViewNext').html(_.template(TplclonarLista)({
                      variable: d,
                      subgerencia: s
                    }));
                    $('#subgerencianueva').attr("value", _this.subgerencia);
                    $('#tipolista').attr("value", _this.tipo);
                    $('#nombrelista').attr("value", _this.nombrelista);
                    $('.newTitulo').click(function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      Singleton.get().showLoading();
                      $('#appView').css('display', 'block');
                      $('#appViewNext').empty();
                      return Singleton.get().hideLoading();
                    });
                    $('#contenedorproductos table tbody tr').click(function(e) {
                      return _this.articulo(e);
                    });
                    $('#cancelar').click(function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      Singleton.get().showLoading();
                      $('#appView').css('display', 'block');
                      $('#appViewNext').empty();
                      return Singleton.get().hideLoading();
                    });
                    $('#guardarclonar').click(function(e) {
                      var datos;
                      _this.subgerencia = $('#subgerencianueva').val();
                      _this.nombrelista = $('#nombrelista').val();
                      _this.tipo = $('#tipolista').val();
                      if (_this.subgerencia !== "vacio" && _this.nombrelista !== "" && _this.tipo !== "vacio") {
                        datos = {
                          sub: _this.subgerencia,
                          nombre: _this.nombrelista,
                          tipo: _this.tipo,
                          id: Singleton.get().listaIdlistaclonada
                        };
                        return $.ajax({
                          url: base_url + "/index.php/services/listaPrecios/guardardatosproducto",
                          type: 'POST',
                          data: datos,
                          success: function(g) {
                            return Singleton.get().showExito('Lista editada correctamente', 'Exito');
                          },
                          error: function(g) {
                            return Singleton.get().showError('No se pudo editar la lista', 'Error');
                          }
                        });
                      }
                    });
                    if (_this.estadoactual === 'Activa') {
                      $('input[type=text]').attr('disabled', true);
                      $('select').attr('disabled', true);
                    }
                    $('.alertaroja').tooltip({
                      'trigger': 'hover',
                      'delay': {
                        'show': 100,
                        'hide': 100
                      }
                    });
                    if (window.innerWidth === 1280) {
                      $('.scroll').css('width', window.innerWidth - 260);
                    } else {
                      $('.scroll').css('width', window.innerWidth - 251);
                    }
                    $('.scroll').css('height', window.innerHeight - 75);
                    return Singleton.get().hideLoading();
                  }
                }, Singleton.get().hideLoading());
              };
            })(this)
          });
        }
      };

      verLista.prototype.guardarestado = function(e) {
        var estadoLista, i;
        Singleton.get().showLoading();
        e.preventDefault();
        e.stopPropagation();
        i = 0;
        if ($("#nueva").is(':checked')) {
          estadoLista = 'Activa';
          $('#modal-estado').modal('hide');
          return $.ajax({
            url: (base_url + "/index.php/services/listaPrecios/cambiarEstado/id/") + this.idLista + "/estadoproducto/" + estadoLista + "/tipo/" + this.tipo + "/subgerencia/" + this.subgerencia + "/estadoactual/" + this.estadoactual,
            type: 'GET',
            success: (function(_this) {
              return function(result) {
                Singleton.get().showExito('Estado cambiado correctamente', 'Exito');
                return $('#btnExito').click(function(e) {
                  return _this.filtrar();
                });
              };
            })(this),
            error: function(result) {
              Singleton.get().hideLoading();
              return Singleton.get().showError('No se pudo cambiar el estado', 'Error');
            }
          });
        } else {
          return Singleton.get().showError('No se pudo cambiar el estado', 'Error');
        }
      };

      verLista.prototype.cancelarEstado = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return $("#accionesLista ").val($("#accionesLista  option:first").val());
      };

      verLista.prototype.eliminar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showAdvertencia('¿Está seguro de eliminar la lista?');
        if (this.estadoactual === "Histórica" || this.estadoactual === "Activa") {
          Singleton.get().showError('No se pueden eliminar la lista seleccionada', 'Error');
          return $("#accionesLista ").val($("#accionesLista  option:first").val());
        } else {
          $("#accionesLista ").val($("#accionesLista  option:first").val());
          $.ajax({
            url: (base_url + "/index.php/services/listaPrecios/eliminarLista/id/") + this.idLista,
            type: 'DELETE',
            success: (function(_this) {
              return function(result) {
                Singleton.get().showExito('Lista borrada correctamente', 'Exito');
                return $('#btnExito').click(function(e) {
                  return _this.filtrar();
                });
              };
            })(this),
            error: (function(_this) {
              return function(result) {
                Singleton.get().showError('La lista no pudo ser borrada', 'Error');
                return $('#btnExito').click(function(e) {
                  return _this.filtrar();
                });
              };
            })(this)
          });
          return false;
        }
      };

      return verLista;

    })(Backbone.View);
  });

}).call(this);
