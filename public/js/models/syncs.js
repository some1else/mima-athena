(function() {
  var getValue, methodMap, urlError;

  MM.Sync || (MM.Sync = {});

  MM.Sync.URL = 'http://193.9.21.195:8999/BTW';

  MM.Sync.Stub = function(method, model, options) {
    return options.succes([
      {
        id: '1',
        value: 'foo'
      }, {
        id: '2',
        value: 'bar'
      }
    ]);
  };

  MM.Sync.Session = function(method, model, options) {
    options.data = model.toJSON();
    delete options.data.token;
    delete options.data.real_name;
    delete options.data.login;
    delete options.data.account;
    return MM.Sync.JSONP(method, model, options);
  };

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
          eid: model.get('id'),
          action: 'delete'
        };
        break;
      case 'update':
        console.log(this, 'update', model);
        console.log(model.changed);
        options.data = {
          eid: model.get('id'),
          status: model.get('status')
        };
    }
    options.data.access_token = MM.session.get('token');
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

  MM.Sync.Workflows = function(method, model, options) {
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

  MM.Sync.StubbedWorkflows = function(method, model, options) {
    var result;
    result = {
      "workflow": {
        "0": {
          "X": [
            {
              "fg": 11,
              "name": "(fail)"
            }
          ]
        },
        "1": {
          "Did?": [
            {
              "fg": 8,
              "name": "Passed"
            }, {
              "fg": 7,
              "name": "Done!"
            }, {
              "fg": 4,
              "name": "Now"
            }, {
              "fg": 5,
              "name": "Soon"
            }, {
              "fg": 6,
              "name": "Later"
            }, {
              "fg": 11,
              "name": "(fail)"
            }
          ]
        },
        "2": {
          "Do?": [
            {
              "fg": 8,
              "name": "Pass"
            }, {
              "fg": 7,
              "name": "Done!"
            }, {
              "fg": 4,
              "name": "Now"
            }, {
              "fg": 5,
              "name": "Soon"
            }, {
              "fg": 6,
              "name": "Later"
            }, {
              "fg": 11,
              "name": "(fail)"
            }
          ]
        },
        "3": {
          "null": [
            {
              "fg": 8,
              "name": "Pass"
            }, {
              "fg": 7,
              "name": "Done!"
            }, {
              "fg": 4,
              "name": "Now"
            }, {
              "fg": 5,
              "name": "Soon"
            }, {
              "fg": 6,
              "name": "Later"
            }, {
              "fg": 11,
              "name": "(fail)"
            }
          ]
        },
        "4": {
          "Went?": [
            {
              "fg": 7,
              "name": "Yeah",
              "st": "def"
            }, {
              "fg": 9,
              "name": "Considered"
            }, {
              "fg": 8,
              "name": "Nah"
            }, {
              "fg": 11,
              "name": "(fail)"
            }
          ]
        },
        "5": {
          "Went?": [
            {
              "fg": 7,
              "name": "Yeah"
            }, {
              "fg": 9,
              "name": "Considered",
              "st": "def"
            }, {
              "fg": 8,
              "name": "Nah"
            }, {
              "fg": 11,
              "name": "(fail)"
            }
          ]
        },
        "6": {
          "RSVP": [
            {
              "fg": 8,
              "name": "Pass"
            }, {
              "fg": 5,
              "name": "Maybe",
              "st": "def"
            }, {
              "fg": 4,
              "name": "Going"
            }, {
              "fg": 11,
              "name": "(fail)"
            }
          ]
        },
        "7": {
          "RSVP": [
            {
              "fg": 4,
              "name": "Yes",
              "st": "def"
            }, {
              "fg": 8,
              "name": "No"
            }, {
              "fg": 11,
              "name": "(fail)"
            }
          ]
        },
        "8": {
          "RSVP": [
            {
              "fg": 4,
              "name": "Yes",
              "st": "def"
            }, {
              "fg": 8,
              "name": "No"
            }, {
              "fg": 11,
              "name": "(fail)"
            }
          ]
        },
        "9": {
          "null": [
            {
              "fg": 8,
              "name": "Pass"
            }, {
              "fg": 5,
              "name": "Maybe",
              "st": "def"
            }, {
              "fg": 4,
              "name": "Going"
            }, {
              "fg": 11,
              "name": "(fail)"
            }
          ]
        }
      }
    };
    return options.success(result);
  };

}).call(this);
