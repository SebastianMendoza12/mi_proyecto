from django.urls import path
from .views import RegisterView, LoginView, VerificarCodigoView, ReenviarCodigoView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),  
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("verificar-codigo/", VerificarCodigoView.as_view(), name="verificar_codigo"),
    path("reenviar-codigo/", ReenviarCodigoView.as_view(), name="reenviar_codigo"),
]
