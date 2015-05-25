class UserForm(ModelForm):
    class Meta:
        model = User

        include = ['author_id']
        exclude = ['description']
        only = ['name', 'content']

    email = TextField(validators=[Optional()])
    age = IntegerField()
