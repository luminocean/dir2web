# dir2web - 将你的文件目录搭建成http服务器

dir2web是一个非常简单的工具，只用一条命令就可以将你文件系统中的某个目录架设成http服务器
从而允许你的小伙伴可以通过他们自己的浏览器访问，从而共享你的文件

### 基本用法

```
Usage: dir2web [options]

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    -d, --directory [directory]  The directory you want to start a web server. Default to current working directory.
    -a, --address [address]      The ip address you want to start the server on. Default to localhost.
    -p, --port [port]            The server port. Default to 3000.
```

假设当前机器的ip地址为192.168.1.215

在/tmp目录下执行命令 `dir2web`，就可以在localhost:3000以及192.168.1.215:3000启动一个http服务器

这时在同一网段使用其他设备的浏览器访问192.168.1.215:3000即可访问到/tmp目录。点击文件进入子目录，点击文件即可浏览或者下载该文件，取决于文件类型

也可是使用`dir2web -a 127.0.0.1 -p 8080 -d /tmp/mydir`来显示指定各种参数

### 安装

首先安装node(https://nodejs.org/en/)

clone本项目后，进入项目根目录，执行`npm install`即可安装各依赖。
然后使用`npm install -g .`来将本项目安装到全局，即可在任意目录直接执行`dir2web命令`

> 使用 `npm uninstall dir2web -g`来完成卸载

安装后bin/dir2web文件即为可执行文件，\*nix系统下直接执行即可

> Windows下需要使用node bin/dir2web来执行
