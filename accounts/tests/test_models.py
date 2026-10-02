import uuid
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.test import TestCase
from stores.models import Store

CustomUser = get_user_model()


# ----------------------------------------------------------------------
# CustomUser model tests
# ----------------------------------------------------------------------
class CustomUserModelTests(TestCase):
    """Test the CustomUser model and its manager."""

    def setUp(self):
        """Create common test data."""
        self.store = Store.objects.create(
            name="Test Store",
            whatsapp_number="+1234567890",
        )

    # ------------------------------------------------------------------
    # Normal user tests
    # ------------------------------------------------------------------
    def test_create_user_normalizes_email_and_hashes_password(self):
        """Create user with normalized email and hashed password."""
        user = CustomUser.objects.create_user(
            email="  TeSt@ExAmPle.com  ",
            password="strongpassword123",
            full_name="Test User",
            store=self.store,
            role=CustomUser.Role.OWNER,
        )

        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("strongpassword123"))
        self.assertNotEqual(
            user.password,
            "strongpassword123",
        )
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertEqual(user.store, self.store)
        self.assertEqual(
            user.role,
            CustomUser.Role.OWNER,
        )

    def test_create_user_requires_store(self):
        """Normal users must have a store."""
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                email="user@example.com",
                password="strongpassword123",
                full_name="Test User",
                role=CustomUser.Role.MANAGER,
            )

    def test_create_user_requires_role(self):
        """Normal users must have a role."""
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                email="user@example.com",
                password="strongpassword123",
                full_name="Test User",
                store=self.store,
            )

    # ------------------------------------------------------------------
    # Superuser tests
    # ------------------------------------------------------------------
    def test_create_superuser_has_correct_flags(self):
        """Superuser has platform access and no store role."""
        superuser = CustomUser.objects.create_superuser(
            email="admin@example.com",
            password="adminpass123",
            full_name="Admin User",
        )

        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.is_active)

        self.assertIsNone(superuser.store)
        self.assertIsNone(superuser.role)

    # ------------------------------------------------------------------
    # Validation tests
    # ------------------------------------------------------------------
    def test_normal_user_cannot_have_no_store(self):
        """Normal users cannot be saved without a store."""
        user = CustomUser(
            email="user@example.com",
            password="pass12345",
            full_name="Test User",
            store=None,
            role=CustomUser.Role.MANAGER,
        )

        with self.assertRaises(ValidationError):
            user.full_clean()

    def test_normal_user_cannot_have_no_role(self):
        """Normal users cannot be saved without a role."""
        user = CustomUser(
            email="user@example.com",
            password="pass12345",
            full_name="Test User",
            store=self.store,
            role=None,
        )

        with self.assertRaises(ValidationError):
            user.full_clean()

    def test_superuser_cannot_have_store(self):
        """Superusers cannot belong to a store."""
        user = CustomUser(
            email="admin@example.com",
            password="pass12345",
            full_name="Admin User",
            store=self.store,
            role=None,
            is_staff=True,
            is_superuser=True,
        )

        with self.assertRaises(ValidationError):
            user.full_clean()

    def test_superuser_cannot_have_role(self):
        """Superusers cannot have a store role."""
        user = CustomUser(
            email="admin@example.com",
            password="pass12345",
            full_name="Admin User",
            store=None,
            role=CustomUser.Role.OWNER,
            is_staff=True,
            is_superuser=True,
        )

        with self.assertRaises(ValidationError):
            user.full_clean()

    def test_superuser_must_be_staff(self):
        """A superuser must also be a staff user."""
        user = CustomUser(
            email="admin@example.com",
            password="pass12345",
            full_name="Admin User",
            store=None,
            role=None,
            is_staff=False,
            is_superuser=True,
        )

        with self.assertRaises(ValidationError):
            user.full_clean()

    # ------------------------------------------------------------------
    # Display method tests
    # ------------------------------------------------------------------
    def test_str_method_returns_email(self):
        """The string representation returns the user's email."""
        user = CustomUser.objects.create_user(
            email="user@example.com",
            password="pass12345",
            full_name="User",
            store=self.store,
            role=CustomUser.Role.SHIPPER,
        )

        self.assertEqual(
            str(user),
            "user@example.com",
        )

    def test_get_full_name_returns_clean_name(self):
        """get_full_name returns the normalized full name."""
        user = CustomUser.objects.create_user(
            email="user@example.com",
            password="pass12345",
            full_name="  Test User  ",
            store=self.store,
            role=CustomUser.Role.MANAGER,
        )

        self.assertEqual(
            user.get_full_name(),
            "Test User",
        )

    def test_get_short_name_returns_first_name(self):
        """get_short_name returns the first part of the name."""
        user = CustomUser.objects.create_user(
            email="user@example.com",
            password="pass12345",
            full_name="Test User",
            store=self.store,
            role=CustomUser.Role.MANAGER,
        )

        self.assertEqual(
            user.get_short_name(),
            "Test",
        )

    # ------------------------------------------------------------------
    # ID tests
    # ------------------------------------------------------------------
    def test_user_id_is_uuid(self):
        """CustomUser.id is a UUID."""
        user = CustomUser.objects.create_user(
            email="uuid@example.com",
            password="pass12345",
            full_name="UUID User",
            store=self.store,
            role=CustomUser.Role.OWNER,
        )

        self.assertIsInstance(
            user.id,
            uuid.UUID,
        )

    # ------------------------------------------------------------------
    # Role tests
    # ------------------------------------------------------------------
    def test_user_can_have_owner_role(self):
        """A normal user can have the owner role."""
        user = CustomUser.objects.create_user(
            email="owner@example.com",
            password="pass12345",
            full_name="Owner User",
            store=self.store,
            role=CustomUser.Role.OWNER,
        )

        self.assertEqual(
            user.role,
            CustomUser.Role.OWNER,
        )

    def test_user_can_have_manager_role(self):
        """A normal user can have the manager role."""
        user = CustomUser.objects.create_user(
            email="manager@example.com",
            password="pass12345",
            full_name="Manager User",
            store=self.store,
            role=CustomUser.Role.MANAGER,
        )

        self.assertEqual(
            user.role,
            CustomUser.Role.MANAGER,
        )

    def test_user_can_have_shipper_role(self):
        """A normal user can have the shipper role."""
        user = CustomUser.objects.create_user(
            email="shipper@example.com",
            password="pass12345",
            full_name="Shipper User",
            store=self.store,
            role=CustomUser.Role.SHIPPER,
        )

        self.assertEqual(
            user.role,
            CustomUser.Role.SHIPPER,
        )

    # ------------------------------------------------------------------
    # Email tests
    # ------------------------------------------------------------------
    def test_email_is_stored_in_lowercase(self):
        """Email is stored in lowercase."""
        user = CustomUser.objects.create_user(
            email="USER@EXAMPLE.COM",
            password="pass12345",
            full_name="Test User",
            store=self.store,
            role=CustomUser.Role.MANAGER,
        )

        self.assertEqual(
            user.email,
            "user@example.com",
        )

    def test_duplicate_email_is_not_allowed(self):
        """Two users cannot use the same email."""
        CustomUser.objects.create_user(
            email="user@example.com",
            password="pass12345",
            full_name="First User",
            store=self.store,
            role=CustomUser.Role.MANAGER,
        )

        with self.assertRaises(ValidationError):
            CustomUser.objects.create_user(
                email="user@example.com",
                password="pass12345",
                full_name="Second User",
                store=self.store,
                role=CustomUser.Role.SHIPPER,
            )
