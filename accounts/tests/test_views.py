from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from stores.models import Store

CustomUser = get_user_model()


# ----------------------------------------------------------------------
# Merchant signup view tests
# ----------------------------------------------------------------------
class MerchantSignUpViewTests(TestCase):
    """Test the merchant signup view."""

    def setUp(self):
        """Create common URLs and test data."""
        self.signup_url = reverse("accounts:signup")
        self.home_url = reverse("home")
        self.login_url = reverse("accounts:login")

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
    # GET tests
    # ------------------------------------------------------------------
    def test_get_signup_page_returns_200(self):
        """The signup page returns HTTP 200."""
        response = self.client.get(self.signup_url)

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(
            response,
            "accounts/signup.html",
        )

    def test_authenticated_user_is_redirected_from_signup(self):
        """Logged-in users are redirected away from signup."""
        store = Store.objects.create(
            name="Logged Store",
            whatsapp_number="+201000000001",
        )

        user = CustomUser.objects.create_user(
            email="logged@example.com",
            password="StrongPassword123!",
            full_name="Logged User",
            store=store,
            role=CustomUser.Role.OWNER,
        )

        self.client.force_login(user)

        response = self.client.get(self.signup_url)

        self.assertRedirects(
            response,
            self.home_url,
        )

    # ------------------------------------------------------------------
    # Successful signup tests
    # ------------------------------------------------------------------
    def test_post_valid_data_creates_store_and_owner(self):
        """Valid signup creates a store and its owner."""
        response = self.client.post(
            self.signup_url,
            self.valid_data,
        )

        self.assertRedirects(
            response,
            self.home_url,
            status_code=302,
            target_status_code=200,
        )

        store = Store.objects.get(
            name="New Store",
        )

        user = CustomUser.objects.get(
            email="new@example.com",
        )

        self.assertEqual(
            user.store,
            store,
        )

        self.assertEqual(
            user.role,
            CustomUser.Role.OWNER,
        )

        self.assertEqual(
            store.business_type,
            Store.BusinessType.RESTAURANT,
        )

        self.assertEqual(
            store.whatsapp_number,
            "+201012345678",
        )

        self.assertEqual(
            store.status,
            Store.Status.PENDING_ACTIVATION,
        )

        self.assertTrue(
            user.check_password(
                "StrongPassword123!",
            )
        )

        self.assertTrue(self.client.session.get("_auth_user_id"))

    # ------------------------------------------------------------------
    # Invalid signup tests
    # ------------------------------------------------------------------
    def test_post_invalid_data_does_not_create_objects(self):
        """Invalid signup does not create a store or user."""
        data = self.valid_data.copy()
        data["confirm_password"] = "DifferentPassword123!"

        response = self.client.post(
            self.signup_url,
            data,
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertTemplateUsed(
            response,
            "accounts/signup.html",
        )

        self.assertFalse(
            Store.objects.filter(
                name="New Store",
            ).exists()
        )

        self.assertFalse(
            CustomUser.objects.filter(
                email="new@example.com",
            ).exists()
        )

    def test_post_without_business_type_is_invalid(self):
        """Signup is invalid when business type is missing."""
        data = self.valid_data.copy()
        data.pop("business_type")

        response = self.client.post(
            self.signup_url,
            data,
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertFalse(
            Store.objects.filter(
                name="New Store",
            ).exists()
        )

    def test_signup_is_atomic_when_user_creation_fails(self):
        """The store is rolled back if owner creation fails."""
        data = self.valid_data.copy()

        # Use an email that is already used.
        Store.objects.create(
            name="Existing Store",
            whatsapp_number="+201000000002",
        )

        existing_store = Store.objects.get(
            name="Existing Store",
        )

        CustomUser.objects.create_user(
            email="new@example.com",
            password="StrongPassword123!",
            full_name="Existing User",
            store=existing_store,
            role=CustomUser.Role.OWNER,
        )

        response = self.client.post(
            self.signup_url,
            data,
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            Store.objects.filter(
                name="New Store",
            ).count(),
            0,
        )


# ----------------------------------------------------------------------
# Account views tests
# ----------------------------------------------------------------------
class AccountsViewsTests(TestCase):
    """Test team management and profile views."""

    @classmethod
    def setUpTestData(cls):
        """Create stores and users shared by the tests."""

        # Create stores.
        cls.store_a = Store.objects.create(
            name="Store A",
            whatsapp_number="+201000000010",
        )

        cls.store_b = Store.objects.create(
            name="Store B",
            whatsapp_number="+201000000011",
        )

        # Create users for Store A.
        cls.owner_a = CustomUser.objects.create_user(
            email="owner_a@example.com",
            password="Password123!",
            full_name="Owner A",
            store=cls.store_a,
            role=CustomUser.Role.OWNER,
        )

        cls.manager_a = CustomUser.objects.create_user(
            email="manager_a@example.com",
            password="Password123!",
            full_name="Manager A",
            store=cls.store_a,
            role=CustomUser.Role.MANAGER,
        )

        cls.shipper_a = CustomUser.objects.create_user(
            email="shipper_a@example.com",
            password="Password123!",
            full_name="Shipper A",
            store=cls.store_a,
            role=CustomUser.Role.SHIPPER,
        )

        # Create users for Store B.
        cls.owner_b = CustomUser.objects.create_user(
            email="owner_b@example.com",
            password="Password123!",
            full_name="Owner B",
            store=cls.store_b,
            role=CustomUser.Role.OWNER,
        )

        cls.shipper_b = CustomUser.objects.create_user(
            email="shipper_b@example.com",
            password="Password123!",
            full_name="Shipper B",
            store=cls.store_b,
            role=CustomUser.Role.SHIPPER,
        )

    def login(self, user):
        """Log in the given user."""
        self.client.login(
            email=user.email,
            password="Password123!",
        )

    # ------------------------------------------------------------------
    # URL helpers
    # ------------------------------------------------------------------
    def team_list_url(self):
        """Return the team list URL."""
        return reverse("accounts:team_list")

    def member_create_url(self):
        """Return the team member creation URL."""
        return reverse("accounts:team_member_create")

    def toggle_url(self, pk):
        """Return the member status toggle URL."""
        return reverse(
            "accounts:team_member_toggle",
            kwargs={"pk": pk},
        )

    def member_profile_url(self, pk):
        """Return the member profile URL."""
        return reverse(
            "accounts:member_profile",
            kwargs={"pk": pk},
        )

    def my_profile_url(self):
        """Return the current user's profile URL."""
        return reverse("accounts:my_profile")

    def profile_update_url(self):
        """Return the profile update URL."""
        return reverse("accounts:profile_edit")

    def password_change_url(self):
        """Return the password change URL."""
        return reverse("accounts:password_change")

    # ------------------------------------------------------------------
    # Team list tests
    # ------------------------------------------------------------------
    def test_team_list_unauthenticated_redirects_to_login(self):
        """Unauthenticated users are redirected to the login page."""
        response = self.client.get(
            self.team_list_url(),
        )

        expected_url = f"{reverse('accounts:login')}" f"?next={self.team_list_url()}"

        self.assertRedirects(
            response,
            expected_url,
        )

    def test_team_list_owner_sees_only_own_store_team(self):
        """Owner sees only team members from their own store."""
        self.login(self.owner_a)

        response = self.client.get(
            self.team_list_url(),
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertContains(
            response,
            "Manager A",
        )

        self.assertContains(
            response,
            "Shipper A",
        )

        self.assertNotContains(
            response,
            "Shipper B",
        )

        self.assertNotContains(
            response,
            "Owner B",
        )

    def test_team_list_manager_is_forbidden(self):
        """Managers cannot access the team management page."""
        self.login(self.manager_a)

        response = self.client.get(
            self.team_list_url(),
        )

        self.assertEqual(
            response.status_code,
            403,
        )

    def test_team_list_shipper_is_forbidden(self):
        """Shippers cannot access the team management page."""
        self.login(self.shipper_a)

        response = self.client.get(
            self.team_list_url(),
        )

        self.assertEqual(
            response.status_code,
            403,
        )

    # ------------------------------------------------------------------
    # Team member creation tests
    # ------------------------------------------------------------------
    def test_member_create_owner_get_is_allowed(self):
        """Owner can open the team member creation page."""
        self.login(self.owner_a)

        response = self.client.get(
            self.member_create_url(),
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertTemplateUsed(
            response,
            "accounts/create_team_member.html",
        )

    def test_member_create_manager_is_forbidden(self):
        """Managers cannot create team members."""
        self.login(self.manager_a)

        response = self.client.get(
            self.member_create_url(),
        )

        self.assertEqual(
            response.status_code,
            403,
        )

    def test_member_create_shipper_is_forbidden(self):
        """Shippers cannot create team members."""
        self.login(self.shipper_a)

        response = self.client.get(
            self.member_create_url(),
        )

        self.assertEqual(
            response.status_code,
            403,
        )

    def test_member_create_owner_creates_manager(self):
        """Owner can create a manager in the same store."""
        self.login(self.owner_a)

        data = {
            "full_name": "New Manager",
            "email": "new_manager@example.com",
            "password": "StrongPassword123!",
            "role": CustomUser.Role.MANAGER,
        }

        response = self.client.post(
            self.member_create_url(),
            data,
        )

        self.assertRedirects(
            response,
            self.team_list_url(),
            status_code=302,
        )

        new_user = CustomUser.objects.get(
            email="new_manager@example.com",
        )

        self.assertEqual(
            new_user.role,
            CustomUser.Role.MANAGER,
        )

        self.assertEqual(
            new_user.store,
            self.store_a,
        )

        self.assertTrue(
            new_user.check_password(
                "StrongPassword123!",
            )
        )

    def test_member_create_owner_creates_shipper(self):
        """Owner can create a shipper in the same store."""
        self.login(self.owner_a)

        data = {
            "full_name": "New Shipper",
            "email": "new_shipper@example.com",
            "password": "StrongPassword123!",
            "role": CustomUser.Role.SHIPPER,
        }

        response = self.client.post(
            self.member_create_url(),
            data,
        )

        self.assertRedirects(
            response,
            self.team_list_url(),
            status_code=302,
        )

        new_user = CustomUser.objects.get(
            email="new_shipper@example.com",
        )

        self.assertEqual(
            new_user.role,
            CustomUser.Role.SHIPPER,
        )

        self.assertEqual(
            new_user.store,
            self.store_a,
        )

    # ------------------------------------------------------------------
    # Toggle member status tests
    # ------------------------------------------------------------------
    def test_toggle_get_is_not_allowed(self):
        """GET requests cannot change member status."""
        self.login(self.owner_a)

        response = self.client.get(
            self.toggle_url(self.shipper_a.pk),
        )

        self.assertEqual(
            response.status_code,
            405,
        )

    def test_toggle_owner_deactivates_manager(self):
        """Owner can deactivate a manager."""
        self.login(self.owner_a)

        self.assertTrue(
            self.manager_a.is_active,
        )

        response = self.client.post(
            self.toggle_url(self.manager_a.pk),
        )

        self.assertRedirects(
            response,
            self.team_list_url(),
            status_code=302,
        )

        self.manager_a.refresh_from_db()

        self.assertFalse(
            self.manager_a.is_active,
        )

    def test_toggle_owner_can_reactivate_manager(self):
        """Owner can reactivate an inactive manager."""
        self.manager_a.is_active = False
        self.manager_a.save()

        self.login(self.owner_a)

        response = self.client.post(
            self.toggle_url(self.manager_a.pk),
        )

        self.assertRedirects(
            response,
            self.team_list_url(),
            status_code=302,
        )

        self.manager_a.refresh_from_db()

        self.assertTrue(
            self.manager_a.is_active,
        )

    def test_toggle_cannot_change_member_from_other_store(self):
        """Owner cannot change a member from another store."""
        self.login(self.owner_a)

        response = self.client.post(
            self.toggle_url(self.shipper_b.pk),
        )

        self.assertEqual(
            response.status_code,
            404,
        )

    def test_toggle_owner_cannot_change_themselves(self):
        """Owner cannot use the toggle view on their own account."""
        self.login(self.owner_a)

        response = self.client.post(
            self.toggle_url(self.owner_a.pk),
        )

        self.assertEqual(
            response.status_code,
            404,
        )

    # ------------------------------------------------------------------
    # Member profile tests
    # ------------------------------------------------------------------
    def test_member_profile_owner_can_view_team_member(self):
        """Owner can view a team member from the same store."""
        self.login(self.owner_a)

        response = self.client.get(
            self.member_profile_url(self.manager_a.pk),
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertTemplateUsed(
            response,
            "accounts/member_profile.html",
        )

        self.assertContains(
            response,
            "Manager A",
        )

    def test_member_profile_cannot_view_other_store_member(self):
        """Owner cannot view a member from another store."""
        self.login(self.owner_a)

        response = self.client.get(
            self.member_profile_url(self.shipper_b.pk),
        )

        self.assertEqual(
            response.status_code,
            404,
        )

    def test_member_profile_manager_is_forbidden(self):
        """Manager cannot access team member profiles."""
        self.login(self.manager_a)

        response = self.client.get(
            self.member_profile_url(self.shipper_a.pk),
        )

        self.assertEqual(
            response.status_code,
            403,
        )

    # ------------------------------------------------------------------
    # User profile update tests
    # ------------------------------------------------------------------
    def test_profile_update_updates_current_user(self):
        """A user can update their own profile."""
        self.login(self.owner_a)

        data = {
            "full_name": "Updated Owner A",
            "email": "updated_owner_a@example.com",
        }

        response = self.client.post(
            self.profile_update_url(),
            data,
        )

        self.assertRedirects(
            response,
            self.my_profile_url(),
            status_code=302,
        )

        self.owner_a.refresh_from_db()

        self.assertEqual(
            self.owner_a.full_name,
            "Updated Owner A",
        )

        self.assertEqual(
            self.owner_a.email,
            "updated_owner_a@example.com",
        )

    def test_profile_update_requires_login(self):
        """Unauthenticated users cannot update a profile."""
        response = self.client.get(
            self.profile_update_url(),
        )

        expected_url = (
            f"{reverse('accounts:login')}" f"?next={self.profile_update_url()}"
        )

        self.assertRedirects(
            response,
            expected_url,
        )

    # ------------------------------------------------------------------
    # MyProfileView tests
    # ------------------------------------------------------------------
    def test_my_profile_shows_current_user(self):
        """My profile page shows the currently logged-in user."""
        self.login(self.owner_a)

        response = self.client.get(
            self.my_profile_url(),
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertTemplateUsed(
            response,
            "accounts/my_profile.html",
        )

        self.assertEqual(
            response.context["profile_user"],
            self.owner_a,
        )

        self.assertContains(
            response,
            "Owner A",
        )

    def test_my_profile_requires_login(self):
        """Unauthenticated users cannot access their profile."""
        response = self.client.get(
            self.my_profile_url(),
        )

        expected_url = f"{reverse('accounts:login')}" f"?next={self.my_profile_url()}"

        self.assertRedirects(
            response,
            expected_url,
        )

    # ------------------------------------------------------------------
    # Password change tests
    # ------------------------------------------------------------------
    def test_password_change_updates_password(self):
        """A logged-in user can change their password."""
        self.login(self.owner_a)

        data = {
            "old_password": "Password123!",
            "new_password1": "NewStrongPassword123!",
            "new_password2": "NewStrongPassword123!",
        }

        response = self.client.post(
            self.password_change_url(),
            data,
        )

        self.assertRedirects(
            response,
            self.my_profile_url(),
            status_code=302,
        )

        self.owner_a.refresh_from_db()

        self.assertTrue(
            self.owner_a.check_password(
                "NewStrongPassword123!",
            )
        )

        self.assertFalse(
            self.owner_a.check_password(
                "Password123!",
            )
        )

    def test_password_change_requires_login(self):
        """Unauthenticated users cannot change passwords."""
        response = self.client.get(
            self.password_change_url(),
        )

        expected_url = (
            f"{reverse('accounts:login')}" f"?next={self.password_change_url()}"
        )

        self.assertRedirects(
            response,
            expected_url,
        )
