一、分类/栏目
======================================

获取栏目/分类列表
--------------------------------------
    url：
        http://127.0.0.1:5000/api/v1/category
    请求：
        GET
    请求头：
        Content-type: application/json
    参数：
        q=json格式的查询表达式
        page=页数
        num_pages=每页的条数

    测试的例子
        curl -H "Content-type: application/json" 'http://127.0.0.1:5000/api/v1/category'

    获取栏目/分类列表，并使用category_name字段查询
        curl -H "Content-type: application/json" 'http://127.0.0.1:5000/api/v1/category?q=\{"filters":\[\{"name":"category_name,"op":"like","val":"分类名"\}\]\}'

    op 的取值
        ==, eq
        !=, neq
        >, gt
        <, lt
        >=, gte
        <=, lte
        in, not_in
        is_null, is_not_null
        like

获取栏目/分类指定ID的信息
--------------------------------------
    url：
        http://127.0.0.1:5000/api/v1/category/ID
    请求：
        GET
    请求头：
        Content-type: application/json
    参数：
        ID 数据ID

    测试的例子
        curl -H "Content-type: application/json" 'http://127.0.0.1:5000/api/v1/category/1'

创建栏目
--------------------------------------
    无，通过admin管理

编辑栏目
--------------------------------------
    无，通过admin管理

删除栏目
--------------------------------------
    无，通过admin管理


二、内容（文章、新闻）
======================================

获取内容/内容列表
--------------------------------------
    url：
        http://127.0.0.1:5000/api/v1/ENTRY_NAME
    请求：
        GET
    请求头：
        Content-type: application/json
    参数：
        ENTRY_NAME 内容名：software、article、answer、forum、news、......

        q=json格式的查询表达式
        page=页数
        num_pages=每页的条数

    测试的例子
        curl -H "Content-type: application/json" 'http://127.0.0.1:5000/api/v1/software'

获取标签指定ID的信息
--------------------------------------
    url：
        http://127.0.0.1:5000/api/v1/ENTRY_NAME/ID
    请求：
        GET
    请求头：
        Content-type: application/json
    参数：
        ENTRY_NAME 内容名：software、article、answer、forum、news、......
        ID 数据ID

    测试的例子
        curl -H "Content-type: application/json" 'http://127.0.0.1:5000/api/v1/software/1'

添加内容
--------------------------------------
    url：
        http://127.0.0.1:5000/entry/v1/create?category_id=ID
    请求：
        POST
    请求头：
        Content-type: application/json
    参数：
        ID 栏目/分类ID

    测试的例子
        curl -H "Content-type: application/json" 'http://127.0.0.1:5000/entry/v1/create?category_id=1' -d 'title=标题&content=内容'


编辑内容
--------------------------------------
    url：
        http://127.0.0.1:5000/entry/v1/create?category_id=ID
    请求：
        POST
    请求头：
        Content-type: application/json
    参数：
        ID 栏目/分类ID

    测试的例子
        curl -H "Content-type: application/json" 'http://127.0.0.1:5000/entry/v1/create?category_id=1' -d 'title=标题&content=内容'

删除内容
todo


三、标签
======================================

获取标签列表
--------------------------------------
    url：
        http://127.0.0.1:5000/api/v1/tag
    请求：
        POST
    请求头：
        Content-type: application/json
    参数：
        q=json格式的查询表达式
        page=页数
        num_pages=每页的条数

    测试的例子
        curl -H "Content-type: application/json" 'http://127.0.0.1:5000/api/v1/tag'

获取标签指定ID的信息
--------------------------------------
    url：
        http://127.0.0.1:5000/api/v1/tag/ID
    请求：
        GET
    请求头：
        Content-type: application/json
    参数：
        ID 数据ID

    测试的例子
        curl -H "Content-type: application/json" 'http://127.0.0.1:5000/api/v1/tag/1'

添加标签
--------------------------------------
    url：
        http://127.0.0.1:5000/tag/v1/create
    请求：
        POST
    参数：
        tag_name 标签名
        slug    固定地址

    测试的例子
    curl 'http://127.0.0.1:5000/tag/v1/create' -d 'tag_name=test1&slug=test1'

编辑标签
--------------------------------------
    url：
        http://127.0.0.1:5000/tag/v1/edit?tag_id=ID
    请求：
        POST
    参数：
        ID 数据ID
        tag_name 标签名
        slug    固定地址

    测试的例子
    curl 'http://127.0.0.1:5000/tag/v1/edit?tag_id=1' -d 'tag_name=test1&slug=test1'

删除标签
todo