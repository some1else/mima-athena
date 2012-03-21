window.MM ||= {}
MM.Views ||= {}

class MM.Views.Nav extends Backbone.View
  # id: 'views-navbar'
  className: 'navbar-inner'
  template: _.template("<div class='navbar-inner'>
                          <h1><a class='brand' href='/'>middlemachine</a></h1>
                          <ul class='nav'>
                            <li><a class='agenda' href='/agenda'>Agenda</a></li>
                            <li><a class='meanxy' href='/meanxy'>MeanXY</a></li>
                            <li><a class='logout' href='/logout'>Log out</a></li>
                          </ul>
                        </div>")

  events:
    'click .agenda': 'gotoAgenda'
    'click .meanxy': 'gotoMeanXY'
    'click .logout': 'logOut'

  gotoAgenda: (e) =>
    e.preventDefault()
    MM.app.navigate('agenda')
  gotoMeanXY: (e) =>
    e.preventDefault()
    MM.app.navigate('meanxy')

  logOut: (e) =>
    e.preventDefault()
    MM.app.resetSession()
    MM.app.navigate('', true)
    console.log @, 'logOut'
    
  render: =>
    @$el.html @template()
    @hide()
    @

  show: ->
    @$el.show()
  hide: ->
    @$el.hide()

  initialize: ->
    # @render()