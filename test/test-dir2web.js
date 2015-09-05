var assert = require("assert");
var rewire = require("rewire");

var dir2web = null;
beforeEach(function(){
  dir2web = rewire('../lib/dir2web.js');
});

describe('dir2web.js', function() {
  // 测试#init()
  describe('#init()', function () {
    it('使用相对目录（.）初始化', function () {
      dir2web.init({
        'dir':'.'
      });
      assert.equal(dir2web.__get__('dir'), process.cwd());
    });

    it('使用绝对目录初始化', function () {
      dir2web.init({
        'dir':'/tmp'
      });
      assert.equal(dir2web.__get__('dir'), '/tmp');
    });
  });

  // 测试resolveToFilePath()
  describe('resolveToFilePath()', function(){
    var resolveToFilePath = null;
    beforeEach(function(){
      resolveToFilePath = dir2web.__get__('resolveToFilePath');
      // 服务器目录初始化为/tmp
      dir2web.init({
        'dir':'/tmp'
      });
    });

    it('解析文件url', function(){
      var filePath = resolveToFilePath({
        'url':'/document/log.txt'
      });
      assert.equal(filePath, '/tmp/document/log.txt');
    });

    it('解析根目录url', function(){
      var filePath = resolveToFilePath({
        'url':'/'
      });
      assert.equal(filePath, '/tmp');
    });

    it('解析目录url', function(){
      var filePath = resolveToFilePath({
        'url':'/doc'
      });
      assert.equal(filePath, '/tmp/doc');
    });
  });
});
