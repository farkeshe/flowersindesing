(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/mantenedorCategoria/productos.html', 'text!tpl/mantenedorCategoria/resultados.html', 'text!tpl/mantenedorCategoria/nuevo.html', 'text!tpl/mantenedorCategoria/editar.html', 'text!tpl/gestorCotizaciones/modalCliente.html', 'assets/js/view/paginador', 'assets/js/model/producto'], function(Backbone, Tplproductos, Tplresultados, Tplnuevo, Tpleditar, TplmodalCliente, Paginador, ProductoModel) {
    var Productos;
    return Productos = (function(superClass) {
      extend(Productos, superClass);

      function Productos() {
        this.modalAceptarProducto = bind(this.modalAceptarProducto, this);
        this.modalBuscarProducto = bind(this.modalBuscarProducto, this);
        this.volveriteminicial = bind(this.volveriteminicial, this);
        this.cargareditar = bind(this.cargareditar, this);
        this.cancelar = bind(this.cancelar, this);
        this.eliminar = bind(this.eliminar, this);
        this.clickTr = bind(this.clickTr, this);
        this.acciones = bind(this.acciones, this);
        this.cargarProductosEnMemoria = bind(this.cargarProductosEnMemoria, this);
        this.cargarCategoriasEnMemoria = bind(this.cargarCategoriasEnMemoria, this);
        this.nuevo = bind(this.nuevo, this);
        this.cargar = bind(this.cargar, this);
        this.filtrar = bind(this.filtrar, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return Productos.__super__.constructor.apply(this, arguments);
      }

      Productos.prototype.el = 'body';

      Productos.prototype.initialize = function() {
        this.paginador = new Paginador();
        this.productoModel = new ProductoModel();
        this.productoModel.buscarCategorias(this.cargarCategoriasEnMemoria);
        this.productoModel.buscarProductos(this.cargarProductosEnMemoria);
        this.objData = {
          nombreproducto: "",
          Id_Categoria: "",
          start: this.paginador.start,
          end: '14'
        };
        return this.init();
      };

      Productos.prototype.init = function() {
        $('#appView').html(_.template(Tplproductos)({
          categorias: this.categorias
        }));
        $('#nuevoproducto').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.nuevo(e);
          };
        })(this));
        this.filtrar();
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
        $('#nuevoproducto').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        $('#insertcategoria').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        if (Singleton.get().idPerfilUsuarioLogueado !== '1' && Singleton.get().idPerfilUsuarioLogueado !== '2' && Singleton.get().idPerfilUsuarioLogueado !== '3') {
          $('#nuevoproducto').css('display', 'none');
          $('#accionesProductos').css('display', 'none');
        }
        $("#autoc1").autocomplete({
          source: function(request, response) {
            return $.ajax({
              url: base_url + "/index.php/services/productos/miproducto",
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
                    categoria: item.Id_Categoria
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
              return $('#categoria').val(ui.item.categoria).attr('selected', true);
            }
          },
          open: function() {
            return $('#autoc1').removeClass("ui-autocomplete-loading");
          },
          close: function() {
            return $('#autoc1').removeClass("ui-autocomplete-loading");
          }
        });
        $('#insertcategoria').click((function(_this) {
          return function(e) {
            var categ;
            console.log("click holi");
            categ = $('#autoc12').val();
            console.log(categ);
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
            $('#modal').html(_.template(TplmodalCliente));
            $('#tituloCliente').html('Elegir Producto');
            $('#Head1').html('Producto');
            $('#Head2').html('Id');
            $('#modal').modal('show');
            $('#btnModalBuscarCliente').click(function(e) {
              return _this.modalBuscarProducto(e);
            });
            $('#inputModalBuscarCliente').keypress(function(e) {
              if (event.keyCode === 13) {
                return _this.modalBuscarProducto(e);
              }
            });
            $('#btnModalclienteAceptar').click(function(e) {
              return _this.modalAceptarProducto(e);
            });
            return false;
          };
        })(this));
        $('#next').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            Singleton.get().showLoading();
            return $.ajax({
              url: base_url + "/index.php/services/productos/contarRegistros",
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
              url: base_url + "/index.php/services/productos/contarRegistros",
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
        return $('#filtrar').click((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.filtrar();
          };
        })(this));
      };

      Productos.prototype.filtrar = function() {
        Singleton.get().showLoading();
        this.objData = {
          nombreproducto: $('#autoc1').val(),
          Id_Categoria: $('#categoria').find(':selected').val(),
          start: this.paginador.start,
          end: '14'
        };
        return $.ajax({
          url: base_url + "/index.php/services/productos/contarRegistros",
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

      Productos.prototype.cargar = function() {
        return $.ajax({
          url: base_url + "/index.php/services/productos/filtrar",
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
                productos: s
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

      Productos.prototype.nuevo = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appView').css('display', 'none');
        $('#appViewNext').html(_.template(Tplnuevo)({
          categorias: this.categorias
        }));
        $('#precioproducto').keydown(function(event) {
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
        $('#guardarproducto').click((function(_this) {
          return function(e) {
            var Validator, datos;
            e.preventDefault();
            e.stopPropagation();
            Validator = true;
            datos = {
              Nombre: $('#nombreproducto').val(),
              Id_Categoria: $('#categoriaselect').val()
            };
            return _this.productoModel.existenciaProducto(datos, function(existencia) {
              if (existencia === 'true') {
                return Singleton.get().showInformacion('El producto para la categoría ya ha sido ingresado');
              } else {
                if ($('#nombreproducto').val() === '') {
                  Singleton.get().showInformacion('Debe ingresar un nombre al producto');
                  Validator = false;
                }
                if ($('#categoriaselect').find(':selected').val() === '') {
                  Singleton.get().showInformacion('Debe asignar una categoría al producto');
                  Validator = false;
                }
                if (Validator === true) {
                  return new ProductoModel().guardarProducto(datos, function(data) {
                    if (_.isUndefined(data.error)) {
                      Singleton.get().showExito('El producto a sido guardado exitosamente.');
                      $('#appView').css('display', 'block');
                      $('#appViewNext').empty();
                      return _this.filtrar();
                    } else {
                      return Singleton.get().showError('El producto no ha podido ser guardado.');
                    }
                  });
                }
              }
            });
          };
        })(this));
        $('#cancelarproducto').click((function(_this) {
          return function(e) {
            return _this.cancelar(e);
          };
        })(this));
        return Singleton.get().hideLoading();
      };

      Productos.prototype.cargarCategoriasEnMemoria = function(categorias) {
        return this.categorias = categorias;
      };

      Productos.prototype.cargarProductosEnMemoria = function(productos) {
        return this.productos = productos;
      };

      Productos.prototype.acciones = function(e) {
        var Validator;
        Validator = true;
        e.preventDefault();
        e.stopPropagation();
        if ("editar" === $('#accionesProductos').find(':selected').val()) {
          Singleton.get().showLoading();
          $('#appView').css('display', 'none');
          $('#appViewNext').html(_.template(Tpleditar)({
            categorias: this.categorias
          }));
          this.productoModel.buscarProducto(this.idproducto, this.cargareditar);
          Singleton.get().hideLoading();
          $('#modal').remove();
          $('.newTitulo').click((function(_this) {
            return function(e) {
              return _this.volveriteminicial(e);
            };
          })(this));
          $('#guardarproducto').click((function(_this) {
            return function(e) {
              var datos;
              e.preventDefault();
              e.stopPropagation();
              Validator = true;
              datos = {
                Nombre: $('#nombreproducto').val(),
                Id_Categoria: $('#categoriaselect').val()
              };
              return _this.productoModel.existenciaProducto(datos, function(existencia) {
                var datosactualizar;
                if (existencia === 'true') {
                  return Singleton.get().showInformacion('El producto para la categoría ya ha sido ingresado');
                } else {
                  if ($('#nombreproducto').val() === '') {
                    Singleton.get().showInformacion('Debe Seleccionar un nombre al producto');
                    Validator = false;
                  }
                  if ($('#categoriaselect').find(':selected').val() === '') {
                    Singleton.get().showInformacion('Debe asignar una categoría al producto');
                    Validator = false;
                  }
                  if (Validator === true) {
                    datosactualizar = {
                      idproducto: _this.idproducto,
                      Nombre: $('#nombreproducto').val(),
                      Id_Categoria: $('#categoriaselect').val()
                    };
                    return new ProductoModel().actualizarProducto(datosactualizar, function(data) {
                      if (_.isUndefined(data.error)) {
                        Singleton.get().showExito('El producto ha sido actualizado exitosamente.');
                        $('#appView').css('display', 'block');
                        $('#appViewNext').empty();
                        return _this.filtrar();
                      } else {
                        return Singleton.get().showError('El producto no ha podido ser actualizado.');
                      }
                    });
                  }
                }
              });
            };
          })(this));
          $('#cancelarproducto').click((function(_this) {
            return function(e) {
              return _this.cancelar(e);
            };
          })(this));
        }
        if ("eliminar" === $('#accionesProductos').find(':selected').val()) {
          return this.eliminar();
        }
      };

      Productos.prototype.clickTr = function(e) {
        var html;
        e.preventDefault();
        e.stopPropagation();
        this.idproducto = e.currentTarget.attributes[0].value;
        html = html + "<option value=\"accion\">Acciones</option>" + "<option value=\"editar\">Editar</option>" + "<option value=\"eliminar\">Eliminar</option>";
        $('#accionesProductos').html(html);
        $(e.currentTarget).addClass('active');
        $(e.currentTarget).siblings().removeClass('active');
        return $('#accionesProductos').change((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return _this.acciones(e);
          };
        })(this));
      };

      Productos.prototype.eliminar = function() {
        return new ProductoModel().eliminarProducto(this.idproducto, (function(_this) {
          return function(data) {
            if (data === 'true') {
              Singleton.get().showExito('El producto ha sido eliminado exitosamente.');
              $('#appView').css('display', 'block');
              $('#appViewNext').empty();
              return _this.filtrar();
            } else {
              return Singleton.get().showInformacion('El producto esta siendo ocupado en la Lista : ' + data);
            }
          };
        })(this));
      };

      Productos.prototype.cancelar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appViewNext').html("");
        $('#appView').css('display', 'inline');
        return Singleton.get().hideLoading();
      };

      Productos.prototype.cargareditar = function(data) {
        $('#nombreproducto').attr("value", data[0].Nombre);
        $('#categoriaselect').attr("value", data[0].Id_Categoria);
        return this.nombreProductoEditar = data[0].Nombre;
      };

      Productos.prototype.volveriteminicial = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        $('#appView').css('display', 'block');
        $('#appViewNext').empty();
        return Singleton.get().hideLoading();
      };

      Productos.prototype.modalBuscarProducto = function(e) {
        var nombreProducto, radioOption;
        e.preventDefault();
        e.stopPropagation();
        nombreProducto = $('#inputModalBuscarCliente').val();
        console.log('nombreProducto');
        console.log(nombreProducto);
        radioOption = '';
        $.ajax({
          url: base_url + "/index.php/services/restricciones/buscarProducto/nombre/" + nombreProducto,
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(productos) {
              var i, len, p;
              console.log('productos');
              console.log(productos);
              for (i = 0, len = productos.length; i < len; i++) {
                p = productos[i];
                radioOption += '<tr>';
                radioOption += '<td class="td-radio"><input type="radio" name="tabla" value="' + p.Id_Producto + '"></td>';
                radioOption += '<td class="td-nombre">' + p.Nombre + '</td>';
                radioOption += '<td>' + p.Id_Producto + '</td>';
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
        return false;
      };

      Productos.prototype.modalAceptarProducto = function(e) {
        var idPro;
        e.preventDefault();
        e.stopPropagation();
        idPro = '';
        $("#tablaModalMostrarClientes tbody tr").each(function(index) {
          var nombre;
          if ($(this).children("td")[0].childNodes[0].checked === true) {
            idPro = $(this).children("td")[2].textContent;
            nombre = $(this).children("td")[1].textContent;
            return $('#autoc1').val(nombre);
          }
        });
        $('#modal').modal('hide');
        return false;
      };

      return Productos;

    })(Backbone.View);
  });

}).call(this);
