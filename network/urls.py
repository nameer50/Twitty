
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),


    # API Routes
    path("profile", views.profile, name="profile"),
    path("post", views.makepost, name="post"),
    path("Allposts", views.getposts, name="Allposts"),
    path("liked/<int:post_id>", views.liked, name="liked_posts")

]
