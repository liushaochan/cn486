#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
#
# Copyright (c) 2011 - 2035 HangZhou JingChuang Information Technology CO.,Ltd.
# 杭州精创信息技术有限公司
#
# http://www.jcing.com
#
# All rights reserved.
#

__doc__ = '保存图像'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2014-01-22 23:34'

def auto_save_img(html, skip_domain=None, img_url_base=''):
    from web.flask.globals import g
    from web.flask.helpers import url_for
    from pyquery.pyquery import PyQuery
    from runkit.http_utility import domain
    from runkit.utility import build_date_folder_file
    #from config.globals import PHOTOS_PATH
    #import Image, ImageEnhance
    #from manage.models.material import Material, MaterialService
    """
    自动保存远端的图片
    """

    if not html:
        return html

    pq = PyQuery(html)
    img_list = pq.find("img")

    replace_list = {}

    for img in img_list:
        if 'src' in img.attrib:
            img_src = img.attrib['src']
            if img_src.find('http') != -1:
                img_domain = domain(img_src)

                if img_domain != skip_domain and img_src not in replace_list:
                    #print img_domain, img_src
                    new_img_file = img_src.split('/')[-1]
                    name, ext = os.path.splitext(new_img_file)
                    ext = ext[1:]

                    folder_name, file_name = build_date_folder_file()
                    file_name += new_img_file

                    directory = '%s%s' % (PHOTOS_PATH, folder_name)

                    # 要创建目录
                    if not os.path.exists(directory):
                        os.makedirs(directory)

                    local_file = '%s/%s' % (directory, file_name)
                    new_img_src = '%s%s/%s' % (img_url_base, folder_name, file_name)

                    #print local_file, new_img_src

                    # 1、下载数据
                    # 2、计算md5
                    # 3、从素材库中查找是否存在
                    try:
                        #urllib.urlretrieve(img_src, local_file)
                        sock = urllib2.urlopen(img_src)
                        rcv = sock.read()
                        sock.close()

                        m = hashlib.md5()
                        m.update(rcv)

                        material = MaterialService.get_by_file_signature(m.hexdigest())

                        if not material:
                            f = open(local_file, 'wb')
                            f.write(rcv)
                            size = f.tell()
                            f.close()

                            material = Material()
                            material.added_user_id = g.user.id
                            material.file_name = file_name
                            material.file_ext = ext
                            material.file_path = folder_name
                            material.file_type = ext
                            material.file_size = size
                            material.file_signature = m.hexdigest()
                            material.thumbnail_file = ''
                            material.url = new_img_src

                            if 'alt' in img.attrib:
                                material.title = img.attrib['alt']
                            MaterialService.add_or_update(material)

                        new_img_src = url_for('misc.photo', id=material.id, ext=ext)

                    except Exception, e:
                        raise e

                    replace_list[img_src] = new_img_src
        else:
            raise Exception(u'内部错误')

    new_html = html

    for old, new in replace_list.iteritems():
        new_html = new_html.replace(old, new)
        #print old, new

    return new_html

