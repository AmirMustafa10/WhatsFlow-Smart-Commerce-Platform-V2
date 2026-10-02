import uuid
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    """Manage user creation for store users and platform superusers."""

    def _create_user(self, email, password=None, **extra_fields):
        """Create a user after basic email and password setup."""
        if not email:
            raise ValueError(_("The email field must be set."))

        email = self.normalize_email(email).strip().lower()

        user = self.model(
            email=email,
            **extra_fields,
        )

        user.set_password(password)

        # The model save method handles model validation.
        user.save(using=self._db)

        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create a normal user who belongs to one store."""
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("is_active", True)

        # Store is required for normal users.
        if extra_fields.get("store") is None:
            raise ValueError(_("The store field is required for normal users."))

        # Role is required for normal users.
        if extra_fields.get("role") is None:
            raise ValueError(_("The role field is required for normal users."))

        return self._create_user(
            email,
            password,
            **extra_fields,
        )

    def create_superuser(self, email, password=None, **extra_fields):
        """Create a platform superuser without a store role."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        # Platform superusers do not belong to a store.
        extra_fields["store"] = None

        # Platform superusers do not use store roles.
        extra_fields["role"] = None

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))

        return self._create_user(
            email,
            password,
            **extra_fields,
        )


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """Store users and platform superusers for the system."""

    class Role(models.TextChoices):
        """Roles used by users inside a store."""

        OWNER = "OWNER", _("Store Owner")
        MANAGER = "MANAGER", _("Manager")
        SHIPPER = "SHIPPER", _("Shipper")

    # ------------------------------------------------------------------
    # Basic user data
    # ------------------------------------------------------------------
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text=_("Unique identifier for the user."),
    )

    email = models.EmailField(
        _("email address"),
        unique=True,
        help_text=_("Required. Used as the login identifier."),
        error_messages={
            "unique": _("A user with that email already exists."),
        },
    )

    full_name = models.CharField(
        _("full name"),
        max_length=150,
        help_text=_("Required. The user's full name."),
    )

    date_joined = models.DateTimeField(
        _("date joined"),
        default=timezone.now,
    )

    # ------------------------------------------------------------------
    # Store and role data
    # ------------------------------------------------------------------
    store = models.ForeignKey(
        "stores.Store",
        on_delete=models.PROTECT,
        related_name="users",
        null=True,
        blank=True,
        help_text=_(
            "The store for this user. " "Only platform superusers can have no store."
        ),
    )

    role = models.CharField(
        _("role"),
        max_length=20,
        choices=Role.choices,
        null=True,
        blank=True,
        help_text=_(
            "The role of the user inside the store. "
            "Platform superusers have no store role."
        ),
    )

    # ------------------------------------------------------------------
    # Django access flags
    # ------------------------------------------------------------------
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can access the Django admin."),
    )

    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_("Designates whether this user account is active."),
    )

    # ------------------------------------------------------------------
    # User manager and Django auth settings
    # ------------------------------------------------------------------
    objects = CustomUserManager()

    USERNAME_FIELD = "email"

    # This is used by the createsuperuser command.
    REQUIRED_FIELDS = [
        "full_name",
    ]

    # ------------------------------------------------------------------
    # Database settings
    # ------------------------------------------------------------------
    class Meta:
        """Database settings for the user model."""

        verbose_name = _("user")
        verbose_name_plural = _("users")
        ordering = ["-date_joined"]

        indexes = [
            models.Index(
                fields=["store", "role", "is_active"],
                name="user_store_role_active_idx",
            ),
        ]

        constraints = [
            models.CheckConstraint(
                condition=(
                    Q(
                        is_superuser=True,
                        store__isnull=True,
                        role__isnull=True,
                    )
                    | Q(
                        is_superuser=False,
                        store__isnull=False,
                        role__isnull=False,
                    )
                ),
                name="user_store_role_scope_valid",
            ),
            models.CheckConstraint(
                condition=(Q(is_superuser=False) | Q(is_staff=True)),
                name="superuser_must_be_staff",
            ),
        ]

    # ------------------------------------------------------------------
    # Display helpers
    # ------------------------------------------------------------------
    def __str__(self):
        """Return the user's email."""
        return self.email

    def get_full_name(self):
        """Return the user's full name."""
        return self.full_name.strip()

    def get_short_name(self):
        """Return the first part of the user's full name."""
        if not self.full_name:
            return self.email

        return self.full_name.strip().split()[0]

    # ------------------------------------------------------------------
    # Model validation
    # ------------------------------------------------------------------
    def clean(self):
        """Validate and normalize the user data."""
        super().clean()

        # Normalize email before validation and saving.
        if self.email:
            self.email = self.email.strip().lower()

        # Remove extra spaces from the user's name.
        if self.full_name:
            self.full_name = self.full_name.strip()

            if not self.full_name:
                raise ValidationError({"full_name": _("Full name cannot be blank.")})

        # Platform superusers do not have a store or store role.
        if self.is_superuser:
            if self.store_id is not None:
                raise ValidationError(
                    {"store": _("Platform superusers cannot belong to a store.")}
                )

            if self.role is not None:
                raise ValidationError(
                    {"role": _("Platform superusers cannot have a store role.")}
                )

            return

        # Every normal user must belong to one store.
        if self.store_id is None:
            raise ValidationError(
                {"store": _("A store must be assigned to normal users.")}
            )

        # Every normal user must have a store role.
        if self.role is None:
            raise ValidationError(
                {"role": _("A role must be assigned to normal users.")}
            )

    def save(self, *args, **kwargs):
        """Validate the user and save it to the database."""
        self.full_clean()
        super().save(*args, **kwargs)
