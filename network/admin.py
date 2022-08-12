from django.contrib import admin
from .models import User,Comments,Like,Post,Profile

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username")


class CommentAdmin(admin.ModelAdmin):
    list_display = ("id","comment", "post", "user_comment")

class LikeAdmin(admin.ModelAdmin):
    list_display = ("id","post", "user_like")

class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "user_post", "post", "timestamp")

class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user_profile",)


admin.site.register(User, UserAdmin)
admin.site.register(Profile,ProfileAdmin)
admin.site.register(Like,LikeAdmin)
admin.site.register(Comments,CommentAdmin)
admin.site.register(Post, PostAdmin)