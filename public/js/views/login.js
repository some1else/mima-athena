(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.MM || (window.MM = {});

  MM.Views || (MM.Views = {});

  MM.Login = (function(_super) {

    __extends(Login, _super);

    function Login() {
      Login.__super__.constructor.apply(this, arguments);
    }

    Login.prototype.defaults = {
      login: '',
      password: '',
      new_user: false,
      submit_text: 'Log in'
    };

    Login.prototype.getPassHash = function() {
      return $.md5(this.get('password'));
    };

    return Login;

  })(Backbone.Model);

  MM.Views.Login = (function(_super) {

    __extends(Login, _super);

    function Login() {
      this.render = __bind(this.render, this);
      Login.__super__.constructor.apply(this, arguments);
    }

    Login.prototype.template = _.template("<div id='loginSignupForm'></div>");

    Login.prototype.id = 'views-login';

    Login.prototype.initialize = function() {
      this.login = new MM.Login({
        login: 'devuser1',
        password: 'admin123'
      });
      return this.loginSignupForm = new MM.Views.LoginSignupForm({
        model: this.login
      });
    };

    Login.prototype.render = function() {
      this.$el.html(this.template());
      this.$loginSignupForm = this.$('#loginSignupForm');
      this.$loginSignupForm.replaceWith(this.loginSignupForm.render().el);
      return this;
    };

    return Login;

  })(Backbone.View);

  MM.Views.LoginSignupForm = (function(_super) {

    __extends(LoginSignupForm, _super);

    function LoginSignupForm() {
      this.render = __bind(this.render, this);
      this.onPasswordChanged = __bind(this.onPasswordChanged, this);
      this.onLoginChanged = __bind(this.onLoginChanged, this);
      this.onLogInClicked = __bind(this.onLogInClicked, this);
      this.onSignUpClicked = __bind(this.onSignUpClicked, this);
      this.onNewUserCheckboxClicked = __bind(this.onNewUserCheckboxClicked, this);
      LoginSignupForm.__super__.constructor.apply(this, arguments);
    }

    LoginSignupForm.prototype.template = _.template("<ul class='nav nav-tabs login_nav'><li class='log_in'><a href='#'>Log in</a></li><li class='sign_up'><a href='#'>Sign up</a></li></ul>                        <form class='login_or_register'>                          <p class='login'>                            <input id='login_name' name='login[name]' type='text' placeholder='email' value='<%= login %>' class='login_field'>                          </p>                          <p class='pass'>                            <input id='login_pass' name='login[pass]' type='password' placeholder='password' value='<%= password %>' class='password_field'>                          </p>                          <!-- <p class='new_user'                            <label for='login[new_user]'>                              <span><small>New user?</small></span>                              <input id='login_new_user' name='login[new_user]' type='checkbox' class='new_user_checkbox' checked>                            </label>                          </p> -->                          <p class='submit'>                            <input id='login_submit' name='login[submit]' type='submit' value='<%= submit_text %>' class='submit_button btn btn-primary'>                          </p>                        </form>");

    LoginSignupForm.prototype.model = MM.Login;

    LoginSignupForm.prototype.events = {
      'keyup input.login_field': 'onLoginChanged',
      'keyup input.password_field': 'onPasswordChanged',
      'change input.new_user_checkbox': 'onNewUserCheckboxClicked',
      'click .sign_up': 'onSignUpClicked',
      'click .log_in': 'onLogInClicked',
      'blur input': 'onUnFocus',
      'submit form': 'onFormSubmit'
    };

    LoginSignupForm.prototype.onFormSubmit = function(e) {
      e.preventDefault();
      MM.session || (MM.session = new MM.Session());
      MM.session.set({
        login: this.model.get('login'),
        pass: this.model.getPassHash()
      });
      return MM.session.save();
    };

    LoginSignupForm.prototype.onUnFocus = function() {
      return this.focused = false;
    };

    LoginSignupForm.prototype.onNewUserCheckboxClicked = function() {
      var attribs;
      this.focused = false;
      attribs = {
        new_user: !this.model.get('new_user'),
        submit_text: this.model.get('new_user') ? 'Log in' : 'Sign up'
      };
      return this.model.set(attribs);
    };

    LoginSignupForm.prototype.onSignUpClicked = function(e) {
      e.preventDefault();
      this.focused = false;
      return this.model.set({
        submit_text: 'Sign up'
      });
    };

    LoginSignupForm.prototype.onLogInClicked = function(e) {
      e.preventDefault();
      this.focused = false;
      return this.model.set({
        submit_text: 'Log in'
      });
    };

    LoginSignupForm.prototype.onLoginChanged = function(e) {
      this.focused = true;
      return this.model.set({
        login: $(e.currentTarget).val()
      });
    };

    LoginSignupForm.prototype.onPasswordChanged = function(e) {
      this.focused = true;
      return this.model.set({
        password: $(e.currentTarget).val()
      });
    };

    LoginSignupForm.prototype.render = function() {
      if (!this.focused) {
        this.$el.html(this.template(this.model.toJSON()));
        this.$log_in = this.$el.find('.log_in').first();
        this.$sign_up = this.$el.find('.sign_up').first();
        if (this.model.get('submit_text') === 'Sign up') {
          this.$sign_up.addClass('active');
        } else {
          this.$log_in.addClass('active');
        }
      }
      return this;
    };

    LoginSignupForm.prototype.initialize = function() {
      this.focused = false;
      if (this.$el && this.model) {
        this.render();
        return this.model.bind('change', this.render);
      }
    };

    return LoginSignupForm;

  })(Backbone.View);

}).call(this);
