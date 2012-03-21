# # MM.Sync
# Handles syncing via `JSONP`
# Reimplements `Backbone.sync` as `MM.CoreSync`
MM.Sync ||= {}

# The URL is not canonical, but it is mandatory, because all
# Collections and Models construct their paths from it.
MM.Sync.URL = 'http://193.9.21.195:8999/BTW'

# ## Stub
#
# An example of a stubbed `Sync` method, that returns a predefined `Array`
MM.Sync.Stub = (method, model, options) ->
  options.succes [
    id: '1'
    value: 'foo'
  ,
    id: '2'
    value: 'bar'
  ]



# ## Session
#
# The `Session` uses `GET` rather than `POST` to instantiate
MM.Sync.Session = (method, model, options) ->
  # Converting model toJSON here prevents `params.data` being `JSON.stringify()`'d in `Backbone.sync`, which messes up the the params in `GET` requests :-O
  options.data = model.toJSON()
  # Remove sensitive data
  delete options.data.token
  delete options.data.real_name
  delete options.data.login
  delete options.data.account

  MM.Sync.JSONP(method, model, options)

# ## Entries Collection
#
# * appends access_token from session data
#
# URLs for `Entries` vary depending on the `method`, and are customized with `options.url` before passing on to `Backbone.Sync`
MM.Sync.Entries = (method, model, options) ->
  # `Entries#url` recieves the `method` to reflect upon
  options.url = model.url(method)
  options.data ||= {}
  # New `Entry` is signified by an `add` param rather than merely being a `POST` request with `Entry.fuzz`
  switch method
    when 'create'
      options.data =
        add: model.get('fuzz')
    when 'delete'
      options.data =
        eid: model.get('id')
        action: 'delete'
    when 'update'
      console.log @, 'update', model
      console.log model.changed
      options.data =
        eid: model.get('id')
        status: model.get('status')

  # Access token from session instance
  options.data.access_token = MM.session.get('token')
  # options.processData = true

  MM.Sync.JSONP(method, model, options)


# ## Entry.RelevantConcepts
#
# * appends access_token from session data
MM.Sync.RelevantConcepts = (method, model, options) ->
  options.data ||= {}
  options.data.access_token = MM.session.get('token')

  MM.Sync.JSONP(method, model, options)

# ## Entry.SuggestedConcepts
#
# * appends access_token from session data
#
# Right now all the `Concepts` are requested at once, when the application starts. In future, this `Sync` will submit a `queryString` (`qs`) and `caretPosition` (`pos`), to facilitate auto-completion of an `Entry.fuzz` during interaction within `AwsmBar` 
MM.Sync.SuggestedConcepts = (method, model, options) ->
  options.data ||= {}
  options.data.access_token = MM.session.get('token')

  MM.Sync.JSONP(method, model, options)

# ## Workflows
#
# * appends access_token from session data
MM.Sync.Workflows = (method, model, options) ->
  options.data ||= {}
  options.data.access_token = MM.session.get('token')

  MM.Sync.JSONP(method, model, options)

# ## MeanXY.TileCollection
#
# * appends access_token from session data
MM.Sync.MeanXY = (method, model, options) ->
  options.data ||= {}
  options.data.access_token = MM.session.get('token')

  MM.Sync.JSONP(method, model, options)

# ## JSONP Sync
#
# This method decorates the sync request with `JSONP` relevant options and proxies to `CoreSync`
#
# Timeout is required for 404 responses because of `JSONP` and a custom callback name (`json_callback`) is used so the server can identify `JSONP` requests
MM.Sync.JSONP = (method, model, options) ->
  options.dataType = 'jsonp'
  options.timeout = 10000 
  # `jQuery.ajax` uses this to define the `callback` name
  options.jsonp = 'json_callback'
  # `jQuery.jsonp` uses this to define the `callback` name
  options.callbackParameter = 'json_callback'
  options.callback = '_jqjsp'
  MM.CoreSync(method, model, options)


# ## Core Sync
#
# Reimplementation of `Backbone.Sync` to handle some exceptions where `sync` proxies want to set `params.data` to something other than `model.toJSON()`
#
# `Backbone.Sync` will undo `options.processData` depending on the `method` of the request and the `Backbone.emulateJSON` option. This might have other implications though. This is the thing to look at if `params.data` isn't being evaluated or escaped properly.
Backbone.emulateJSON = true

MM.CoreSync = (method, model, options) ->
  type = methodMap[method]
  params =
    type: type
    dataType: "json"
  params.url = getValue(model, "url") or urlError()  unless options.url
  # `params.data` shouldn't be set if we have `options.data` to work with
  if not options.data and model and (method is "create" or method is "update")
    params.contentType = "application/json"
    params.data = JSON.stringify(model.toJSON())
  if Backbone.emulateJSON
    params.contentType = "application/x-www-form-urlencoded"
    params.data = (if params.data then model: params.data else {})
  if Backbone.emulateHTTP
    if type is "PUT" or type is "DELETE"
      params.data._method = type  if Backbone.emulateJSON
      params.type = "POST"
      params.beforeSend = (xhr) ->
        xhr.setRequestHeader "X-HTTP-Method-Override", type
  # `processData` shoudn't be false if we have `Backbone.emulateJSON` enabled
  params.processData = false  if params.type isnt "GET" and not Backbone.emulateJSON
  combined = _.extend(params, options)
  # We use `$.jsonp` instead of `$.ajax` due to it's improved `JSONP` error handling
  $.jsonp combined

# Utility for resolving `method` to `HTTP` verbs
methodMap =
  'create': 'POST'
  'update': 'PUT'
  'delete': 'DELETE'
  'read'  : 'GET'
# Utility for retrieving any `Backbone` object property either as a method or an attribute
getValue = (object, prop) ->
  return null  unless object and object[prop]
  (if _.isFunction(object[prop]) then object[prop]() else object[prop])
# Utility for throwing an `Error` if no `URL` is specified
urlError = ->
  throw new Error("A 'url' property or function must be specified")

# ## Workflows Stub
#
# Stubbed `/appdata` so we don't have to wait for the load
MM.Sync.StubbedWorkflows = (method, model, options) ->
  result = {
    "workflow": {
        "0": {
            "X": [{
                "fg": 11,
                "name": "(fail)"
            }]
        },
        "1": {
            "Did?": [{
                "fg": 8,
                "name": "Passed"
            },
            {
                "fg": 7,
                "name": "Done!"
            },
            {
                "fg": 4,
                "name": "Now"
            },
            {
                "fg": 5,
                "name": "Soon"
            },
            {
                "fg": 6,
                "name": "Later"
            },
            {
                "fg": 11,
                "name": "(fail)"
            }]
        },
        "2": {
            "Do?": [{
                "fg": 8,
                "name": "Pass"
            },
            {
                "fg": 7,
                "name": "Done!"
            },
            {
                "fg": 4,
                "name": "Now"
            },
            {
                "fg": 5,
                "name": "Soon"
            },
            {
                "fg": 6,
                "name": "Later"
            },
            {
                "fg": 11,
                "name": "(fail)"
            }]
        },
        "3": {
            "null": [{
                "fg": 8,
                "name": "Pass"
            },
            {
                "fg": 7,
                "name": "Done!"
            },
            {
                "fg": 4,
                "name": "Now"
            },
            {
                "fg": 5,
                "name": "Soon"
            },
            {
                "fg": 6,
                "name": "Later"
            },
            {
                "fg": 11,
                "name": "(fail)"
            }]
        },
        "4": {
            "Went?": [{
                "fg": 7,
                "name": "Yeah",
                "st": "def"
            },
            {
                "fg": 9,
                "name": "Considered"
            },
            {
                "fg": 8,
                "name": "Nah"
            },
            {
                "fg": 11,
                "name": "(fail)"
            }]
        },
        "5": {
            "Went?": [{
                "fg": 7,
                "name": "Yeah"
            },
            {
                "fg": 9,
                "name": "Considered",
                "st": "def"
            },
            {
                "fg": 8,
                "name": "Nah"
            },
            {
                "fg": 11,
                "name": "(fail)"
            }]
        },
        "6": {
            "RSVP": [{
                "fg": 8,
                "name": "Pass"
            },
            {
                "fg": 5,
                "name": "Maybe",
                "st": "def"
            },
            {
                "fg": 4,
                "name": "Going"
            },
            {
                "fg": 11,
                "name": "(fail)"
            }]
        },
        "7": {
            "RSVP": [{
                "fg": 4,
                "name": "Yes",
                "st": "def"
            },
            {
                "fg": 8,
                "name": "No"
            },
            {
                "fg": 11,
                "name": "(fail)"
            }]
        },
        "8": {
            "RSVP": [{
                "fg": 4,
                "name": "Yes",
                "st": "def"
            },
            {
                "fg": 8,
                "name": "No"
            },
            {
                "fg": 11,
                "name": "(fail)"
            }]
        },
        "9": {
            "null": [{
                "fg": 8,
                "name": "Pass"
            },
            {
                "fg": 5,
                "name": "Maybe",
                "st": "def"
            },
            {
                "fg": 4,
                "name": "Going"
            },
            {
                "fg": 11,
                "name": "(fail)"
            }]
        }
    }
  }

  options.success(result)