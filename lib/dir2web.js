var path = require('path');
var fs = require('fs');
var mime = require('mime');

// 要建立服务器的目录(绝对地址)
var dir = null;

// 服务器的主逻辑
var server = function(req, res){
  // 客户端请求文件的绝对路径
  var filePath = resolveToFilePath(req);

  // 获取文件基本信息
  fs.stat(filePath, function(err, stat){
    if(err) return handleError(err);

    if(stat.isFile())
      handleFile(res, filePath);
    else
      handleDirectory(res, filePath);
  });
};
module.exports = server;

// 初始化
server.init = function(settings){
  var inputPath = settings.dir || '.';
  dir = path.resolve(process.cwd(), inputPath);
};

////// 以下为业务函数 //////

// 读取文件返回
function handleFile(res, filePath){
  var readStram = fs.createReadStream(filePath)

  res.writeHead(200, {'Content-Type': resolveMime(filePath)});
  readStram.pipe(res);

  readStram.on('error', function(err){
    handleError(res, err);
  });
}

function handleDirectory(res, dirPath){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('处理目录');
}

// 错误处理
function handleError(res, err, status){
  console.error(err);

  res.writeHead(status || 500, {'Content-Type': 'text/plain'});
  res.end('服务器异常');
}


////// 以下为工具函数 //////

// 解析用户请求，返回该请求文件在服务器文件系统中的绝对路径
// 如请求地址http://192.168.1.2/document/log.txt -> ~/MyDocuments/site/document/log.txt
function resolveToFilePath(req){
  var url = req.url; // 形如/document/log.txt
  var relativePath = url.replace(/^\//,''); // 移除开头/
  var absolutePath = path.join(dir, relativePath);

  return absolutePath;
}

function resolveMime(filePath){
  return mime.lookup(filePath);
}
