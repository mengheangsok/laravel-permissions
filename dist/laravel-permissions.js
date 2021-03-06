(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash/isEmpty'), require('lodash/startCase')) :
  typeof define === 'function' && define.amd ? define(['lodash/isEmpty', 'lodash/startCase'], factory) :
  (global = global || self, global.LaravelPermissions = factory(global.isEmpty, global.startCase));
}(this, function (isEmpty, startCase) { 'use strict';

  isEmpty = isEmpty && isEmpty.hasOwnProperty('default') ? isEmpty['default'] : isEmpty;
  startCase = startCase && startCase.hasOwnProperty('default') ? startCase['default'] : startCase;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  var laravelPermissions = {
    install: function install(Vue) {
      window.Laravel = _objectSpread({}, window.Laravel, {
        permissions: [],
        roles: []
      });
      Vue.prototype.$laravel = {
        /*
        |-------------------------------------------------------------------------
        | Setters
        |-------------------------------------------------------------------------
        |
        | These functions controls the "permissions" and "roles" provided
        | by Laravel Permissions, or from a custom array.
        |
        */
        setPermissions: function setPermissions(permissions) {
          window.Laravel.permissions = permissions;
        },
        setRoles: function setRoles(roles) {
          window.Laravel.roles = roles;
        },

        /*
        |-------------------------------------------------------------------------
        | Getters
        |-------------------------------------------------------------------------
        |
        | These functions return the "permissions" and "roles" stored.
        | This is useful when you want list all data.
        |
        */
        getPermissions: function getPermissions() {
          return window.Laravel.permissions;
        },
        getRoles: function getRoles() {
          return window.Laravel.roles;
        },

        /*
        |-------------------------------------------------------------------------
        | Directives
        |-------------------------------------------------------------------------
        |
        | These is a group of functions for Vue Directives.
        | This is useful when you want valid a "permission" or "role"
        | programmatically.
        |
        */
        hasPermission: function hasPermission(permission) {
          return window.Laravel.permissions.includes(permission);
        },
        unlessPermission: function unlessPermission(permission) {
          return !Vue.prototype.$laravel.hasPermission(permission);
        },
        hasAnyPermission: function hasAnyPermission(values) {
          var permissions = values.split('|');
          return permissions.some(function (permission) {
            return window.Laravel.permissions.includes(permission);
          });
        },
        hasAllPermissions: function hasAllPermissions(values) {
          var permissions = values.split('|');
          return permissions.every(function (permission) {
            return window.Laravel.permissions.includes(permission);
          });
        },
        hasRole: function hasRole(role) {
          return window.Laravel.roles.includes(role);
        },
        unlessRole: function unlessRole(role) {
          return !Vue.prototype.$laravel.hasRole(role);
        },
        hasAnyRole: function hasAnyRole(values) {
          var roles = values.split('|');
          return roles.some(function (role) {
            return window.Laravel.roles.includes(role);
          });
        },
        hasAllRoles: function hasAllRoles(values) {
          var roles = values.split('|');
          return roles.every(function (role) {
            return window.Laravel.roles.includes(role);
          });
        }
      }; // Normalize directive and call specific function

      var callFunctionFromDirective = function callFunctionFromDirective(el, binding) {
        if (!binding.value) {
          console.error('You must specify a value in the directive.');
          return;
        } // Only allow this function to be run if the Laravel instance exists


        if (!window.Laravel) {
          return;
        } // Get property to validate


        var suffix = binding.name;
        var arg = 'has';

        if (binding.arg) {
          if (binding.arg === 'unless') {
            arg = 'unless';
          } else if (binding.arg !== 'has') {
            arg += startCase(binding.arg);
          }
        } // Convert to plural if is needed


        if (arg === 'hasAll') {
          suffix += 's';
        } // Get name of function to call


        var functionName = "".concat(arg).concat(startCase(suffix)); // Check if value exists in property value

        if (!Vue.prototype.$laravel[functionName](binding.value)) {
          if (isEmpty(binding.modifiers)) {
            // Remove DOM Element
            el.parentNode.removeChild(el);
          } else {
            // Set modifiers on DOM element
            Object.assign(el, binding.modifiers);
          }
        }
      };

      Vue.directive('permission', {
        inserted: callFunctionFromDirective
      });
      Vue.directive('role', {
        inserted: callFunctionFromDirective
      }); // Alias for "v-permission:has"

      Vue.directive('can', {
        inserted: function inserted(el, binding) {
          if (!Vue.prototype.$laravel.hasPermission(binding.value)) {
            el.parentNode.removeChild(el);
          }
        }
      });
    }
  };

  return laravelPermissions;

}));
