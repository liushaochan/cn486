"""empty message

Revision ID: 54d34dd3299b
Revises: None
Create Date: 2014-02-10 22:05:27.797451

"""

# revision identifiers, used by Alembic.
revision = '54d34dd3299b'
down_revision = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_details',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('mobile', sa.String(length=50), nullable=True),
    sa.Column('interest', sa.Text(), nullable=True),
    sa.Column('bio', sa.String(length=200), nullable=True),
    sa.Column('gender', sa.Integer(), nullable=False),
    sa.Column('avatar_url', sa.String(length=50), nullable=True),
    sa.Column('gold_medal', sa.Integer(), nullable=True),
    sa.Column('silver_medal', sa.Integer(), nullable=True),
    sa.Column('reputation', sa.Integer(), nullable=True),
    sa.Column('rank', sa.Integer(), nullable=False),
    sa.Column('joined_ip', sa.Integer(), nullable=True),
    sa.Column('user_type', sa.Integer(), nullable=False),
    sa.Column('referer_type', sa.Integer(), nullable=False),
    sa.Column('referer_url', sa.Integer(), nullable=False),
    sa.Column('message_receive', sa.Integer(), nullable=False),
    sa.Column('num_message_unread', sa.Integer(), nullable=False),
    sa.Column('email_validated', sa.Boolean(), nullable=False),
    sa.Column('mobile_validated', sa.Boolean(), nullable=False),
    sa.Column('is_first_login', sa.Boolean(), nullable=False),
    sa.Column('recent_visit', sa.Text(), nullable=False),
    sa.Column('content_push_type', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('role',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=True),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=20), nullable=True),
    sa.Column('email', sa.String(length=50), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=True),
    sa.Column('active', sa.Boolean(), nullable=True),
    sa.Column('confirmed_at', sa.DateTime(), nullable=True),
    sa.Column('last_login_at', sa.DateTime(), nullable=True),
    sa.Column('current_login_at', sa.DateTime(), nullable=True),
    sa.Column('last_login_ip', sa.String(length=41), nullable=True),
    sa.Column('current_login_ip', sa.String(length=41), nullable=True),
    sa.Column('login_count', sa.Integer(), nullable=True),
    sa.Column('status_code', sa.SmallInteger(), nullable=True),
    sa.Column('homepage_url', sa.String(length=50), nullable=True),
    sa.Column('sns_token', sa.String(length=64), nullable=True),
    sa.Column('sns_expires', sa.DateTime(), nullable=True),
    sa.Column('user_detail_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_detail_id'], ['user_details.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_user_email', 'user', ['email'], unique=True)
    op.create_index('ix_user_homepage_url', 'user', ['homepage_url'], unique=True)
    op.create_table('roles_users',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['role_id'], ['role.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], )
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('roles_users')
    op.drop_index('ix_user_homepage_url', table_name='user')
    op.drop_index('ix_user_email', table_name='user')
    op.drop_table('user')
    op.drop_table('role')
    op.drop_table('user_details')
    ### end Alembic commands ###