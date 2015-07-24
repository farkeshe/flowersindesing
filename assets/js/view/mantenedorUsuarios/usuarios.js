(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'text!tpl/mantenedorUsuarios/usuarios.html', 'text!tpl/mantenedorUsuarios/nuevousuarios.html', 'text!tpl/mantenedorUsuarios/editarusuarios.html', 'text!tpl/mantenedorUsuarios/resultadousuarios.html', 'text!tpl/mantenedorUsuarios/restricciones.html', 'assets/js/view/paginador'], function(Backbone, Tplusuarios, Tplnuevousuario, Tpleditarusuarios, Tplresultadosusuarios, Tplrestricciones, Paginador) {
    var entidades;
    return entidades = (function(superClass) {
      extend(entidades, superClass);

      function entidades() {
        this.clickTr = bind(this.clickTr, this);
        this.eliminar = bind(this.eliminar, this);
        this.guardarusuarioeditar = bind(this.guardarusuarioeditar, this);
        this.editar = bind(this.editar, this);
        this.filtrar = bind(this.filtrar, this);
        this.cargar = bind(this.cargar, this);
        this.guardarusuario = bind(this.guardarusuario, this);
        this.nueva = bind(this.nueva, this);
        this.usuarios = bind(this.usuarios, this);
        this.init = bind(this.init, this);
        this.initialize = bind(this.initialize, this);
        return entidades.__super__.constructor.apply(this, arguments);
      }

      entidades.prototype.el = 'body';

      entidades.prototype.initialize = function() {
        this.paginador = new Paginador();
        this.objData = {
          sucursal: "vacio",
          perfil: "vacio",
          start: '0',
          end: '14'
        };
        return this.init();
      };

      entidades.prototype.init = function() {
        Singleton.get().showLoading();
        if (Singleton.get().idPerfilUsuarioLogueado === '1' || Singleton.get().idPerfilUsuarioLogueado === '2') {
          return $.ajax({
            url: base_url + "/index.php/services/usuarios/perfil",
            type: 'GET',
            statusCode: {
              302: function() {
                return Singleton.get().reload();
              }
            },
            success: (function(_this) {
              return function(p) {
                return $.ajax({
                  url: base_url + "/index.php/services/usuarios/sucursal",
                  type: 'GET',
                  statusCode: {
                    302: function() {
                      return Singleton.get().reload();
                    }
                  },
                  success: function(s) {
                    $('#appView').html(_.template(Tplusuarios)({
                      perfiles: p,
                      sucursal: s
                    }));
                    _this.filtrar();
                    Singleton.get().hideLoading();
                    $('#accionesusuarios').change(function(e) {
                      return _this.usuarios(e);
                    });
                    $('#nuevousuario').click(function(e) {
                      return _this.nueva(e);
                    });
                    $('.scroll').css('height', window.innerHeight - 75);
                    $('#filtrarUsuarios').click(function(e) {
                      return _this.filtrar();
                    });
                    $('#next').click(function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      Singleton.get().showLoading();
                      return $.ajax({
                        url: base_url + "/index.php/services/usuarios/contarRegistros",
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
                        url: base_url + "/index.php/services/usuarios/contarRegistros",
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
                    });
                  }
                });
              };
            })(this)
          });
        } else {
          this.idusuario = Singleton.get().idUsuarioLogueado;
          return this.editar();
        }
      };

      entidades.prototype.usuarios = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if ("nueva" === $('#accionesusuarios').find(':selected').val()) {
          this.nueva(e);
        }
        if ("editar" === $('#accionesusuarios').find(':selected').val()) {
          this.editar();
        }
        if ("eliminar" === $('#accionesusuarios').find(':selected').val()) {
          return this.eliminar(e);
        }
      };

      entidades.prototype.nueva = function() {
        Singleton.get().showLoading();
        return $.ajax({
          url: base_url + "/index.php/services/usuarios/sucursal",
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(d) {
              return $.ajax({
                url: base_url + "/index.php/services/usuarios/perfil",
                type: 'GET',
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(p) {
                  return $.ajax({
                    url: base_url + "/index.php/services/usuarios/supervisor",
                    type: 'GET',
                    statusCode: {
                      302: function() {
                        return Singleton.get().reload();
                      }
                    },
                    success: function(s) {
                      $('#appView').html(_.template(Tplnuevousuario)({
                        sucursales: d,
                        perfiles: p,
                        supervisor: s
                      }));
                      $('#telefono').keydown(function(event) {
                        if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

                        } else {
                          if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                            return event.preventDefault();
                          }
                        }
                      });
                      $('#celular').keydown(function(event) {
                        if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

                        } else {
                          if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                            return event.preventDefault();
                          }
                        }
                      });
                      $(document).on("focusout", "#telefono", function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if ($('#telefono').val() !== '') {
                          if (!$.isNumeric(Singleton.get().cleanValor($('#telefono').val()))) {
                            Singleton.get().showError('El Valor Ingresado es Incorrecto');
                            $('#telefono').val('0');
                          }
                        }
                        return false;
                      });
                      $(document).on("focusout", "#celular", function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if ($('#celular').val() !== '') {
                          if (!$.isNumeric(Singleton.get().cleanValor($('#celular').val()))) {
                            Singleton.get().showError('El Valor Ingresado es Incorrecto');
                            $('#celular').val('0');
                          }
                        }
                        return false;
                      });
                      $(document).on("focusout", "#perfil", function(e) {
                        var i, len, option;
                        e.preventDefault();
                        e.stopPropagation();
                        option = "";
                        if ($('#perfil').val() === '1' || $('#perfil').val() === '2') {
                          $('#responsable').html('<option value="">Seleccione...</option>');
                        } else {
                          for (i = 0, len = s.length; i < len; i++) {
                            e = s[i];
                            option += '<option value="' + e.Id_Usuario + '" selected="selected">' + e.Nombre + '</option>';
                          }
                          $('#responsable').html(option);
                        }
                        return false;
                      });
                      Singleton.get().hideLoading();
                      $('#cancelarestado').click(function(e) {
                        return _this.initialize();
                      });
                      return $('#guardarestado').click(function(e) {
                        return _this.guardarusuario();
                      });
                    }
                  });
                }
              });
            };
          })(this)
        });
      };

      entidades.prototype.guardarusuario = function() {
        var celular, consignatario, datos, email, nombre, pass, perfil, repitpass, supervisor, telefono, user;
        Singleton.get().showLoading();
        perfil = $('#perfil').val();
        supervisor = $('#responsable').val();
        nombre = $('#nombre').val();
        pass = $('#passwd').val();
        repitpass = $('#repitpass').val();
        telefono = $('#telefono').val();
        celular = $('#celular').val();
        email = $('#email').val();
        user = $('#nuevoUsuario').val();
        consignatario = $('#consignatario').val();
        if (pass !== repitpass) {
          return Singleton.get().showError('Contraseña inválida, verifique que sean iguales o no esten en blanco', 'Error');
        } else {
          if (perfil !== "vacio" && supervisor !== "vacio" && nombre !== "" && pass !== "" && consignatario !== "vacio") {
            datos = {
              perfil: perfil,
              supervisor: supervisor,
              consignatario: consignatario,
              nombre: nombre,
              pass: pass,
              telefono: telefono,
              celular: celular,
              email: email,
              user: user
            };
            return $.ajax({
              url: base_url + "/index.php/services/usuarios/guardarusuario",
              type: 'POST',
              data: datos,
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: (function(_this) {
                return function(g) {
                  return _this.init();
                };
              })(this),
              error: (function(_this) {
                return function(g) {
                  return Singleton.get().hideLoading();
                };
              })(this)
            });
          } else {
            return Singleton.get().showError('Faltan datos');
          }
        }
      };

      entidades.prototype.cargar = function() {
        return $.ajax({
          url: base_url + "/index.php/services/usuarios",
          type: 'POST',
          data: this.objData,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(s) {
              $('#cargatabla').html(_.template(Tplresultadosusuarios)({
                variable: s
              }));
              $('#accionesLista').change(function(e) {
                return _this.usuarios(e);
              });
              $('#tablaBody tr').click(function(e) {
                return _this.clickTr(e);
              });
              $('#nuevalista').click(function(e) {
                return _this.nueva(e);
              });
              return Singleton.get().hideLoading();
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

      entidades.prototype.filtrar = function() {
        var perfilusuarios, sucursalusuarios;
        Singleton.get().showLoading();
        sucursalusuarios = "vacio";
        perfilusuarios = "vacio";
        if ($('#sucursalusuarios').val() !== '') {
          sucursalusuarios = $('#sucursalusuarios').val();
        }
        if ($('#perfilusuarios').val() !== '') {
          perfilusuarios = $('#perfilusuarios').val();
        }
        this.objData = {
          sucursal: sucursalusuarios,
          perfil: perfilusuarios,
          start: this.paginador.start,
          end: '14'
        };
        return $.ajax({
          url: base_url + "/index.php/services/usuarios/contarRegistros",
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

      entidades.prototype.editar = function() {
        Singleton.get().showLoading();
        return $.ajax({
          url: base_url + "/index.php/services/usuarios/sucursal",
          type: 'GET',
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(d) {
              return $.ajax({
                url: base_url + "/index.php/services/usuarios/perfil",
                type: 'GET',
                statusCode: {
                  302: function() {
                    return Singleton.get().reload();
                  }
                },
                success: function(p) {
                  return $.ajax({
                    url: base_url + "/index.php/services/usuarios/supervisor",
                    type: 'GET',
                    statusCode: {
                      302: function() {
                        return Singleton.get().reload();
                      }
                    },
                    success: function(s) {
                      $('#appView').html(_.template(Tpleditarusuarios)({
                        sucursal: d,
                        perfiles: p,
                        supervisor: s
                      }));
                      $('#telefono').keydown(function(event) {
                        if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

                        } else {
                          if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                            return event.preventDefault();
                          }
                        }
                      });
                      $('#celular').keydown(function(event) {
                        if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {

                        } else {
                          if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                            return event.preventDefault();
                          }
                        }
                      });
                      $(document).on("focusout", "#telefono", function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if ($('#telefono').val() !== '') {
                          if (!$.isNumeric(Singleton.get().cleanValor($('#telefono').val()))) {
                            Singleton.get().showError('El Valor Ingresado es Incorrecto');
                            $('#telefono').val('0');
                          }
                        }
                        return false;
                      });
                      $(document).on("focusout", "#celular", function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if ($('#celular').val() !== '') {
                          if (!$.isNumeric(Singleton.get().cleanValor($('#celular').val()))) {
                            Singleton.get().showError('El Valor Ingresado es Incorrecto');
                            $('#celular').val('0');
                          }
                        }
                        return false;
                      });
                      $.ajax({
                        url: (base_url + "/index.php/services/usuarios/obtenerusuario/id/") + _this.idusuario,
                        type: 'GET',
                        statusCode: {
                          302: function() {
                            return Singleton.get().reload();
                          }
                        },
                        success: function(u) {
                          $('#perfil').attr("value", u[0].Id_Perfil);
                          $('#nombre').attr("value", u[0].Nombre);
                          if (u[0].Telefono !== '0') {
                            $('#telefono').attr("value", u[0].Telefono);
                          } else {
                            $('#telefono').val("");
                          }
                          if (u[0].Celular !== '0') {
                            $('#celular').attr("value", u[0].Celular);
                          } else {
                            $('#celular').val("");
                          }
                          $('#email').attr("value", u[0].Email);
                          $('#consignatario').attr("value", u[0].Id_Sucursal);
                          $('#user').attr("value", u[0].User);
                          $('#responsable').attr("value", u[0].Supervisor);
                          return Singleton.get().hideLoading();
                        }
                      });
                      if (window.innerWidth === 1280) {
                        $('.scroll').css('width', window.innerWidth - 260);
                      } else {
                        $('.scroll').css('width', window.innerWidth - 251);
                      }
                      $('.scroll').css('height', window.innerHeight - 75);
                      if (Singleton.get().idPerfilUsuarioLogueado === '1' || Singleton.get().idPerfilUsuarioLogueado === '2') {
                        $('#cancelarestado').click(function(e) {
                          return _this.initialize();
                        });
                        return $('#guardarestado').click(function(e) {
                          var Validator;
                          Validator = true;
                          if ($('#nombre').val() === '') {
                            Singleton.get().showInformacion('Debe ingresar su nombre');
                            Validator = false;
                          }
                          if ($('#user').val() === '') {
                            Singleton.get().showInformacion('Debe ingresar un nombre de usuario');
                            Validator = false;
                          }
                          if ($('#perfil').find(':selected').val() === '') {
                            Singleton.get().showInformacion('Debe asignar un perfil al usuario');
                            Validator = false;
                          }
                          if ($('#consignatario').find(':selected').val() === '') {
                            Singleton.get().showInformacion('Debe asignar una sucursal al usuario');
                            Validator = false;
                          }
                          if (Validator === true) {
                            return _this.guardarusuarioeditar();
                          }
                        });
                      } else {
                        $('#perfil').attr('disabled', 'disabled');
                        $('#consignatario').attr('disabled', 'disabled');
                        $('#responsable').attr('disabled', 'disabled');
                        $('#user').attr('disabled', 'disabled');
                        $('#nombre').attr('disabled', 'disabled');
                        $('#telefono').attr('disabled', 'disabled');
                        $('#celular').attr('disabled', 'disabled');
                        $('#email').attr('disabled', 'disabled');
                        $('#guardarestado').click(function(e) {
                          var Validator;
                          Validator = true;
                          if ($('#nombre').val() === '') {
                            Singleton.get().showInformacion('Debe ingresar su nombre');
                            Validator = false;
                          }
                          if ($('#user').val() === '') {
                            Singleton.get().showInformacion('Debe ingresar un nombre de usuario');
                            Validator = false;
                          }
                          if (Validator === true) {
                            return _this.guardarusuarioeditar();
                          }
                        });
                        return $('#cancelarestado').click(function(e) {
                          $('#barraizq').find('.active').removeClass('active');
                          return $('#appView').empty();
                        });
                      }
                    }
                  });
                }
              });
            };
          })(this)
        });
      };

      entidades.prototype.guardarusuarioeditar = function() {
        var datos;
        Singleton.get().showLoading();
        this.perfil = $('#perfil').val();
        this.supervisor = $('#responsable').val();
        this.nombre = $('#nombre').val();
        this.pass = $('#passwde').val();
        this.repitpass = $('#repitpass').val();
        this.telefono = $('#telefono').val();
        this.celular = $('#celular').val();
        this.email = $('#email').val();
        this.user = $('#editarusuario').val();
        this.consignatario = $('#consignatario').val();
        if (this.pass !== "" && this.pass !== "") {
          if (this.pass !== this.repitpass) {
            return Singleton.get().showError('Contraseña inválida, verifique que sean iguales', 'Error');
          } else {
            datos = {
              perfil: this.perfil,
              supervisor: this.supervisor,
              consignatario: this.consignatario,
              nombre: this.nombre,
              pass: this.pass,
              telefono: this.telefono,
              celular: this.celular,
              email: this.email,
              user: this.user,
              antiguo: this.userusuario,
              id: this.idusuario
            };
            return $.ajax({
              url: base_url + "/index.php/services/usuarios/updateusuario",
              type: 'POST',
              data: datos,
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: (function(_this) {
                return function(g) {
                  if (Singleton.get().idPerfilUsuarioLogueado === '1' || Singleton.get().idPerfilUsuarioLogueado === '2') {
                    return _this.initialize();
                  } else {
                    Singleton.get().showExito('Usuario guardado correctamente', 'Exito');
                    return $('#btnExito').click(function(e) {
                      $('#barraizq').find('.active').removeClass('active');
                      return $('#appView').empty();
                    });
                  }
                };
              })(this),
              error: (function(_this) {
                return function(g) {
                  return Singleton.get().showError('No se pudo guardar el usuario', 'Error');
                };
              })(this)
            });
          }
        } else {
          datos = {
            perfil: this.perfil,
            supervisor: this.supervisor,
            consignatario: this.consignatario,
            nombre: this.nombre,
            pass: "",
            telefono: this.telefono,
            celular: this.celular,
            email: this.email,
            user: this.user,
            antiguo: this.userusuario,
            id: this.idusuario
          };
          return $.ajax({
            url: base_url + "/index.php/services/usuarios/updateusuario",
            type: 'POST',
            data: datos,
            statusCode: {
              302: function() {
                return Singleton.get().reload();
              }
            },
            success: (function(_this) {
              return function(g) {
                if (Singleton.get().idPerfilUsuarioLogueado === '1') {
                  Singleton.get().showExito('Usuario guardado correctamente', 'Exito');
                  return $('#btnExito').click(function(e) {
                    return _this.initialize();
                  });
                } else {
                  Singleton.get().showExito('Usuario guardado correctamente', 'Exito');
                  return $('#btnExito').click(function(e) {
                    $('#barraizq').find('.active').removeClass('active');
                    return $('#appView').empty();
                  });
                }
              };
            })(this),
            error: (function(_this) {
              return function(g) {
                return Singleton.get().showError('No se pudo guardar el usuario', 'Error');
              };
            })(this)
          });
        }
      };

      entidades.prototype.eliminar = function() {
        Singleton.get().showAdvertencia('¿Está seguro que desea desactivar el usuario?');
        return $('#btnAceptarAdvertencia').click((function(_this) {
          return function(e) {
            return $.ajax({
              url: (base_url + "/index.php/services/usuarios/eliminar/id/") + _this.idusuario,
              type: 'GET',
              statusCode: {
                302: function() {
                  return Singleton.get().reload();
                }
              },
              success: function(data) {
                Singleton.get().showExito('Usuario desactivado correctamente');
                $('.modal-backdrop').css('display', 'none');
                return _this.filtrar();
              },
              error: function(data) {
                return Singleton.get().showError('No se puede desactivar el usuario');
              }
            });
          };
        })(this));
      };

      entidades.prototype.clickTr = function(e) {
        var html;
        e.preventDefault();
        e.stopPropagation();
        this.idusuario = e.currentTarget.attributes[0].value;
        Singleton.get().restriccionusuario = this.idusuario;
        this.nombreusuario = e.currentTarget.cells[0].id;
        this.telefonousuario = e.currentTarget.cells[1].id;
        this.celularusuario = e.currentTarget.cells[2].id;
        this.emailusuario = e.currentTarget.cells[3].id;
        this.userusuario = e.currentTarget.cells[4].id;
        this.cuotamaximausuario = e.currentTarget.cells[5].id;
        this.tipousuario = e.currentTarget.cells[6].id;
        this.subgerenciausuario = e.currentTarget.cells[7].id;
        html = html + "<option value=\"accionesusuarios\">Acciones</option>" + "<option value=\"editar\">Editar</option>" + "<option value=\"eliminar\">Desactivar</option>";
        $('#accionesusuarios').html(html);
        $(e.currentTarget).addClass('active');
        return $(e.currentTarget).siblings().removeClass('active');
      };

      return entidades;

    })(Backbone.View);
  });

}).call(this);
