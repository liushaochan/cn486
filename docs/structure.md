# 目录与文件结构
    bin           执行文件目录，buildout自动产生
    conf          配置文件
    db            数据库存放目录，用于sqlite
    develop-eggs  一些依赖包，buildout自动产生
    docs          说明文档
    eggs          依赖包，buildout自动产生
    external      第三方库，buildout自动产生
    logs          系统日志存放目录
    migrations    数据迁移目录
    parts         依赖包，buildout自动产生
    resources     资源文件目录
    scripts       脚本文件
    src           源代码目录
    tmp           临时文件目录
    todo          放待做日志
    webroot       web根目录

    buildout.cfg  buildout配置文件
    LICENSE.txt   许可信息
    Makefile      make配置文件
    readme.md     说明文件
    requirements.txt    依赖包配置文件
    setup.py      系统配置文件
    versions.cfg  依赖包版本信息，buildout自动产生

## webroot的目录结构
    img
     模块或库名/......
    css
     模块或库名/......
    js
     模块或库名/......
    upload

# 开发view

# 设计思路
不使用数据库自带的主键id，采用ObjectId
目录：
    分布式
    防采集