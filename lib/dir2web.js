// 要建立服务器的目录
var dir = null;

// 服务器的主逻辑
var server = function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
};

// 初始化
server.init = function(settings){
  dir = settings.dir || '.';
};

module.exports = server;
