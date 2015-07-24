(function() {
  define([], function() {
    var Lista_precio;
    return Lista_precio = (function() {
      function Lista_precio() {}

      Lista_precio.prototype.guardarlista = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/listaPrecios/guardarlista",
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

      Lista_precio.prototype.productolistainsert = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/listaPrecios/productolistainsert",
          data: JSON.stringify(datos),
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          cache: false,
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

      Lista_precio.prototype.productolistaeliminar = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/listaPrecios/productolistaeliminar",
          data: JSON.stringify(datos),
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          cache: false,
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

      Lista_precio.prototype.productolistaedit = function(datos, success) {
        console.log("productolistaedit");
        console.log(datos);
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/listaPrecios/productolistaedit",
          data: JSON.stringify(datos),
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          cache: false,
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

      Lista_precio.prototype.actualizarLista = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/listaPrecios/actualizar",
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

      Lista_precio.prototype.eliminarLista = function(datos, success) {
        return $.ajax({
          type: 'GET',
          url: ("" + base_url + "/index.php/services/listaPrecios/eliminar/id/") + datos,
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

      return Lista_precio;

    })();
  });

}).call(this);
