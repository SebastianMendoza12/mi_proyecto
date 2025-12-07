from django.urls import path
from .views import RegisterView, LoginView, VerifyCodeView, AdminLoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),  
    path("login/", LoginView.as_view(), name="login"),
    path("admin-login/", AdminLoginView.as_view(), name="admin-login"),
    path("verify-code/", VerifyCodeView.as_view(), name="verify-code"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
