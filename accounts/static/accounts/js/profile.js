(() => {
"use strict";
const root=document.querySelector(".profile-page");
if(!root)return;

const T={
en:{back:"Back to team",team_profile:"TEAM PROFILE",intro:"Account identity, role information, and performance insights.",edit:"Edit profile",owner:"Business owner",active:"Active",inactive:"Inactive",store:"Store",no_store:"No store assigned",joined:"Joined",workspace_access:"Workspace access",shipper_perf:"SHIPPER PERFORMANCE",delivery_overview:"Delivery overview",shipper_metrics:"Operational metrics for this shipper.",assigned:"Assigned orders",total_assigned:"Total assigned",delivered:"Delivered",successfully:"Successfully delivered",pending:"Pending",in_progress:"Still in progress",success_rate:"Success rate",delivery_success:"Delivery success",failed:"Failed",failed_attempts:"Failed attempts",cash:"Cash collected",cod:"COD collected",avg_delivery:"Avg. delivery",avg_time:"Average time",manager_perf:"MANAGER PERFORMANCE",operations:"Operations overview",manager_metrics:"Order and team-management activity.",reviewed:"Orders reviewed",reviewed_by:"Reviewed by manager",confirmed:"Confirmed",orders_confirmed:"Orders confirmed",rejected:"Rejected",orders_rejected:"Orders rejected",assigned_short:"Assigned",to_shippers:"Assigned to shippers",awaiting:"Still awaiting action",team_members:"Team members",managed:"Managed workspace",support_perf:"SUPPORT PERFORMANCE",support_overview:"Customer support overview",support_metrics:"Conversation and resolution activity.",conversations:"Conversations",handled:"Handled conversations",resolved:"Resolved",resolved_cases:"Resolved cases",open:"Open conversations",resolution:"Resolution rate",resolved_handled:"Resolved / handled",escalated:"Escalated",management:"Sent to management",avg_response:"Avg. response",response_time:"Average response time",accounting_perf:"ACCOUNTING PERFORMANCE",financial:"Financial operations",accounting_metrics:"Financial review and collection activity.",financially_reviewed:"Financially reviewed",recorded:"Recorded collections",paid:"Paid orders",marked_paid:"Marked as paid",unpaid:"Unpaid orders",awaiting_payment:"Awaiting payment",refunds:"Refunds",processed:"Processed refunds",business_overview:"BUSINESS OVERVIEW",workspace_snapshot:"Workspace snapshot",owner_metrics:"Business-level information for the store owner.",orders:"Orders",total_orders:"Total orders",revenue:"Revenue",business_revenue:"Business revenue",customers:"Customers",customers_served:"Customers served",team:"Team",pending_orders:"Pending orders",needs_attention:"Needs attention",activity_trend:"ACTIVITY TREND",activity_over_time:"Activity over time",period_description:"Recent activity across the selected period.",last_7:"Last 7 days",recent_activity:"RECENT ACTIVITY",latest_actions:"Latest actions",activity_description:"Recent activity associated with this account.",no_activity:"No recent activity",activity_appears:"Activity will appear here as this member works.",work_history:"WORK HISTORY",recent_deliveries:"Recent deliveries",delivery_history:"The latest orders handled by this shipper.",view_all:"View all",no_deliveries:"No recent deliveries",deliveries_appear:"Orders handled by this shipper will appear here.",account:"ACCOUNT",account_info:"Account information",identity_details:"Identity and workspace details.",full_name:"Full name",email:"Email address",role:"Role",status:"Status",performance:"PERFORMANCE",overall_score:"Overall score",score_description:"Based on available role metrics.",manage_profile:"Manage your profile",keep_updated:"Keep your account information up to date.",chart_activity:"Activity",chart_completed:"Completed"},
ar:{back:"العودة إلى الفريق",team_profile:"ملف الفريق",intro:"هوية الحساب والدور ومؤشرات الأداء.",edit:"تعديل الملف الشخصي",owner:"مالك النشاط التجاري",active:"نشط",inactive:"غير نشط",store:"المتجر",no_store:"لا يوجد متجر مرتبط",joined:"انضم في",workspace_access:"صلاحيات مساحة العمل",shipper_perf:"أداء المندوب",delivery_overview:"نظرة عامة على التوصيل",shipper_metrics:"مؤشرات التشغيل الخاصة بهذا المندوب.",assigned:"الطلبات المسندة",total_assigned:"إجمالي الطلبات المسندة",delivered:"تم التوصيل",successfully:"تم توصيلها بنجاح",pending:"معلقة",in_progress:"ما زالت قيد التنفيذ",success_rate:"معدل النجاح",delivery_success:"نجاح التوصيل",failed:"فشلت",failed_attempts:"محاولات فاشلة",cash:"المبالغ المحصلة",cod:"تحصيل الدفع عند الاستلام",avg_delivery:"متوسط التوصيل",avg_time:"متوسط الوقت",manager_perf:"أداء المدير",operations:"نظرة عامة على العمليات",manager_metrics:"نشاط إدارة الطلبات والفريق.",reviewed:"الطلبات التي تمت مراجعتها",reviewed_by:"تمت مراجعتها بواسطة المدير",confirmed:"مؤكدة",orders_confirmed:"الطلبات المؤكدة",rejected:"مرفوضة",orders_rejected:"الطلبات المرفوضة",assigned_short:"مسندة",to_shippers:"تم إسنادها للمندوبين",awaiting:"في انتظار إجراء",team_members:"أعضاء الفريق",managed:"مساحة العمل المُدارة",support_perf:"أداء الدعم",support_overview:"نظرة عامة على دعم العملاء",support_metrics:"نشاط المحادثات وحل المشكلات.",conversations:"المحادثات",handled:"المحادثات التي تم التعامل معها",resolved:"تم حلها",resolved_cases:"الحالات التي تم حلها",open:"المحادثات المفتوحة",resolution:"معدل الحل",resolved_handled:"تم حلها / تم التعامل معها",escalated:"تم تصعيدها",management:"تم إرسالها للإدارة",avg_response:"متوسط الرد",response_time:"متوسط وقت الرد",accounting_perf:"أداء المحاسبة",financial:"العمليات المالية",accounting_metrics:"نشاط المراجعة والتحصيل المالي.",financially_reviewed:"تمت مراجعتها ماليًا",recorded:"التحصيلات المسجلة",paid:"الطلبات المدفوعة",marked_paid:"تم تعليمها كمدفوعة",unpaid:"الطلبات غير المدفوعة",awaiting_payment:"في انتظار الدفع",refunds:"المبالغ المستردة",processed:"المبالغ المستردة التي تمت معالجتها",business_overview:"نظرة عامة على النشاط التجاري",workspace_snapshot:"ملخص مساحة العمل",owner_metrics:"معلومات النشاط التجاري الخاصة بالمالك.",orders:"الطلبات",total_orders:"إجمالي الطلبات",revenue:"الإيرادات",business_revenue:"إيرادات النشاط التجاري",customers:"العملاء",customers_served:"العملاء الذين تم خدمتهم",team:"الفريق",pending_orders:"الطلبات المعلقة",needs_attention:"تحتاج إلى متابعة",activity_trend:"اتجاه النشاط",activity_over_time:"النشاط عبر الوقت",period_description:"النشاط الأخير خلال الفترة المحددة.",last_7:"آخر 7 أيام",recent_activity:"النشاط الأخير",latest_actions:"أحدث الإجراءات",activity_description:"أحدث الأنشطة المرتبطة بهذا الحساب.",no_activity:"لا يوجد نشاط حديث",activity_appears:"سيظهر النشاط هنا مع عمل هذا العضو.",work_history:"سجل العمل",recent_deliveries:"أحدث عمليات التوصيل",delivery_history:"أحدث الطلبات التي تعامل معها هذا المندوب.",view_all:"عرض الكل",no_deliveries:"لا توجد عمليات توصيل حديثة",deliveries_appear:"ستظهر هنا الطلبات التي تعامل معها هذا المندوب.",account:"الحساب",account_info:"معلومات الحساب",identity_details:"تفاصيل الهوية ومساحة العمل.",full_name:"الاسم بالكامل",email:"البريد الإلكتروني",role:"الدور",status:"الحالة",performance:"الأداء",overall_score:"التقييم الإجمالي",score_description:"بناءً على مؤشرات الدور المتاحة.",manage_profile:"إدارة ملفك الشخصي",keep_updated:"حافظ على تحديث بيانات حسابك.",chart_activity:"النشاط",chart_completed:"المكتمل"}};

const roles={en:{OWNER:"Business owner",MANAGER:"Manager",SHIPPER:"Shipper",SUPPORT:"Support",ACCOUNTANT:"Accountant"},ar:{OWNER:"مالك النشاط التجاري",MANAGER:"مدير",SHIPPER:"مندوب توصيل",SUPPORT:"دعم العملاء",ACCOUNTANT:"محاسب"}};
let chart,lastLang;

const lang=()=>String(document.documentElement.lang||localStorage.getItem("whatsflow-language")||"en").toLowerCase().startsWith("ar")?"ar":"en";
const t=k=>T[lang()][k]||T.en[k]||k;

function dateOf(v){const d=new Date(v);return Number.isNaN(d.getTime())?null:d}
function fmt(d,withTime=false){return new Intl.DateTimeFormat(lang()==="ar"?"ar-EG":"en-US",withTime?{year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}:{year:"numeric",month:"short",day:"numeric"}).format(d)}

function translate(){
 root.querySelectorAll("[data-i18n]").forEach(e=>{const k=e.dataset.i18n;if(T[lang()][k])e.textContent=T[lang()][k]});
 const role=root.dataset.role||"";
 root.querySelectorAll(".js-role").forEach(e=>e.textContent=roles[lang()][role]||role);
 const access=root.querySelector(".js-access");
 if(access)access.textContent=role==="OWNER"?t("workspace_access")+" — "+t("owner"):((roles[lang()][role]||role)+" "+(lang()==="ar"?"صلاحيات":"access"));
 root.querySelectorAll(".js-date").forEach(e=>{const d=dateOf(e.getAttribute("datetime"));if(d)e.textContent=fmt(d)});
 root.querySelectorAll(".js-date-time").forEach(e=>{const d=dateOf(e.getAttribute("datetime"));if(d)e.textContent=fmt(d,true)});
}

function chartOptions(){
 const el=document.getElementById("profile-chart-data");
 let d={};try{d=el?JSON.parse(el.textContent||"{}"):{} }catch{}
 const dark=document.documentElement.dataset.theme==="dark"||document.documentElement.classList.contains("dark");
 const rtl=lang()==="ar", grid=dark?"rgba(255,255,255,.08)":"rgba(15,23,42,.08)", text=dark?"#94a3b8":"#64748b";
 const datasets=[{label:d.label||t("chart_activity"),data:d.values||[0,0,0,0,0,0,0],borderColor:"#25D366",backgroundColor:"rgba(37,211,102,.12)",fill:true,tension:.38,borderWidth:3,pointRadius:3,pointHoverRadius:6}];
 if(Array.isArray(d.secondary))datasets.push({label:d.secondary_label||t("chart_completed"),data:d.secondary,borderColor:"#168A70",backgroundColor:"transparent",fill:false,tension:.38,borderWidth:2,pointRadius:2});
 return {type:"line",data:{labels:d.labels||["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],datasets},options:{responsive:true,maintainAspectRatio:false,interaction:{intersect:false,mode:"index"},plugins:{legend:{display:datasets.length>1,rtl,textDirection:rtl?"rtl":"ltr",labels:{color:text,usePointStyle:true,boxWidth:8}},tooltip:{rtl,textDirection:rtl?"rtl":"ltr",backgroundColor:dark?"#0f172a":"#fff",titleColor:dark?"#f8fafc":"#0f172a",bodyColor:text,borderColor:grid,borderWidth:1}},scales:{x:{reverse:rtl,grid:{display:false},ticks:{color:text}},y:{beginAtZero:true,grid:{color:grid},border:{display:false},ticks:{color:text,precision:0}}}}};
}

function renderChart(){
 if(typeof Chart==="undefined")return;
 const el=document.getElementById("profileActivityChart");if(!el)return;
 if(chart)chart.destroy();
 chart=new Chart(el,chartOptions());
}

function sync(){translate();renderChart();lastLang=lang()}
function boot(){
 sync();
 document.addEventListener("whatsflow:languagechange",sync);
 document.addEventListener("whatsflow:themechange",renderChart);
 window.addEventListener("storage",e=>{if(e.key==="whatsflow-language"||e.key==="whatsflow-theme")sync()});
 window.addEventListener("pageshow",sync);
 new MutationObserver(()=>{if(lang()!==lastLang)sync()}).observe(document.documentElement,{attributes:true,attributeFilter:["lang","dir","data-theme","class"]});
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();
})();