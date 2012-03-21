# # middlemachine App Router

window.MM ||= {}

# Responds to `routes` and instantiates appropriate `Views`
#
# * `landing` - The greeting page for new and returning users of *middlemachine*
# * `agenda` - The main `View` of *middlemachine* used for creating, editing and filtering `Entries`
# * `meanxy` - Tile-based interface for exploring `Concepts`
class MM.App extends Backbone.Router
  routes:
    ''              : 'redirect'
    'landing'       : 'landing'
    'agenda'        : 'agenda'
    'meanxy'        : 'meanxy'
    'login'         : 'login'
  
  # ## Landing
  #
  # * doesn't show the main `Nav`
  landing: ->
    @view = new MM.Views.Landing()
    @$stage.html @view.render().el
    @nav.hide()

  # ## Login
  #
  # * doesn't show the main `Nav`
  login: ->
    @view = new MM.Views.Login()
    @$stage.html @view.render().el
    @nav.hide()

  # ## Agenda
  #
  # * requires a `Session` token
  # * needs to know when it was appended to the `DOM`
  # * shows `Nav`
  agenda: ->
    @ensureSession()

    @view = new MM.Views.Agenda()
    @$stage.html @view.render().el    
    @view.onRendered()

    @nav.show()

  # ## MeanXY
  #
  # * requires a `Session` token
  # * shows `Nav`
  meanxy: ->
    @ensureSession()

    tiles = new MM.MeanXY.TileCollection()
    @view = new MM.MeanXY.Views.Tiles collection: tiles
    @$el.html @view.render().el

    @nav.show()

  # ## Redirect
  # When the user arrives to the root path, they're redirected depending on whether they're logged in or not
  redirect: ->
    if MM.session.isLoaded()
      @navigate('agenda', true)
    else
      @navigate('landing', true)

  # ## Initialize
  # We start by assigning the `DOM` elements to local variables, initializing and rendering the `Nav` view and creating or loading the `Session`
  initialize: ->
    @assignDOMElements()
    @initNav()
    @initSession()
    @initWorkflows()

  # ## Utility Methods

  # Local variables for easy, cached access
  assignDOMElements: ->
    @$app = $('#app')
    @$nav = $('#views-navbar')
    @$stage = $('#stage')

  # `Nav` view
  initNav: ->
    @nav = new MM.Views.Nav()
    @$nav.html @nav.render().el
  
  # Workflows
  initWorkflows: ->
    unless MM.workflows
      MM.workflows = new MM.Workflows()

  # `Session` model
  initSession: ->
    unless MM.session
      MM.session = new MM.Session()
    MM.session.on 'change:token', @onTokenChanged
  resetSession: ->
    if MM.session
      MM.session.off 'change:token', @onTokenChanged
      MM.session.deleteCookie()
      delete MM.session
    MM.session = new MM.Session()
    MM.session.on 'change:token', @onTokenChanged

  # We can navigate to `Agenda` once we get the `Session` token
  onTokenChanged: =>
    @navigate('agenda', true)

  # We send the user to the `landing` page in case the `Session` isn't loaded
  ensureSession: ->
    unless MM.session.isLoaded()
      @navigate('landing', true)
