(function() {
  define([], function() {
    var Producto;
    return Producto = (function() {
      function Producto() {}

      Producto.prototype.buscarCategorias = function(success) {
        return $.ajax({
          url: "" + base_url + "/index.php/services/productos/categorias",
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

      Producto.prototype.buscarProductos = function(success) {
        return $.ajax({
          url: "" + base_url + "/index.php/services/productos/obtenerproductos",
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

      Producto.prototype.buscarProductos2 = function(success) {
        return $.ajax({
          url: "" + base_url + "/index.php/services/productos/obtenerproductos2",
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

      Producto.prototype.buscarProductosHistorico = function(datos, success) {
        return $.ajax({
          url: ("" + base_url + "/index.php/services/productos/obtenerproductoshistorico/id/") + datos,
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

      Producto.prototype.guardarProducto = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/productos/guardarproducto",
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

      Producto.prototype.buscarProducto = function(id, success) {
        return $.ajax({
          type: 'GET',
          url: ("" + base_url + "/index.php/services/productos/buscar/id/") + id,
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

      Producto.prototype.eliminarProducto = function(datos, success) {
        return $.ajax({
          type: 'GET',
          url: ("" + base_url + "/index.php/services/productos/eliminar/id/") + datos,
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

      Producto.prototype.actualizarProducto = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/productos/actualizar",
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

      Producto.prototype.existenciaProducto = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/productos/existenciaProducto",
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

      return Producto;

    })();
  });

}).call(this);
