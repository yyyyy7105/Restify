from django.urls import path
from . import views


app_name = "comment"
urlpatterns = [
    path('create/myuser/<int:user_id>/<int:parent_id>/',
         views.CreateUserCommentView.as_view(), name='create1'),
    path('create/property/<int:property_id>/<int:parent_id>/',
         views.CreatePropertyCommentView.as_view(), name='create2'),
    path('listall/',
         views.ListCommentAllView.as_view(), name='listall'),
    path('list/property/<int:pk>/',
         views.ListPropertyCommentAllView.as_view(), name='listproperty'),
    path('list/user/<int:pk>/',
         views.ListUserCommentAllView.as_view(), name='listuser'),
    path('detail/<int:pk>/',
         views.CommentDetailView.as_view(), name='detail'),
    path('update/<int:pk>/<int:user>/',
         views.CommentUpdateView.as_view(), name='update'),
    path('delete/<int:pk>/',
         views.DeleteCommentView.as_view(), name='delete'),
]
