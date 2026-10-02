from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from .models import CustomUser


# ----------------------------------------------------------------------
# Base store user mixin
# ----------------------------------------------------------------------
class StoreUserRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    """Allow access only to active users who belong to a store."""

    def test_func(self):
        """Check that the user is active and belongs to a store."""
        user = self.request.user

        return user.is_authenticated and user.is_active and user.store_id is not None


# ----------------------------------------------------------------------
# Owner permission
# ----------------------------------------------------------------------
class OwnerRequiredMixin(StoreUserRequiredMixin):
    """Allow access only to store owners."""

    def test_func(self):
        """Check that the user is a store owner."""
        user = self.request.user

        return super().test_func() and user.role == CustomUser.Role.OWNER


# ----------------------------------------------------------------------
# Owner or manager permission
# ----------------------------------------------------------------------
class StoreManagerRequiredMixin(StoreUserRequiredMixin):
    """Allow access to store owners and managers."""

    def test_func(self):
        """Check that the user is an owner or manager."""
        user = self.request.user

        return super().test_func() and user.role in (
            CustomUser.Role.OWNER,
            CustomUser.Role.MANAGER,
        )


# ----------------------------------------------------------------------
# Shipper permission
# ----------------------------------------------------------------------
class ShipperRequiredMixin(StoreUserRequiredMixin):
    """Allow access only to store shippers."""

    def test_func(self):
        """Check that the user is a shipper."""
        user = self.request.user

        return super().test_func() and user.role == CustomUser.Role.SHIPPER
