from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass
    



class Post(models.Model):
    user_post = models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_post", default="1")
    post = models.CharField(max_length=2000, null=False, blank=False, default="")
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        likes = len(self.liked_on.all())
        return {
            "id":self.id,
            "user_post":self.user_post.username,
            "post": self.post,
            "time":self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes":likes
        }



class Comments(models.Model):
    comment = models.TextField(blank=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="commented_on", default="1")
    user_comment = models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_comm", default="1")


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="liked_on", default="1")
    user_like = models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_like", default="1")


class Profile(models.Model):
    following = models.ManyToManyField(User, null=True)


    


