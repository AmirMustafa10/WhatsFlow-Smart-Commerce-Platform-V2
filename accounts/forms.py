from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
from stores.models import Store

CustomUser = get_user_model()


# ----------------------------------------------------------------------
# Admin user creation form
# ----------------------------------------------------------------------
class CustomUserCreationForm(UserCreationForm):
    """
    Form for creating a normal CustomUser in the admin.
    """

    class Meta(UserCreationForm.Meta):
        """Set the model and fields used by the form."""

        model = CustomUser
        fields = (
            "email",
            "full_name",
            "store",
            "role",
        )


# ----------------------------------------------------------------------
# Admin user change form
# ----------------------------------------------------------------------
class CustomUserChangeForm(UserChangeForm):
    """
    Form for updating an existing CustomUser in the admin.
    """

    class Meta(UserChangeForm.Meta):
        """Set the model and fields used by the form."""

        model = CustomUser
        fields = "__all__"


# ----------------------------------------------------------------------
# Merchant signup form
# ----------------------------------------------------------------------
class MerchantSignUpForm(forms.Form):
    """
    Form for merchant self-registration.
    Creates the store and its owner account in the signup flow.
    """

    store_name = forms.CharField(
        max_length=200,
        label=_("Store name"),
        help_text=_("Required. Unique name for your business."),
    )

    business_type = forms.ChoiceField(
        label=_("Business type"),
        choices=Store.BusinessType.choices,
        help_text=_("Select the type that best describes your business."),
    )

    full_name = forms.CharField(
        max_length=150,
        label=_("Full name"),
        help_text=_("Enter the full name of the store owner."),
    )

    email = forms.EmailField(
        label=_("Email"),
        help_text=_("Will be used as your login identifier."),
    )

    password = forms.CharField(
        widget=forms.PasswordInput,
        label=_("Password"),
        strip=False,
        help_text=_("Enter a strong password."),
    )

    confirm_password = forms.CharField(
        widget=forms.PasswordInput,
        label=_("Confirm password"),
        strip=False,
    )

    whatsapp_number = forms.CharField(
        max_length=15,
        label=_("WhatsApp number"),
        validators=[
            RegexValidator(
                regex=r"^\+[1-9]\d{8,14}$",
                message=_(
                    "Phone number must be in international format "
                    "(for example, +201000000000)."
                ),
            )
        ],
        help_text=_("Use the WhatsApp number that will be connected to this business."),
        widget=forms.TextInput(
            attrs={
                "placeholder": "+201000000000",
            }
        ),
    )

    # ------------------------------------------------------------------
    # Store validation
    # ------------------------------------------------------------------
    def clean_store_name(self):
        """Normalize the store name and check that it is unique."""
        store_name = self.cleaned_data.get("store_name", "").strip()

        if not store_name:
            raise ValidationError(_("Store name cannot be blank."))

        if Store.objects.filter(name__iexact=store_name).exists():
            raise ValidationError(_("A store with this name already exists."))

        return store_name

    def clean_business_type(self):
        """Validate the selected business type."""
        business_type = self.cleaned_data.get("business_type")

        valid_types = {choice[0] for choice in Store.BusinessType.choices}

        if business_type not in valid_types:
            raise ValidationError(_("Please select a valid business type."))

        return business_type

    def clean_whatsapp_number(self):
        """Normalize the WhatsApp number and check that it is unique."""
        whatsapp_number = self.cleaned_data.get("whatsapp_number", "").strip()

        if Store.objects.filter(whatsapp_number=whatsapp_number).exists():
            raise ValidationError(
                _("A store with this WhatsApp number already exists.")
            )

        return whatsapp_number

    # ------------------------------------------------------------------
    # User validation
    # ------------------------------------------------------------------
    def clean_full_name(self):
        """Normalize and validate the owner's full name."""
        full_name = self.cleaned_data.get("full_name", "").strip()

        if not full_name:
            raise ValidationError(_("Full name cannot be blank."))

        return full_name

    def clean_email(self):
        """Normalize the email and check that it is unique."""
        email = self.cleaned_data.get("email", "").strip().lower()

        if CustomUser.objects.filter(email__iexact=email).exists():
            raise ValidationError(_("A user with this email already exists."))

        return email

    def clean_password(self):
        """Validate the password using Django password validators."""
        password = self.cleaned_data.get("password")

        if password:
            validate_password(password)

        return password

    # ------------------------------------------------------------------
    # Form validation
    # ------------------------------------------------------------------
    def clean(self):
        """Check that the password fields have the same value."""
        cleaned_data = super().clean()

        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password and confirm_password and password != confirm_password:
            raise ValidationError({"confirm_password": _("Passwords do not match.")})

        return cleaned_data


# ----------------------------------------------------------------------
# Team member creation form
# ----------------------------------------------------------------------
class TeamMemberCreationForm(forms.ModelForm):
    """
    Form for creating a Manager or Shipper.
    Store is assigned automatically in the view.
    """

    password = forms.CharField(
        label=_("Password"),
        widget=forms.PasswordInput,
        strip=False,
        help_text=_("Enter a strong password for the team member."),
    )

    role = forms.ChoiceField(
        label=_("Role"),
        choices=[
            (
                CustomUser.Role.MANAGER,
                _("Manager"),
            ),
            (
                CustomUser.Role.SHIPPER,
                _("Shipper"),
            ),
        ],
        widget=forms.Select(
            attrs={
                "class": "form-control",
            }
        ),
    )

    class Meta:
        """Set the model and fields used by the form."""

        model = CustomUser
        fields = [
            "full_name",
            "email",
            "role",
        ]

    # ------------------------------------------------------------------
    # Field validation
    # ------------------------------------------------------------------
    def clean_full_name(self):
        """Normalize and validate the team member's full name."""
        full_name = self.cleaned_data.get("full_name", "").strip()

        if not full_name:
            raise ValidationError(_("Full name cannot be blank."))

        return full_name

    def clean_email(self):
        """Normalize the email and check that it is unique."""
        email = self.cleaned_data.get("email", "").strip().lower()

        if CustomUser.objects.filter(email__iexact=email).exists():
            raise ValidationError(_("A user with this email already exists."))

        return email

    def clean_password(self):
        """Validate the team member password."""
        password = self.cleaned_data.get("password")

        if password:
            validate_password(password)

        return password

    # ------------------------------------------------------------------
    # Save
    # ------------------------------------------------------------------
    def save(self, commit=True):
        """Set the password and save the team member."""
        user = super().save(commit=False)

        user.set_password(self.cleaned_data["password"])

        if commit:
            user.save()

        return user


# ----------------------------------------------------------------------
# User profile update form
# ----------------------------------------------------------------------
class UserProfileUpdateForm(forms.ModelForm):
    """
    Form for updating the user's basic profile information.
    """

    class Meta:
        """Set the model and fields used by the form."""

        model = CustomUser
        fields = [
            "full_name",
            "email",
        ]

    # ------------------------------------------------------------------
    # Field validation
    # ------------------------------------------------------------------
    def clean_full_name(self):
        """Normalize and validate the user's full name."""
        full_name = self.cleaned_data.get("full_name", "").strip()

        if not full_name:
            raise ValidationError(_("Full name cannot be blank."))

        return full_name

    def clean_email(self):
        """Normalize the email and check that it is not used by another user."""
        email = self.cleaned_data.get("email", "").strip().lower()

        email_exists = (
            CustomUser.objects.exclude(pk=self.instance.pk)
            .filter(email__iexact=email)
            .exists()
        )

        if email_exists:
            raise ValidationError(_("This email is already in use by another account."))

        return email
