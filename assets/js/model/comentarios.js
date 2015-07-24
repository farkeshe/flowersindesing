(function() {
  define([], function() {
    var Comentarios;
    return Comentarios = (function() {
      function Comentarios() {}

      Comentarios.prototype.guardarcomentarioentrega = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/listadoCotizacion/guardarcomentarioentrega",
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

      Comentarios.prototype.guardarcomentarioanulacion = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/listadoCotizacion/guardarcomentarioanulacion",
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

      return Comentarios;

    })();
  });

}).call(this);
