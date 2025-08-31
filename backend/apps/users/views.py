from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserProfileSerializer

User = get_user_model()


class CurrentUserView(generics.RetrieveUpdateAPIView):
    """
    Get or update the current authenticated user
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    """
    Simple view to get current user info
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)