# 系统框架

##一、分类/栏目的创建、显示
### 创建
后台admin

### 显示[取消]
    1、request url： /栏目slug/
    2、读取category表
      select fields from category where slug = '栏目slug'
      Category.get_by_slug(栏目slug)
    3、权限处理
    4、渲染list_template指定的模板文件
    5、例子：
    GET /software/ 表示显示栏目software的内容

##二、内容（文章、新闻......)的创建、显示
### 创建/投递
    1、request url： /内容类型/create?category_id=<int>
      内容类型：article、news、software、answer等
    2、读取category表
      select fields from category where slug = '栏目slug'
      Category.get_by_slug(栏目slug)
    3、权限处理
    4、渲染create_template指定的模板文件

    5、例子：
    http://127.0.0.1:5000/software/create?category_id=2
    http://127.0.0.1:5000/software/edit?entry_id=1
    http://127.0.0.1:5000/software/1.html
    http://127.0.0.1:5000/software/2/1_20.html