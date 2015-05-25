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

from math import ceil

from flask.ext.security import RoleMixin, UserMixin
from runkit.model.utils import JsonSerializer
from sqlalchemy.sql.expression import and_
from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, String, Text, DateTime
from flask.ext.principal import RoleNeed, UserNeed
from runkit.model.bases import IdMixin
from runkit.web.flask_ext.admin_manager import ModelAdmin
from runkit.web.flask_ext.sql import db


__doc__ = '用户数据表'
__author__ = 'wuxqing'
__version__ = 1.0
__time__ = '2013-06-02 7:45 PM'


class UserRole(object):
    """
    用户角色常量
    """
    restricter = 0  # 受限的
    member = 10  # 普通会员
    enthusiast = 11  # 热心会员
    mainstay = 12  # 支柱会员
    senior = 13  # 资深会员
    partner = 100  # 合作伙伴
    editor = 1000  # 编辑
    moderator = 2000  # 版主、仲裁者
    supervisor = 10000  # 管理员
    administrator = 10100  # 高级管理员
    #todo 是否还有用


class UserStatus(object):
    """
    用户状态常量
    """
    inactive = 0  # 未激活
    normal = 1    # 正常
    banned = 2    # 被禁止访问
    silenced = 3  # 被禁言


class Gender(object):
    """
    用户性别常量
    """
    privary = 0  # 保密
    male = 1     # 男
    female = 2   # 女


# Define models
roles_users = db.Table('roles_users',
              db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
              db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))


class Role(db.Model, IdMixin, RoleMixin):
    __tablename__ = 'role'

    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    #todo
    #北斗网可能存在的角色有：个人会员、企业会员、导航办编辑、导航办主管、双星编辑、双星办主管、星球编辑、星球主编、星球主管

    def __repr__(self):
        return u'<Role %s>' % self.name


class UserJsonSerializer(JsonSerializer):
    __json_hidden__ = ['sns_expires', 'user_detail_id']


class User(UserJsonSerializer, db.Model, IdMixin, UserMixin):
    __tablename__ = 'user'

    username = Column(String(20), doc=u'用户名称')
    email = Column(String(50), nullable=False, unique=True, index=True, doc=u'邮箱')

    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))

    last_login_at = db.Column(db.DateTime())
    current_login_at = db.Column(db.DateTime())
    last_login_ip = db.Column(db.String(41))
    current_login_ip = db.Column(db.String(41))
    login_count = db.Column(db.Integer)


    ###################
    status_code = Column(db.SmallInteger, default=UserStatus.inactive)
    homepage_url = Column(String(50), unique=True, index=True, doc=u'个人主页URL')

    sns_token = Column(String(64), nullable=True)
    sns_expires = Column(DateTime, nullable=True)

    # ================================================================
    # One-to-one (uselist=False) relationship between users and user_details.
    user_detail_id = Column(db.Integer, db.ForeignKey("user_details.id"))
    user_detail = db.relationship("UserDetail", uselist=False, backref="user")

    #
    # # ================================================================
    # # Follow / Following
    # followers = Column(DenormalizedText)
    # following = Column(DenormalizedText)
    #
    # @property
    # def num_followers(self):
    #     if self.followers:
    #         return len(self.followers)
    #     return 0
    #
    # @property
    # def num_following(self):
    #     return len(self.following)
    #
    # def follow(self, user):
    #     user.followers.add(self.id)
    #     self.following.add(user.id)
    #
    # def unfollow(self, user):
    #     if self.id in user.followers:
    #         user.followers.remove(self.id)
    #
    #     if user.id in self.following:
    #         self.following.remove(user.id)
    #
    # def get_following_query(self):
    #     return User.query.filter(User.id.in_(self.following or set()))
    #
    # def get_followers_query(self):
    #     return User.query.filter(User.id.in_(self.followers or set()))
    #
    # # ================================================================
    # # Class methods
    #
    # @classmethod
    # def authenticate(cls, login, password):
    #     user = cls.query.filter(db.or_(User.name == login, User.email == login)).first()
    #
    #     if user:
    #         authenticated = user.check_password(password)
    #     else:
    #         authenticated = False
    #
    #     return user, authenticated
    #
    # @classmethod
    # def search(cls, keywords):
    #     criteria = []
    #     for keyword in keywords.split():
    #         keyword = '%' + keyword + '%'
    #         criteria.append(db.or_(
    #             User.name.ilike(keyword),
    #             User.email.ilike(keyword),
    #         ))
    #     q = reduce(db.and_, criteria)
    #     return cls.query.filter(q)
    #
    @classmethod
    def get_by_id(cls, user_id):
        return cls.query.filter_by(id=user_id).first_or_404()

    def check_name(self, name):
        return User.query.filter(db.and_(User.name == name, User.email != self.id)).count() == 0

    def __repr__(self):
        return u'<User %s>' % self.username

    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(email=email).first()


class UserDetail(db.Model, IdMixin):
    __tablename__ = 'user_details'

    mobile = Column(String(50), doc=u'手机')
    interest = Column(Text, default='', doc=u'研究领域/兴趣范围（多个用，分开）')
    bio = Column(String(200), default='', doc=u'自我介绍')
    gender = Column(Integer, nullable=False, default=0, doc=u'性别：0-保密、1-男、2-女')
    avatar_url = Column(String(50), doc=u'头像URL')

    gold_medal = Column(Integer, default=0, doc=u'用户金牌')
    silver_medal = Column(Integer, default=0, doc=u'用户银牌')
    reputation = Column(Integer, default=0, doc=u'用户声誉(威望、积分)')
    rank = Column(Integer, nullable=False, default=0, doc=u'用户头衔')

    joined_ip = Column(Integer, doc=u'加入时的IP')

    user_type = Column(Integer, nullable=False, default=0, doc=u'用户类型：0-本站注册、100-google、101-新浪、102-新浪、200-其它SNS')
    referer_type = Column(Integer, nullable=False, default=0, doc=u'注册来源类别')
    referer_url = Column(Integer, nullable=False, default=0, doc=u'来源 URL')

    message_receive = Column(Integer, nullable=False, default=0, doc=u'消息接收：0-所有人可以发给我、1-我关注的人')

    num_message_unread = Column(Integer, nullable=False, default=0, doc=u'未读消息')
    # num_notice_unread = Column(Integer, nullable=False, default=0, doc=u'未读通告')

    # num_following = Column(Integer, nullable=False, default=0, doc=u'粉丝数')
    # num_followers = Column(Integer, nullable=False, default=0, doc=u'观众数')
    # num_invite_ask = Column(Integer, nullable=False, default=0, doc=u'问我数量')
    # num_answer = Column(Integer, nullable=False, default=0, doc=u'回答问题数量')
    # num_edited = Column(Integer, nullable=False, default=0, doc=u'编辑过的数量')
    # num_entry = Column(Integer, nullable=False, default=0, doc=u'内容数量')
    # num_attention_entry = Column(Integer, nullable=False, default=0, doc=u'关注内容数量')
    # num_home_views = Column(Integer, nullable=False, default=0, doc=u'个人主页查看数量')

    email_validated = Column(db.Boolean, nullable=False, default=0, doc=u'邮箱已经验证')
    mobile_validated = Column(db.Boolean, nullable=False, default=0, doc=u'手机已经验证')
    is_first_login = Column(db.Boolean, nullable=False, default=0, doc=u'首次登录标记')

    recent_visit = Column(Text, nullable=False, default='[]', doc=u'最近来访')

    content_push_type = Column(Integer, nullable=False, default=0, doc=u'内容推送类型：0-不限、1-除了不感兴趣的、2-仅关注的')

    # 其他
    # 是否邮件订阅、所在地区、工作简历等

    @property
    def interest_list(self):
        if self.interest:
            interest_list = self.interest.split(',')
        else:
            interest_list = []
        return interest_list

    def following(self):
        # todo 有些问题，几万个粉都列出来？
        return UserService.following(self.id)

    def followers(self):
        return UserService.followers(self.id)

    @property
    def fake_account_list(self):
        """
        获取有效的假账号
        @return:
        """
        # _list = UserFakeAccountService.get_by_user_id(self.id)
        #print '获取有效的假账号', len(_list)
        # return _list
        return []

    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id


# 数据管理类
class UserAdmin(ModelAdmin):
    roles_accepted = ('admin',)
    column_list = ('username', 'email', 'active',
                   'last_login_at', 'login_count')
    form_columns = ('username', 'email', 'roles', 'active')

    column_searchable_list = ('username', 'email')
    #list_template = 'admin/user/list.html'


class RoleAdmin(ModelAdmin):
    roles_accepted = ('admin',)
    column_list = ('name', 'description')
    column_searchable_list = ('name', )


class UserService(object):
    @staticmethod
    def following(user_id):
        return User.query.join(UserFollow, UserFollow.to_user_id == user_id).order_by('user.username').all()

    @staticmethod
    def followers(user_id):
        return User.query.join(UserFollow, UserFollow.from_user_id == user_id).order_by('user.username').all()

    @staticmethod
    def is_following(user_id, check_user_id):
        return UserFollow.query.filter(
            and_(UserFollow.from_user_id == user_id, UserFollow.to_user_id == check_user_id)).count() > 0

    @staticmethod
    def update(user):
        # 修改用户信息
        user.updated_time = sys_now()
        user_fake_account = UserFakeAccountService.get_by_fake_account_id(user.id)
        if user_fake_account:
            user_fake_account.fake_account_name = user.nickname

        db.session.commit()

    @staticmethod
    def get_brief_by_id(id):
        # ['username', 'nickname', 'email', 'homepage']
        return User.query.filter(User.id == id).first()

    @staticmethod
    def get_by_id(id):
        # ['username', 'nickname', 'email', 'homepage']
        return User.query.filter(User.id == id).first()

    @staticmethod
    def get_by_email(email):
        return User.query.filter(User.email == email).first()

    @staticmethod
    def get_by_username(username):
        return User.query.filter(User.username == username).first()

    @staticmethod
    def get_by_nickname(nickname):
        return User.query.filter(User.nickname == nickname).first()

    @staticmethod
    def count_by_username(username):
        # 指定用户名的记录数
        return User.query.filter(User.username == username).count()

    @staticmethod
    def count_by_nickname(nickname):
        # 指定昵称的记录数
        return User.query.filter(User.nickname == nickname).count()

    @staticmethod
    def count_by_email(email):
        # 指定email的记录数
        return User.query.filter(User.email == email).count()

    @staticmethod
    def from_identity(identity):
        """
        Loads user from flask.ext.principal.Identity instance and
        assigns permissions from user.

        A "user" instance is monkeypatched to the identity instance.

        If no user found then None is returned.
        """

        try:
            id = int(identity.id)
            user = UserService.get_brief_by_id(id)

            if user:
                needs = [UserNeed(id)]

                # test: user.role = 100000

                if user.role >= UserRole.member:
                    user.is_member = True
                    needs.append(RoleNeed('member'))
                else:
                    user.is_member = False

                if user.role >= UserRole.enthusiast:
                    user.is_enthusiast = True
                    needs.append(RoleNeed('enthusiast'))
                else:
                    user.is_enthusiast = False

                if user.role >= UserRole.mainstay:
                    user.is_mainstay = True
                    needs.append(RoleNeed('mainstay'))
                else:
                    user.is_mainstay = False

                if user.role >= UserRole.senior:
                    user.is_senior = True
                    needs.append(RoleNeed('senior'))
                else:
                    user.is_senior = False

                if user.role >= UserRole.partner:
                    user.is_partner = True
                    needs.append(RoleNeed('partner'))
                else:
                    user.is_partner = False

                if user.role >= UserRole.editor:
                    user.is_editor = True
                    needs.append(RoleNeed('editor'))
                else:
                    user.is_editor = False

                if user.role >= UserRole.moderator:
                    user.is_moderator = True
                    needs.append(RoleNeed('moderator'))
                else:
                    user.is_moderator = False

                if user.role >= UserRole.supervisor:
                    user.is_supervisor = True
                    needs.append(RoleNeed('supervisor'))
                else:
                    user.is_supervisor = False

                if user.role >= UserRole.administrator:
                    user.is_administrator = True
                    needs.append(RoleNeed('administrator'))
                else:
                    user.is_administrator = False

                identity.provides.update(needs)
        except:
            user = None

        identity.user = user

        return user

    @staticmethod
    def init_admin():
        user = UserService.get_by_username('admin')
        if not user:
            user = User()

            user.email = 'admin@infopub.org'
            user.username = u'admin'
            user.nickname = u'管理员'
            user.role = UserRole.administrator
            user.password = 'admin888'
            user.joined_ip = ip2long('127.0.0.1')
            user.homepage = ''

            # 保存数据
            id = UserService.signup(user)
            user.user_status = UserStatus.normal
            db.session.commit()

            return id is not None

    @staticmethod
    def signup(user):
        # 注册用户
        user.salt = random_str(8)
        user.password = calc_password(user.salt, user.password)
        user.activation_key = build_activation_key(user.password)
        user.created_time = sys_now()
        user.updated_time = user.created_time

        if not user.role:
            user.role = UserRole.member

        # 根据规则，设置用户认证规则
        config_value = int(SystemConfigService.get_by_key('register_validation'))

        if not config_value:
            user.user_status = UserStatus.normal
        else:
            user.user_status = UserStatus.inactive

        if not user.nickname:
            user.nickname = user.username

        db.session.add(user)
        db.session.commit()

        return user.id

    @staticmethod
    def authenticate(login, password):
        # 用户鉴权
        user = User.query.filter(db.or_(User.username == login, User.email == login)).first()

        if user:
            return user.id, user.username, user.nickname, user.email, \
                   calc_password(user.salt, password) == user.password, \
                   user.user_status
        else:
            return None, None, None, None, False, None

    @staticmethod
    def check_pwd_by_id(user_id, password):
        # 验证旧密码

        user = UserService.get_by_id(user_id)

        if user:
            authenticated = calc_password(user.salt, password) == user.password
        else:
            authenticated = False

        return authenticated

    @staticmethod
    def update_pwd_by_id(user_id, password):
        # 验证旧密码

        user = UserService.get_by_id(user_id)

        if not user:
            return False

        # 写入新的密码
        pwd = calc_password(user.salt, password)

        user.password = pwd

        return db.session.commit()

    @staticmethod
    def active(user_id):
        user = UserService.get_by_id(user_id)

        if not user:
            return False

        user.user_status = UserStatus.normal
        user.role = UserRole.member

        return db.session.commit()

    @staticmethod
    def rest_pwd_by_email(email):
        user = UserService.get_by_email(email)
        if not user:
            return None, None

        # 修改密码
        new_pwd = get_token()
        UserService.update_pwd_by_id(user.id, new_pwd)

        return user.username, new_pwd

    @staticmethod
    def get_users_total():
        _total = User.query.count()
        _pages = int(ceil(_total / float(PER_PAGE)))

        return _total, _pages

