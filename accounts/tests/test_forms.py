from django.contrib.auth import get_user_model
from django.test import TestCase
from stores.models import Store
from ..forms import (
    MerchantSignUpForm,
    TeamMemberCreationForm,
    UserProfileUpdateForm,
)

CustomUser = get_user_model()


# ----------------------------------------------------------------------
# Merchant signup form tests
# ----------------------------------------------------------------------
class MerchantSignUpFormTests(TestCase):
    """Test the MerchantSignUpForm."""

    def setUp(self):
        """Create common test data."""
        self.store = Store.objects.create(
            name="Existing Store",
            whatsapp_number="+1111111111",
        )

        self.user = CustomUser.objects.create_user(
            email="existing@example.com",
            password="StrongPassword123!",
            full_name="Existing User",
            store=self.store,
            role=CustomUser.Role.OWNER,
        )

        self.valid_data = {
            "store_name": "New Store",
            "business_type": Store.BusinessType.RESTAURANT,
            "full_name": "New User",
            "email": "new@example.com",
            "whatsapp_number": "+201012345678",
            "password": "StrongPassword123!",
            "confirm_password": "StrongPassword123!",
        }

    # ------------------------------------------------------------------
    # Valid data
    # ------------------------------------------------------------------
    def test_form_with_valid_data_is_valid(self):
        """A valid signup form should be valid."""
        form = MerchantSignUpForm(data=self.valid_data)

        self.assertTrue(form.is_valid())

    # ------------------------------------------------------------------
    # Store validation
    # ------------------------------------------------------------------
    def test_form_rejects_duplicate_store_name(self):
        """The form rejects a duplicate store name."""
        data = self.valid_data.copy()
        data["store_name"] = "existing store"

        form = MerchantSignUpForm(data=data)

        self.assertFalse(form.is_valid())
        self.assertIn("store_name", form.errors)

    def test_form_rejects_empty_store_name(self):
        """The form rejects an empty store name."""
        data = self.valid_data.copy()
        data["store_name"] = "   "

        form = MerchantSignUpForm(data=data)

        self.assertFalse(form.is_valid())
        self.assertIn("store_name", form.errors)

    def test_form_rejects_duplicate_whatsapp_number(self):
        """The form rejects a WhatsApp number used by another store."""
        data = self.valid_data.copy()
        data["whatsapp_number"] = self.store.whatsapp_number

        form = MerchantSignUpForm(data=data)

        self.assertFalse(form.is_valid())
        self.assertIn("whatsapp_number", form.errors)

    def test_form_rejects_invalid_whatsapp_number(self):
        """The form rejects an invalid WhatsApp number."""
        data = self.valid_data.copy()
        data["whatsapp_number"] = "01012345678"

        form = MerchantSignUpForm(data=data)

        self.assertFalse(form.is_valid())
        self.assertIn("whatsapp_number", form.errors)

    # ------------------------------------------------------------------
    # Business type validation
    # ------------------------------------------------------------------
    def test_form_requires_business_type(self):
        """The form requires a business type."""
        data = self.valid_data.copy()
        data.pop("business_type")

        form = MerchantSignUpForm(data=data)

        self.assertFalse(form.is_valid())
        self.assertIn("business_type", form.errors)

    def test_form_rejects_invalid_business_type(self):
        """The form rejects an invalid business type."""
        data = self.valid_data.copy()
        data["business_type"] = "INVALID_TYPE"

        form = MerchantSignUpForm(data=data)

        self.assertFalse(form.is_valid())
        self.assertIn("business_type", form.errors)

    # ------------------------------------------------------------------
    # User validation
    # ------------------------------------------------------------------
    def test_form_rejects_duplicate_email(self):
        """The form rejects an email already used by another user."""
        data = self.valid_data.copy()
        data["email"] = "EXISTING@example.com"

        form = MerchantSignUpForm(data=data)

        self.assertFalse(form.is_valid())
        self.assertIn("email", form.errors)

    def test_form_normalizes_email(self):
        """The form stores the email in lowercase without extra spaces."""
        data = self.valid_data.copy()
        data["email"] = "  NewUser@EXAMPLE.COM  "

        form = MerchantSignUpForm(data=data)

        self.assertTrue(form.is_valid())
        self.assertEqual(
            form.cleaned_data["email"],
            "newuser@example.com",
        )

    def test_form_normalizes_full_name(self):
        """The form removes extra spaces from the full name."""
        data = self.valid_data.copy()
        data["full_name"] = "  New User  "

        form = MerchantSignUpForm(data=data)

        self.assertTrue(form.is_valid())
        self.assertEqual(
            form.cleaned_data["full_name"],
            "New User",
        )

    def test_form_rejects_empty_full_name(self):
        """The form rejects an empty full name."""
        data = self.valid_data.copy()
        data["full_name"] = "   "

        form = MerchantSignUpForm(data=data)

        self.assertFalse(form.is_valid())
        self.assertIn("full_name", form.errors)

    # ------------------------------------------------------------------
    # Password validation
    # ------------------------------------------------------------------
    def test_form_rejects_password_mismatch(self):
        """The form rejects passwords that do not match."""
        data = self.valid_data.copy()
        data["confirm_password"] = "DifferentPassword123!"

        form = MerchantSignUpForm(data=data)

        self.assertFalse(form.is_valid())
        self.assertIn("confirm_password", form.errors)


# ----------------------------------------------------------------------
# Team member creation form tests
# ----------------------------------------------------------------------
class TeamMemberCreationFormTests(TestCase):
    """Test the TeamMemberCreationForm."""

    def setUp(self):
        """Create common test data."""
        self.store = Store.objects.create(
            name="Test Store",
            whatsapp_number="+1234567890",
        )

        self.valid_data = {
            "full_name": "John Doe",
            "email": "member@example.com",
            "password": "StrongPassword123!",
            "role": CustomUser.Role.MANAGER,
        }

    def get_dummy_instance(self):
        """Return a user instance linked to the test store."""
        return CustomUser(
            store=self.store,
        )

    # ------------------------------------------------------------------
    # Valid data
    # ------------------------------------------------------------------
    def test_valid_data_saves_user_correctly(self):
        """A valid form creates a user with the correct data."""
        form = TeamMemberCreationForm(
            data=self.valid_data,
            instance=self.get_dummy_instance(),
        )

        self.assertTrue(form.is_valid())

        user = form.save()

        self.assertIsNotNone(user.pk)
        self.assertEqual(user.full_name, "John Doe")
        self.assertEqual(user.email, "member@example.com")
        self.assertEqual(user.store, self.store)
        self.assertEqual(user.role, CustomUser.Role.MANAGER)
        self.assertTrue(user.check_password("StrongPassword123!"))
        self.assertNotEqual(
            user.password,
            "StrongPassword123!",
        )

    # ------------------------------------------------------------------
    # Email validation
    # ------------------------------------------------------------------
    def test_email_normalization(self):
        """The form normalizes the email."""
        data = self.valid_data.copy()
        data["email"] = "  Test@EXAMPLE.com  "

        form = TeamMemberCreationForm(
            data=data,
            instance=self.get_dummy_instance(),
        )

        self.assertTrue(form.is_valid())
        self.assertEqual(
            form.cleaned_data["email"],
            "test@example.com",
        )

    def test_duplicate_email_rejected(self):
        """The form rejects an email already used by another user."""
        CustomUser.objects.create_user(
            email="member@example.com",
            password="StrongPassword123!",
            full_name="Existing User",
            store=self.store,
            role=CustomUser.Role.SHIPPER,
        )

        form = TeamMemberCreationForm(
            data=self.valid_data,
            instance=self.get_dummy_instance(),
        )

        self.assertFalse(form.is_valid())
        self.assertIn("email", form.errors)

    # ------------------------------------------------------------------
    # Role validation
    # ------------------------------------------------------------------
    def test_manager_role_is_allowed(self):
        """The form allows the manager role."""
        data = self.valid_data.copy()
        data["role"] = CustomUser.Role.MANAGER

        form = TeamMemberCreationForm(
            data=data,
            instance=self.get_dummy_instance(),
        )

        self.assertTrue(form.is_valid())

    def test_shipper_role_is_allowed(self):
        """The form allows the shipper role."""
        data = self.valid_data.copy()
        data["role"] = CustomUser.Role.SHIPPER

        form = TeamMemberCreationForm(
            data=data,
            instance=self.get_dummy_instance(),
        )

        self.assertTrue(form.is_valid())

    def test_owner_role_is_not_allowed(self):
        """The form does not allow creating another store owner."""
        data = self.valid_data.copy()
        data["role"] = CustomUser.Role.OWNER

        form = TeamMemberCreationForm(
            data=data,
            instance=self.get_dummy_instance(),
        )

        self.assertFalse(form.is_valid())
        self.assertIn("role", form.errors)

    # ------------------------------------------------------------------
    # Required fields
    # ------------------------------------------------------------------
    def test_missing_password_is_invalid(self):
        """The form is invalid when the password is missing."""
        data = self.valid_data.copy()
        data.pop("password")

        form = TeamMemberCreationForm(
            data=data,
            instance=self.get_dummy_instance(),
        )

        self.assertFalse(form.is_valid())
        self.assertIn("password", form.errors)

    def test_missing_role_is_invalid(self):
        """The form is invalid when the role is missing."""
        data = self.valid_data.copy()
        data.pop("role")

        form = TeamMemberCreationForm(
            data=data,
            instance=self.get_dummy_instance(),
        )

        self.assertFalse(form.is_valid())
        self.assertIn("role", form.errors)


# ----------------------------------------------------------------------
# User profile update form tests
# ----------------------------------------------------------------------
class UserProfileUpdateFormTests(TestCase):
    """Test the UserProfileUpdateForm."""

    def setUp(self):
        """Create common test data."""
        self.store = Store.objects.create(
            name="Test Store",
            whatsapp_number="+1234567890",
        )

        self.user = CustomUser.objects.create_user(
            email="user@example.com",
            password="StrongPassword123!",
            full_name="Original Name",
            store=self.store,
            role=CustomUser.Role.OWNER,
        )

    # ------------------------------------------------------------------
    # Valid update
    # ------------------------------------------------------------------
    def test_valid_update(self):
        """The form updates the user's name and email."""
        data = {
            "full_name": "Updated Name",
            "email": "updated@example.com",
        }

        form = UserProfileUpdateForm(
            data=data,
            instance=self.user,
        )

        self.assertTrue(form.is_valid())

        updated_user = form.save()

        self.assertEqual(
            updated_user.full_name,
            "Updated Name",
        )
        self.assertEqual(
            updated_user.email,
            "updated@example.com",
        )

    def test_same_email_update_is_valid(self):
        """A user can keep their current email."""
        data = {
            "full_name": "Still Original",
            "email": self.user.email,
        }

        form = UserProfileUpdateForm(
            data=data,
            instance=self.user,
        )

        self.assertTrue(form.is_valid())

    # ------------------------------------------------------------------
    # Email validation
    # ------------------------------------------------------------------
    def test_email_taken_by_other_user_is_rejected(self):
        """The form rejects an email used by another account."""
        other_user = CustomUser.objects.create_user(
            email="other@example.com",
            password="StrongPassword123!",
            full_name="Other User",
            store=self.store,
            role=CustomUser.Role.SHIPPER,
        )

        data = {
            "full_name": "New Name",
            "email": other_user.email,
        }

        form = UserProfileUpdateForm(
            data=data,
            instance=self.user,
        )

        self.assertFalse(form.is_valid())
        self.assertIn("email", form.errors)

    def test_email_normalization(self):
        """The form normalizes the email before saving."""
        data = {
            "full_name": "Normalized Name",
            "email": "  UPDATED@EXAMPLE.COM  ",
        }

        form = UserProfileUpdateForm(
            data=data,
            instance=self.user,
        )

        self.assertTrue(form.is_valid())
        self.assertEqual(
            form.cleaned_data["email"],
            "updated@example.com",
        )

    # ------------------------------------------------------------------
    # Full name validation
    # ------------------------------------------------------------------
    def test_empty_full_name_is_rejected(self):
        """The form rejects an empty full name."""
        data = {
            "full_name": "   ",
            "email": self.user.email,
        }

        form = UserProfileUpdateForm(
            data=data,
            instance=self.user,
        )

        self.assertFalse(form.is_valid())
        self.assertIn("full_name", form.errors)
