var path = require('path');
var fs = require('fs');
var mime = require('mime');

// 要建立服务器的目录(绝对地址)
var dir = null;

// 服务器的主逻辑
var server = function(req, res){
  // 客户端请求文件的绝对路径
  var filePath = resolveToFilePath(req);

  // 特别处理favicon请求
  if(handleFavicon(filePath, res)) return;

  // 获取文件基本信息
  fs.stat(filePath, function(err, stat){
    if(err) return handleError(err, res);

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

  res.writeHead(200, {'Content-Type': resolveMime(filePath)+'; charset=utf-8'});
  readStram.pipe(res);

  readStram.on('error', function(err){
    handleError(err, res);
  });
}

function handleDirectory(res, dirPath){
  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  res.end('处理目录');
}

// 处理favicon请求
// 如果是favicon请求，则返回true，提醒调用方不用再往下处理了
// 否则返回false
function handleFavicon(filePath, res){
  var requestedFaviconPath = path.join(dir, 'favicon.ico');
  if(requestedFaviconPath != filePath) return false;

  var actualFaviconPath = path.join(__dirname, '../favicon.ico');
  handleFile(res, actualFaviconPath);

  return true;
}

// 错误处理
function handleError(err, res, status){
  console.error(err);

  var msg = '服务器异常'; // 默认错误消息
  if(err.code = 'ENOENT') msg = '文件或目录不存在';

  res.writeHead(status || 500, {'Content-Type': 'text/plain'});
  res.end(msg);
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

// 根据文件名（或路径）解析出对应的mime类型字符串
function resolveMime(filePath){
  return mime.lookup(filePath);
}
