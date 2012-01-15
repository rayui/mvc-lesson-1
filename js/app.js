//require web server module
var ws = require('./modules/server');

//instantiate new web server
var webServer = new ws.webServer({
	'port':process.env.PORT || 8000
});
