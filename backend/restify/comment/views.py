from django.shortcuts import render, get_object_or_404
from .models import Comment
from .serializers import CommentCreateSerializer, CommentDetailSerializer, CommentUpdateSerializer, CommentChildUpdateSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView, ListAPIView, DestroyAPIView
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from revs.models import Rev
from property.models import Property
from django.db.models import Q
from revs.models import Ntf
from .pagination import IndexPagination

User = get_user_model()
# Create your views here.


class CreateUserCommentView(CreateAPIView):
    serializer_class = CommentCreateSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id, parent_id):
        user = User.objects.filter(id=self.kwargs["user_id"])
        if not user:
            return Response("Not Found: User you want to comment on does not exists", status=404)
        if self.request.user.id == self.kwargs["user_id"]:
            if self.kwargs['parent_id'] == 0:
                return Response("Forbidden: Can not write parent comment on yourself", status=403)
            else:
                return super().post(request, user_id, parent_id)
        reservations = user.first().revs.filter(
            property__host=self.request.user).filter(host_commented=False).filter(Q(status="terminated") | Q(status="completed"))
        print(reservations)

        if self.kwargs['parent_id'] == 0 and reservations:
            reservation = reservations.first()
            result = super().post(request, user_id, parent_id)
            reservation.host_commented = True
            reservation.save()
            return result
        
        reservate = user.first().revs.filter(
            property__host=self.request.user).filter(Q(status="terminated") | Q(status="completed"))
        if self.kwargs['parent_id'] > 0 and reservate:
            return super().post(request, user_id, parent_id)
        return Response("Forbidden: You have no right to write comment", status=403)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['modeltype'] = "myuser"
        if self.kwargs["parent_id"] == 0:
            context['parent_id'] = None
        else:
            context['parent_id'] = self.kwargs["parent_id"]
        context['obj_id'] = self.kwargs["user_id"]
        context['author'] = self.request.user
        return context


class CreatePropertyCommentView(CreateAPIView):
    serializer_class = CommentCreateSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, property_id, parent_id):
        property = Property.objects.filter(id=self.kwargs["property_id"])
        if not property:
            return Response("Not Found: User you want to comment on does not exists", status=404)
        else:
            property = property.first()
        if self.request.user.id == property.host.id:
            if self.kwargs['parent_id'] == 0:
                return Response("Forbidden: Can not start a parent comment on your own property", status=403)
            else:
                return super().post(request, property_id, parent_id)
        reservations = self.request.user.revs.filter(
            property=property).filter(guest_commented=False).filter(Q(status="terminated") | Q(status="completed"))
        all_rev = self.request.user.revs.filter(property=property)
        if not all_rev:
            return Response("Forbidden: You have no right to write comment", status=403)
        if self.kwargs['parent_id'] == 0 and not reservations:
            return Response("Forbidden: You have no right to write comment", status=403)
        if self.kwargs['parent_id'] > 0:
            return super().post(request, property_id, parent_id)
        else:
            reservation = reservations.first()
            result = super().post(request, property_id, parent_id)
            reservation.guest_commented = True
            Ntf.objects.create(
                recipient=property.host, rev=reservation, summary=f"New Comment on your property:{property_id}")
            reservation.save()
            return result

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['modeltype'] = "property"
        if self.kwargs["parent_id"] == 0:
            context['parent_id'] = None
        else:
            context['parent_id'] = self.kwargs["parent_id"]
        context['obj_id'] = self.kwargs["property_id"]
        context['author'] = self.request.user
        return context


class ListCommentAllView(ListAPIView):
    serializer_class = CommentDetailSerializer
    queryset = Comment.objects.all()
    permission_classes = [AllowAny]


class ListPropertyCommentAllView(ListAPIView):
    serializer_class = CommentDetailSerializer
    pagination_class = IndexPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        property = Property.objects.filter(id=self.kwargs['pk'])
        if not property:
            return Response("user not found", status=404)
        else:
            property = property.first()
        qs = property.comments.filter(parent=None)
        return qs


class ListUserCommentAllView(ListAPIView):
    serializer_class = CommentDetailSerializer
    pagination_class = IndexPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = User.objects.filter(id=self.kwargs['pk'])
        if not user:
            return Response("user not found", status=404)
        else:
            user = user.first()
        qs = user.comments.filter(parent=None)
        return qs


class CommentDetailView(RetrieveAPIView):
    serializer_class = CommentDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Comment, id=self.kwargs['pk'])


class CommentUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Comment, id=self.kwargs['pk'])
    
    def update(self, request, *args, **kwargs):
        comment = Comment.objects.filter(id=self.kwargs['pk']).first()
        isUser = self.kwargs['user']
        if request.data.get("rating") != comment.rating and comment.is_parent:
            if isUser:
                content_obj=User.objects.filter(id=comment.object_id).first()
                print("user")
            else:
                content_obj=Property.objects.filter(id=comment.object_id).first()

            obj_rating = content_obj.rating
            obj_rating_num = content_obj.rating_num
            if not obj_rating:
                total = 0
            else:
                total = obj_rating * obj_rating_num
            if not comment.rating:
                updated_num = obj_rating_num + 1
                content_obj.rating_num = updated_num
                final = (total+int(request.data.get("rating"))) / content_obj.rating_num
            else:
                print(request.data.get("rating"))
                print( obj_rating_num)
                final = (total-comment.rating+int(request.data.get("rating"))) / content_obj.rating_num
            if final > 5:
                final = 5
            content_obj.rating = round(final, 2)
            content_obj.save()
        response = super().update(request, *args, **kwargs)
        return response


    def get_queryset(self):
        comment = Comment.objects.filter(id=self.kwargs['pk'])
        if not comment:
            return Response("comment not found", status=404)
        else:
            comment = comment.first()
        if comment.author != self.request.user:
            return Response("Forbidden: It's not your comment", status=403)
        return comment

    def get_serializer_class(self):
        comment = Comment.objects.filter(id=self.kwargs['pk'])
        if not comment:
            return Response("comment not found", status=404)
        else:
            comment = comment.first()
        if comment.is_parent:
            return CommentUpdateSerializer
        else:
            return CommentChildUpdateSerializer


class DeleteCommentView(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Comment, id=self.kwargs['pk'])
