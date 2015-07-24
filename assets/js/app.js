(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'assets/js/view/mainView', 'text!tpl/login/login.html', 'text!tpl/modal/error.html', 'assets/js/model/usuario', 'assets/js/view/listadoCotizaciones/viewList'], function(Backbone, MainView, TplLogin, TplError, usuarioModel, ViewList) {
    var Router, root;
    root = typeof exports !== "undefined" && exports !== null ? exports : this;
    root.Singleton = (function() {
      var _instance;

      function Singleton() {}

      _instance = void 0;

      Singleton.get = function() {
        return _instance != null ? _instance : _instance = new MainView;
      };

      return Singleton;

    })();
    return Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        this.createCookie = __bind(this.createCookie, this);
        this.readCookie = __bind(this.readCookie, this);
        this.showInformacion = __bind(this.showInformacion, this);
        this.showError = __bind(this.showError, this);
        this.log_in = __bind(this.log_in, this);
        this.render = __bind(this.render, this);
        this.index = __bind(this.index, this);
        this.initialize = __bind(this.initialize, this);
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.routes = {
        '': 'index'
      };

      Router.prototype.initialize = function() {
        return Backbone.history.start();
      };

      Router.prototype.index = function() {
        var usuario;
        usuario = new usuarioModel();
        usuario.thisLogged(this.render);
        if (this.readCookie('session_out') === 'true') {
          this.createCookie("session_out", "", -1);
          this.session_out = true;
          Singleton.get().showInformacion('Su tiempo de session ha expirado');
          return $("#modal").on("hidden", function() {
            return $('#modal').removeAttr('style');
          });
        }
      };

      Router.prototype.render = function(logged) {
        if (logged.logIn === 'True') {
          this.mainView = root.Singleton.get();
        } else {
          $('#appMain').empty();
          $('#appMain').css('display', 'none');
          $('#appLogin').css('display', 'block');
          $('#appLogin').html(_.template(TplLogin));
        }
        $('#btnlogin').click((function(_this) {
          return function(e) {
            _this.log_in();
            return false;
          };
        })(this));
        return $('#pass').keypress((function(_this) {
          return function(e) {
            if (event.keyCode === 13) {
              return _this.log_in();
            }
          };
        })(this));
      };

      Router.prototype.log_in = function() {
        var obj;
        if ($('#user').val() === '') {
          this.showError('El campo usuario es requerido', 'Error');
          $("#modal").on("hidden", function() {
            return $('#modal').removeAttr('style');
          });
        } else if ($('#pass').val() === '') {
          this.showError('El campo contraseña es requerido', 'Error');
          $("#modal").on("hidden", function() {
            return $('#modal').removeAttr('style');
          });
        } else {
          obj = {
            user: $('#user').val(),
            pass: $('#pass').val()
          };
          $.ajax({
            url: "" + base_url + "/index.php/services/login/logIn",
            type: 'POST',
            data: obj,
            success: (function(_this) {
              return function(result) {
                if (result === 'True') {
                  if (_this.session_out === true) {
                    _this.mainView = root.Singleton.get();
                    return window.location.reload(false);
                  } else {
                    return _this.mainView = root.Singleton.get();
                  }
                } else {
                  _this.showError('Nombre de usuario o contraseña incorrecta', 'Error');
                  return $("#modal").on("hidden", function() {
                    return $('#modal').removeAttr('style');
                  });
                }
              };
            })(this)
          });
        }
        return false;
      };

      Router.prototype.showError = function(txt, titulo) {
        if (txt != null) {
          if (titulo != null) {
            $('#modal').html(_.template(TplError)({
              titulo: titulo,
              mensaje: txt
            }));
          } else {
            $('#modal').html(_.template(TplError)({
              titulo: 'Error',
              mensaje: txt
            }));
          }
        } else {
          $('#modal').html(_.template(TplError)({
            titulo: 'Error',
            mensaje: 'La operaci&oacute;n a concluido con errores.'
          }));
        }
        $('#image_error').attr("src", "" + base_url + "/assets/img/img_error.png");
        $('#modal').modal('show');
        return false;
      };

      Router.prototype.showInformacion = function(txt, titulo) {
        if (txt != null) {
          if (titulo != null) {
            $('#modal').html(_.template(TplInformacion)({
              titulo: titulo,
              mensaje: txt
            }));
          } else {
            $('#modal').html(_.template(TplInformacion)({
              titulo: 'Informaci&oacute;n',
              mensaje: txt
            }));
          }
        } else {
          $('#modal').html(_.template(TplInformacion)({
            titulo: 'Informaci&oacute;n',
            mensaje: 'La operaci&oacute;n a concluido exitosamente.'
          }));
        }
        $('#image_informacion').attr("src", "" + base_url + "/assets/img/img_info.png");
        $('#modal').css('width', 450);
        $('#modal').css('height', 170);
        $('#modal').css('left', '55.5%');
        $('#modal').css('top', '50%');
        $('#modal').css('background-color', '#ffffff');
        $('#modal').modal({
          'show': true,
          'backdrop': 'static',
          'keyboard': false
        });
        return false;
      };

      Router.prototype.readCookie = function(name) {
        var c, ca, i, nameEQ;
        nameEQ = name + "=";
        ca = document.cookie.split(";");
        i = 0;
        while (i < ca.length) {
          c = ca[i];
          while (c.charAt(0) === " ") {
            c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
              return c.substring(nameEQ.length, c.length);
            }
          }
          i++;
        }
        return 'null';
        return false;
      };

      Router.prototype.createCookie = function(name, value, days) {
        var date, expires;
        if (days) {
          date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toGMTString();
        } else {
          expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
        return false;
      };

      return Router;

    })(Backbone.Router);
  });

}).call(this);
