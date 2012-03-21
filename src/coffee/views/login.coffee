window.MM ||= {}
MM.Views ||= {}


# # Login
# * depends on MM.Session

# `Login` is used to keep both Login/Signup views up to date
class MM.Login extends Backbone.Model
  defaults:
    login: ''
    password: ''
    new_user: false
    submit_text: 'Log in'

  getPassHash: ->
    $.md5(@get('password'))

# `Login` view
class MM.Views.Login extends Backbone.View
  template: _.template("<div id='loginSignupForm'></div>")
  id: 'views-login'

  # At the start we create a `Login` model that holds credentials that are used to sign the visitor up or create a user's `Session`
  initialize: ->
    @login = new MM.Login login: 'devuser1', password: 'admin123'
    @loginSignupForm = new MM.Views.LoginSignupForm model: @login

  # After rendering the landing template into the `el`, placeholder for `LoginSignupForms` is found and replaced
  render: =>
    @$el.html @template()
    @$loginSignupForm = @$('#loginSignupForm')
    @$loginSignupForm.replaceWith @loginSignupForm.render().el
    @

# The form uses a temporary model login to hold the values
# But it creates a Session model upon submission
class MM.Views.LoginSignupForm extends Backbone.View
  template: _.template("<ul class='nav nav-tabs login_nav'><li class='log_in'><a href='#'>Log in</a></li><li class='sign_up'><a href='#'>Sign up</a></li></ul>
                        <form class='login_or_register'>
                          <p class='login'>
                            <input id='login_name' name='login[name]' type='text' placeholder='email' value='<%= login %>' class='login_field'>
                          </p>
                          <p class='pass'>
                            <input id='login_pass' name='login[pass]' type='password' placeholder='password' value='<%= password %>' class='password_field'>
                          </p>
                          <!-- <p class='new_user'
                            <label for='login[new_user]'>
                              <span><small>New user?</small></span>
                              <input id='login_new_user' name='login[new_user]' type='checkbox' class='new_user_checkbox' checked>
                            </label>
                          </p> -->
                          <p class='submit'>
                            <input id='login_submit' name='login[submit]' type='submit' value='<%= submit_text %>' class='submit_button btn btn-primary'>
                          </p>
                        </form>")
  model: MM.Login
  events:
    'keyup input.login_field'           : 'onLoginChanged'
    'keyup input.password_field'        : 'onPasswordChanged'
    'change input.new_user_checkbox'    : 'onNewUserCheckboxClicked'
    'click .sign_up'                    : 'onSignUpClicked'
    'click .log_in'                     : 'onLogInClicked'
    'blur input'                        : 'onUnFocus'
    'submit form'                       : 'onFormSubmit'
  
  onFormSubmit: (e) ->
    e.preventDefault()
    MM.session ||= new MM.Session()
    MM.session.set 
      login: @model.get('login')
      pass: @model.getPassHash()
    MM.session.save()
    
  onUnFocus: ->
    @focused = false

  onNewUserCheckboxClicked: =>
    @focused = false
    attribs =
      new_user: !@model.get('new_user')
      submit_text:
        if @model.get('new_user')
          'Log in'
        else
          'Sign up'
    @model.set attribs

  onSignUpClicked: (e) =>
    e.preventDefault()
    @focused = false
    @model.set submit_text: 'Sign up' 

  onLogInClicked: (e) =>
    e.preventDefault()
    @focused = false
    @model.set submit_text: 'Log in'

  onLoginChanged: (e) =>
    @focused = true
    @model.set login: $(e.currentTarget).val()

  onPasswordChanged: (e) =>
    @focused = true
    @model.set password: $(e.currentTarget).val()

  render: =>
    unless @focused
      @.$el.html @template(@model.toJSON())
      @.$log_in = @.$el.find('.log_in').first()
      @.$sign_up = @.$el.find('.sign_up').first()
      if @model.get('submit_text') == 'Sign up'
        @.$sign_up.addClass('active')
      else
        @.$log_in.addClass('active')
      # @.$el.find('.login_field').focus()
      # @focused = true
    @

  initialize: ->
    
    @focused = false
    if @.$el && @model
      @render()
      @model.bind 'change', @render


