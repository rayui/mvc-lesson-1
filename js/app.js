//require web server module
var ws = require('./modules/server');
var appconfig = require('./modules/appconfig');

var webServer = new ws.webServer(appconfig.get('webServer'));
