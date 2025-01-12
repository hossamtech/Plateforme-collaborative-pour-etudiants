from django.urls import path
from . import views

urlpatterns = [
    path('', views.feed, name='feed'),
    path('upload', views.upload, name='upload'),
    path('comment/<uuid:post_id>/', views.post_comment, name='post_comment'),
    path('signup', views.signup, name='signup'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('check_email_exists', views.check_email_exists,
         name='check_email_exists'),
    path('check_password', views.check_password,
         name='check_password'),
    path('gpt_outputv11/', views.gpt_outputv11, name='gpt_outputv11'),
    path('groupes', views.groupes, name='groupes'),
    path('cours', views.cours, name='cours'),
    path('coursUML', views.cours_intro, name='cours_intro'),
    path('evenements', views.evenements, name='evenements'),
    path('actualites', views.actualites, name='actualites'),
    path('profile', views.profile, name='profile'),
    path('chat', views.chat, name='chat'),



]
