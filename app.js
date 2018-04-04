var Koa = require('koa');
var app = new Koa();
var staticServer = require('koa-static');
var path = require('path');
app.use(staticServer(path.join(__dirname,'_gh_pages')));
app.listen(8888);
