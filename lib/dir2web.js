var path = require('path');
var fs = require('fs');
var mime = require('mime');
var ejs = require('ejs');
var urlencode = require('urlencode');

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

  // mime类型识别默认为text/plain
  mime.default_type = 'text/plain';
};

////// 以下为业务函数 //////

// 读取文件返回
function handleFile(res, filePath){
  var readStram = fs.createReadStream(filePath);

  res.writeHead(200, {'Content-Type': resolveMime(filePath)+'; charset=utf-8'});
  readStram.pipe(res);

  readStram.on('error', function(err){
    handleError(err, res);
  });
}

function handleDirectory(res, dirPath){
  readDir(dirPath, function(err, files){
    // 目录名称
    var baseName = path.basename(dirPath);

    fs.readFile(path.join(__dirname, '../view/directory.ejs'), function(err, data){
      var htmlTemplate = data.toString();
      var dirHtml = ejs.render(htmlTemplate, {
        'dirName':baseName,
        'files':files
      });

      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(dirHtml);
    });
  });
}

// 读取目录，获取目录内各文件的文件名以及类型（是否目录）
function readDir(dirPath, callback){
  var files = [];

  fs.readdir(dirPath, function(err, fileNames){
    // 过滤隐藏文件
    var fileNames = fileNames.filter(function(fileName){
      if(fileName.match(/^\./)) return false;
      return true;
    });

    var filesNum = fileNames.length;
    var counter = 0;

    fileNames.forEach(function(fileName){
      fs.stat(path.join(dirPath, fileName), function(err, stat){
        counter++;
        if(err) return callback(err);

        files.push({
          'fileName':fileName,
          'isDir':stat.isDirectory()
        });

        if(counter == filesNum){
          return callback(null, files);
        }
      });
    });
  });
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

  // 对文件路径中的中文部分解码
  var decodedPath = urlencode.decode(absolutePath, 'utf8');
  return decodedPath;
}

// 根据文件名（或路径）解析出对应的mime类型字符串
function resolveMime(filePath){
  return mime.lookup(filePath);
}
