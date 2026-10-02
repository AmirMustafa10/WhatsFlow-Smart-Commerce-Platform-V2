(() => {
  'use strict';

  const page = document.querySelector('[data-page="password-change"]');
  if (!page) return;

  const I18N = {
    en: {
      back:'Back to My Profile', eyebrow:'SECURITY', title:'Change your password', subtitle:'Protect your WhatsFlow account with a strong, unique password.',
      security:'ACCOUNT SECURITY', secureTitle:'Keep your account protected.', secureText:'A strong password helps keep your business workspace and account information private.',
      rule1:'Use at least 8 characters.', rule2:'Mix letters, numbers, and symbols.', rule3:'Avoid passwords you use elsewhere.', tip:'Never share your password with another team member.',
      formTitle:'Update password', formSubtitle:'Enter your current password, then choose a new one.', encrypted:'Private', strength:'Password strength', strengthHint:'Start typing a new password to check its strength.', cancel:'Cancel', update:'Update password', updating:'Updating…',
      show:'Show', hide:'Hide', weak:'Weak', fair:'Fair', good:'Good', strong:'Strong',
      currentPassword:'Current password', newPassword:'New password', confirmPassword:'Confirm new password'
    },
    ar: {
      back:'العودة إلى حسابي', eyebrow:'الأمان', title:'تغيير كلمة المرور', subtitle:'احمِ حساب WhatsFlow بكلمة مرور قوية وفريدة.',
      security:'أمان الحساب', secureTitle:'حافظ على حماية حسابك.', secureText:'كلمة المرور القوية تساعد في حماية مساحة عمل البيزنس وبيانات حسابك.',
      rule1:'استخدم 8 أحرف على الأقل.', rule2:'اخلط بين الحروف والأرقام والرموز.', rule3:'تجنب استخدام كلمة مرور تستخدمها في أماكن أخرى.', tip:'لا تشارك كلمة المرور مع أي عضو آخر في الفريق.',
      formTitle:'تحديث كلمة المرور', formSubtitle:'اكتب كلمة المرور الحالية ثم اختر كلمة مرور جديدة.', encrypted:'خاص وآمن', strength:'قوة كلمة المرور', strengthHint:'ابدأ بكتابة كلمة المرور الجديدة لمعرفة قوتها.', cancel:'إلغاء', update:'تحديث كلمة المرور', updating:'جارٍ التحديث…',
      show:'إظهار', hide:'إخفاء', weak:'ضعيفة', fair:'متوسطة', good:'جيدة', strong:'قوية',
      currentPassword:'كلمة المرور الحالية', newPassword:'كلمة المرور الجديدة', confirmPassword:'تأكيد كلمة المرور الجديدة'
    }
  };

  const root = document.documentElement;
  const lang = () => root.dataset.language === 'ar' ? 'ar' : 'en';
  const tr = key => I18N[lang()][key] || I18N.en[key] || key;

  function applyLanguage() {
    const language = lang();
    page.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (I18N[language][key]) el.textContent = I18N[language][key];
    });

    const fields = [
      ['id_old_password','currentPassword'], ['id_new_password1','newPassword'], ['id_new_password2','confirmPassword']
    ];
    fields.forEach(([id,key]) => {
      const input = document.getElementById(id);
      if (!input) return;
      const label = page.querySelector(`label[for="${id}"]`);
      if (label) label.textContent = tr(key);
    });

    document.querySelectorAll('.toggle-password').forEach(button => {
      const input = document.getElementById(button.dataset.target);
      button.textContent = input?.type === 'text' ? tr('hide') : tr('show');
      button.setAttribute('aria-label', button.textContent);
    });

    document.title = `${tr('title')} | WhatsFlow`;
    updateStrength();
  }

  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.target);
      if (!input) return;
      input.type = input.type === 'text' ? 'password' : 'text';
      button.textContent = input.type === 'text' ? tr('hide') : tr('show');
    });
  });

  const form = document.getElementById('passwordForm');
  const submit = document.getElementById('passwordSubmit');
  const newPassword = document.getElementById('id_new_password1');
  const strengthBox = page.querySelector('.strength-box');
  const label = document.getElementById('strengthLabel');
  const hint = document.getElementById('strengthHint');

  function scorePassword(value) {
    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return Math.min(4, score);
  }

  function updateStrength() {
    const score = scorePassword(newPassword?.value || '');
    if (strengthBox) strengthBox.dataset.level = score;
    const labels = ['—', tr('weak'), tr('fair'), tr('good'), tr('strong')];
    const hints = [tr('strengthHint'), tr('rule2'), tr('rule2'), tr('rule1'), tr('strong') + '.'];
    if (label) label.textContent = labels[score];
    if (hint) hint.textContent = hints[score];
  }

  newPassword?.addEventListener('input', updateStrength);

  if (form && submit) {
    form.addEventListener('submit', () => {
      if (!form.checkValidity()) return;
      submit.classList.add('is-saving');
      submit.setAttribute('aria-busy', 'true');
    });
  }

  document.addEventListener('whatsflow:languagechange', applyLanguage);
  window.addEventListener('storage', e => { if (e.key === 'whatsflow-language') applyLanguage(); });
  window.addEventListener('pageshow', applyLanguage);
  applyLanguage();
})();
