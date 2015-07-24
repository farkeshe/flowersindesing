(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/mantenedorListaPrecios/productosLista.html', 'text!tpl/mantenedorListaPrecios/listaprecios.html', 'text!tpl/mantenedorListaPrecios/resultados.html', 'text!tpl/mantenedorListaPrecios/editar.html', 'text!tpl/mantenedorListaPrecios/nuevo.html', 'text!tpl/mantenedorListaPrecios/listahistorica.html', 'assets/js/view/paginador', 'assets/js/model/lista_precio', 'assets/js/model/producto'], function(Backbone, TplproductosLista, TplListasPrecios, Tplresultados, Tpleditar, Tplnuevo, Tplhistorica, Paginador, ListaPrecio, ProductoModel) {
    var listaprecios;
    return listaprecios = (function(superClass) {
      extend(listaprecios, superClass);

      function listaprecios() {
        this.volveriteminicial = bind(this.volveriteminicial, this);
        this.cancelar = bind(this.cancelar, this);
        this.cargarProductosListaEnMemoria = bind(this.cargarProductosListaEnMemoria, this);
        this.cargarProductosEnMemoriahistorico = bind(this.cargarProductosEnMemoriahistorico, this);
        this.cargarProductosEnMemoria2 = bind(this.cargarProductosEnMemoria2, this);
        this.cargarProductosEnMemoria = bind(this.cargarProductosEnMemoria, this);
        this.cargarCategoriasEnMemoria = bind(this.cargarCategoriasEnMemoria, this);
        this.eliminar = bind(this.eliminar, this);
        this.nuevalista = bind(this.nuevalista, this);
        this.acciones = bind(this.acciones, this);
        this.clickTr = bind(this.clickTr, this);
        this.cargar = bind(this.cargar, this);
        this.filtrar = bind(this.filtrar, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return listaprecios.__super__.constructor.apply(this, arguments);
      }

      listaprecios.prototype.el = 'body';

      listaprecios.prototype.initialize = function() {
        this.paginador = new Paginador();
        this.lista_precio = new ListaPrecio();
        this.objData = {
          nombre: "",
          Id_ListaPrecio: "",
          start: this.paginador.start,
          end: '14'
        };
        return this.init();
      };

      listaprecios.prototype.init = function() {
        Singleton.get().showLoading();
        $('#appView').html(_.template(TplListasPrecios)({}));
        $('.scroll').css('height', window.innerHeight - 75);
        this.filtrar();
        Singleton.get().hideLoading();
        $('#nuevalista').tooltip({
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
        $('#filtrar').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('#nuevalista').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.nuevalista(e);
          };
        })(this));
        $('#filtrar').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.filtrar();
          };
        })(this));
        return $("#filtrolista").autocomplete({
          source: function(request, response) {
            return $.ajax({
              url: base_url + "/index.php/services/listaPrecios/milista",
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
                    value: item.Nombre
                  };
                }));
              },
              error: function(data) {
                $('#filtrolista').removeClass("ui-autocomplete-loading");
                return $('#filtrolista').autocomplete("close");
              }
            });
          },
          minLength: 1,
          open: function() {
            return $('#filtrolista').removeClass("ui-autocomplete-loading");
          },
          close: function() {
            return $('#filtrolista').removeClass("ui-autocomplete-loading");
          }
        });
      };

      listaprecios.prototype.filtrar = function() {
        Singleton.get().showLoading();
        this.objData = {
          nombre: $('#filtrolista').val(),
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
              return Singleton.get().showError('No existe el filtro');
            };
          })(this)
        });
      };

      listaprecios.prototype.cargar = function() {
        return $.ajax({
          url: base_url + "/index.php/services/listaPrecios/filtrar",
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
                listaprecio: s
              }));
              Singleton.get().hideLoading();
              $('#tablaBody tr').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                return _this.clickTr(e);
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
              return $('#previous').click(function(e) {
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
                    console.log($('#labelPaginador'));
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

      listaprecios.prototype.clickTr = function(e) {
        var html;
        e.preventDefault();
        e.stopPropagation();
        this.idlista = e.currentTarget.attributes[0].value;
        this.listaEstado = $('#' + this.idlista)[0].cells[3].textContent;
        if (this.listaEstado === "Historica") {
          html = html + "<option value=\"accion\">Acciones</option>" + "<option value=\"ver\">Ver</option>";
          $('#accionesListas').html(html);
          $(e.currentTarget).addClass('active');
          $(e.currentTarget).siblings().removeClass('active');
          $('#accionesListas').unbind("change");
          $('#accionesListas').change((function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              return _this.acciones(e);
            };
          })(this));
        }
        if (this.listaEstado === "Activo") {
          html = html + "<option value=\"accion\">Acciones</option>" + "<option value=\"editar\">Editar</option>";
          $('#accionesListas').html(html);
          $(e.currentTarget).addClass('active');
          $(e.currentTarget).siblings().removeClass('active');
          $('#accionesListas').unbind("change");
          $('#accionesListas').change((function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              return _this.acciones(e);
            };
          })(this));
        }
        if (this.listaEstado === "Temporal") {
          html = html + "<option value=\"accion\">Acciones</option>" + "<option value=\"editar\">Editar</option>" + "<option value=\"eliminar\">Eliminar</option>";
          $('#accionesListas').html(html);
          $(e.currentTarget).addClass('active');
          $(e.currentTarget).siblings().removeClass('active');
          $('#accionesListas').unbind("change");
          return $('#accionesListas').change((function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              return _this.acciones(e);
            };
          })(this));
        }
      };

      listaprecios.prototype.acciones = function(e) {
        var Validator;
        Validator = true;
        e.preventDefault();
        e.stopPropagation();
        if ("eliminar" === $('#accionesListas').find(':selected').val()) {
          this.eliminar();
        }
        if ("ver" === $('#accionesListas').find(':selected').val()) {
          Singleton.get().showLoading();
          this.objData = {
            id: this.idlista
          };
          $.ajax({
            url: base_url + "/index.php/services/listaPrecios/editarlista",
            type: 'POST',
            data: this.objData,
            statusCode: {
              302: function() {
                return Singleton.get().reload();
              }
            },
            success: (function(_this) {
              return function(result) {
                var c, cate, html, i, j, k, len, len1, listaProd, p, ref, ref1;
                $('#appView').css('display', 'none');
                $('#appViewNext').html(_.template(Tplhistorica)({
                  nombre: result[0].Nombre,
                  tipo: result[0].Tipo,
                  estado: result[0].Estado,
                  fecha: result[0].Fecha_C
                }));
                $('.scroll').css('height', window.innerHeight - 75);
                $('.newTitulo').click(function(e) {
                  return _this.volveriteminicial(e);
                });
                if (result[0].Tipo === 'Normal') {
                  $('#tiposelect').attr('disabled', 'disabled');
                }
                if (Number(result[0].Estado) === 2) {
                  $('#estadoselect').attr('disabled', 'disabled');
                }
                _this.productoModel = new ProductoModel();
                _this.productoModel.buscarCategorias(_this.cargarCategoriasEnMemoria);
                _this.productoModel.buscarProductosHistorico(_this.idlista, _this.cargarProductosEnMemoriahistorico);
                console.log(_this.productos);
                $('#productoslista').html(_.template(TplproductosLista)({
                  categorias: _this.categorias,
                  productos: _this.productos
                }));
                cate = 0;
                ref = _this.categorias;
                for (j = 0, len = ref.length; j < len; j++) {
                  c = ref[j];
                  listaProd = Array();
                  ref1 = _this.productos;
                  for (k = 0, len1 = ref1.length; k < len1; k++) {
                    p = ref1[k];
                    if (p.Id_Categoria === c.Id_Categoria) {
                      listaProd.push(p);
                    }
                  }
                  i = 0;
                  html = "";
                  while (i < listaProd.length) {
                    html += '<div style="width: 50%;float:left;">';
                    html += '<div style="width: 30%;float:left;">';
                    html += '<input type="checkbox" style="margin-left: 3%;" id="check' + cate + '' + i + '" disabled="disabled" name="option">';
                    html += '<label class="etiquetas" style="margin-left: 32%;margin-right: -53%;">' + listaProd[i].nombreProducto + '</label>';
                    html += '</div>';
                    html += '<div>';
                    html += '<label class="etiquetas" style="width:3%">$</label>';
                    html += '<input type="text" id="input' + cate + '' + i + '" class="precios" readonly="readonly" style="width: 35.6%; margin-top: -0.5%;"/>';
                    html += '<input type="hidden" id="oculto' + cate + '' + i + '" value=' + listaProd[i].Id_Producto + '>';
                    html += '</div>';
                    html += '</div>';
                    i++;
                  }
                  $('#cat' + c.Id_Categoria).html(html);
                  cate++;
                }
                $('.datos-titulo').click(function(e) {
                  var id;
                  id = e.currentTarget.id.substr(19, e.currentTarget.id.length);
                  $('#cat' + id).slideToggle('slow');
                  if ($('#encabezadocategoria' + id)[0].attributes[1].value === 'datos-titulo act') {
                    $('#encabezadocategoria' + id).removeClass('act');
                    return $('#encabezadocategoria' + id).addClass('dis');
                  } else {
                    $('#encabezadocategoria' + id).removeClass('dis');
                    return $('#encabezadocategoria' + id).addClass('act');
                  }
                });
                Singleton.get().hideLoading();
                $.ajax({
                  url: base_url + "/index.php/services/listaPrecios/traerlistaproductos",
                  type: 'POST',
                  data: _this.objData,
                  statusCode: {
                    302: function() {
                      return Singleton.get().reload();
                    }
                  },
                  success: function(result) {
                    var i1, i2, l, len2, len3, len4, m, n, r, ref2, ref3, results;
                    i1 = 0;
                    ref2 = _this.categorias;
                    results = [];
                    for (l = 0, len2 = ref2.length; l < len2; l++) {
                      c = ref2[l];
                      i2 = 0;
                      ref3 = _this.productos;
                      for (m = 0, len3 = ref3.length; m < len3; m++) {
                        p = ref3[m];
                        if (c.Id_Categoria === p.Id_Categoria) {
                          for (n = 0, len4 = result.length; n < len4; n++) {
                            r = result[n];
                            if (r.Id_Producto === p.Id_Producto) {
                              if (r.Estado === "1") {
                                $('#check' + i1 + i2).attr('checked', true);
                                $('#input' + i1 + i2).val(r.Precio);
                              } else {
                                $('#input' + i1 + i2).val(r.Precio);
                              }
                            }
                          }
                          i2++;
                        }
                      }
                      results.push(i1++);
                    }
                    return results;
                  }
                });
                return $('#cancelarlistaHistorica').click(function(e) {
                  return _this.cancelar(e);
                });
              };
            })(this)
          });
        }
        if ("editar" === $('#accionesListas').find(':selected').val()) {
          Singleton.get().showLoading();
          this.objData = {
            id: this.idlista
          };
          return $.ajax({
            url: base_url + "/index.php/services/listaPrecios/editarlista",
            type: 'POST',
            data: this.objData,
            statusCode: {
              302: function() {
                return Singleton.get().reload();
              }
            },
            success: (function(_this) {
              return function(result) {
                var c, cate, html, i, j, k, len, len1, listaProd, p, ref, ref1;
                $('#appView').css('display', 'none');
                $('#appViewNext').html(_.template(Tpleditar)({
                  nombre: result[0].Nombre,
                  tipo: result[0].Tipo,
                  estado: result[0].Estado,
                  fecha: result[0].Fecha_C
                }));
                $('.scroll').css('height', window.innerHeight - 75);
                if (Number(result[0].Estado) === 1) {
                  $('#estadoselect').attr('disabled', 'disabled');
                }
                $('.newTitulo').click(function(e) {
                  return _this.volveriteminicial(e);
                });
                _this.productoModel = new ProductoModel();
                _this.productoModel.buscarCategorias(_this.cargarCategoriasEnMemoria);
                _this.productoModel.buscarProductos2(_this.cargarProductosEnMemoria2);
                $('#productoslista').html(_.template(TplproductosLista)({
                  categorias: _this.categorias
                }));
                console.log('@categorias');
                console.log(_this.categorias);
                cate = 0;
                ref = _this.categorias;
                for (j = 0, len = ref.length; j < len; j++) {
                  c = ref[j];
                  listaProd = Array();
                  ref1 = _this.productos;
                  for (k = 0, len1 = ref1.length; k < len1; k++) {
                    p = ref1[k];
                    if (p.Id_Categoria === c.Id_Categoria) {
                      listaProd.push(p);
                    }
                  }
                  i = 0;
                  html = "";
                  while (i < listaProd.length) {
                    html += '<div style="width: 50%;float:left;">';
                    html += '<div style="width: 50%;float:left;">';
                    html += '<input type="checkbox" style="margin-left: -10%;" id="check' + cate + '' + i + '" class="chekProducto" name="option">';
                    html += '<label class="etiquetas" style="margin-left: 16%;margin-right: -53%;width: 54%;">' + listaProd[i].nombreProducto + '</label>';
                    html += '</div>';
                    html += '<div>';
                    html += '<label class="etiquetas" style="width:3%">$</label>';
                    html += '<input type="text" id="input' + cate + '' + i + '" class="precios"  style="width: 35.6%; margin-top: -0.5%;"/>';
                    html += '<input type="hidden" id="oculto' + cate + '' + i + '" value=' + listaProd[i].Id_Producto + '>';
                    html += '</div>';
                    html += '</div>';
                    i++;
                  }
                  $('#cat' + c.Id_Categoria).html(html);
                  cate++;
                }
                $('.precios').keydown(function(event) {
                  if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

                  } else {
                    if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                      return event.preventDefault();
                    }
                  }
                });
                $('#checkTodosProductos').click(function(e) {
                  if ($('#checkTodosProductos').is(':checked') === true) {
                    return $('.chekProducto').prop('checked', true);
                  } else {
                    return $('.chekProducto').prop('checked', false);
                  }
                });
                $('.datos-titulo').click(function(e) {
                  var id;
                  id = e.currentTarget.id.substr(19, e.currentTarget.id.length);
                  $('#cat' + id).slideToggle('slow');
                  if ($('#encabezadocategoria' + id)[0].attributes[1].value === 'datos-titulo act') {
                    $('#encabezadocategoria' + id).removeClass('act');
                    return $('#encabezadocategoria' + id).addClass('dis');
                  } else {
                    $('#encabezadocategoria' + id).removeClass('dis');
                    return $('#encabezadocategoria' + id).addClass('act');
                  }
                });
                Singleton.get().hideLoading();
                $.ajax({
                  url: base_url + "/index.php/services/listaPrecios/traerlistaproductos",
                  type: 'POST',
                  data: _this.objData,
                  statusCode: {
                    302: function() {
                      return Singleton.get().reload();
                    }
                  },
                  success: function(result) {
                    var i1, i2, l, len2, len3, len4, m, n, r, ref2, ref3, results;
                    i1 = 0;
                    ref2 = _this.categorias;
                    results = [];
                    for (l = 0, len2 = ref2.length; l < len2; l++) {
                      c = ref2[l];
                      i2 = 0;
                      ref3 = _this.productos;
                      for (m = 0, len3 = ref3.length; m < len3; m++) {
                        p = ref3[m];
                        if (c.Id_Categoria === p.Id_Categoria) {
                          for (n = 0, len4 = result.length; n < len4; n++) {
                            r = result[n];
                            if (r.Id_Producto === p.Id_Producto) {
                              if (r.Estado === "1") {
                                $('#check' + i1 + i2).attr('checked', true);
                                $('#input' + i1 + i2).val(r.Precio);
                              } else {
                                $('#input' + i1 + i2).val(r.Precio);
                              }
                            }
                          }
                          i2++;
                        }
                      }
                      results.push(i1++);
                    }
                    return results;
                  }
                });
                $('#cancelarlistaEditar').click(function(e) {
                  return _this.cancelar(e);
                });
                return $('#guardarlistaEditar').click(function(e) {
                  Validator = true;
                  if ($('#nombrelista').val() === '') {
                    Validator = false;
                    Singleton.get().showInformacion('Debe ingresar un nombre a la Lista.');
                  }
                  if ($('#estadoselect').val() === '') {
                    Validator = false;
                    Singleton.get().showInformacion('Debe ingresar un Estado.');
                  }
                  return $.ajax({
                    url: (base_url + "/index.php/services/listaPrecios/conactiva/id/") + _this.idlista,
                    type: 'POST',
                    data: '',
                    statusCode: {
                      302: function() {
                        return Singleton.get().reload();
                      }
                    },
                    success: function(result) {
                      var datos;
                      if (result === 'false') {
                        if (Validator === true) {
                          datos = {
                            idlista: _this.idlista,
                            nombre: $('#nombrelista').val(),
                            estado: $('#estadoselect').val(),
                            fecha: $('#fechaActual').val()
                          };
                          Singleton.get().showLoading();
                          return new ListaPrecio().actualizarLista(datos, function(data) {
                            var cc, cont, contp, da, l, len2, len3, lproductos, m, ref2, ref3;
                            if (_.isUndefined(data.error)) {
                              cont = 0;
                              lproductos = Array();
                              ref2 = _this.categorias;
                              for (l = 0, len2 = ref2.length; l < len2; l++) {
                                c = ref2[l];
                                contp = 0;
                                ref3 = _this.productos;
                                for (m = 0, len3 = ref3.length; m < len3; m++) {
                                  p = ref3[m];
                                  if (p.Id_Categoria === c.Id_Categoria) {
                                    contp++;
                                  }
                                }
                                lproductos[cont] = contp;
                                cont++;
                              }
                              cont = 0;
                              cc = 0;
                              _this.cant = Array();
                              while (cc < lproductos.length) {
                                i = 0;
                                while (i < lproductos[cont]) {
                                  if ($('#check' + cc + i).is(':checked')) {
                                    da = {
                                      val_c: _this.idlista,
                                      val_v: $('#input' + cc + i).val(),
                                      val_p: $('#oculto' + cc + i).val(),
                                      val_e: 1
                                    };
                                  } else {
                                    da = {
                                      val_c: _this.idlista,
                                      val_v: $('#input' + cc + i).val(),
                                      val_p: $('#oculto' + cc + i).val(),
                                      val_e: 0
                                    };
                                  }
                                  _this.cant.push(da);
                                  i++;
                                }
                                cont++;
                                cc++;
                              }
                              return new ListaPrecio().productolistaedit(_this.cant, function(data) {
                                Singleton.get().showExito('La lista ha sido Editado exitosamente.');
                                $('#appView').css('display', 'block');
                                $('#appViewNext').empty();
                                return $('#btnExito').click(function(e) {
                                  e.preventDefault;
                                  e.stopPropagation;
                                  _this.filtrar();
                                  return false;
                                });
                              });
                            } else {
                              Singleton.get().showError('La lista no a podido ser guardado.');
                              return Singleton.get().hideLoading();
                            }
                          });
                        }
                      } else {
                        if ($('#estadoselect').val() === '0') {
                          if (Validator === true) {
                            datos = {
                              idlista: _this.idlista,
                              nombre: $('#nombrelista').val(),
                              estado: $('#estadoselect').val(),
                              fecha: $('#fechaActual').val()
                            };
                            Singleton.get().showLoading();
                            new ListaPrecio().actualizarLista(datos, function(data) {
                              var cc, cont, contp, da, l, len2, len3, lproductos, m, ref2, ref3;
                              if (_.isUndefined(data.error)) {
                                cont = 0;
                                lproductos = Array();
                                ref2 = _this.categorias;
                                for (l = 0, len2 = ref2.length; l < len2; l++) {
                                  c = ref2[l];
                                  contp = 0;
                                  ref3 = _this.productos;
                                  for (m = 0, len3 = ref3.length; m < len3; m++) {
                                    p = ref3[m];
                                    if (p.Id_Categoria === c.Id_Categoria) {
                                      contp++;
                                    }
                                  }
                                  lproductos[cont] = contp;
                                  cont++;
                                }
                                cont = 0;
                                cc = 0;
                                _this.cant = Array();
                                while (cc < lproductos.length) {
                                  i = 0;
                                  while (i < lproductos[cont]) {
                                    if ($('#check' + cc + i).is(':checked')) {
                                      da = {
                                        val_c: _this.idlista,
                                        val_v: $('#input' + cc + i).val(),
                                        val_p: $('#oculto' + cc + i).val(),
                                        val_e: 1
                                      };
                                    } else {
                                      da = {
                                        val_c: _this.idlista,
                                        val_v: $('#input' + cc + i).val(),
                                        val_p: $('#oculto' + cc + i).val(),
                                        val_e: 0
                                      };
                                    }
                                    _this.cant.push(da);
                                    i++;
                                  }
                                  cont++;
                                  cc++;
                                }
                                return new ListaPrecio().productolistaedit(_this.cant, function(data) {
                                  Singleton.get().showExito('La lista ha sido Editada exitosamente.');
                                  $('#appView').css('display', 'block');
                                  $('#appViewNext').empty();
                                  return $('#btnExito').click(function(e) {
                                    e.preventDefault;
                                    e.stopPropagation;
                                    _this.filtrar();
                                    return false;
                                  });
                                });
                              } else {
                                Singleton.get().showError('La lista no ha podido ser guardada.');
                                return Singleton.get().hideLoading();
                              }
                            });
                          }
                        }
                        if ($('#estadoselect').val() === '1') {
                          $.ajax({
                            url: (base_url + "/index.php/services/listaPrecios/actualizar2/id/") + result[0].Id_ListaPrecio,
                            type: 'POST',
                            data: '',
                            statusCode: {
                              302: function() {
                                return Singleton.get().reload();
                              }
                            },
                            success: function(result) {
                              console.log("resultado historica");
                              return console.log(result);
                            }
                          });
                          if (Validator === true) {
                            datos = {
                              idlista: _this.idlista,
                              nombre: $('#nombrelista').val(),
                              estado: $('#estadoselect').val(),
                              fecha: $('#fechaActual').val()
                            };
                            return new ListaPrecio().actualizarLista(datos, function(data) {
                              var cc, cont, contp, da, l, len2, len3, lproductos, m, ref2, ref3;
                              if (_.isUndefined(data.error)) {
                                cont = 0;
                                lproductos = Array();
                                ref2 = _this.categorias;
                                for (l = 0, len2 = ref2.length; l < len2; l++) {
                                  c = ref2[l];
                                  contp = 0;
                                  ref3 = _this.productos;
                                  for (m = 0, len3 = ref3.length; m < len3; m++) {
                                    p = ref3[m];
                                    if (p.Id_Categoria === c.Id_Categoria) {
                                      contp++;
                                    }
                                  }
                                  lproductos[cont] = contp;
                                  cont++;
                                }
                                cont = 0;
                                cc = 0;
                                _this.cant = Array();
                                while (cc < lproductos.length) {
                                  i = 0;
                                  while (i < lproductos[cont]) {
                                    if ($('#check' + cc + i).is(':checked')) {
                                      da = {
                                        val_c: _this.idlista,
                                        val_v: $('#input' + cc + i).val(),
                                        val_p: $('#oculto' + cc + i).val(),
                                        val_e: 1
                                      };
                                    } else {
                                      da = {
                                        val_c: _this.idlista,
                                        val_v: $('#input' + cc + i).val(),
                                        val_p: $('#oculto' + cc + i).val(),
                                        val_e: 0
                                      };
                                    }
                                    _this.cant.push(da);
                                    i++;
                                  }
                                  cont++;
                                  cc++;
                                }
                                return new ListaPrecio().productolistaedit(_this.cant, function(data) {
                                  Singleton.get().showExito('La lista ha sido Editada exitosamente.');
                                  $('#appView').css('display', 'block');
                                  $('#appViewNext').empty();
                                  return $('#btnExito').click(function(e) {
                                    e.preventDefault;
                                    e.stopPropagation;
                                    _this.filtrar();
                                    return false;
                                  });
                                });
                              } else {
                                Singleton.get().showError('La lista no ha podido ser guardada.');
                                return Singleton.get().hideLoading();
                              }
                            });
                          }
                        }
                      }
                    }
                  });
                });
              };
            })(this),
            error: (function(_this) {
              return function(result) {
                Singleton.get().hideLoading();
                return Singleton.get().showError('No existe el filtro');
              };
            })(this)
          });
        }
      };

      listaprecios.prototype.nuevalista = function(e) {
        var c, cate, html, i, j, k, len, len1, listaProd, p, ref, ref1;
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appView').css('display', 'none');
        $('#appViewNext').html(_.template(Tplnuevo)({}));
        $('#tiposelect').css('disabled', 'disabled');
        $('.scroll').css('height', window.innerHeight - 75);
        $('.newTitulo').click((function(_this) {
          return function(e) {
            return _this.volveriteminicial(e);
          };
        })(this));
        $('#checkTodosProductos').click((function(_this) {
          return function(e) {
            if ($('#checkTodosProductos').is(':checked') === true) {
              return $('.chekProducto').prop('checked', true);
            } else {
              return $('.chekProducto').prop('checked', false);
            }
          };
        })(this));
        $('#fechaActual').attr('value', Singleton.get().fechaActual());
        this.productoModel = new ProductoModel();
        this.productoModel.buscarCategorias(this.cargarCategoriasEnMemoria);
        this.productoModel.buscarProductos2(this.cargarProductosEnMemoria2);
        $('#productoslista').html(_.template(TplproductosLista)({
          categorias: this.categorias
        }));
        cate = 0;
        ref = this.categorias;
        for (j = 0, len = ref.length; j < len; j++) {
          c = ref[j];
          listaProd = Array();
          ref1 = this.productos;
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            p = ref1[k];
            if (p.Id_Categoria === c.Id_Categoria) {
              listaProd.push(p);
            }
          }
          i = 0;
          html = "";
          while (i < listaProd.length) {
            html += '<div style="width: 50%;float:left;">';
            html += '<div style="width: 50%;float:left;">';
            html += '<input type="checkbox" style="margin-left: -10%;" id="check' + cate + '' + i + '" class="chekProducto" name="option">';
            html += '<label class="etiquetas" style="margin-left: 16%;margin-right: -53%;width: 54%;">' + listaProd[i].nombreProducto + '</label>';
            html += '</div>';
            html += '<div>';
            html += '<label class="etiquetas" style="width:3%">$</label>';
            html += '<input type="text" id="input' + cate + '' + i + '" class="precios" value=0  style="width: 35.6%; margin-top: -0.5%;"/>';
            html += '<input type="hidden" id="oculto' + cate + '' + i + '" value=' + listaProd[i].Id_Producto + '>';
            html += '</div>';
            html += '</div>';
            i++;
          }
          $('#cat' + c.Id_Categoria).html(html);
          cate++;
        }
        Singleton.get().hideLoading();
        $('.precios').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        $('.datos-titulo').click((function(_this) {
          return function(e) {
            var id;
            id = e.currentTarget.id.substr(19, e.currentTarget.id.length);
            $('#cat' + id).slideToggle('slow');
            if ($('#encabezadocategoria' + id)[0].attributes[1].value === 'datos-titulo act') {
              $('#encabezadocategoria' + id).removeClass('act');
              return $('#encabezadocategoria' + id).addClass('dis');
            } else {
              $('#encabezadocategoria' + id).removeClass('dis');
              return $('#encabezadocategoria' + id).addClass('act');
            }
          };
        })(this));
        $('#cancelarlista').click((function(_this) {
          return function(e) {
            return _this.cancelar(e);
          };
        })(this));
        return $('#guardarlista').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return $.ajax({
              url: base_url + "/index.php/services/listaPrecios/contemporal",
              type: 'POST',
              data: '',
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: function(result) {
                var Validator, datos;
                if (result === "true") {
                  Validator = true;
                  if ($('#nombrelista').val() === '') {
                    Validator = false;
                    Singleton.get().showInformacion('Debe ingresar un nombre a la Lista.');
                  }
                  if ($('#estadoselect').val() === '') {
                    Validator = false;
                    Singleton.get().showInformacion('Debe ingresar un Estado.');
                  }
                  if (Validator === true) {
                    Singleton.get().showLoading();
                    datos = {
                      Nombre: $('#nombrelista').val(),
                      Estado: $('#estadoselect').val()
                    };
                    new ListaPrecio().guardarlista(datos, function(data) {
                      var cc, cont, contp, da, l, len2, len3, lproductos, m, ref2, ref3;
                      if ($.isNumeric(Number(data))) {
                        cont = 0;
                        lproductos = Array();
                        ref2 = _this.categorias;
                        for (l = 0, len2 = ref2.length; l < len2; l++) {
                          c = ref2[l];
                          contp = 0;
                          ref3 = _this.productos;
                          for (m = 0, len3 = ref3.length; m < len3; m++) {
                            p = ref3[m];
                            if (p.Id_Categoria === c.Id_Categoria) {
                              contp++;
                            }
                          }
                          lproductos[cont] = contp;
                          cont++;
                        }
                        cont = 0;
                        cc = 0;
                        _this.cant = Array();
                        while (cc < lproductos.length) {
                          i = 0;
                          while (i < lproductos[cont]) {
                            if ($('#check' + cc + i).is(':checked')) {
                              da = {
                                val_c: data,
                                val_v: $('#input' + cc + i).val(),
                                val_p: $('#oculto' + cc + i).val(),
                                val_e: 1
                              };
                            } else {
                              da = {
                                val_c: data,
                                val_v: $('#input' + cc + i).val(),
                                val_p: $('#oculto' + cc + i).val(),
                                val_e: 0
                              };
                            }
                            _this.cant.push(da);
                            i++;
                          }
                          cont++;
                          cc++;
                        }
                        return new ListaPrecio().productolistainsert(_this.cant, function(data) {
                          Singleton.get().showExito('La lista ha sido guardada exitosamente.');
                          $('#appView').css('display', 'block');
                          $('#appViewNext').empty();
                          return $('#btnExito').click(function(e) {
                            e.preventDefault;
                            e.stopPropagation;
                            _this.filtrar();
                            return false;
                          });
                        });
                      } else {
                        return Singleton.get().showInformacion('La lista no ha podido ser guardada.');
                      }
                    });
                  }
                }
                if (result === "false") {
                  Singleton.get().showInformacion('Ya existe una lista temporal en el Sistema.');
                  return $('#btnExito').click(function(e) {
                    $('#appView').css('display', 'block');
                    $('#appViewNext').empty();
                    return $('#btnExito').click(function(e) {
                      e.preventDefault;
                      e.stopPropagation;
                      _this.filtrar();
                      return false;
                    });
                  });
                }
              }
            });
          };
        })(this));
      };

      listaprecios.prototype.eliminar = function() {
        this.productoModel = new ProductoModel();
        this.productoModel.buscarProductos2(this.cargarProductosEnMemoria2);
        if (this.listaEstado === "Historica") {
          Singleton.get().showInformacion('La lista no puede ser eliminada. Pertenece a la Data Histórica.');
          $('#btnExito').click((function(_this) {
            return function(e) {
              e.preventDefault;
              e.stopPropagation;
              return _this.filtrar();
            };
          })(this));
        }
        if (this.listaEstado === "Activo") {
          Singleton.get().showInformacion('La lista no puede ser eliminada estando en uso.');
          $('#btnExito').click((function(_this) {
            return function(e) {
              e.preventDefault;
              e.stopPropagation;
              return _this.filtrar();
            };
          })(this));
        }
        if (this.listaEstado === "Temporal") {
          Singleton.get().showAdvertencia();
          return $('#btnAceptarAdvertencia').click((function(_this) {
            return function(e) {
              var j, len, obj, p, ref;
              _this.cont = new Array();
              ref = _this.productos;
              for (j = 0, len = ref.length; j < len; j++) {
                p = ref[j];
                obj = {
                  id_lista: _this.idlista,
                  id_produ: p.Id_Producto
                };
                _this.cont.push(obj);
              }
              return new ListaPrecio().productolistaeliminar(_this.cont, function(data) {
                if (data === "true") {
                  return new ListaPrecio().eliminarLista(_this.idlista, function(data2) {
                    if (data2 === "true") {
                      Singleton.get().showExito('La lista ha sido eliminada exitosamente.');
                      $('#appView').css('display', 'block');
                      $('#appViewNext').empty();
                      return $('#btnExito').click(function(e) {
                        e.preventDefault;
                        e.stopPropagation;
                        _this.filtrar();
                        return false;
                      });
                    }
                  });
                } else {
                  return Singleton.get().showError('Error al eliminar la lista');
                }
              });
            };
          })(this));
        }
      };

      listaprecios.prototype.cargarCategoriasEnMemoria = function(categorias) {
        return this.categorias = categorias;
      };

      listaprecios.prototype.cargarProductosEnMemoria = function(productos) {
        return this.productos = productos;
      };

      listaprecios.prototype.cargarProductosEnMemoria2 = function(productos) {
        return this.productos = productos;
      };

      listaprecios.prototype.cargarProductosEnMemoriahistorico = function(productos) {
        return this.productos = productos;
      };

      listaprecios.prototype.cargarProductosListaEnMemoria = function(productosLista) {
        return this.productosLista = productosLista;
      };

      listaprecios.prototype.cancelar = function(e) {
        var html;
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appViewNext').html("");
        $('#appView').css('display', 'inline');
        html = html + "<option value=\"accion\">Acciones</option>";
        $('#accionesListas').html(html);
        this.filtrar();
        return Singleton.get().hideLoading();
      };

      listaprecios.prototype.volveriteminicial = function(e) {
        var html;
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appView').css('display', 'block');
        $('#appViewNext').empty();
        html = html + "<option value=\"accion\">Acciones</option>";
        $('#accionesListas').html(html);
        this.filtrar();
        return Singleton.get().hideLoading();
      };

      return listaprecios;

    })(Backbone.View);
  });

}).call(this);
