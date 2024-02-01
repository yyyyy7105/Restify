# Inspired by CodingEntrepreneurs: https://www.youtube.com/watch?v=58p_mNuntd8&list=PLEsfXFp6DpzTOcOVdZF-th7BS_GYGguAS&index=19
from rest_framework import serializers
from .models import Comment
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'parent',
                  'content', 'rating', 'timestamp']

    def validate(self, data):
        model_type = self.context['modeltype']
        model_qs = ContentType.objects.filter(model=model_type)
        if not model_qs.exists() or model_qs.count() != 1:
            raise serializers.ValidationError(
                "This is not a valid content type")
        ModelType = model_qs.first().model_class()
        obj_qs = ModelType.objects.filter(id=self.context['obj_id'])

        if not obj_qs.exists() or obj_qs.count() != 1:
            raise serializers.ValidationError(
                "The object id is invalid. Can not create a comment for it")

        if self.context['parent_id']:
            parent_qs = Comment.objects.filter(id=self.context['parent_id'])
            if not parent_qs.exists() or parent_qs.count() != 1:
                raise serializers.ValidationError("Wrong parent_id")
            if parent_qs.first().children():
                print(parent_qs.first().children());
                raise serializers.ValidationError(
                    "This comment has been replied")
            if parent_qs.first().author.id == self.context['author'].id:
                raise serializers.ValidationError(
                    "You can not comment on your previous comment")
        obj = obj_qs.first()

        if self.context['parent_id'] != None and not obj.comments.all().filter(id=self.context['parent_id']):
            raise serializers.ValidationError("parent_id doesn't match")

        rating = data.get("rating")
        if rating:
            if rating > 5:
                raise serializers.ValidationError(
                    "Rating can not larger than 5")
        return data

    def create(self, validated_data):
        rating = validated_data.get("rating")
        content = validated_data.get("content")
        author = User.objects.get(id=self.context['author'].id)
        model_type = self.context['modeltype']
        model_qs = ContentType.objects.filter(model=model_type)
        ModelType = model_qs.first().model_class()
        content_obj = ModelType.objects.get(id=self.context['obj_id'])
        if self.context['parent_id']:
            parent_obj = Comment.objects.get(id=self.context['parent_id'])
        else:
            parent_obj = None
        comment = Comment.objects.create(
            content_object=content_obj, rating=rating, content=content, author=author, parent=parent_obj)

        obj_rating = content_obj.rating
        obj_rating_num = content_obj.rating_num
        if comment.is_parent:
            if not rating:
                return comment
            elif not obj_rating:
                obj_rating = 0
            total = obj_rating * obj_rating_num + rating
            obj_rating_num += 1
            final = total / obj_rating_num
            content_obj.rating = round(final, 2)
            content_obj.rating_num = obj_rating_num
            content_obj.save()
        return comment


class CommentChildDetailSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    authorName = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'author',
            'parent',
            'authorName',
            'content',
            'timestamp',
            'replies',
        ]

    def get_replies(self, obj):
        if obj.children():
            return CommentChildDetailSerializer(obj.children(), many=True).data
        return None
    def get_authorName(self,obj):
        return obj.author.first_name


class CommentDetailSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    authorName = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'parent',
            'author',
            'authorName',
            'content',
            'timestamp',
            'rating',
            'replies',
        ]

    def get_replies(self, obj):
        if obj.children():
            return CommentChildDetailSerializer(obj.children(), many=True).data
        return None
    def get_authorName(self,obj):
        return obj.author.first_name


class CommentUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = [
            'content',
            'rating']


class CommentChildUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = [
            'content',
        ]
