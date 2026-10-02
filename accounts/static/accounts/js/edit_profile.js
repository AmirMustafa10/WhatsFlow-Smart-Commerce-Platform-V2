(() => {
  'use strict';

  const page = document.querySelector('[data-page="edit-profile"]');
  if (!page) return;

  const I18N = {
    en: {
      back: 'Back to My Profile', eyebrow: 'ACCOUNT SETTINGS', title: 'Edit your profile', subtitle: 'Keep your personal information accurate and up to date.',
      previewLabel: 'PROFILE PREVIEW', live: 'Live', role: 'Role', workspace: 'Workspace', locked: 'Role and workspace are managed by the business owner and cannot be changed here.',
      personalTitle: 'Personal information', personalSubtitle: 'Update the information used on your WhatsFlow account.', secure: 'Secure',
      avatarHelp: 'Use a clear JPG, PNG, or WebP image.', workspaceTitle: 'Workspace access', workspaceSubtitle: 'These details are controlled by your workspace.', business: 'Business', accessRole: 'Access role',
      cancel: 'Cancel', save: 'Save changes', saving: 'Saving…', securityKicker: 'ACCOUNT SECURITY', securityTitle: 'Want to update your password?', securityText: 'Password changes are handled separately so your profile edits stay simple.', changePassword: 'Change password',
      yourName: 'Your name', emailPlaceholder: 'your@email.com', fullName: 'Full name', email: 'Email address', phone: 'Phone number', avatar: 'Profile photo',
      clearAvatar: 'Choose a profile photo'
    },
    ar: {
      back: 'العودة إلى حسابي', eyebrow: 'إعدادات الحساب', title: 'تعديل ملفك الشخصي', subtitle: 'حدّث بياناتك الشخصية وحافظ عليها محدثة.',
      previewLabel: 'معاينة الملف الشخصي', live: 'مباشر', role: 'الدور', workspace: 'مساحة العمل', locked: 'الدور ومساحة العمل يتم التحكم بهما من مالك البيزنس ولا يمكن تغييرهما من هنا.',
      personalTitle: 'البيانات الشخصية', personalSubtitle: 'حدّث البيانات المستخدمة في حسابك على WhatsFlow.', secure: 'آمن',
      avatarHelp: 'استخدم صورة واضحة بصيغة JPG أو PNG أو WebP.', workspaceTitle: 'صلاحيات مساحة العمل', workspaceSubtitle: 'هذه البيانات يتم التحكم بها من مساحة العمل.', business: 'البيزنس', accessRole: 'دور الوصول',
      cancel: 'إلغاء', save: 'حفظ التغييرات', saving: 'جارٍ الحفظ…', securityKicker: 'أمان الحساب', securityTitle: 'عايز تغيّر كلمة المرور؟', securityText: 'تغيير كلمة المرور منفصل حتى تظل تعديلات الملف الشخصي بسيطة.', changePassword: 'تغيير كلمة المرور',
      yourName: 'اسمك', emailPlaceholder: 'your@email.com', fullName: 'الاسم بالكامل', email: 'البريد الإلكتروني', phone: 'رقم الهاتف', avatar: 'صورة الملف الشخصي',
      clearAvatar: 'اختر صورة للملف الشخصي'
    }
  };

  const root = document.documentElement;
  const lang = () => root.dataset.language === 'ar' ? 'ar' : 'en';

  function tr(key) { return (I18N[lang()] && I18N[lang()][key]) || I18N.en[key] || key; }

  function applyLanguage() {
    const language = lang();
    page.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (I18N[language][key]) el.textContent = I18N[language][key];
    });

    const fields = [
      ['id_full_name', 'fullName'], ['id_email', 'email'], ['id_phone', 'phone'], ['id_avatar', 'avatar']
    ];
    fields.forEach(([id, key]) => {
      const input = document.getElementById(id);
      if (!input) return;
      const label = page.querySelector(`label[for="${id}"]`);
      if (label) label.textContent = tr(key);
    });

    const title = document.getElementById('previewName');
    const email = document.getElementById('previewEmail');
    const fullName = document.getElementById('id_full_name');
    const emailInput = document.getElementById('id_email');
    if (title && (!fullName || !fullName.value.trim())) title.textContent = tr('yourName');
    if (email && (!emailInput || !emailInput.value.trim())) email.textContent = tr('emailPlaceholder');
    document.title = `${tr('title')} | WhatsFlow`;
  }

  function updatePreview() {
    const fullName = document.getElementById('id_full_name');
    const email = document.getElementById('id_email');
    const namePreview = document.getElementById('previewName');
    const emailPreview = document.getElementById('previewEmail');
    if (namePreview) namePreview.textContent = fullName?.value.trim() || tr('yourName');
    if (emailPreview) emailPreview.textContent = email?.value.trim() || tr('emailPlaceholder');
  }

  const fullName = document.getElementById('id_full_name');
  const email = document.getElementById('id_email');
  [fullName, email].filter(Boolean).forEach(input => input.addEventListener('input', updatePreview));

  const avatarPreviewInput = document.getElementById('avatarPreviewInput');
  const avatarPreview = document.getElementById('avatarPreview');
  if (avatarPreviewInput && avatarPreview) {
    avatarPreviewInput.addEventListener('change', () => {
      const file = avatarPreviewInput.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = e => {
        if (avatarPreview.tagName === 'IMG') avatarPreview.src = e.target.result;
        else {
          const img = document.createElement('img');
          img.id = 'avatarPreview'; img.className = avatarPreview.className; img.alt = tr('avatar'); img.src = e.target.result;
          avatarPreview.replaceWith(img);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  const form = document.getElementById('profileForm');
  const saveBtn = document.getElementById('saveProfileBtn');
  if (form && saveBtn) {
    form.addEventListener('submit', () => {
      if (!form.checkValidity()) return;
      saveBtn.classList.add('is-saving');
      saveBtn.setAttribute('aria-busy', 'true');
    });
  }

  document.addEventListener('whatsflow:languagechange', applyLanguage);
  window.addEventListener('storage', e => {
    if (e.key === 'whatsflow-language') applyLanguage();
  });
  window.addEventListener('pageshow', applyLanguage);

  applyLanguage();
  updatePreview();
})();
