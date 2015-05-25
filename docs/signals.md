1、注册signals
from blinker import Namespace
signals = Namespace()
comment_added = signals.signal("comment-added")

2、连接signals
def update_num_comments(sender):
    sender.num_comments = \
        Comment.query.filter(Comment.post_id==sender.id).count()
    db.session.commit()

signals.comment_added.connect(update_num_comments)

3、发送signals
signals.comment_deleted.send(comment.post)
