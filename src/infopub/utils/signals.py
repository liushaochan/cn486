from blinker import Namespace

signals = Namespace()

comment_added = signals.signal("comment-added")
comment_deleted = signals.signal("comment-deleted")

entry_added = signals.signal("entry-added")
entry_deleted = signals.signal("entry-deleted")

