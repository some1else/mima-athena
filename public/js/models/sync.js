(function() {
  var getValue, methodMap, urlError;

  MM.Sync || (MM.Sync = {});

  MM.Sync.URL = 'http://193.9.21.195:8999/BTW';

  MM.Sync.Entries = function(method, model, options) {
    options.url = model.url(method);
    options.data || (options.data = {});
    switch (method) {
      case 'create':
        options.data = {
          add: model.get('fuzz')
        };
        break;
      case 'delete':
        options.data = {
          action: 'delete',
          eid: model.get('id')
        };
    }
    options.data.access_token = MM.session.get('token');
    return MM.Sync.JSONP(method, model, options);
  };

  MM.Sync.Session = function(method, model, options) {
    options.data = model.toJSON();
    delete options.data.token;
    delete options.data.real_name;
    delete options.data.login;
    delete options.data.account;
    return MM.Sync.JSONP(method, model, options);
  };

  MM.Sync.RelevantConcepts = function(method, model, options) {
    options.data || (options.data = {});
    options.data.access_token = MM.session.get('token');
    return MM.Sync.JSONP(method, model, options);
  };

  MM.Sync.SuggestedConcepts = function(method, model, options) {
    options.data || (options.data = {});
    options.data.access_token = MM.session.get('token');
    return MM.Sync.JSONP(method, model, options);
  };

  MM.Sync.MeanXY = function(method, model, options) {
    options.data || (options.data = {});
    options.data.access_token = MM.session.get('token');
    return MM.Sync.JSONP(method, model, options);
  };

  MM.Sync.JSONP = function(method, model, options) {
    options.dataType = 'jsonp';
    options.timeout = 10000;
    options.jsonp = 'json_callback';
    options.callbackParameter = 'json_callback';
    options.callback = '_jqjsp';
    return MM.CoreSync(method, model, options);
  };

  Backbone.emulateJSON = true;

  MM.CoreSync = function(method, model, options) {
    var combined, params, type;
    type = methodMap[method];
    params = {
      type: type,
      dataType: "json"
    };
    if (!options.url) params.url = getValue(model, "url") || urlError();
    if (!options.data && model && (method === "create" || method === "update")) {
      params.contentType = "application/json";
      params.data = JSON.stringify(model.toJSON());
    }
    if (Backbone.emulateJSON) {
      params.contentType = "application/x-www-form-urlencoded";
      params.data = (params.data ? {
        model: params.data
      } : {});
    }
    if (Backbone.emulateHTTP) {
      if (type === "PUT" || type === "DELETE") {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = "POST";
        params.beforeSend = function(xhr) {
          return xhr.setRequestHeader("X-HTTP-Method-Override", type);
        };
      }
    }
    if (params.type !== "GET" && !Backbone.emulateJSON) params.processData = false;
    combined = _.extend(params, options);
    return $.jsonp(combined);
  };

  methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read': 'GET'
  };

  getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    if (_.isFunction(object[prop])) {
      return object[prop]();
    } else {
      return object[prop];
    }
  };

  urlError = function() {
    throw new Error("A 'url' property or function must be specified");
  };

}).call(this);
