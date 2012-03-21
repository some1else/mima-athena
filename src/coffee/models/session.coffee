window.MM ||= {}

class MM.Session extends Backbone.Model
  defaults:
      login: ''
      pass: ''
      token: '', real_name: '', account: ''

  sync: MM.Sync.Session

  url: ->
    MM.Sync.URL + '/api/login/' + @get('login')

  saveToCookie: ->
    cookieData = JSON.stringify
      account: @get('account')
      real_name: @get('real_name')
      token: @get('token')

    $.cookie 'MMSessionData', cookieData, {path: '/', expires: 14}

  loadFromCookie: ->
    cookieData = $.cookie 'MMSessionData'

    if (cookieData isnt null)
      cookieData = JSON.parse(cookieData)
      @set(cookieData, silent: true)

  isLoaded: ->
    @get('token') != '' && @get('account') != '' && @get('real_name') != ''

  deleteCookie: ->
    $.cookie 'MMSessionData', null
    
  tokenChanged: ->
    @saveToCookie() if @isLoaded()

  initialize: ->
    @loadFromCookie()
    @on 'change:token', @tokenChanged