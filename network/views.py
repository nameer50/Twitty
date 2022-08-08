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


def profile(request):
    if request.method == "GET":
        return JsonResponse({"clicked":f"{request.user}"}) 

@csrf_exempt
def makepost(request):
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            user = data["user_post"]
            user = User.objects.get(pk=user)
            post = data["post"]
            if len(post) == 0:
                raise Exception
            p = Post(user_post=user, post=post)
            p.save()
            return JsonResponse({"success":"post created"})
        except:
            return JsonResponse({"error":"something went wrong"})
        
def getposts(request):
    if request.method == "GET":
        posts = Post.objects.all()
        posts = posts.order_by("-timestamp").all()
        return JsonResponse([post.serialize() for post in posts], safe=False)



     