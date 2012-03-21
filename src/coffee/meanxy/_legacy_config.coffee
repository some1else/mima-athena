window.SERVER_URI = "www.middlemachine.com/BTW"
loc = document.location.toString()
server = loc.substr(loc.indexOf("server=") + 7, loc.length)
server = server.substr(0, server.indexOf("&"))  unless server.indexOf("&") is -1
port = loc.substr(loc.indexOf("port=") + 5, loc.length)
port = port.substr(0, port.indexOf("&"))  unless port.indexOf("&") is -1
user = loc.substr(loc.indexOf("user=") + 5, loc.length)
user = user.substr(0, user.indexOf("&"))  unless user.indexOf("&") is -1
token = loc.substr(loc.indexOf("token=") + 6, loc.length)
token = token.substr(0, token.indexOf("&"))  unless token.indexOf("&") is -1
window.USERNAME = user
window.TOKEN = token
window.SERVER_URI = server
window.SERVER_PORT = port