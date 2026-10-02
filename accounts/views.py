from django.contrib import messages
from django.contrib.auth import get_user_model, login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, PasswordChangeView
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
from django.views import View
from django.views.generic import CreateView, DetailView, FormView, ListView, UpdateView
from stores.models import Store
from .forms import (
    MerchantSignUpForm,
    TeamMemberCreationForm,
    UserProfileUpdateForm,
)
from .permissions import OwnerRequiredMixin

CustomUser = get_user_model()


# ----------------------------------------------------------------------
# Merchant signup
# ----------------------------------------------------------------------
class MerchantSignUpView(FormView):
    """
    Handle merchant registration.
    Create the store and its owner account in one transaction.
    """

    template_name = "accounts/signup.html"
    form_class = MerchantSignUpForm
    success_url = reverse_lazy("home")

    def dispatch(self, request, *args, **kwargs):
        """Redirect logged-in users to the main page."""
        if request.user.is_authenticated:
            return redirect("home")

        return super().dispatch(request, *args, **kwargs)

    @transaction.atomic
    def form_valid(self, form):
        """Create the store and owner account after valid form data."""

        # Create the store.
        store = Store.objects.create(
            name=form.cleaned_data["store_name"],
            description="",
            business_type=form.cleaned_data["business_type"],
            whatsapp_number=form.cleaned_data["whatsapp_number"],
        )

        # Create the store owner.
        user = CustomUser.objects.create_user(
            email=form.cleaned_data["email"],
            password=form.cleaned_data["password"],
            full_name=form.cleaned_data["full_name"],
            store=store,
            role=CustomUser.Role.OWNER,
        )

        # Log the new owner in.
        login(self.request, user)

        response = super().form_valid(form)

        messages.success(
            self.request,
            _("Registration successful! " "Welcome to your dashboard."),
        )

        return response


# ----------------------------------------------------------------------
# Merchant login
# ----------------------------------------------------------------------
class MerchantLoginView(LoginView):
    """
    Handle merchant login and redirect to the main page.
    """

    template_name = "accounts/login.html"
    redirect_authenticated_user = True

    def get_success_url(self):
        """Return the main page after successful login."""
        return reverse_lazy("home")


# ----------------------------------------------------------------------
# Team member list
# ----------------------------------------------------------------------
class TeamListView(OwnerRequiredMixin, ListView):
    """
    Show manager and shipper accounts for the current owner's store.
    """

    model = CustomUser
    template_name = "accounts/team_list.html"
    context_object_name = "team_members"

    def get_queryset(self):
        """Return team members from the current owner's store."""
        queryset = CustomUser.objects.filter(
            store_id=self.request.user.store_id,
            role__in=[
                CustomUser.Role.MANAGER,
                CustomUser.Role.SHIPPER,
            ],
        )

        # Search by name or email when a search value is provided.
        search_query = self.request.GET.get("q", "").strip()

        if search_query:
            queryset = queryset.filter(
                Q(full_name__icontains=search_query) | Q(email__icontains=search_query)
            )

        return queryset

    def get_context_data(self, **kwargs):
        """Add the current owner to the page context."""
        context = super().get_context_data(**kwargs)
        context["owner"] = self.request.user

        return context


# ----------------------------------------------------------------------
# Create team member
# ----------------------------------------------------------------------
class TeamMemberCreateView(OwnerRequiredMixin, CreateView):
    """
    Create a Manager or Shipper for the current owner's store.
    """

    model = CustomUser
    form_class = TeamMemberCreationForm
    template_name = "accounts/create_team_member.html"
    success_url = reverse_lazy("accounts:team_list")

    def get_form_kwargs(self):
        """Set the current owner's store on the new user."""
        kwargs = super().get_form_kwargs()

        kwargs["instance"] = CustomUser(
            store=self.request.user.store,
        )

        return kwargs

    def form_valid(self, form):
        """Save the team member and show a success message."""
        response = super().form_valid(form)

        messages.success(
            self.request,
            _("Team member added successfully."),
        )

        return response


# ----------------------------------------------------------------------
# Toggle team member status
# ----------------------------------------------------------------------
class TeamMemberToggleStatusView(OwnerRequiredMixin, View):
    """
    Activate or deactivate a Manager or Shipper.
    Only POST requests are allowed.
    """

    def post(self, request, pk, *args, **kwargs):
        """Toggle the active status of a team member."""

        # Get a team member from the current owner's store only.
        member = get_object_or_404(
            CustomUser,
            pk=pk,
            store_id=request.user.store_id,
            role__in=[
                CustomUser.Role.MANAGER,
                CustomUser.Role.SHIPPER,
            ],
        )

        # Change the account status.
        member.is_active = not member.is_active
        member.save(update_fields=["is_active"])

        if member.is_active:
            messages.success(
                request,
                _("Member '%(name)s' is now active.") % {"name": member.full_name},
            )
        else:
            messages.warning(
                request,
                _("Member '%(name)s' has been deactivated.")
                % {"name": member.full_name},
            )

        return redirect("accounts:team_list")


# ----------------------------------------------------------------------
# Team member profile
# ----------------------------------------------------------------------
class MemberProfileView(OwnerRequiredMixin, DetailView):
    """
    Show a team member profile from the current owner's store.
    """

    model = CustomUser
    template_name = "accounts/member_profile.html"
    context_object_name = "member"

    def get_object(self, queryset=None):
        """Return a team member from the current owner's store."""
        return get_object_or_404(
            CustomUser,
            pk=self.kwargs["pk"],
            store_id=self.request.user.store_id,
            role__in=[
                CustomUser.Role.MANAGER,
                CustomUser.Role.SHIPPER,
            ],
        )


# ----------------------------------------------------------------------
# Current user profile
# ----------------------------------------------------------------------
class MyProfileView(LoginRequiredMixin, DetailView):
    """
    Show the profile of the currently logged-in user.
    """

    model = CustomUser
    template_name = "accounts/my_profile.html"
    context_object_name = "profile_user"

    def get_object(self, queryset=None):
        """Return the currently logged-in user."""
        return self.request.user


# ----------------------------------------------------------------------
# User profile update
# ----------------------------------------------------------------------
class UserProfileUpdateView(LoginRequiredMixin, UpdateView):
    """
    Allow a logged-in user to update their own profile.
    """

    model = CustomUser
    form_class = UserProfileUpdateForm
    template_name = "accounts/edit_profile.html"
    success_url = reverse_lazy("accounts:my_profile")

    def get_object(self, queryset=None):
        """Return the currently logged-in user."""
        return self.request.user

    def form_valid(self, form):
        """Save the profile and show a success message."""
        response = super().form_valid(form)

        messages.success(
            self.request,
            _("Your profile has been updated successfully."),
        )

        return response


# ----------------------------------------------------------------------
# Password change
# ----------------------------------------------------------------------
class CustomPasswordChangeView(
    LoginRequiredMixin,
    PasswordChangeView,
):
    """
    Allow a logged-in user to change their own password.
    """

    template_name = "accounts/password_change.html"
    success_url = reverse_lazy("accounts:my_profile")

    def form_valid(self, form):
        """Save the new password and show a success message."""
        response = super().form_valid(form)

        messages.success(
            self.request,
            _("Your password has been successfully updated."),
        )

        return response
