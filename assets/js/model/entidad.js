(function() {
  define([], function() {
    var Entidad;
    return Entidad = (function() {
      function Entidad() {}

      Entidad.prototype.buscarCategorias = function(success) {
        return $.ajax({
          url: "" + base_url + "/index.php/services/entidades/clasificacionentidad",
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

      Entidad.prototype.guardarEntidad = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/entidades/guardarentidad",
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

      Entidad.prototype.buscarEntidad = function(id, success) {
        return $.ajax({
          type: 'GET',
          url: ("" + base_url + "/index.php/services/entidades/buscar/id/") + id,
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

      Entidad.prototype.actualizarEntidad = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/entidades/actualizar",
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

      Entidad.prototype.eliminarEntidad = function(datos, success) {
        return $.ajax({
          type: 'GET',
          url: ("" + base_url + "/index.php/services/entidades/eliminar/rut/") + datos,
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

      return Entidad;

    })();
  });

}).call(this);
