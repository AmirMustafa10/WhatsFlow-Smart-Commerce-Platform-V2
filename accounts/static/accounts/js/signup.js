(() => {
  const page = document.querySelector('[data-signup-page]');
  const form = document.getElementById('merchantSignupForm');
  if (!page || !form) return;

  const translations = {
    en: {
      'showcase.eyebrow':'BUILD YOUR WORKSPACE','showcase.title':'One account.<br><span>One connected business.</span>','showcase.description':'Create your WhatsFlow workspace, tell us what you sell, and prepare the business identity your team and WhatsApp assistant will work from.','showcase.already':'Already have an account?','showcase.signin':'Sign in',
      'progress.label':'Setup progress','summary.eyebrow':'LIVE SUMMARY','summary.businessPlaceholder':'Your business','summary.typePlaceholder':'Business type not selected','summary.ownerPlaceholder':'Owner name will appear here','summary.emailPlaceholder':'Email will appear here','summary.whatsappPlaceholder':'WhatsApp number will appear here',
      'benefit.workspace.title':'Business workspace','benefit.workspace.text':'A dedicated place for your store, team and operations.','benefit.whatsapp.title':'WhatsApp ready','benefit.whatsapp.text':'Connect your business number after registration.','benefit.ai.title':'Knowledge-powered AI','benefit.ai.text':'Your business information can power customer conversations.',
      'header.eyebrow':'CREATE YOUR ACCOUNT','header.title':"Let's set up your business",'header.description':'A few details now will give your WhatsFlow workspace the right starting point.','header.secure':'Secure setup','errors.title':'Please check the form',
      'nav.business':'Business','nav.owner':'Owner','nav.whatsapp':'WhatsApp','nav.security':'Security','section.business.title':'Your business','section.business.subtitle':'Give your workspace its identity.','section.owner.title':'Your details','section.owner.subtitle':'This information identifies your account.','section.whatsapp.title':'WhatsApp connection','section.whatsapp.subtitle':'Tell us which business number you plan to connect.','section.security.title':'Account security','section.security.subtitle':'Protect access to your business workspace.',
      'field.storeName':'Store Name','help.storeName':'This is the name customers and your team will recognize.','field.businessType':'Business Type','help.businessType':'Choose the category that best describes your business.','field.description':'Business Description','help.description':'Describe what your business sells or provides. This can later help shape your business knowledge.','tip.business':'Tip: use a clear description such as “Online fashion store selling modest women\'s clothing and accessories.”','field.fullName':'Full Name','field.email':'Email','help.email':'Use an email you can access for account and business notifications.','tip.owner':'Your account becomes the first owner profile of this business workspace.','field.whatsapp':'WhatsApp Number','help.whatsapp':'Use international format, for example +201001234567.',
      'whatsapp.noteTitle':'Your business number','whatsapp.noteText':'This is the number the WhatsFlow team will use when preparing your WhatsApp connection. It does not connect automatically during signup.','flow.register':'Registration','flow.registerText':'Create your business account','flow.connect':'Connection','flow.connectText':'WhatsFlow team connects your number','flow.activate':'Activation','flow.activateText':'Your workspace is ready to operate',
      'field.password':'Password','field.confirmPassword':'Confirm Password','password.strength.empty':'Enter a password','terms.text':'I agree to the WhatsFlow Terms of Service and Privacy Policy, and I confirm that the information provided is accurate.','activation.title':'What happens after signup?','activation.text':'Your registration is created first. The WhatsFlow platform team will contact you within 24 business hours to connect the WhatsApp number and activate the business workspace.','buttons.back':'Back','buttons.continue':'Continue','buttons.create':'Create Merchant Account <i class="fas fa-arrow-right"></i>','buttons.creating':'Creating account...','success.eyebrow':'REGISTRATION COMPLETE','success.title':'Your business is registered','success.description':'Your account was created successfully. Your business activation will be handled by the WhatsFlow platform team.','success.note':'You are already signed in and can continue to your dashboard.','success.button':'Go to Dashboard'
    },
    ar: {
      'showcase.eyebrow':'أنشئ مساحة عملك','showcase.title':'حساب واحد.<br><span>نشاط تجاري متصل.</span>','showcase.description':'أنشئ مساحة عمل WhatsFlow، عرّفنا بنشاطك التجاري، وجهّز المعلومات الأساسية التي سيعتمد عليها فريقك ومساعد واتساب.','showcase.already':'لديك حساب بالفعل؟','showcase.signin':'تسجيل الدخول',
      'progress.label':'نسبة الإعداد','summary.eyebrow':'ملخص مباشر','summary.businessPlaceholder':'نشاطك التجاري','summary.typePlaceholder':'لم يتم اختيار نوع النشاط','summary.ownerPlaceholder':'سيظهر اسم المالك هنا','summary.emailPlaceholder':'سيظهر البريد الإلكتروني هنا','summary.whatsappPlaceholder':'سيظهر رقم واتساب هنا',
      'benefit.workspace.title':'مساحة عمل للنشاط','benefit.workspace.text':'مكان مخصص لمتجرك وفريقك وعملياتك.','benefit.whatsapp.title':'جاهز لواتساب','benefit.whatsapp.text':'اربط رقم نشاطك التجاري بعد التسجيل.','benefit.ai.title':'ذكاء اصطناعي يعتمد على المعرفة','benefit.ai.text':'يمكن لمعلومات نشاطك التجاري أن تدعم محادثات العملاء.',
      'header.eyebrow':'إنشاء حسابك','header.title':'لنجهز نشاطك التجاري','header.description':'بضع معلومات الآن ستمنح مساحة عمل WhatsFlow نقطة بداية مناسبة.','header.secure':'إعداد آمن','errors.title':'يرجى مراجعة البيانات',
      'nav.business':'النشاط','nav.owner':'المالك','nav.whatsapp':'واتساب','nav.security':'الأمان','section.business.title':'نشاطك التجاري','section.business.subtitle':'امنح مساحة عملك هويتها.','section.owner.title':'بياناتك','section.owner.subtitle':'هذه المعلومات تحدد حسابك.','section.whatsapp.title':'اتصال واتساب','section.whatsapp.subtitle':'أدخل رقم النشاط الذي تخطط لربطه.','section.security.title':'أمان الحساب','section.security.subtitle':'احمِ الوصول إلى مساحة عمل نشاطك.',
      'field.storeName':'اسم المتجر','help.storeName':'هذا هو الاسم الذي سيتعرف عليه العملاء وفريقك.','field.businessType':'نوع النشاط','help.businessType':'اختر الفئة التي تصف نشاطك بشكل أفضل.','field.description':'وصف النشاط التجاري','help.description':'صف ما يبيعه نشاطك أو الخدمات التي يقدمها. ويمكن استخدامه لاحقًا ضمن معرفة نشاطك التجاري.','tip.business':'نصيحة: استخدم وصفًا واضحًا مثل «متجر أزياء أونلاين يبيع الملابس النسائية المحتشمة والإكسسوارات».','field.fullName':'الاسم بالكامل','field.email':'البريد الإلكتروني','help.email':'استخدم بريدًا يمكنك الوصول إليه لاستقبال إشعارات الحساب والنشاط.','tip.owner':'سيصبح حسابك أول ملف مالك لمساحة عمل هذا النشاط.','field.whatsapp':'رقم واتساب','help.whatsapp':'استخدم الصيغة الدولية، مثال: +201001234567.',
      'whatsapp.noteTitle':'رقم نشاطك التجاري','whatsapp.noteText':'سيستخدم فريق WhatsFlow هذا الرقم عند تجهيز اتصال واتساب. لن يتم الاتصال تلقائيًا أثناء التسجيل.','flow.register':'التسجيل','flow.registerText':'إنشاء حساب النشاط','flow.connect':'الاتصال','flow.connectText':'فريق WhatsFlow يربط الرقم','flow.activate':'التفعيل','flow.activateText':'مساحة العمل تصبح جاهزة',
      'field.password':'كلمة المرور','field.confirmPassword':'تأكيد كلمة المرور','password.strength.empty':'أدخل كلمة المرور','terms.text':'أوافق على شروط استخدام WhatsFlow وسياسة الخصوصية، وأؤكد أن البيانات التي قدمتها صحيحة.','activation.title':'ماذا يحدث بعد التسجيل؟','activation.text':'يتم إنشاء التسجيل أولًا، ثم سيتواصل معك فريق WhatsFlow خلال 24 ساعة عمل لربط رقم واتساب وتفعيل مساحة عمل نشاطك.','buttons.back':'رجوع','buttons.continue':'متابعة','buttons.create':'إنشاء حساب النشاط <i class="fas fa-arrow-left"></i>','buttons.creating':'جاري إنشاء الحساب...','success.eyebrow':'اكتمل التسجيل','success.title':'تم تسجيل نشاطك التجاري','success.description':'تم إنشاء حسابك بنجاح، وسيتم التعامل مع تفعيل نشاطك التجاري بواسطة فريق WhatsFlow.','success.note':'أنت مسجل الدخول بالفعل ويمكنك الانتقال إلى لوحة التحكم.','success.button':'الانتقال إلى لوحة التحكم'
    }
  };

  const getLang = () => document.documentElement.lang?.toLowerCase().startsWith('ar') || document.documentElement.dir === 'rtl' ? 'ar' : 'en';
  let lang = getLang();
  const t = key => translations[lang]?.[key] || translations.en[key] || key;
  const setText = (el,key) => { if (!el) return; const value=t(key); if (value.includes('<')) el.innerHTML=value; else el.textContent=value; };
  const applyLanguage = () => { lang=getLang(); page.querySelectorAll('[data-i18n]').forEach(el=>setText(el,el.dataset.i18n)); };

  const sections=[...form.querySelectorAll('[data-section]')];
  const tabs=[...form.querySelectorAll('[data-section-tab]')];
  const next=form.querySelector('[data-next-section]');
  const prev=form.querySelector('[data-prev-section]');
  const progressBar=page.querySelector('[data-progress-bar]');
  const progressPercent=page.querySelector('[data-progress-percent]');
  const stepLabel=page.querySelector('[data-step-label]');
  let current=1;

  const field = name => form.querySelector(`[name="${name}"]`) || form.querySelector(`#id_${name}`);
  const val = name => (field(name)?.value || '').trim();

  const updateProgress=()=>{
    const percent=Math.round((current/4)*100);
    if(progressBar) progressBar.style.width=`${percent}%`;
    if(progressPercent) progressPercent.textContent=`${percent}%`;
    if(stepLabel) stepLabel.textContent=`0${current} / 04`;
    sections.forEach(s=>s.classList.toggle('is-active',Number(s.dataset.section)===current));
    tabs.forEach(tab=>{const active=Number(tab.dataset.sectionTab)===current;tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',active?'true':'false');});
    if(prev) prev.style.visibility=current===1?'hidden':'visible';
    if(next) next.querySelector('span').textContent=t('buttons.continue');
    updateSummary();
  };

  const updateSummary=()=>{
    const name=val('store_name'), type=val('business_type'), owner=val('full_name'), email=val('email'), wa=val('whatsapp_number');
    const nameEl=page.querySelector('[data-summary-name]'); if(nameEl) nameEl.textContent=name || t('summary.businessPlaceholder');
    const typeEl=page.querySelector('[data-summary-type]'); if(typeEl){ const selected=field('business_type')?.selectedOptions?.[0]?.textContent?.trim(); typeEl.textContent=selected && selected!==type ? selected : type || t('summary.typePlaceholder'); }
    const ownerEl=page.querySelector('[data-summary-owner]'); if(ownerEl) ownerEl.textContent=owner || t('summary.ownerPlaceholder');
    const emailEl=page.querySelector('[data-summary-email]'); if(emailEl) emailEl.textContent=email || t('summary.emailPlaceholder');
    const waEl=page.querySelector('[data-summary-whatsapp]'); if(waEl) waEl.textContent=wa || t('summary.whatsappPlaceholder');
    const avatar=page.querySelector('[data-summary-avatar]'); if(avatar) avatar.textContent=(name||'W').charAt(0).toUpperCase();
    const storeCount=page.querySelector('[data-store-count]'); if(storeCount) storeCount.textContent=`${name.length}/80`;
    const descCount=page.querySelector('[data-description-count]'); if(descCount){const d=val('business_description');descCount.textContent=`${d.length}/500`;}
  };

  const requiredForSection={1:['store_name','business_type','business_description'],2:['full_name','email'],3:['whatsapp_number'],4:['password','confirm_password','accept_terms']};
  const showFieldError=el=>{el?.classList.add('signup-client-error');setTimeout(()=>el?.classList.remove('signup-client-error'),1400)};
  const validateSection=(number)=>{
    let ok=true;
    requiredForSection[number].forEach(name=>{
      const el=field(name); if(!el) return;
      const empty=(el.type==='checkbox')?!el.checked:!el.value.trim();
      if(empty){ok=false;showFieldError(el);}
    });
    if(number===2){const email=field('email');if(email?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){ok=false;showFieldError(email)}}
    if(number===4){const p=val('password'),c=val('confirm_password');if(p&&c&&p!==c){ok=false;showFieldError(field('confirm_password'));}}
    return ok;
  };

  const updatePassword=()=>{
    const p=val('password'), meter=page.querySelector('[data-password-strength]'), label=page.querySelector('[data-password-strength-label]');
    if(!meter||!label) return;
    meter.className='signup-password-strength';
    if(!p){label.textContent=t('password.strength.empty');return;}
    let score=0;if(p.length>=8)score++;if(/[A-Z]/.test(p)&&/[a-z]/.test(p))score++;if(/\d/.test(p))score++;if(/[^A-Za-z0-9]/.test(p))score++;meter.classList.add(`level-${score}`);
    label.textContent=score<=1?(lang==='ar'?'ضعيفة':'Weak'):score===2?(lang==='ar'?'متوسطة':'Fair'):score===3?(lang==='ar'?'جيدة':'Good'):(lang==='ar'?'قوية':'Strong');
  };
  const updateMatch=()=>{const p=val('password'),c=val('confirm_password'),el=page.querySelector('[data-password-match]');if(!el)return;if(!c){el.textContent='';el.className='signup-match';return}if(p===c){el.textContent=lang==='ar'?'كلمتا المرور متطابقتان':'Passwords match';el.className='signup-match ok'}else{el.textContent=lang==='ar'?'كلمتا المرور غير متطابقتين':'Passwords do not match';el.className='signup-match bad'}};

  const goTo=n=>{current=Math.min(4,Math.max(1,n));updateProgress();page.querySelector('.signup-form-panel')?.scrollIntoView({behavior:'smooth',block:'start'});};
  tabs.forEach(tab=>tab.addEventListener('click',()=>{const target=Number(tab.dataset.sectionTab);if(target<=current||validateSection(current))goTo(target)}));
  next?.addEventListener('click',()=>{if(validateSection(current))goTo(current+1)});
  prev?.addEventListener('click',()=>goTo(current-1));

  form.querySelectorAll('input,select,textarea').forEach(el=>el.addEventListener('input',()=>{updateSummary();updatePassword();updateMatch();}));
  form.querySelectorAll('select').forEach(el=>el.addEventListener('change',updateSummary));
  form.querySelectorAll('[data-password-toggle]').forEach(btn=>btn.addEventListener('click',()=>{const input=document.getElementById(btn.dataset.target);if(!input)return;const visible=input.type==='text';input.type=visible?'password':'text';btn.innerHTML=`<i class="fas fa-${visible?'eye':'eye-slash'}"></i>`;btn.setAttribute('aria-label',visible?'Show password':'Hide password')}));

  form.addEventListener('submit',e=>{for(let i=1;i<=4;i++){if(!validateSection(i)){e.preventDefault();goTo(i);return}}const submit=form.querySelector('#signupSubmitBtn');submit?.classList.add('is-loading');submit?.setAttribute('disabled','disabled')});

  const observer=new MutationObserver(()=>{applyLanguage();updateProgress();updatePassword();updateMatch()});
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
  page.querySelectorAll('input,select,textarea').forEach(el=>el.classList.add('signup-enhanced-field'));
  const style=document.createElement('style');style.textContent='.signup-client-error{border-color:#dc2626!important;box-shadow:0 0 0 4px rgba(220,38,38,.08)!important;animation:sgShake .22s linear 2}@keyframes sgShake{25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}';document.head.appendChild(style);
  applyLanguage();updateProgress();updateSummary();updatePassword();updateMatch();
})();
