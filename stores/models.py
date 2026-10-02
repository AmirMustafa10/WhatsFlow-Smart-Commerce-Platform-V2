import uuid
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models
from django.db.models.functions import Lower
from django.utils.translation import gettext_lazy as _


# ----------------------------------------------------------------------
# Store model
# ----------------------------------------------------------------------
class Store(models.Model):
    """Store model for a business and its tenant data."""

    class BusinessType(models.TextChoices):
        """Main types of businesses supported by the platform."""

        RETAIL = "RETAIL", _("Retail")
        CLOTHING_AND_FASHION = "CLOTHING_AND_FASHION", _("Clothing and Fashion")
        SPORTS_AND_FITNESS = "SPORTS_AND_FITNESS", _("Sports and Fitness")

        RESTAURANT = "RESTAURANT", _("Restaurant")
        FOOD_AND_BEVERAGE = "FOOD_AND_BEVERAGE", _("Food and Beverage")

        ELECTRONICS = "ELECTRONICS", _("Electronics")
        HOME_AND_FURNITURE = "HOME_AND_FURNITURE", _("Home and Furniture")
        BEAUTY_AND_PERSONAL_CARE = "BEAUTY_AND_PERSONAL_CARE", _(
            "Beauty and Personal Care"
        )

        HEALTHCARE = "HEALTHCARE", _("Healthcare")
        PHARMACY = "PHARMACY", _("Pharmacy")

        SOFTWARE_AND_TECH = "SOFTWARE_AND_TECH", _("Software and Technology")
        PROFESSIONAL_SERVICES = "PROFESSIONAL_SERVICES", _("Professional Services")
        SERVICE_BUSINESS = "SERVICE_BUSINESS", _("Service Business")
        FREELANCER = "FREELANCER", _("Freelancer")

        EDUCATION = "EDUCATION", _("Education and Training")

        REAL_ESTATE = "REAL_ESTATE", _("Real Estate")
        AUTOMOTIVE = "AUTOMOTIVE", _("Automotive")
        TRAVEL_AND_HOSPITALITY = "TRAVEL_AND_HOSPITALITY", _("Travel and Hospitality")

        WHOLESALE = "WHOLESALE", _("Wholesale")
        MANUFACTURING = "MANUFACTURING", _("Manufacturing")
        CONSTRUCTION = "CONSTRUCTION", _("Construction")

        LOGISTICS_AND_DELIVERY = "LOGISTICS_AND_DELIVERY", _("Logistics and Delivery")
        EVENTS_AND_ENTERTAINMENT = "EVENTS_AND_ENTERTAINMENT", _(
            "Events and Entertainment"
        )
        MEDIA_AND_CONTENT = "MEDIA_AND_CONTENT", _("Media and Content")

        PETS_AND_ANIMALS = "PETS_AND_ANIMALS", _("Pets and Animals")
        AGRICULTURE = "AGRICULTURE", _("Agriculture")

        COMPANY = "COMPANY", _("Company")
        OTHER = "OTHER", _("Other")

    class Status(models.TextChoices):
        """Store states during its platform lifecycle."""

        PENDING_ACTIVATION = "PENDING_ACTIVATION", _("Pending Activation")
        ACTIVE = "ACTIVE", _("Active")
        SUSPENDED = "SUSPENDED", _("Suspended")
        DEACTIVATED = "DEACTIVATED", _("Deactivated")

    # ------------------------------------------------------------------
    # Basic store data
    # ------------------------------------------------------------------
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text=_("Unique identifier for the store."),
    )

    name = models.CharField(
        _("store name"),
        max_length=200,
        help_text=_("The public name of the business."),
        error_messages={
            "unique": _("A store with this name already exists."),
        },
    )

    description = models.TextField(
        _("description"),
        blank=True,
        default="",
        help_text=_("Short information about the business and its services."),
    )

    business_type = models.CharField(
        _("business type"),
        max_length=30,
        choices=BusinessType.choices,
        default=BusinessType.OTHER,
        help_text=_("The main type of the business."),
    )

    # ------------------------------------------------------------------
    # WhatsApp data
    # ------------------------------------------------------------------
    whatsapp_number = models.CharField(
        _("WhatsApp number"),
        max_length=15,
        unique=True,
        validators=[
            RegexValidator(
                regex=r"^\+[1-9]\d{8,14}$",
                message=_("Enter a valid WhatsApp number in international format."),
            )
        ],
        help_text=_(
            "The WhatsApp number used by this business in international format."
        ),
        error_messages={
            "unique": _("A store with this WhatsApp number already exists."),
        },
    )

    # ------------------------------------------------------------------
    # Store lifecycle
    # ------------------------------------------------------------------
    status = models.CharField(
        _("status"),
        max_length=30,
        choices=Status.choices,
        default=Status.PENDING_ACTIVATION,
        help_text=_("The current status of the store."),
    )

    # ------------------------------------------------------------------
    # Timestamps
    # ------------------------------------------------------------------
    created_at = models.DateTimeField(
        _("created at"),
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        _("updated at"),
        auto_now=True,
    )

    # ------------------------------------------------------------------
    # Database settings
    # ------------------------------------------------------------------
    class Meta:
        """Database settings for the store model."""

        verbose_name = _("store")
        verbose_name_plural = _("stores")
        ordering = ["name"]

        constraints = [
            models.UniqueConstraint(
                Lower("name"),
                name="store_name_case_insensitive_unique",
            ),
        ]

    # ------------------------------------------------------------------
    # Display helpers
    # ------------------------------------------------------------------
    def __str__(self):
        """Return the store name."""
        return self.name

    # ------------------------------------------------------------------
    # Model validation
    # ------------------------------------------------------------------
    def clean(self):
        """Validate and normalize store data."""
        super().clean()

        # Remove extra spaces from the store name.
        if self.name:
            self.name = self.name.strip()

            if not self.name:
                raise ValidationError({"name": _("Store name cannot be blank.")})

        # Remove extra spaces from the WhatsApp number.
        if self.whatsapp_number:
            self.whatsapp_number = self.whatsapp_number.strip()

        # Remove extra spaces from the description.
        if self.description:
            self.description = self.description.strip()

    def save(self, *args, **kwargs):
        """Validate the store and save it to the database."""
        self.full_clean()
        super().save(*args, **kwargs)
