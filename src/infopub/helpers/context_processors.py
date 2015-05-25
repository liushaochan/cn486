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
import urlparse
from flask import url_for

from runkit.web.helpers import context_processors


__doc__ = '上下文处理'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-02-11 16:54'

# 栏目以及TAG管理
top_menu = {
    'sc': {'name': '素材', 'slug': '/sc.html', 'sub_menu': ['psd', 'vectors', 'pic']},
    'lg': {'name': '灵感', 'slug': '/lg.html', 'sub_menu': ['app', 'cool_web', 'color', 'illustration', 'package', 'game',
                                                          'graphic']},
    'bz': {'name': '壁纸', 'slug': '/bz.html', 'sub_menu': ['Cartoon_wallpaper', 'beauty_wallpaper', 'game_wallpaper',
                                                          'movie_wallpaper', 'scenery_wallpaper', 'food_wallpaper', 'automotive_wallpaper']}
}
# todo 按下面创建栏目
guide_menu = {'home': {'parent': '', 'name': 'home', 'tag': []},
              'psd': {'parent': 'sc', 'name': 'psd', 'tag': ['广告海报', '楼书画册', '节日素材', '包装设计', '网站模板', '设计模板']},
              'vectors': {'parent': 'sc', 'name': '矢量', 'tag': []},
              'pic': {'parent': 'sc', 'name': '图片', 'tag': []},
              'app': {'parent': 'lg', 'name': 'APP', 'tag': ['启动', '导航', '登录', '按钮', '列表', '设置', '输入',
                                                             '位置', '引导', '数据', '其他']},
              'cool_web': {'parent': 'lg', 'name': '酷站', 'tag': []},
              'color': {'parent': 'lg', 'name': '色彩', 'tag': []},
              'illustration': {'parent':'lg', 'name': '插画', 'tag': []},
              'package': {'parent': 'lg', 'name': '包装', 'tag': []},
              'game': {'parent': 'lg', 'name': '游戏', 'tag': []},
              'graphic': {'parent': 'lg', 'name': '平面设计', 'tag': []},
              'Cartoon_wallpaper': {'parent': 'bz', 'name': '动漫', 'tag': []},
              'beauty_wallpaper': {'parent': 'bz', 'name': '美女', 'tag': []},
              'game_wallpaper': {'parent': 'bz', 'name': '游戏', 'tag': []},
              'movie_wallpaper': {'parent': 'bz', 'name': '影视', 'tag': []},
              'scenery_wallpaper': {'parent': 'bz', 'name': '风景', 'tag': []},
              'food_wallpaper': {'parent': 'bz', 'name': '食品', 'tag': []},
              'automotive_wallpaper': {'parent': 'bz', 'name': '汽车', 'tag': []}}


def configure(app):
    context_processors.configure(app)

    def assets(path):
        url_map = app.config.get('URL_MAP')

        if url_map is None or 'assets' not in url_map:
            return url_for('static', filename='assets/' + path)
        else:
            return urlparse.urljoin(url_map['assets'], path)

    @app.context_processor
    def demo():
        return dict(demo_context_processor='context_processor demo')

    @app.context_processor
    def context_processor():
        return dict(assets=assets)

    @app.context_processor
    def get_menu():
        def get_menu():
            return top_menu, guide_menu
        return dict(get_menu=get_menu)
