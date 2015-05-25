#!/usr/bin/python

from setuptools import setup

install_requires = [i.strip() for i in open("requirements.txt").readlines()]

entry_points = """
[console_scripts]
manage = manage:manager.run
webapp = infopub.webapp:main
"""

setup(
    name="cn486",
    version="1.0",
    url='http://www.jcing.com',
    license='Private',
    description="cn486 web site",
    long_description=open('readme.md').read(),
    author='wuxqing',
    author_email='wuxqing@gmail.com',
    include_package_data=True,
    package_dir={'': 'src'},
    install_requires=install_requires,
    entry_points=entry_points,
    platforms=['Linux']
)
