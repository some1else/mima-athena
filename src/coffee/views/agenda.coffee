# # Agenda View
#
# `Agenda` is the main view of **middlemachine**. It facilitates creating, editing and filtering of thoughts (or individual `Entries`). To accomplish that goal, it has to coordinate the following sub-views
#
# ## Main sub-views
#
# The following main sub-views of Agenda enable the most crucial editing and filtering of a user's thoughs
#
# * `AwsmBar` - A unified way to query and create new `Entries`. A crossbreed between a search bar and an `Entry` edit view
# * `Entries` - A collection of individual thoughts, expressed as a `Fuzz` (a piece of data in fuzztle markup)
#
# ## Auxilliary views
#
# The following auxilliary sub-views of Agenda enable a basic overview of the user's concepts and a way to filter the current entries related to those concepts
#
# * `Aims` - A group of `Concepts` similar to tags. It describes the user's intentions and abstract `Concepts` their `Entries` belong to
# * `Contacts` - A group of `Concepts` that describes people the user shares `Entries` with
# * `Locations` - A group of `Concepts` that describes the location of the user and individual `Entries` in either the physical or abstract domain

window.MM ||= {}
MM.Views ||= {}

class MM.Views.Agenda extends Backbone.View
  template: _.template("")
  id: 'views-agenda'


  # ### Initialize
  # In the beginning, we need to instantiate the individual models, collections and views that belong to `Agenda`
  initialize: ->
    # To help `AwsmBar` work, we create an empty `Entry` the user will modify or use to filter existing related `Entries` with
    @entry = new MM.Entry()

    # We create a collection of `Entries` and their `View`
    @entries = new MM.Entries()
    @entriesView = new MM.Views.Entries(collection: @entries, agenda: @)
    # `AwsmBar` recieves both, but `Entries` don't arrive as a `Collection`, because we don't need to bind to their events yet
    @awsmBar = new MM.Views.AwsmBar(model: @entry, entries: @entries, agenda: @)
    # Fetch `Workflows` and `Entries` for the first time.
    #
    # Warning: Race condition? `Entries` might render before `Workflows` have been fetched
    @fetchWorkflows()
    @fetchEntries()
    @bindEntriesSearch(@entry)

  # ### Initial fetch
  # Right now the `API` calls `success` even in case of internal errors, because `JSONP` doesn't support `status` codes.
  # However, `error` is invoked in case there is a timeout because the network is unreachable.
  fetchEntries: ->
    options = _.extend @getFetchRequestOptions(), @getFetchErrorOptions()
    # Simple fetch without a `limit` will do
    @entries.fetch options
  fetchWorkflows: ->
    MM.workflows.fetch()

  # When the `Entry` for `AwsmBar` is instantiated or re-instantiated, we need to bind and unbind events appropriately.
  bindEntriesSearch: (entry) ->
    entry.on 'change:fuzz', @searchForEntries
  unBindEntriesSearch: (entry) ->
    entry.off 'change:fuzz', @searchForEntries

  # ### Entry search/filter
  # We `fetch` `Entries` whenever `AwsmBar` `Entry`'s `fuzz` changes
  searchForEntries: (model, fuzz) =>
    query = model.getChompedFuzz()
    # If there's something inside `fuzz`, we pass the `query` on as `_Es`
    if query isnt ''
      options =
        data:
          _Es: query
          _El: 'off'
      options = _.extend options, @getFetchErrorOptions()
      @entries.fetch options
    # Otherwise we make a clean `fetch` without a limit (`_El`)
    else
      @entries.fetch @getFetchRequestOptions()

  # ### Rendering
  # Merely clears the `el` that holds `Agenda` and appends all the sub-views
  render: =>
    @$el.html @template()
    @$el.append @awsmBar.render().el
    @$el.append @entriesView.render().el
    @

  # ### Render callback
  # Initialize `AwsmBar` after it was appended to the `DOM`
  onRendered: =>
    @awsmBar.onRendered()

  # ### Fetch Options
  # For now all the requests ask for the entire list of `Entries` so we return a simple params hash (`_El` stands for limit).
  getFetchRequestOptions: ->
    {
      data:
        _El: 'off'
    }
  # We use a uniform fetch options hash that handles `JSONP` errors. The returned hash contains functions that will handle errors, and are bound to scope of the `Agenda`
  getFetchErrorOptions: ->
    {
      # Sometimes the header state is `200 OK` and the error is communicated via `JSON`
      success: (model, resp) =>
        if _.isString(resp.error)
          @onFetchError(model, resp)
      # Timeouts are routed to `error` as they should
      error: (model, resp) =>
        console.log @, '#fetchErrorOptions.error', model, resp
        resp = error: 'Timeout'
        @onFetchError(model, resp)
    }

  # ### Sync error handling
  onFetchError: (model, resp) =>
    resp ||= error: ''
    switch resp.error
      # In case we're not authenticated, we want to send the user to a `login` page
      when 'Failed user auth'
        MM.app.resetSession()
        _.defer ->
          MM.app.navigate('login', true)
      # Otherwise we show a descriptive error message
      when 'Timeout'
        # Perhaps we should consider capturing `Timeouts` globally, or even working with an intermediary local `Sync`
        console.log @, '#onFetchError', 'Timeout'
      else
        console.log @, '#onFetchError', 'Unknown Error'

  # ### Proxy
  # Handy method
  focusAwsmBar: ->
    @awsmBar.focus()
