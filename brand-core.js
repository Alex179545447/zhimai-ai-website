/* ============================================================
   智脉系·品牌统一数据与文案口径出口（Single Source of Truth）
   官网(zhimai-ai.cn) / 登录页(/login-db) / 各产品引用此文件
   数字口径变更只改这里，全站自动同步
   ============================================================ */
window.BRAND_CORE = {
  version: '2026.10.01',
  /* 统一统计口径（真实基数，所有页面从这里读） */
  stats: {
    aiSpeed:    { value: 8,    suffix: 's',  label: '单份简历AI分析' },
    matchRate:  { value: 70,   suffix: '%',  label: '高匹配率（≥80分）' },
    resumeTotal:{ value: 5000, suffix: '',   label: '简历处理总量', grow: true, growEvery: 14000 },
    jobs:       { value: 40,   suffix: '',   label: '标准岗位覆盖', grow: true, growEvery: 38000 },
    fields:     { value: 58,   suffix: ' 项', label: '标准化解析字段' },
    source:     { value: '教育部', suffix: '', label: '专业目录官方数据源' }
  },
  /* 品牌VI色板（黑金体系） */
  vi: {
    bg: '#0A0A0C', bgSoft: '#111014',
    gold: '#D4AF37', goldLight: '#F5D061', goldDeep: '#B8860B', goldText: '#E8C877',
    orange: '#E8590C', coral: '#FF7A59',
    text: '#F5EFE6', text2: '#B0A88E', text3: '#8D8470',
    glassBg: 'rgba(255,255,255,.045)', glassBorder: 'rgba(212,175,55,.22)'
  },
  /* 品牌文案口径 */
  copy: {
    brandName: '职觉AI',
    brandEn: 'ZHIJUE AI · 智能人才库',
    heroLine1: '让每一份简历',
    heroLine2: '可检索的人才资产',
    slogan: '智能人才招聘工具 · AI 智能简历库',
    sloganHH: 'AI 驱动的猎头效率工具 · 智能简历库',
    trustLine: '数据独立加密存储，仅你可见——权限归你'
  },
  /* 数字增长模拟（仅视觉呈现，基数不写回） */
  growEngine: function (el) {
    var v = parseInt(el.getAttribute('data-cv') || '0', 10);
    var suf = el.getAttribute('data-cs') || '';
    el.classList.add('grow-pulse');
    setTimeout(function () { el.classList.remove('grow-pulse'); }, 480);
    el.textContent = (v + 1) + suf;
    el.setAttribute('data-cv', v + 1);
  }
};
