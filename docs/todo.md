1、更好的返回josn信息

#Flask中如何对html转义
Flask框架默认是将输出自动转义（注意是转义output，不是input）。如果我们需要非转义的输出，只需要按Flask文档提供的方式标示出即可。
Flask的对转义的标示方式有三种：
用于Python代码中的Markup类；
用于Template中的safe过滤器；
用于Template中的{% autoescape %}块。
flask.escape()

# Flask自定义Converter
class ObjectIDConverter(BaseConverter):
    def to_python(self, value):
        try:
            return ObjectId(base64_decode(value))
        except (InvalidId, ValueError, TypeError):
            raise ValidationError()
    def to_url(self, value):
        return base64_encode(value.binary)

app.url_map.converters['objectid'] = ObjectIDConverter

@app.route('/users/<objectid:user_id>')
def show_user(user_id):
    return 'User ID: %r' % user_id

#如何使用BBCode
##第三方包bbcode
https://github.com/dcwatson/bbcode

##WYSIWYG BBcode editor
https://github.com/wbb/WysiBB





About

## 如何使用项目
curl -O http://python-distribute.org/distribute_setup.py
sudo /opt/python-2.7.4/bin/python distribute_setup.py

mkdir project_name
cd project_name
virtualenv .
. bin/activate
python setup.py install

项目的结构

   - category: A Category
    - date: 2012-12-24
    - tags: tag1, tag2
    - comment: disabled

- 依赖的库
  - Flask-BabelEx
  - https://pypi.python.org/pypi/Flask-BabelEx

misaka
https://github.com/FSX/misaka

## Dependencies

    pip install Flask
    pip install Flask-SQLAlchemy
    pip install Flask-WTF

## Customizations

**Be sure to set a `SECRET_KEY` in hello/config.py** ... you can generate one like this:

    import uuid
    print uuid.uuid4().hex


http://wtforms-alchemy.readthedocs.org/en/latest/
https://github.com/sebastien/cuisine


https://github.com/thrisp/flask-security
https://github.com/danielholmstrom/flask-alchemyview/
https://github.com/mrjoes/flask-admin/
https://github.com/mitsuhiko/flask-babel
https://github.com/jfinkels/flask-restless

如何更好的组织flask结构
http://www.oschina.net/translate/how-i-structure-my-flask-applications?print
http://mattupstate.com/python/2013/06/26/how-i-structure-my-flask-applications.html

http://sphinx-doc.org/tutorial.html

#todo
.. _semantic_version: http://python-semanticversion.readthedocs.org/en/latest/
.. _webassets: http://elsdoerfer.name/docs/webassets/
.. _Docflow: http://docflow.readthedocs.org/
.. _werkzeug.exceptions.Forbidden: http://werkzeug.readthedocs.org/en/latest/exceptions/#werkzeug.exceptions.Forbidden
SQLAlchemy
BeautifulSoup
http://github.com/jace/pydocflow/tarball/master#egg=docflow
nose
coverage
coveralls
SQLAlchemy
webassets
semantic_version
pytz
Flask-SQLAlchemy
http://github.com/jace/pydocflow/tarball/master#egg=docflow
https://github.com/jace/flask-alembic/archive/master.zip
psycopg2

https://github.com/mjhea0/flaskr-tdd