from django.contrib.auth.views import LogoutView
from django.urls import path

from . import views

app_name = "accounts"


urlpatterns = [
    # ------------------------------------------------------------------
    # Authentication
    # ------------------------------------------------------------------
    path(
        "signup/",
        views.MerchantSignUpView.as_view(),
        name="signup",
    ),
    path(
        "login/",
        views.MerchantLoginView.as_view(),
        name="login",
    ),
    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),
    # ------------------------------------------------------------------
    # Team management
    # ------------------------------------------------------------------
    path(
        "team-members/",
        views.TeamListView.as_view(),
        name="team_list",
    ),
    path(
        "team/add-member/",
        views.TeamMemberCreateView.as_view(),
        name="team_member_create",
    ),
    path(
        "team-member/<uuid:pk>/toggle/",
        views.TeamMemberToggleStatusView.as_view(),
        name="team_member_toggle",
    ),
    path(
        "team-member-profile/<uuid:pk>/",
        views.MemberProfileView.as_view(),
        name="member_profile",
    ),
    # ------------------------------------------------------------------
    # Current user profile
    # ------------------------------------------------------------------
    path(
        "my-profile/",
        views.MyProfileView.as_view(),
        name="my_profile",
    ),
    path(
        "profile/edit/",
        views.UserProfileUpdateView.as_view(),
        name="profile_edit",
    ),
    path(
        "profile/change-password/",
        views.CustomPasswordChangeView.as_view(),
        name="password_change",
    ),
]
