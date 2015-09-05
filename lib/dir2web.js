var path = require('path');
var fs = require('fs');

// 要建立服务器的目录(绝对地址)
var dir = null;

// 服务器的主逻辑
var server = function(req, res){
  // 客户端实际请求的文件绝对路径
  var filePath = resolveToFilePath(req);

  var readStram = fs.createReadStream(filePath);
  readStram.on('error', function(err){
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('获取文件或目录异常');
  });

  res.writeHead(200, {'Content-Type': 'text/plain'});
  readStram.pipe(res);
};
module.exports = server;

// 初始化
server.init = function(settings){
  var inputPath = settings.dir || '.';
  dir = path.resolve(process.cwd(), inputPath);
};

////// 以下为工具函数 //////

// 解析用户请求，返回该请求文件在服务器文件系统中的绝对路径
// 如请求地址http://192.168.1.2/document/log.txt -> ~/MyDocuments/site/document/log.txt
function resolveToFilePath(req){
  var url = req.url; // 形如/document/log.txt
  var relativePath = url.replace(/^\//,''); // 移除开头/
  var absolutePath = path.join(dir, relativePath);

  return absolutePath;
}
