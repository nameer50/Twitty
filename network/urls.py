
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("posts", views.posts, name="posts"),
    path("profile/<str:username>", views.profile, name="profile"),

    path("follow", views.follow, name="follow"),
    path("liked", views.liked, name="liked_posts"),
    path("edit", views.edit_post, name="edit_post"),
    path("comment", views.comment, name="comment")

]
