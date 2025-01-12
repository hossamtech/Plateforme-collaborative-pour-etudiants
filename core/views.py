from nltk.tokenize import word_tokenize
from django.shortcuts import render, get_object_or_404
import openai
import random
import json
from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from django.http import HttpResponse
from .models import Profile, Post, Comment
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
from django.http import JsonResponse
import requests
from django.contrib.auth.decorators import login_required
from django import forms


# Create your views here.

@login_required(login_url='login')
def feed(request):
    user_object = User.objects.get(username=request.user.username)
    user_profile = Profile.objects.get(user=user_object)
    posts = Post.objects.all()
    comments = Comment.objects.all()

    formatted_posts = []
    for post in reversed(posts):
        created_at_js = post.created_at.strftime("%Y-%m-%dT%H:%M:%S")
        post_comments = comments.filter(post=post)
        formatted_post = {
            'post': post,
            'created_at_js': created_at_js,
            'comments': post_comments
        }
        formatted_posts.append(formatted_post)

    return render(request, 'accueil.html', {'user_profile': user_profile, 'formatted_posts': formatted_posts})


@login_required(login_url='login')
def upload(request):
    print("upload.rerer..")
    if request.method == 'POST':
        user = request.user.username
        image = request.FILES.get('image_upload')
        caption = request.POST['caption']

        new_post = Post.objects.create(user=user, image=image, caption=caption)
        new_post.save()

        return redirect('/')
    else:
        return redirect('/')


@login_required(login_url='login')
def post_comment(request, post_id):
    print("comment4545..")
    if request.method == 'POST':
        user = request.user.username
        text = request.POST['comment_text']
        post = Post.objects.get(pk=post_id)

        new_comment = Comment.objects.create(
            post=post, user=user, content=text)
        new_comment.save()

        return redirect('/')
    else:
        return redirect('/')


@login_required(login_url='login')
def pages(request):
    return render(request, 'pages.html')


@login_required(login_url='login')
def groupes(request):
    return render(request, 'groups.html')


@login_required(login_url='login')
def cours(request):
    return render(request, 'courses.html')


@login_required(login_url='login')
def cours_intro(request):
    return render(request, 'course-intro.html')


@login_required(login_url='login')
def evenements(request):
    return render(request, 'events.html')


@login_required(login_url='login')
def actualites(request):
    return render(request, 'actualites.html')


@login_required(login_url='login')
def profile(request):
    return render(request, 'profile.html')


@login_required(login_url='login')
def chat(request):
    return render(request, 'chats-friend.html')


def check_email_exists(request):
    data = json.loads(request.body)
    email = data.get('email')
    user_exists = User.objects.filter(email=email).exists()
    return JsonResponse({'exists': user_exists})


def signup(request):
    if request.method == 'POST':

        data = json.loads(request.body)
        email = data.get('email')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')

        username = first_name[0].lower(
        ) + last_name.lower() + str(random.randint(10000, 99999))
        while User.objects.filter(username=username).exists():
            username = first_name[0].lower(
            ) + last_name.lower() + str(random.randint(10000, 99999))

        user = User.objects.create_user(
            username=username, email=email, password=password)
        user.first_name = first_name
        user.last_name = last_name
        user.save()

        # log user in and redirect to settings page

        # create a Profile object for the new user
        user_model = User.objects.get(username=username)
        new_profile = Profile.objects.create(
            user=user_model, id_user=user_model.id, first_name=user_model.first_name, last_name=user_model.last_name)
        new_profile.save()
        return JsonResponse({'success': True, 'redirect_url': '/login'})

    else:
        return render(request, 'signup.html')


def check_password(request):

    if request.method == 'POST':
        print("succeful")
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        print(email)
        username = User.objects.get(email=email.lower()).username
        user = auth.authenticate(username=username, password=password)

        if user is not None:
            print("false")
            return JsonResponse({'exists': False})
        else:
            print("true")
            return JsonResponse({'exists': True})
    else:
        return render(request, 'login.html')


def login(request):

    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        username = User.objects.get(email=email.lower()).username
        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            if data.get('remember'):
                print("remember")
                # Set a cookie that expires in 30 days
                request.session.set_expiry(30 * 24 * 60 * 60)
                # request.session['user'] = user
            else:
                # print("not remember")
                # # Create a session that expires when the user closes the browser
                # request.session.set_expiry(0)
                # request.session['user'] = user
                pass

            return JsonResponse({'success': True, 'redirect_url': '/'})
        else:
            # Handle invalid login
            pass
    else:
        return render(request, 'login.html')


@login_required(login_url='login')
def logout(request):
    auth.logout(request)
    return redirect('login')

# ===============================
# ====== Generate Response ======
# ===============================


openai.api_key = "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"


def gpt_outputv11(request):
    data = json.loads(request.body)
    text = data.get('text')

    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=text,
        temperature=0.2,
        max_tokens=500,
    )
    data = response.choices[0].text.strip()
    return JsonResponse({'exists': True, 'output': data})
