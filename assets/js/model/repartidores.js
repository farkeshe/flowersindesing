(function() {
  define([], function() {
    var Repartidores;
    return Repartidores = (function() {
      function Repartidores() {}

      Repartidores.prototype.buscarFechaRepartidores = function(success) {
        return $.ajax({
          url: "" + base_url + "/index.php/services/repartidores/buscarFechaRepartidores",
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

      Repartidores.prototype.guardarRepartidorFecha = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/repartidores/guardarRepartidorFecha",
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

      Repartidores.prototype.obtenercantidadpedidos = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/repartidores/obtenercantidadpedidos",
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

      return Repartidores;

    })();
  });

}).call(this);
