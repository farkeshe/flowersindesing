(function() {
  define([], function() {
    var Destinatario;
    return Destinatario = (function() {
      function Destinatario() {}

      Destinatario.prototype.guardarDestinatario = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/destinatarios/guardardestinatario",
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

      Destinatario.prototype.buscarDestinatario = function(id, success) {
        return $.ajax({
          type: 'GET',
          url: ("" + base_url + "/index.php/services/destinatarios/buscar/id/") + id,
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

      Destinatario.prototype.actualizarDestinatario = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/destinatarios/actualizar",
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

      Destinatario.prototype.eliminarDestinatario = function(datos, success) {
        return $.ajax({
          type: 'GET',
          url: ("" + base_url + "/index.php/services/destinatarios/eliminar/id/") + datos,
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

      return Destinatario;

    })();
  });

}).call(this);
