(function() {
  var loc, port, server, token, user;

  window.SERVER_URI = "www.middlemachine.com/BTW";

  loc = document.location.toString();

  server = loc.substr(loc.indexOf("server=") + 7, loc.length);

  if (server.indexOf("&") !== -1) server = server.substr(0, server.indexOf("&"));

  port = loc.substr(loc.indexOf("port=") + 5, loc.length);

  if (port.indexOf("&") !== -1) port = port.substr(0, port.indexOf("&"));

  user = loc.substr(loc.indexOf("user=") + 5, loc.length);

  if (user.indexOf("&") !== -1) user = user.substr(0, user.indexOf("&"));

  token = loc.substr(loc.indexOf("token=") + 6, loc.length);

  if (token.indexOf("&") !== -1) token = token.substr(0, token.indexOf("&"));

  window.USERNAME = user;

  window.TOKEN = token;

  window.SERVER_URI = server;

  window.SERVER_PORT = port;

}).call(this);
