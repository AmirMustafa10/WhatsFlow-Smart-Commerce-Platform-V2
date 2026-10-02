from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import CustomUser


# ----------------------------------------------------------------------
# User admin
# ----------------------------------------------------------------------
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """
    Admin configuration for CustomUser.
    """

    model = CustomUser

    # Use custom forms for adding and changing users.
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm

    # ------------------------------------------------------------------
    # List view
    # ------------------------------------------------------------------
    list_display = (
        "email",
        "full_name",
        "store",
        "role_badge",
        "account_scope",
        "is_active",
        "is_staff",
    )

    list_filter = (
        "is_active",
        "is_staff",
        "is_superuser",
        "role",
        "store",
    )

    search_fields = (
        "email",
        "full_name",
        "store__name",
    )

    ordering = ("email",)

    list_select_related = ("store",)

    list_per_page = 25

    date_hierarchy = "date_joined"

    # Show this message when a value is empty.
    empty_value_display = "—"

    # ------------------------------------------------------------------
    # Fields that cannot be changed from admin
    # ------------------------------------------------------------------
    readonly_fields = (
        "id",
        "date_joined",
        "last_login",
    )

    # ------------------------------------------------------------------
    # Change user page
    # ------------------------------------------------------------------
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "email",
                    "password",
                ),
            },
        ),
        (
            _("Personal Information"),
            {
                "fields": ("full_name",),
            },
        ),
        (
            _("Store Membership"),
            {
                "fields": (
                    "store",
                    "role",
                ),
                "description": _(
                    "Store users must have a store and a role. "
                    "Platform superusers do not use store membership."
                ),
            },
        ),
        (
            _("Account Status"),
            {
                "fields": ("is_active",),
            },
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
                "description": _(
                    "Use these settings carefully. "
                    "Platform-level permissions should not be given "
                    "to normal store users unless needed."
                ),
            },
        ),
        (
            _("Important Dates"),
            {
                "fields": (
                    "last_login",
                    "date_joined",
                    "id",
                ),
            },
        ),
    )

    # ------------------------------------------------------------------
    # Add user page
    # ------------------------------------------------------------------
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "full_name",
                    "store",
                    "role",
                    "password1",
                    "password2",
                ),
            },
        ),
    )

    # ------------------------------------------------------------------
    # List display helpers
    # ------------------------------------------------------------------
    @admin.display(
        description=_("Role"),
        ordering="role",
    )
    def role_badge(self, obj):
        """Show the user's role in a clear badge."""
        if obj.role is None:
            return format_html('<span style="color:#666;">{}</span>', "—")

        badge_styles = {
            CustomUser.Role.OWNER: ("background:#e8f0fe; color:#1a73e8;"),
            CustomUser.Role.MANAGER: ("background:#e6f4ea; color:#137333;"),
            CustomUser.Role.SHIPPER: ("background:#fef7e0; color:#b06000;"),
        }

        style = badge_styles.get(
            obj.role,
            "background:#f1f3f4; color:#444;",
        )

        return format_html(
            '<span style="padding:3px 8px; border-radius:12px; '
            'font-weight:600; {}">{}</span>',
            style,
            obj.get_role_display(),
        )

    @admin.display(
        description=_("Account Type"),
    )
    def account_scope(self, obj):
        """Show whether the account belongs to the platform or a store."""
        if obj.is_superuser:
            return format_html('<strong style="color:#7b1fa2;">{}</strong>', "Platform")

        return format_html('<strong style="color:#1a73e8;">{}</strong>', "Store")

    # ------------------------------------------------------------------
    # Admin actions
    # ------------------------------------------------------------------
    @admin.action(description=_("Activate selected users"))
    def activate_users(self, request, queryset):
        """Activate the selected user accounts."""
        updated_count = queryset.update(is_active=True)

        self.message_user(
            request,
            _("%(count)d user(s) were activated.") % {"count": updated_count},
        )

    @admin.action(description=_("Deactivate selected users"))
    def deactivate_users(self, request, queryset):
        """Deactivate selected non-superuser accounts."""
        queryset = queryset.exclude(is_superuser=True)

        updated_count = queryset.update(is_active=False)

        self.message_user(
            request,
            _("%(count)d user(s) were deactivated.") % {"count": updated_count},
        )

    actions = (
        "activate_users",
        "deactivate_users",
    )
