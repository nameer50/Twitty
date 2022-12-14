from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass
    



class Post(models.Model):
    user_post = models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_post", default="1")
    post = models.CharField(max_length=2000, null=False, blank=False, default="")
    timestamp = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def serialize(self):
        likes = len(self.liked_on.all())
        comments = self.commented_on.all()
        comments = [comment.serialize() for comment in comments]
        return {
            "id":self.id,
            "user_post":self.user_post.username,
            "post": self.post,
            "time":self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes":likes,
            "comments":comments,
            "how_many_comments":len(comments)
        }



class Comment(models.Model):
    comment = models.TextField(blank=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="commented_on", default="1")
    user_comment = models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_comm", default="1")
    
    def serialize(self):
        return {
            'comment': self.comment,
            'user_comment': self.user_comment.username
        }


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="liked_on", default="1")
    user_like = models.ForeignKey(User, on_delete=models.CASCADE,related_name="user_like", default="1")

    def serialize(self):
        return {
            "id":self.id,
            "user_like":self.user_like.username,
            "post": self.post.id
            
        }


class Profile(models.Model):
    user_profile = models.ForeignKey(User,primary_key=True, on_delete=models.CASCADE, related_name="user_profile", default="1")
    following = models.ManyToManyField(User, null=True, related_name='followings')
    followers = models.ManyToManyField(User, null=True, related_name='followers')



    


