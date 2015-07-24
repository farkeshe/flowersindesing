(function() {
  define([], function() {
    var Sector;
    return Sector = (function() {
      function Sector() {}

      Sector.prototype.buscarRegiones = function(success) {
        return $.ajax({
          type: 'GET',
          url: "" + base_url + "/index.php/services/sectores/regiones",
          cache: true,
          async: false,
          datatype: "json",
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

      Sector.prototype.buscarProvincia = function(reg, success) {
        return $.ajax({
          url: ("" + base_url + "/index.php/services/sectores/provincia/region/") + reg,
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

      Sector.prototype.buscarComuna = function(pro, success) {
        return $.ajax({
          url: ("" + base_url + "/index.php/services/sectores/comuna/provincia/") + pro,
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

      Sector.prototype.guardarSector = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/sectores/guardarsector",
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

      Sector.prototype.buscarSectorExistente = function(nombre, idcomuna, success) {
        return $.ajax({
          url: ("" + base_url + "/index.php/services/sectores/obtenersector/nombre/") + nombre + "/idcomuna/" + idcomuna,
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

      Sector.prototype.eliminarSector = function(datos, success) {
        return $.ajax({
          type: 'GET',
          url: ("" + base_url + "/index.php/services/sectores/eliminar/id/") + datos,
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

      Sector.prototype.buscarSector = function(id, success) {
        return $.ajax({
          type: 'GET',
          url: ("" + base_url + "/index.php/services/sectores/buscar/id/") + id,
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

      Sector.prototype.buscarzona = function(id, success) {
        return $.ajax({
          type: 'GET',
          url: ("" + base_url + "/index.php/services/sectores/buscarzona/id/") + id,
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

      Sector.prototype.actualizarSector = function(datos, success) {
        return $.ajax({
          type: 'POST',
          url: "" + base_url + "/index.php/services/sectores/actualizar",
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

      return Sector;

    })();
  });

}).call(this);
