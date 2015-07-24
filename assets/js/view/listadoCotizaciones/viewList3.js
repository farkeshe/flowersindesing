(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/listadoCotizaciones/viewList.html', 'text!tpl/listadoCotizaciones/viewFiltro.html', 'text!tpl/gestorCotizaciones/modalCliente.html', 'assets/js/view/paginador', 'text!tpl/listadoCotizaciones/viewReasignar.html', 'text!tpl/listadoCotizaciones/viewDespachar.html', 'text!tpl/listadoCotizaciones/viewEntregar.html', 'text!tpl/listadoCotizaciones/comentariosEntregada.html', 'text!tpl/listadoCotizaciones/comentariosAnulada.html', 'assets/js/view/gestorCotizaciones/editarCotizacion', 'assets/js/view/historialCotizaciones/tracking', 'assets/js/model/comentarios'], function(Backbone, TplviewList, TplviewFiltro, TplmodalCliente, Paginador, TplviewReasignar, TplviewDespachar, TplviewEntregar, tplcomentariosEntregada, tplcomentariosAnulada, viewEditarCotizacion, viewTracking, ComentariosModel) {
    var verLista;
    return verLista = (function(superClass) {
      extend(verLista, superClass);

      function verLista() {
        this.initPaginador = bind(this.initPaginador, this);
        this.filtrarListado = bind(this.filtrarListado, this);
        this.cargarFiltroProducto = bind(this.cargarFiltroProducto, this);
        this.cargarFiltroVendedor = bind(this.cargarFiltroVendedor, this);
        this.cargarFiltroClase = bind(this.cargarFiltroClase, this);
        this.showExportarPDF = bind(this.showExportarPDF, this);
        this.showTracking = bind(this.showTracking, this);
        this.modalcomentariosEntregada = bind(this.modalcomentariosEntregada, this);
        this.modalcomentariosAnulada = bind(this.modalcomentariosAnulada, this);
        this.showCambiarClase = bind(this.showCambiarClase, this);
        this.showReasignar = bind(this.showReasignar, this);
        this.showRecotizar = bind(this.showRecotizar, this);
        this.showClonar = bind(this.showClonar, this);
        this.showEliminar = bind(this.showEliminar, this);
        this.showEditar = bind(this.showEditar, this);
        this.showConsultar = bind(this.showConsultar, this);
        this.showacciones = bind(this.showacciones, this);
        this.clickTr = bind(this.clickTr, this);
        this.modalAceptarCliente = bind(this.modalAceptarCliente, this);
        this.modalBuscarCliente = bind(this.modalBuscarCliente, this);
        this.showModalCliente = bind(this.showModalCliente, this);
        this.showfiltrar = bind(this.showfiltrar, this);
        this.cargar = bind(this.cargar, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return verLista.__super__.constructor.apply(this, arguments);
      }

      verLista.prototype.initialize = function() {
        this.paginador = new Paginador();
        Singleton.get().showLoading();
        this.objData = {
          idClase: '0',
          idVendedor: '0',
          idCliente: '',
          idDestinatario: '0',
          idCentroNegocio: '0',
          idForma: '0',
          idProducto: '0',
          fechaDesde: '',
          fechaHasta: '',
          idPerfil: Singleton.get().idPerfilUsuarioLogueado,
          idUsuario: Singleton.get().idUsuarioLogueado,
          start: this.paginador.start,
          end: '14'
        };
        return this.init();
      };

      verLista.prototype.init = function() {
        $('#appView').html(_.template(TplviewFiltro)({}));
        this.cargarFiltroClase();
        this.cargarFiltroProducto();
        this.cargarFiltroVendedor();
        this.cargar();
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
        $('#buscarCliente').tooltip({
          'trigger': 'hover',
          'delay': {
            'show': 100,
            'hide': 100
          }
        });
        if (Singleton.get().idPerfilUsuarioLogueado !== '2') {
          $('#flitroVendedor').attr('disabled', 'disabled');
        }
        $('.scroll').css('height', window.innerHeight - 75);
        $('#fechaDesde').datepicker({
          dateFormat: "dd/mm/yy",
          dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
          monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        });
        $('#fechaHasta').datepicker({
          dateFormat: "dd/mm/yy",
          dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
          monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        });
        $('#filtrar').click((function(_this) {
          return function(e) {
            return _this.showfiltrar(e);
          };
        })(this));
        $('#buscarCliente').click((function(_this) {
          return function(e) {
            return _this.showModalCliente(e);
          };
        })(this));
        $('#acciones').change((function(_this) {
          return function(e) {
            return _this.showacciones(e);
          };
        })(this));
        $('#autoc1').focusout((function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($('#DV').val() === '' && $('#autoc1').val() !== '') {
              Singleton.get().showInformacion('El cliente ingresado no existe');
              $('#autoc1').val('');
            }
            return false;
          };
        })(this));
        return $(document).on("keyup", "#autoc1", (function(_this) {
          return function(e) {
            if (event.keyCode !== 13) {
              e.preventDefault();
              e.stopPropagation();
              $('#DV').val('');
              $('#consignatario').html('<option value="0" selected="selected">Seleccione</option>');
            }
            return false;
          };
        })(this));
      };

      verLista.prototype.cargar = function(e) {
        $.ajax({
          url: base_url + "/index.php/services/listadoCotizacion/CargaPedidos",
          type: 'POST',
          data: this.objData,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(s) {
              console.log("CARGAR SUCCESS");
              console.log(s);
              return $('#filtroResultados').html(_.template(TplviewList)({
                pedidos: s
              }));
            };
          })(this)
        });
        return Singleton.get().hideLoading();
      };

      verLista.prototype.showfiltrar = function(e) {
        var aux, fechaDesde, fechaHasta;
        e.preventDefault();
        e.stopPropagation();
        Singleton.get().showLoading();
        fechaDesde = '';
        fechaHasta = '';
        if ($('#fechaDesde').val() !== '') {
          fechaDesde = Singleton.get().invertirFecha($('#fechaDesde').val(), 'I');
        }
        if ($('#fechaHasta').val() !== '') {
          fechaHasta = Singleton.get().invertirFecha($('#fechaHasta').val(), 'I');
        }
        if (fechaHasta < fechaDesde) {
          aux = fechaDesde;
          fechaDesde = fechaHasta;
          fechaHasta = aux;
        }
        console.log($('#consignatario').find(':selected').val());
        this.objData = {
          idClase: $('#filtroClase').find(':selected').val(),
          idVendedor: $('#flitroVendedor').find(':selected').val(),
          idCliente: $('#DV').val(),
          idDestinatario: $('#consignatario').find(':selected').val(),
          idProducto: $('#producto').find(':selected').val(),
          fechaDesde: fechaDesde,
          fechaHasta: fechaHasta,
          idPerfil: Singleton.get().idPerfilUsuarioLogueado,
          idUsuario: Singleton.get().idUsuarioLogueado,
          start: this.paginador.start,
          end: '3'
        };
        console.log(this.objData);
        $.ajax({
          url: base_url + "/index.php/services/listadoCotizacion/contarRegistros",
          type: 'POST',
          data: this.objData,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(result) {
              console.log(result);
              _this.paginador.init(0, 14, result[0].Cantidad_Total);
              $('#labelPaginador').html(_this.paginador.label());
              $(_this)[0].objData.end = _this.paginador.end;
              $(_this)[0].objData.start = _this.paginador.start;
              return Singleton.get().hideLoading();
            };
          })(this),
          error: (function(_this) {
            return function(result) {
              Singleton.get().hideLoading();
              return Singleton.get().showError('No existe el filtro');
            };
          })(this)
        });
        return Singleton.get().hideLoading();
      };

      verLista.prototype.showModalCliente = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('#modal').css('width', 475);
        $('#modal').css('height', 465);
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

      verLista.prototype.modalBuscarCliente = function(e) {
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

      verLista.prototype.modalAceptarCliente = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $("#tablaModalMostrarClientes tbody tr").each(function(index) {
          var nombreCiente, option, rutCliente;
          if ($(this).children("td")[0].childNodes[0].checked === true) {
            rutCliente = $(this).children("td")[0].firstElementChild.value;
            nombreCiente = $(this).children("td")[1].textContent;
            $('#DV').val(rutCliente);
            $('#autoc1').val(nombreCiente);
            option = '<option value="0" selected="selected">Seleccione</option>';
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
                  var d, i, len;
                  for (i = 0, len = destino.length; i < len; i++) {
                    d = destino[i];
                    option += '<option value="' + d.Id_Destino + '" selected="selected">' + d.Nombre_Contacto + '</option>';
                  }
                  $('#consignatario').html(option);
                  return $('#consignatario option[value=0]').attr('selected', true);
                };
              })(this),
              error: (function(_this) {
                return function(data) {
                  $('#consignatario').empty();
                  $('#consignatario').html('<option value="0" selected="selected">Seleccione</option>');
                  return $('#consignatario option[value=0]').attr('selected', true);
                };
              })(this)
            });
          }
        });
        $('#modal').modal('hide');
        return false;
      };

      verLista.prototype.clickTr = function(e) {
        var option;
        e.preventDefault();
        e.stopPropagation();
        $(e.currentTarget).addClass('active');
        $(e.currentTarget).siblings().removeClass('active');
        Singleton.get().idCotizacionListado = e.currentTarget.childNodes[1].textContent;
        Singleton.get().idVendedorListado = e.currentTarget.id;
        option = '<option value="0">Acciones</option>';
        option += '<option value="1">Consultar</option>';
        if (e.currentTarget.childNodes[3].textContent === 'Pendiente') {
          option += '<option value="2">Editar</option>';
          option += '<option value="7">En Proceso</option>';
        }
        if (e.currentTarget.childNodes[3].textContent === 'Proceso') {
          option += '<option value="9">Anular</option>';
          option += '<option value="10">Despachar</option>';
        }
        if (e.currentTarget.childNodes[3].textContent !== 'Pendiente' && e.currentTarget.childNodes[3].textContent !== 'Anulada') {
          option += '<option value="4">Clonar</option>';
        }
        if (e.currentTarget.childNodes[3].textContent === 'Despachada') {
          option += '<option value="11">Entregar</option>';
        }
        if (Singleton.get().idPerfilUsuarioLogueado === '1' || Singleton.get().idPerfilUsuarioLogueado === '2') {
          option += '<option value="12">Ver Tracking</option>';
        }
        option += '<option value="14">Exportar a PDF</option>';
        $('#acciones').html(option);
        $('#acciones option[value=0]').attr('selected', true);
        return false;
      };

      verLista.prototype.showacciones = function(e) {
        var accion;
        e.preventDefault();
        e.stopPropagation();
        accion = $('#acciones').find(':selected').val();
        $('#acciones option[value=0]').attr('selected', true);
        switch (accion) {
          case '1':
            this.showConsultar();
            break;
          case '2':
            this.showEditar();
            break;
          case '4':
            this.showClonar();
            break;
          case '7':
            $.ajax({
              url: base_url + "/index.php/services/listadoCotizacion/existeCliente/idCotizacion/" + (Singleton.get().idCotizacionListado),
              type: 'GET',
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: (function(_this) {
                return function(result) {
                  if (result[0].Existe === '1') {
                    return _this.showCambiarClase('3');
                  } else {
                    return Singleton.get().showInformacion('Debe asignar un cliente para el pedido seleccionado');
                  }
                };
              })(this),
              error: (function(_this) {
                return function(data) {
                  return Singleton.get().showError('Error en la conexión con la base de datos');
                };
              })(this)
            });
            break;
          case '9':
            this.showCambiarClase('4');
            break;
          case '10':
            this.showCambiarClase('7');
            break;
          case '11':
            this.showCambiarClase('9');
            break;
          case '12':
            this.showTracking();
            break;
          case '14':
            this.showExportarPDF();
        }
        return false;
      };

      verLista.prototype.showConsultar = function() {
        Singleton.get().showModalCotizacion(Singleton.get().idCotizacionListado);
        return false;
      };

      verLista.prototype.showEditar = function() {
        var editarCotizacion;
        $(document).unbind('click');
        $(document).unbind('change');
        $(document).unbind('focus');
        $(document).unbind('focusout');
        $(document).unbind('keyup');
        editarCotizacion = new viewEditarCotizacion(Singleton.get().idCotizacionListado);
        return false;
      };

      verLista.prototype.showEliminar = function() {
        Singleton.get().showAdvertencia();
        $('#btnAceptarAdvertencia').click((function(_this) {
          return function(e) {
            var idCotizacion;
            e.preventDefault();
            e.stopPropagation();
            idCotizacion = Singleton.get().idCotizacionListado;
            return $.ajax({
              url: base_url + "/index.php/services/listadoCotizacion/eliminarCotizacion/idCotizacion/" + idCotizacion,
              type: 'DELETE',
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: function(result) {
                if (result === 'true') {
                  Singleton.get().showExito();
                  return $('#btnExito').click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    Singleton.get().showLoading();
                    _this.filtrarListado();
                    return false;
                  });
                } else {
                  return Singleton.get().showError('Error en la conexión con la base de datos');
                }
              },
              error: function(data) {
                return Singleton.get().showError('Error en la conexión con la base de datos');
              }
            });
          };
        })(this));
        return false;
      };

      verLista.prototype.showClonar = function() {
        Singleton.get().showAdvertencia();
        $('#btnAceptarAdvertencia').click((function(_this) {
          return function(e) {
            var idCotizacion;
            e.preventDefault();
            e.stopPropagation();
            idCotizacion = Singleton.get().idCotizacionListado;
            return $.ajax({
              url: base_url + "/index.php/services/listadoCotizacion/clonarCotizacion/idCotizacion/" + idCotizacion + "/idUsuario/" + (Singleton.get().idUsuarioLogueado),
              type: 'POST',
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: function(result) {
                if (result[0] === 'true') {
                  Singleton.get().showExito();
                  return $('#btnExito').click(function(e) {
                    var editarCotizacion;
                    e.preventDefault();
                    e.stopPropagation();
                    $(_this)[0].objData.start = 0;
                    _this.initPaginador();
                    _this.filtrarListado();
                    $(document).unbind('click');
                    $(document).unbind('change');
                    $(document).unbind('focus');
                    $(document).unbind('focusout');
                    $(document).unbind('keyup');
                    editarCotizacion = new viewEditarCotizacion(result[1]);
                    return false;
                  });
                } else {
                  return Singleton.get().showError('Error en la conexión con la base de datos');
                }
              },
              error: function(data) {
                return Singleton.get().showError('Error en la conexión con la base de datos');
              }
            });
          };
        })(this));
        return false;
      };

      verLista.prototype.showRecotizar = function() {
        Singleton.get().showAdvertencia();
        $('#btnAceptarAdvertencia').click((function(_this) {
          return function(e) {
            var idCotizacion;
            e.preventDefault();
            e.stopPropagation();
            idCotizacion = Singleton.get().idCotizacionListado;
            return $.ajax({
              url: base_url + "/index.php/services/listadoCotizacion/recotizarCotizacion/idCotizacion/" + idCotizacion + "/idUsuario/" + (Singleton.get().idUsuarioLogueado),
              type: 'POST',
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: function(result) {
                if (result[0] === 'true') {
                  Singleton.get().showExito();
                  return $('#btnExito').click(function(e) {
                    var editarCotizacion;
                    e.preventDefault();
                    e.stopPropagation();
                    $(_this)[0].objData.start = 0;
                    _this.initPaginador();
                    _this.filtrarListado();
                    $(document).unbind('click');
                    $(document).unbind('change');
                    $(document).unbind('focus');
                    $(document).unbind('focusout');
                    $(document).unbind('keyup');
                    editarCotizacion = new viewEditarCotizacion(result[1]);
                    return false;
                  });
                } else {
                  return Singleton.get().showError('Error en la conexión con la base de datos');
                }
              },
              error: function(data) {
                return Singleton.get().showError('Error en la conexión con la base de datos');
              }
            });
          };
        })(this));
        return false;
      };

      verLista.prototype.showReasignar = function() {
        var idPerfil, newRow;
        idPerfil = Singleton.get().idPerfilUsuarioLogueado;
        newRow = '';
        $('#modal').css('width', 500);
        $('#modal').css('height', 273);
        $('#modal').css('left', '55.5%');
        $('#modal').css('top', '50%');
        $('#modal').css('background-color', '#f6f6f6');
        $('#modal').html(_.template(TplviewReasignar));
        $('#modal').modal('show');
        $('#subtituloModalListaPrecio').html('Pedido Nº ' + Singleton.get().idCotizacionListado);
        $.ajax({
          url: base_url + "/index.php/services/listadoCotizacion/cargarVendedores/id/" + idPerfil,
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(data) {
              var d, i, len;
              for (i = 0, len = data.length; i < len; i++) {
                d = data[i];
                newRow += '<tr idSupervisor="' + d.Id_Supervisor + '">';
                newRow += '<td class="td-radio"><input type="radio" name="tabla" value="' + d.Id_Usuario + '"></td>';
                newRow += '<td class="td-lista">' + d.Nombre + '</td>';
                newRow += '<td class="td-precio">' + d.Perfil + '</td>';
                if (d.Supervisor !== null) {
                  newRow += '<td class="td-tipo">' + d.Supervisor + '</td>';
                } else {
                  newRow += '<td class="td-tipo"></td>';
                }
                newRow += '<td>' + d.Sucursal + '</td>';
                newRow += '</tr>';
              }
              $('#tablaModalReasignar tbody').html(newRow);
              return $.each($('#tablaModalReasignar')[0].childNodes[1].children, function(index, value) {
                if ($(this)[0].cells[0].childNodes[0].value === Singleton.get().idVendedorListado) {
                  return $(this)[0].cells[0].childNodes[0].checked = true;
                }
              });
            };
          })(this)
        }, $('#btnGuardarVendedor').click((function(_this) {
          return function(e) {
            var idCotizacion, idSupervisor, idVendedor;
            e.preventDefault();
            e.stopPropagation();
            idVendedor = 0;
            idSupervisor = 0;
            idCotizacion = Singleton.get().idCotizacionListado;
            $("#tablaModalReasignar tbody tr").each(function(index) {
              if ($(this).children("td")[0].childNodes[0].checked === true) {
                idVendedor = $(this).children("td")[0].childNodes[0].value;
                return idSupervisor = $(this)[0].attributes[0].value;
              }
            });
            return $.ajax({
              url: base_url + "/index.php/services/listadoCotizacion/updateVendedores/idVendedor/" + idVendedor + "/idSupervisor/" + idSupervisor + "/idCotizacion/" + idCotizacion,
              type: 'PUT',
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: function(result) {
                if (result === 'true') {
                  Singleton.get().showExito();
                  return $('#btnExito').click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    Singleton.get().showLoading();
                    _this.filtrarListado();
                    return false;
                  });
                } else {
                  return Singleton.get().showError('Error en la conexión con la base de datos');
                }
              },
              error: function(data) {
                return Singleton.get().showError('Error en la conexión con la base de datos');
              }
            });
          };
        })(this)));
        return false;
      };

      verLista.prototype.showCambiarClase = function(clase) {
        Singleton.get().showAdvertencia();
        $('#btnAceptarAdvertencia').click((function(_this) {
          return function(e) {
            var idCotizacion, idUsuario;
            e.preventDefault();
            e.stopPropagation();
            idCotizacion = Singleton.get().idCotizacionListado;
            idUsuario = Singleton.get().idUsuarioLogueado;
            return $.ajax({
              url: base_url + "/index.php/services/listadoCotizacion/cambiarClase/idCotizacion/" + idCotizacion + "/clase/" + clase + "/idUsuario/" + idUsuario,
              type: 'PUT',
              async: false,
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: function(result) {
                if (result === 'true') {
                  Singleton.get().showExito();
                  return $('#btnExito').click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (clase !== '9' && clase !== '4') {
                      Singleton.get().showLoading();
                      _this.filtrarListado();
                    }
                    if (clase === '9') {
                      _this.modalcomentariosEntregada();
                    }
                    if (clase === '4') {
                      _this.modalcomentariosAnulada();
                    }
                    return false;
                  });
                } else {
                  return Singleton.get().showError('Error en la conexión con la base de datos');
                }
              },
              error: function(data) {
                return Singleton.get().showError('Error en la conexión con la base de datos');
              }
            });
          };
        })(this));
        return false;
      };

      verLista.prototype.modalcomentariosAnulada = function() {
        var radioOption;
        $('#modal').css('width', 475);
        $('#modal').css('height', 465);
        $('#modal').css('top', '50%');
        $('#modal').css('left', '55.5%');
        $('#modal').css('background-color', '#f6f6f6');
        $('#modal').html(_.template(tplcomentariosAnulada)());
        $('#Head1').html('&nbsp;&nbsp;&nbsp;Motivo');
        radioOption = '';
        $.ajax({
          url: base_url + "/index.php/services/listadoCotizacion/buscarMotivos/",
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(motivos) {
              var i, len, m;
              for (i = 0, len = motivos.length; i < len; i++) {
                m = motivos[i];
                radioOption += '<tr>';
                radioOption += '<td class="td-radio"><input type="radio" name="tabla" value="' + m.Id_Opcion + '"></td>';
                radioOption += '<td class="td-nombre">' + m.Detalle + '</td>';
                radioOption += '</tr>';
              }
              return $('#tablaModalMostrarOpciones tbody').html(radioOption);
            };
          })(this),
          error: (function(_this) {
            return function(data) {
              return $('#tablaModalMostrarOpciones tbody').empty();
            };
          })(this)
        });
        $('#btnMotivoAceptar').click((function(_this) {
          return function(e) {
            var Validator, datos, opcion;
            e.preventDefault();
            e.stopPropagation();
            Validator = true;
            if (_.isUndefined($('input[name=tabla]:checked').val()) && $('#comentarios').val() === "") {
              Validator = false;
              console.log($('input[name=tabla]:checked').val());
            }
            if (Validator === true) {
              opcion = "";
              if (_.isUndefined($('input[name=tabla]:checked').val())) {
                opcion = "";
              } else {
                opcion = $('input[name=tabla]:checked').val();
              }
              datos = {
                idcotizacion: Singleton.get().idCotizacionListado,
                idopcion: opcion,
                comentarios: $('#comentarios').val()
              };
              new ComentariosModel().guardarcomentarioanulacion(datos, function(data) {});
              $('#modal').modal('hide');
              return _this.filtrarListado();
            }
          };
        })(this));
        return false;
      };

      verLista.prototype.modalcomentariosEntregada = function() {
        $('#modal').css('width', 651);
        $('#modal').css('height', 360);
        $('#modal').css('left', '45.5%');
        $('#modal').css('background-color', '#f6f6f6');
        $('#modal').html(_.template(tplcomentariosEntregada)());
        $('#mensajehora').css('display', 'none');
        $(document).on("change", ".rg", (function(_this) {
          return function(e) {
            if ($("#radio1").attr("checked")) {
              $('#receptor').val("");
              $('#receptor').attr('disabled', 'disabled');
              $('.mensaje2').html("&nbsp;&nbsp");
            } else {
              $('.mensaje2').html("*");
              $('.mensaje2').css('display', 'inline');
              $("#receptor").removeAttr("disabled");
            }
            return false;
          };
        })(this));
        $('#hora').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        $('#minutos').keydown(function(event) {
          if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

          } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
              return event.preventDefault();
            }
          }
        });
        $(document).on("focusout", "#hora", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($('#hora').val() > 23) {
              $('#hora').val("");
              $('#mensajehora').html("Hora no valida");
              return $('#mensajehora').css('display', 'inline');
            }
          };
        })(this));
        $(document).on("focus", "#hora", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return $('#mensajehora').css('display', 'none');
          };
        })(this));
        $(document).on("focusout", "#minutos", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($('#minutos').val() > 59) {
              $('#minutos').val("");
              $('#mensajehora').html("minutos no validos");
              return $('#mensajehora').css('display', 'inline');
            }
          };
        })(this));
        $(document).on("focus", "#minutos", (function(_this) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            return $('#mensajehora').css('display', 'none');
          };
        })(this));
        return $('#guardardestinatario').click((function(_this) {
          return function(e) {
            var Validator, datos;
            e.preventDefault();
            e.stopPropagation();
            Validator = true;
            if ($('input[name=radios]:checked').val() === '1') {
              if ($('#hora').val() === '' || $('#minutos').val() === '') {
                Validator = false;
              }
            } else {
              if ($('#hora').val() === '' || $('#minutos').val() === '' || $('#receptor').val() === '' || $('#comentarios').val() === '') {
                Validator = false;
              }
            }
            if (Validator === true) {
              datos = {
                idcotizacion: Singleton.get().idCotizacionListado,
                recibiodestinatario: $('input[name=radios]:checked').val(),
                nombrereceptor: $('#receptor').val(),
                hora: $('#hora').val() + ":" + $('#minutos').val(),
                comentarios: $('#comentarios').val()
              };
              new ComentariosModel().guardarcomentarioentrega(datos, function(data) {});
              $('#modal').modal('hide');
              return _this.filtrarListado();
            }
          };
        })(this));
      };

      false;

      verLista.prototype.showTracking = function() {
        Singleton.get().idPedidoTracking = Singleton.get().idCotizacionListado;
        $('#ListadoCotizacion').removeClass('active');
        $('#trackingCotizacion').addClass('active');
        this.tracking = new viewTracking();
        return false;
      };

      verLista.prototype.showExportarPDF = function() {
        return $.ajax({
          url: base_url + "/index.php/services/cotizacion/buscarCotizacion/idCotizacion/" + (Singleton.get().idCotizacionListado),
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(cotizacion) {
              return $.ajax({
                url: base_url + "/index.php/services/cotizacion/buscarItems/idCotizacion/" + (Singleton.get().idCotizacionListado),
                type: 'GET',
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(items) {
                  $('#ExportarPDF').attr('action', 'index.php/services/exportar/exportarcotPDF');
                  return $("#ExportarPDF").submit();
                }
              });
            };
          })(this)
        });
      };

      verLista.prototype.cargarFiltroClase = function() {
        var option;
        option = '<option value="0" selected="selected">Seleccione</option>';
        $.ajax({
          url: base_url + "/index.php/services/listadoCotizacion/cargarFiltroClase",
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(clases) {
              var c, i, len;
              for (i = 0, len = clases.length; i < len; i++) {
                c = clases[i];
                option += '<option value="' + c.Id_Clase + '" selected="selected">' + c.Nombre + '</option>';
              }
              $('#filtroClase').html(option);
              return $('#filtroClase option[value=0]').attr('selected', true);
            };
          })(this),
          error: (function(_this) {
            return function(data) {
              $('#filtroClase').html('<option value="0" selected="selected">Seleccione</option>');
              return $('#filtroClase option[value=0]').attr('selected', true);
            };
          })(this)
        });
        return false;
      };

      verLista.prototype.cargarFiltroVendedor = function() {
        var option;
        option = '<option value="0" selected="selected">Seleccione</option>';
        $.ajax({
          url: base_url + "/index.php/services/listadoCotizacion/cargarFiltroVendedor",
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(vendedores) {
              var i, len, v;
              for (i = 0, len = vendedores.length; i < len; i++) {
                v = vendedores[i];
                option += '<option value="' + v.Id_Usuario + '" selected="selected">' + v.Nombre + '</option>';
              }
              $('#flitroVendedor').html(option);
              return $('#flitroVendedor option[value=0]').attr('selected', true);
            };
          })(this),
          error: (function(_this) {
            return function(data) {
              $('#flitroVendedor').html('<option value="0" selected="selected">Seleccione</option>');
              return $('#flitroVendedor option[value=0]').attr('selected', true);
            };
          })(this)
        });
        return false;
      };

      verLista.prototype.cargarFiltroProducto = function() {
        var idCentroNegocio, idFormas, option;
        idCentroNegocio = $('#centroNegocio').find(':selected').val();
        idFormas = $('#forma').find(':selected').val();
        option = '<option value="0" selected="selected">Seleccione</option>';
        $.ajax({
          url: base_url + "/index.php/services/listadoCotizacion/cargarFiltroProducto",
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(productos) {
              var P, i, len;
              for (i = 0, len = productos.length; i < len; i++) {
                P = productos[i];
                option += '<option value="' + P.Id_Producto + '" selected="selected">' + P.Nombre + '</option>';
              }
              $('#producto').html(option);
              return $('#producto option[value=0]').attr('selected', true);
            };
          })(this),
          error: (function(_this) {
            return function(data) {
              $('#producto').html('<option value="0" selected="selected">Seleccione</option>');
              return $('#producto option[value=0]').attr('selected', true);
            };
          })(this)
        });
        return false;
      };

      verLista.prototype.filtrarListado = function() {
        var option, row;
        row = '';
        option = '<option value="0">Acciones</option>';
        $('#acciones').html(option);
        $('#acciones option[value=0]').attr('selected', true);
        $.ajax({
          url: base_url + "/index.php/services/listadoCotizacion",
          type: 'POST',
          data: this.objData,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(result) {
              var i, len, r;
              for (i = 0, len = result.length; i < len; i++) {
                r = result[i];
                row += '<tr id="' + r.Id_Vendedor + '">';
                row += '<td style="width: 4.7%;">';
                row += '<td style="width: 10.5%;">' + r.Id_Pedidos + '</td>';
                row += '<td style="width: 10.5%;">' + Singleton.get().invertirFecha(r.FechaHoraDespacho.substring(0, 10)) + ' ' + r.FechaHoraDespacho.substring(10, 16) + '</td>';
                row += '<td style="width: 10.5%;">' + r.Clase + '</td>';
                row += '<td style="width: 11.3%;">' + r.Nombre_Contacto + '</td>';
                row += '<td style="width: 10.5%;">' + r.Vendedor + '</td>';
                if (r.Cliente !== null) {
                  row += '<td style="width: 10.5%;">' + r.Cliente + '</td>';
                } else {
                  row += '<td style="width: 10.5%;"></td>';
                }
                row += '<td align="right" style="width: 10.5%;">' + Singleton.get().miles(r.Total) + '</td>';
                row += '</tr>';
              }
              $('#myTable tbody tr').addClass('delete');
              $('#myTable tbody').append(row);
              $('#myTable').trigger("update");
              $('#myTable').trigger("appendCache");
              $('#myTable').tablesorter({
                usNumberFormat: false,
                dateFormat: "dd/mm/yyyy",
                headers: {
                  0: {
                    sorter: false
                  },
                  2: {
                    sorter: "datetime"
                  }
                },
                sortList: [[0, 0]]
              });
              $('#myTable tbody tr.delete').remove();
              $('#myTable').trigger('update');
              $('.tablesorter-header').css('background-position', 'right');
              $('#tablaBodyListado tr').click(function(e) {
                return _this.clickTr(e);
              });
              return Singleton.get().hideLoading();
            };
          })(this),
          error: (function(_this) {
            return function(data) {
              $('#tablaBodyListado').empty();
              return Singleton.get().hideLoading();
            };
          })(this)
        });
        return false;
      };

      verLista.prototype.initPaginador = function() {
        $.ajax({
          url: base_url + "/index.php/services/listadoCotizacion/contarRegistros",
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
              return $('#labelPaginador').html(_this.paginador.label());
            };
          })(this)
        });
        return false;
      };

      return verLista;

    })(Backbone.View);
  });

}).call(this);
