(function() {
  define([], function() {
    var Lugar;
    return Lugar = (function() {
      function Lugar() {}

      Lugar.prototype.buscarSectores = function(pro, success) {
        return $.ajax({
          url: ("" + base_url + "/index.php/services/lugares/sectores/comuna/") + pro,
          type: 'GET',
          cache: true,
          async: true,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(data) {
              return success(data);
            };
          })(this)
        });
      };

      Lugar.prototype.buscarTipos = function(success) {
        return $.ajax({
          type: 'GET',
          url: "" + base_url + "/index.php/services/lugares/tipos",
          cache: true,
          async: false,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(data) {
              return success(data);
            };
          })(this)
        });
      };

      Lugar.prototype.guardarLugar = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/lugares/guardarlugar",
          data: datos,
          cache: true,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(data) {
              return success(data);
            };
          })(this)
        });
      };

      Lugar.prototype.buscarLugarExistente = function(nombre, idtipo, idsector, success) {
        return $.ajax({
          url: ("" + base_url + "/index.php/services/lugares/obtenerlugar/nombre/") + nombre + "/idtipo/" + idtipo + "/idsector/" + idsector,
          type: 'GET',
          cache: true,
          async: false,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(data) {
              return success(data);
            };
          })(this)
        });
      };

      Lugar.prototype.eliminarLugar = function(datos, success) {
        return $.ajax({
          type: 'GET',
          url: ("" + base_url + "/index.php/services/lugares/eliminar/id/") + datos,
          cache: true,
          async: false,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(data) {
              return success(data);
            };
          })(this)
        });
      };

      Lugar.prototype.buscarLugar = function(id, success) {
        return $.ajax({
          type: 'GET',
          url: ("" + base_url + "/index.php/services/lugares/buscar/id/") + id,
          cache: true,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(data) {
              return success(data);
            };
          })(this)
        });
      };

      Lugar.prototype.buscarzona = function(id, success) {
        return $.ajax({
          type: 'GET',
          url: ("" + base_url + "/index.php/services/lugares/buscarzona/id/") + id,
          cache: true,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(data) {
              return success(data);
            };
          })(this)
        });
      };

      Lugar.prototype.actualizarLugar = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/lugares/actualizar",
          data: datos,
          cache: true,
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(data) {
              return success(data);
            };
          })(this)
        });
      };

      return Lugar;

    })();
  });

}).call(this);
