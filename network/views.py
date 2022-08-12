import re
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import User,Post,Like,Comments,Profile


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            # Create a default profile when user signs up
            profile = Profile(pk=user.id)
            profile.save()
         
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
def posts(request):
    if request.method == "GET":
        posts = Post.objects.all()
        posts = posts.order_by("-timestamp").all()
        posts = [post.serialize() for post in posts]
        liked = Like.objects.filter(user_like=request.user)
        liked = [like.post.id for like in liked]
        return render(request, 'network/posts.html',{'posts':posts, 'liked':liked})
    if request.method == "POST":
        data = json.loads(request.body)
        user_post = request.user
        post = data['post']
        p = Post(user_post=user_post, post=post)
        p.save()
        new_post = p.serialize()
        return JsonResponse({'success': new_post})


@csrf_exempt
def liked(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            post = data["post"]
            type = data["type"]
            post = Post.objects.get(pk=post)
            user = User.objects.get(pk=request.user.id)

            if type == 'like':
                l = Like(post=post, user_like=user)
                l.save()
                likes = post.serialize()['likes']
                return JsonResponse({'success':'liked', 'likes':likes})
            elif type == 'unlike':
                l = Like.objects.get(post=post, user_like=user)
                l.delete()
                likes = post.serialize()['likes']
                return JsonResponse({'success': 'unliked', 'likes':likes})
        except:
            return JsonResponse({'error':'something went wrong'})


def profile(request, username):
    if request.method == "GET":
        user = User.objects.get(username=username)
        profile = Profile.objects.get(pk=user.id)
        following = [user for user in profile.following.all()]
        followers = [user for user in profile.followers.all()]

        return render(request, 'network/profile.html', {'following': following, 'followers':followers, 'profile':username})


@csrf_exempt
def follow(request):
    if request.method == "POST":
        data = json.loads(request.body)
        type = data["type"]
        user_toggled_on = data["user_toggled_on"]
        user_toggled_on = User.objects.get(username=user_toggled_on)
        user_toggled_on_profile = Profile.objects.get(pk=user_toggled_on)
        user_profile = Profile.objects.get(pk=request.user)
        user = User.objects.get(pk=request.user.id)

        if type == 'follow':
            user_profile.following.add(user_toggled_on)
            user_toggled_on_profile.followers.add(user)
            return JsonResponse({'success':'nice work'})

            





























        




     