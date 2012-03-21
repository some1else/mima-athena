# # Entry
#
# `Entry` holds user's thoughts in encoded in Fuzztle. It has `RelevantConcepts` and `SuggestedConcepts`

MM.Entry ||= {}

class MM.Entry extends Backbone.Model
  defaults:
    fuzz: ""
    workflow_label: ""

  # `Sync.Entries` is exceptional because it invokes `url` with the `method` parameter, that let's us reflect on it to return singular or plural `URL`s
  sync: MM.Sync.Entries
  url: (method) ->
    base = MM.Sync.URL
    login = MM.session.get('account')

    switch method
      when 'create'
        "#{base}/entry/#{login}"
      when 'read'
        "#{base}/entries/#{login}"
      when 'delete'
        "#{base}/entry/#{login}"
      when 'update'
        "#{base}/entry/#{login}"

  # We need related `Concepts` while we're editing an `Entry`
  initializeConcepts: ->
    @relevantConcepts = new MM.Entry.RelevantConcepts(entry: this)
    @suggestedConcepts = new MM.Entry.SuggestedConcepts(entry: this)

  hasWorkflow: ->
    @workflow instanceof MM.Workflow
  hasState: ->

  initializeWorkflow: ->
    console.log @, 'initializeWorkflow', @get('wf_id')
    @workflow = MM.workflows.get @get('wf_id')
    # if we have a fresh Entry, the workflow is yet unknown and should be initialized accordingly
    if @hasWorkflow()
      @set workflow_label: @workflow.get('label')

  # We start by instantiating both relations to `Concepts`
  initialize: ->
    
    @oldFuzz = @get 'fuzz'
    @initializeConcepts()
    @initializeWorkflow()
  
  # A getter that strips away newlines and tabs
  getChompedFuzz: ->
    @get('fuzz').replace(/^(\n|\r|\t)+$/, '')

  # When the user is editing fuzztle, the `AwsmBar` view asks the `Entry` to fetch related `Concepts` as `@relevantConcepts` (for easily appending metadata)
  fetchRelevantConcepts: =>
    @newFuzz = @get 'fuzz'
    if @newFuzz isnt @oldFuzz
      @oldFuzz = @newFuzz
      options =
        q: @newFuzz
        limit: 7
      @relevantConcepts.fetch data:  options
  # Sometimes a user will delete the entire `Entry.fuzz` and we want to clear any `RelevantConcepts` that are displayed at the moment
  resetRelevantConcepts: =>
    @relevantConcepts.reset()

  # When the user is editing fuzztle, the `AwsmBar` view asks the `Entry` to fetch suggested `Concepts` as `@suggestedConcepts` (for additional metadata) and `@suggestedConcepts` (for inline autocompletions)
  fetchSuggestedConcepts: =>
    options =
      q: @get 'fuzz'
    @suggestedConcepts.fetch data: options
  # Sometimes a user will delete the entire `Entry.fuzz` and we want to clear any `SuggestedConcepts` that are displayed at the moment
  resetSuggestedConcepts: =>
    @suggestedConcepts.reset()

  # When a user clicks a `RelevantConcept` below the `AwsmBar` it's content is appended to the `fuzz` attribute. We trigger a `relevantConceptAppended` event, because `change` will cause the `Fuzz` to re-render and lose focus
  appendRelevantConcept: (concept) ->
    @set 'fuzz', @get('fuzz') + ' ' + concept.toString()
    @trigger 'relevantConceptAppended'

  # If `Entry` is instantiated as part of a collection, it gets values as it should. If `Entry#save` is called, the whole collection is returned
  parse: (values) ->
    entry =
      id: values.id
      status: values.status
      state: values.state
      fuzz: values.fuzz
      url: values.url
      text: values.text
      description: values.description
      kind: values.type
      prettytime: values.prettytimecreated
      aims: values.aims
      # Workflow information
      fg: values.fg
      wf_id: values.wfid
    entry

# ## Entries
# URLs for `Entries` vary depending on the context. Here we're using `Sync.Entries` which enables reflecting `url` depending on the `method`.
class MM.Entries extends Backbone.Collection
  model: MM.Entry
  sync: MM.Sync.Entries
  url: (method) ->
    base = MM.Sync.URL
    login = MM.session.get('account')

    switch method
      when 'create'
        "#{base}/entry/#{login}"
      when 'read'
        "#{base}/entries/#{login}"        

  # `API` doesn't communicate auth errors with `HTTP`, so we have to handle it in `Entries#parse`
  parse: (response) ->
    if _.isObject(response.entries) && _.isArray(response.entries.items) && response.entries.items.length > 0
      response.entries.items
    else
      []

  # Sometimes the session data stored in the cookie is invalid,
  # or a server may encounter an internal error
  onSyncError: (model, response) =>
    console.log @, 'onSyncError', model, response
    if response.status is 'timeout'
      # TODO: Handle errors by reissuing the same request
      console.log @, 'onSyncError', 'It was a timeout'

  initialize: () ->
    
class MM.Entry.RelevantConcepts extends Backbone.Collection
  model: MM.Concept
  sync: MM.Sync.RelevantConcepts

  # The collection of relevant concepts is not mounted on the Entry, but on the user. It might make sense to distinguish between the  two approaches, but for now the API answers to two kinds of query params:
  #
  # * `q` - contains comma delimited concept names, prefixed with their identifying characters (+, #, @, ..). See Concept#toString
  # * `qs` - contains a full query string. See `Entry.fuzz` attribute
  url: ->
    base = MM.Sync.URL
    login = MM.session.get('account')

    "#{base}/relevant/#{login}"

  # If response was successful, `Concepts` are contained within `response.entities`
  parse: (response) ->
    if _.isArray(response.entities) && response.entities.length > 0
      response.entities
    else
      []

  # Sorted descending by `weight`
  comparator: (concept) ->
    parseFloat(concept.get("weight")) * -1

  initialize: (options) ->
    @entry = options.entry

# ## SuggestedConcept
# A `Concept` that can (auto)-complete the current `Entry.fuzz` while the user is typing in `AwsmBar`
class MM.Entry.SuggestedConcept extends Backbone.Model

  parse: (suggestion) ->
    console.log @, '#parse', suggestion
    suggestion

  initialize: ->
    console.log @

# ## Suggestions
# A `Collection` of `Suggestions` fetched by the `Entry` when the user changes `Entry.fuzz`
class MM.Entry.SuggestedConcepts extends Backbone.Collection
  model: MM.Concept
  sync: MM.Sync.SuggestedConcepts

  url: ->
    base = MM.Sync.URL
    login = MM.session.get('account')

    "#{base}/suggestions/#{login}"

  parse: (suggestions) ->
    # console.log @, '#parse', suggestions
    unless suggestions.length == 0
      [{'label': 'dev', 'type': 'TAG'}, {'label': 'mima', 'type': 'TAG'}]
    else
      []

  # Because this is a `Collection` of mixed `Model`s, we override `Backbone`'s `_prepareModel` to reflect on the model `type`
  _prepareModel: (model, options) ->
    # console.log @, '#_prepareModel', model, options
    if !(model instanceof Backbone.Model)
      attrs = model
      options.collection = @
      # console.log @, '#_prepareModel', attrs
      # We alter the way models are created. Originally this was `model = new this.model(attrs, options)`
      if _.isString(attrs.type)
        switch attrs.type.toUpperCase()
          when 'TAG'
            modelClass = MM.Concepts.Tag
          when 'PERSON'
            modelClass = MM.Concepts.Person
          when 'PLACE'
            modelClass = MM.Concepts.Place
          when 'TIME'
            modelClass = MM.Concepts.Time
        model = new modelClass(attrs, options)
      else
        model = new this.model(attrs, options)

      if (!model._validate(model.attributes, options))
        model = false
    else if (!model.collection)
      model.collection = this
    
    model
    

  initialize: ->
    # console.log @, '#initialize'



