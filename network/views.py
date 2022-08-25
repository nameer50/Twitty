from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
import json
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import User,Post,Like,Comment,Profile



def index(request):
    if request.user.is_authenticated:
        user = User.objects.get(pk=request.user.id)
        profile = Profile.objects.get(pk=user.id)
        following = [user.id for user in profile.following.all()]
        following.append(user.id)
        posts = Post.objects.filter(user_post__in=following)
        posts = posts.order_by("-timestamp").all()
        posts = [post.serialize() for post in posts]
        liked = Like.objects.filter(user_like=request.user)
        liked = [like.post.id for like in liked]
        return render(request, "network/index.html",{
            'posts':posts, 
            'liked':liked
            })
    else:
        posts = Post.objects.all().order_by('-timestamp')
        posts = [post.serialize() for post in posts]
        return render(request, "network/index.html", {
            'posts': posts,
            'liked': None
        })

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        
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

def posts(request):
    if request.method == "GET":
        posts = Post.objects.all()
        posts = posts.order_by("-timestamp").all()
        posts = [post.serialize() for post in posts]
        
        try:
            liked = Like.objects.filter(user_like=request.user)
            liked = [like.post.id for like in liked]
            profile = Profile.objects.get(user_profile = request.user)
            following = [user.username for user in profile.following.all()]

        except (Like.DoesNotExist,Profile.DoesNotExist,TypeError):
            liked = None
            following = None

        return render(request, 'network/posts.html',{
            'posts':posts, 
            'liked':liked,
            'following':following
            })

    if request.user.is_authenticated and request.method == "POST":
        data = json.loads(request.body)
        user_post = request.user
        post = data['post']
        if len(post) == 0 or post.isspace():
            return JsonResponse({'error':'post is empty'})
        p = Post(user_post=user_post, post=post)
        p.save()
        new_post = p.serialize()
        return JsonResponse({
            'success': 'posted', 
            'new_post':new_post
            })
    else:
        return JsonResponse({'error':'need to login'})

def liked(request):
    if request.user.is_authenticated and request.method == "POST":
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
                return JsonResponse({
                    'success':'liked',
                    'likes':likes
                    })

            elif type == 'unlike':
                l = Like.objects.get(post=post, user_like=user)
                l.delete()
                likes = post.serialize()['likes']
                return JsonResponse({
                    'success': 'unliked',
                    'likes':likes
                    })
        except:
            return JsonResponse({'error':'something went wrong'})
    else:
        return JsonResponse({'error':'need to login'})

def profile(request, username):
    if request.method == "GET":
        user = User.objects.get(username=username)
        profile = Profile.objects.get(pk=user.id)
        following = [user for user in profile.following.all()]
        followers = [user for user in profile.followers.all()]
        posts = Post.objects.filter(user_post=user)
        posts = posts.order_by("-timestamp").all()
        posts = [post.serialize() for post in posts]

        try:
            liked = Like.objects.filter(user_like=request.user)
            liked = [like.post.id for like in liked]

        except(Like.DoesNotExist, TypeError):
            liked=None

        return render(request, 'network/profile.html', {
            'following': following, 
            'followers':followers,
             'profile':username, 
             'posts':posts, 
             'liked':liked,
             'followers_howmany':len(followers),
             'following_howmany': len(following)
             })

def follow(request):
    if request.user.is_authenticated and request.method == "POST":
        data = json.loads(request.body)
        type = data["type"]
        user_toggled_on = User.objects.get(username=data["user_toggled_on"])
        user = User.objects.get(pk=request.user.id)
        user_toggled_on_profile = Profile.objects.get(pk=user_toggled_on)
        user_profile = Profile.objects.get(pk=request.user)

        if type == 'follow':
            user_profile.following.add(user_toggled_on)
            user_toggled_on_profile.followers.add(user)
            return JsonResponse({
                'success':'followed', 
                'user':user.username,
                'updated_count': len(user_toggled_on_profile.followers.all())})

        if type == 'unfollow':
            user_profile.following.remove(user_toggled_on)
            user_toggled_on_profile.followers.remove(user)
            return JsonResponse({
                'success': 'unfollowed',
                 'user':user.username,
                 'updated_count': len(user_toggled_on_profile.followers.all())})
    else:
        return JsonResponse({'error':'must be logged in'})

def edit_post(request):
    if request.user.is_authenticated and request.method == "PUT":
        data = json.loads(request.body)
        text = data['text']

        if len(text) == 0 or text.isspace():
            return JsonResponse({'error':'no text submitted'})

        post = data["post"]
        post = Post.objects.get(pk=post)

        if request.user != post.user_post:
            return JsonResponse({'error':'forbidden'})

        post.post = text
        post.save()
        post= post.serialize()
        return JsonResponse({'post':post})

    else:
        return JsonResponse({'error':'must be logged in'})

def comment(request):
    if request.user.is_authenticated and request.method == "POST":
        data = json.loads(request.body)
        comment = data['comment']

        if len(comment) == 0 or comment.isspace():
            return JsonResponse({'error': 'no comment provided'})

        post = Post.objects.get(pk=data['post'])
        user = User.objects.get(pk=request.user.id)
        c = Comment(comment=comment, post=post, user_comment=user)
        c.save()
        post = post.serialize()
        return JsonResponse({
            'success':'commented', 
            'comment':c.comment, 
            'user_comment':c.user_comment.username, 
            'comments_amount':post['how_many_comments']
            })
    else:
        return JsonResponse({'error':'must be logged in'})

    






        




     