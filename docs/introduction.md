how to get started
------------------
1、安装python
cd /usr/local/src/
wget http://www.python.org/ftp/python/2.7.3/Python-2.7.3.tar.bz2
tar vxf Python-2.7.3.tar.bz2
cd Python-2.7.3
./configure --prefix=/usr/local/python-2.7.3
make && make install

2、安装setuptools
cd /usr/local/src/
wget http://pypi.python.org/packages/source/s/setuptools/setuptools-0.6c11.tar.gz#md5=7df2a529a074f613b509fb44feefe74e
tar vxf setuptools-0.6c11.tar.gz
cd setuptools-0.6c11
/usr/local/python-2.7.3/bin/python setup.py install

/usr/local/python-2.7.3/bin/easy_install virtualenv
/usr/local/python-2.7.3/bin/easy_install pip
/usr/local/python-2.7.3/bin/pip install http://projects.unbit.it/downloads/uwsgi-lts.tar.gz
/usr/local/python-2.7.3/bin/pip install -r requirements.txt

http://effbot.org/downloads/Imaging-1.1.7.tar.gz

安装nginx
cp nginx.conf
cp www.360ito.com.conf

修改/etc/hosts

1. ```cd ~```

/usr/local/python-2.7.3/bin/virtualenv 360ito_env
cd 360ito_env
source bin/activate
pip install -r requirements.txt

6. Create the database and populate it with some initial content:

    ```
    python2.7 manage.py create_db
    python2.7 manage.py populate_anime data/animes_initial.json
    ```

7. Work on whatever you want! Everything is still in a state of flux.

DROP DATABASE cn486_v1;
CREATE DATABASE cn486_v1 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
GRANT DROP, CREATE, ALTER, DELETE, INSERT, SELECT, UPDATE, INDEX, LOCK TABLES on cn486_v1.* to cn486_user@"127.0.0.1" identified by 'Cny486IbVA3s8YX8';


扩展阅读
http://docs.torriacg.org/

Jinja2 文档
http://docs.torriacg.org/jinja2/

Flask-SQLAlchemy 文档
http://docs.torriacg.org/flask-sqlalchemy/

Flask 文档
http://docs.torriacg.org/flask/