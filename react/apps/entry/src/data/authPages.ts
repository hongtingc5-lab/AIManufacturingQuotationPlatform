import { marketingOrigin, marketingUrl } from '../config/origins'

export type Locale = 'zh' | 'en'

export type VisualStat = {
  label: string
  description: string
}

export type AuthVisual = {
  ariaLabel: string
  eyebrowIcon: string
  eyebrow: string
  title: string
  description: string
  stats: readonly VisualStat[]
}

export type AuthPageKind = 'login' | 'register' | 'forgot'

export type PortalId = 'customer' | 'admin' | 'mes' | 'supplier'

export type AuthPageConfig = {
  id: string
  kind: AuthPageKind
  portal: PortalId
  title: string
  visual: AuthVisual
  headTitle: string
  headSubtitle: string
  switchText?: string
  switchHref?: string
  wide?: boolean
  redirectTarget?: string
  submitLabel: string
  showTabs?: boolean
  showSocial?: boolean
  showGuestStrip?: boolean
  guestStrip?: { title: string; body: string }
  showRemember?: boolean
  showTerms?: boolean
  termsText?: string
  footerLinks: Array<{ label: string; href: string; external?: boolean }>
  portalNote?: { title: string; items: string[] }
  registerFields?: 'customer' | 'portal'
}

type LocalizedCopy = Record<Locale, AuthPageConfig>

export function localePathPrefix(locale: Locale, path: string): string {
  return locale === 'en' ? `/en${path === '/' ? '' : path}` : path
}

export function getAuthPage(id: string, locale: Locale): AuthPageConfig | undefined {
  const entry = authPages[id]
  if (!entry) return undefined
  const config = entry[locale]
  return {
    ...config,
    switchHref: config.switchHref ? localePathPrefix(locale, config.switchHref) : undefined,
    footerLinks: config.footerLinks.map((link) => {
      if (link.external && (link.href === marketingOrigin || link.href.startsWith(marketingOrigin))) {
        return { ...link, href: marketingUrl('/', locale) }
      }
      return {
        ...link,
        href: link.external ? link.href : localePathPrefix(locale, link.href),
      }
    }),
  }
}

export const authPages: Record<string, LocalizedCopy> = {
  'customer-login': {
    zh: {
      id: 'customer-login',
      kind: 'login',
      portal: 'customer',
      title: '客户登录 | AgileMakeAI',
      visual: {
        ariaLabel: 'AgileMakeAI 制造协同入口',
        eyebrowIcon: 'precision_manufacturing',
        eyebrow: 'Customer Workspace',
        title: '登录客户工作台',
        description:
          '查看报价、订单、模型、交付与工程协作信息，快速回到正在处理的询价和项目进度。',
        stats: [
          { label: 'RFQ', description: '报价与询价协同' },
          { label: 'DFM', description: '模型解析与制造评估' },
          { label: 'MES', description: '订单进度与交付追踪' },
        ],
      },
      headTitle: '账户登录',
      headSubtitle: '选择账号密码或手机号验证码登录客户工作台。',
      switchText: '没有账号？',
      switchHref: '/register',
      submitLabel: '登录工作台',
      showTabs: true,
      showSocial: true,
      showRemember: true,
      showGuestStrip: true,
      guestStrip: {
        title: '访客体验',
        body: '可先浏览样例工作台与报价流程；保存报价、追加模型和提交订单时需要登录或注册。',
      },
      footerLinks: [
        { label: '返回首页', href: marketingOrigin, external: true },
        { label: '服务条款', href: '#' },
        { label: '隐私政策', href: '#' },
      ],
    },
    en: {
      id: 'customer-login',
      kind: 'login',
      portal: 'customer',
      title: 'Customer Login | AgileMakeAI',
      visual: {
        ariaLabel: 'AgileMakeAI customer workspace entry',
        eyebrowIcon: 'precision_manufacturing',
        eyebrow: 'Customer Workspace',
        title: 'Log in to the customer workspace',
        description:
          'Review quotes, orders, models, delivery progress, and engineering collaboration, then return quickly to active RFQs and project updates.',
        stats: [
          { label: 'RFQ', description: 'Quote and inquiry collaboration' },
          { label: 'DFM', description: 'Model parsing and manufacturability review' },
          { label: 'MES', description: 'Order progress and delivery tracking' },
        ],
      },
      headTitle: 'Account Login',
      headSubtitle: 'Choose password login or SMS verification to enter the customer workspace.',
      switchText: 'No account?',
      switchHref: '/register',
      submitLabel: 'Log In to Workspace',
      showTabs: true,
      showSocial: true,
      showRemember: true,
      showGuestStrip: true,
      guestStrip: {
        title: 'Guest preview',
        body: 'You can browse sample workspace and quoting flows first. Saving quotes, adding models, or submitting orders requires login or registration.',
      },
      footerLinks: [
        { label: 'Back to Home', href: marketingOrigin, external: true },
        { label: 'Terms of Service', href: '#' },
        { label: 'Privacy Policy', href: '#' },
      ],
    },
  },
  'customer-register': {
    zh: {
      id: 'customer-register',
      kind: 'register',
      portal: 'customer',
      title: '客户注册 | AgileMakeAI',
      wide: true,
      visual: {
        ariaLabel: 'AgileMakeAI 客户注册入口',
        eyebrowIcon: 'domain_add',
        eyebrow: 'Customer Onboarding',
        title: '创建客户账号',
        description:
          '以手机号作为主身份入口，后续可绑定企业邮箱、Google / Gmail、LinkedIn、Facebook 和微信，保持报价与订单资料可追溯。',
        stats: [
          { label: '手机', description: '主账号与短信验证' },
          { label: '企业', description: '公司与联系人资料' },
          { label: '绑定', description: '邮箱与第三方账号' },
        ],
      },
      headTitle: '客户注册',
      headSubtitle: '完成基础资料后即可进入客户工作台，继续上传模型和管理报价。',
      switchText: '已有账号？',
      switchHref: '/login',
      submitLabel: '创建客户账号',
      showSocial: true,
      showTerms: true,
      termsText: '我已阅读并同意 服务条款 与 隐私政策，并了解第三方注册首次使用时仍需绑定手机号完成验证。',
      registerFields: 'customer',
      guestStrip: {
        title: '暂不注册？',
        body: '可返回营销首页了解服务能力；正式保存报价、查看订单和提交付款时需要客户账号。',
      },
      showGuestStrip: true,
      footerLinks: [
        { label: '返回首页', href: marketingOrigin, external: true },
        { label: '帮助中心', href: '#' },
        { label: '隐私政策', href: '#' },
      ],
    },
    en: {
      id: 'customer-register',
      kind: 'register',
      portal: 'customer',
      title: 'Customer Register | AgileMakeAI',
      wide: true,
      visual: {
        ariaLabel: 'AgileMakeAI customer registration',
        eyebrowIcon: 'domain_add',
        eyebrow: 'Customer Onboarding',
        title: 'Create a customer account',
        description:
          'Use your phone number as the primary identity. You can later bind corporate email, Google / Gmail, LinkedIn, Facebook, and WeChat.',
        stats: [
          { label: 'Phone', description: 'Primary account and SMS verification' },
          { label: 'Company', description: 'Organization and contact profile' },
          { label: 'Binding', description: 'Email and third-party accounts' },
        ],
      },
      headTitle: 'Customer Registration',
      headSubtitle: 'Complete basic details to enter the customer workspace and manage quotes.',
      switchText: 'Already have an account?',
      switchHref: '/login',
      submitLabel: 'Create Customer Account',
      showSocial: true,
      showTerms: true,
      termsText:
        'I have read and agree to the Terms of Service and Privacy Policy, and understand third-party registration still requires phone verification.',
      registerFields: 'customer',
      guestStrip: {
        title: 'Not ready to register?',
        body: 'Return to the marketing site to explore services. Saving quotes and submitting orders requires a customer account.',
      },
      showGuestStrip: true,
      footerLinks: [
        { label: 'Back to Home', href: marketingOrigin, external: true },
        { label: 'Help Center', href: '#' },
        { label: 'Privacy Policy', href: '#' },
      ],
    },
  },
  'admin-login': {
    zh: {
      id: 'admin-login',
      kind: 'login',
      portal: 'admin',
      title: 'Admin Login | 敏捷智造',
      visual: {
        ariaLabel: '管理后台入口',
        eyebrowIcon: 'admin_panel_settings',
        eyebrow: 'Admin Login',
        title: '管理后台入口',
        description:
          '当前系统先兼容简单的账号密码登录，后续将接入邮箱验证码登录、Google / Gmail、LinkedIn、Facebook、微信和手机号等方式。',
        stats: [
          { label: '权限', description: '角色与运营工作台' },
          { label: '手机', description: '主身份锚点' },
          { label: '审计', description: '操作与访问追踪' },
        ],
      },
      headTitle: 'Admin Login',
      headSubtitle: '管理后台入口，进入您的权限与运营工作台',
      switchText: '还没有管理员账号？',
      switchHref: '/admin/register',
      submitLabel: '登录工作台',
      showTabs: true,
      showSocial: true,
      showRemember: true,
      portalNote: {
        title: 'Admin Login 后续扩展说明',
        items: [
          '邮箱与 Gmail 登录需要支持邮件验证码，登录成功后仍需绑定手机号并接收短信验证码。',
          'Google / Gmail、LinkedIn、Facebook、微信等第三方应用统一按扫码登录设计，扫码完成后仍需手机号验证。',
          '手机号注册用户登录后，可在个人页面继续绑定邮箱和第三方应用账号。',
        ],
      },
      footerLinks: [
        { label: '返回首页', href: marketingOrigin, external: true },
        { label: '服务条款', href: '#' },
        { label: '隐私政策', href: '#' },
      ],
    },
    en: {
      id: 'admin-login',
      kind: 'login',
      portal: 'admin',
      title: 'Admin Login | AgileMakeAI',
      visual: {
        ariaLabel: 'Admin portal entry',
        eyebrowIcon: 'admin_panel_settings',
        eyebrow: 'Admin Login',
        title: 'Admin portal entry',
        description:
          'Password login is supported today. Email verification, Google / Gmail, LinkedIn, Facebook, WeChat, and phone login will follow.',
        stats: [
          { label: 'RBAC', description: 'Roles and operations console' },
          { label: 'Phone', description: 'Primary identity anchor' },
          { label: 'Audit', description: 'Access and action tracking' },
        ],
      },
      headTitle: 'Admin Login',
      headSubtitle: 'Enter the admin console for permissions and operations.',
      switchText: 'No admin account yet?',
      switchHref: '/admin/register',
      submitLabel: 'Log In to Console',
      showTabs: true,
      showSocial: true,
      showRemember: true,
      portalNote: {
        title: 'Planned admin login extensions',
        items: [
          'Email and Gmail login will require email verification, then phone SMS verification.',
          'Google / Gmail, LinkedIn, Facebook, and WeChat will use QR-based login with phone verification.',
          'Phone-registered admins can bind email and third-party accounts in profile settings.',
        ],
      },
      footerLinks: [
        { label: 'Back to Home', href: marketingOrigin, external: true },
        { label: 'Terms of Service', href: '#' },
        { label: 'Privacy Policy', href: '#' },
      ],
    },
  },
  'admin-register': {
    zh: {
      id: 'admin-register',
      kind: 'register',
      portal: 'admin',
      title: 'Admin Register | 敏捷智造',
      wide: true,
      visual: {
        ariaLabel: '管理后台注册',
        eyebrowIcon: 'domain_add',
        eyebrow: 'Admin Register',
        title: '创建管理后台账号',
        description: '以手机号作为主账号完成管理后台开户注册，注册后可在个人页面继续绑定邮箱或第三方应用。',
        stats: [
          { label: 'Admin', description: '主账号与权限控制' },
          { label: '手机', description: '直接注册与登录' },
          { label: '绑定', description: '邮箱与第三方账号' },
        ],
      },
      headTitle: 'Admin Register',
      headSubtitle: '以手机号作为主账号完成管理后台开户注册，注册后可在个人页面继续绑定邮箱或第三方应用。',
      switchText: '已经有账号？',
      switchHref: '/admin/login',
      submitLabel: '完成后台注册',
      showSocial: true,
      showTerms: true,
      termsText:
        '我已阅读并同意 服务条款 与 隐私政策，并知晓管理后台除手机号直接注册外，其它注册方式都必须绑定手机号并接收短信验证码。',
      registerFields: 'portal',
      footerLinks: [
        { label: '返回首页', href: marketingOrigin, external: true },
        { label: '帮助中心', href: '#' },
        { label: '隐私政策', href: '#' },
      ],
    },
    en: {
      id: 'admin-register',
      kind: 'register',
      portal: 'admin',
      title: 'Admin Register | AgileMakeAI',
      wide: true,
      visual: {
        ariaLabel: 'Admin registration',
        eyebrowIcon: 'domain_add',
        eyebrow: 'Admin Register',
        title: 'Create an admin account',
        description:
          'Register with a phone number as the primary account. Bind email or third-party accounts later in profile settings.',
        stats: [
          { label: 'Admin', description: 'Primary account and RBAC' },
          { label: 'Phone', description: 'Direct registration and login' },
          { label: 'Binding', description: 'Email and third-party accounts' },
        ],
      },
      headTitle: 'Admin Register',
      headSubtitle: 'Complete admin onboarding with phone as the primary account.',
      switchText: 'Already have an account?',
      switchHref: '/admin/login',
      submitLabel: 'Complete Admin Registration',
      showSocial: true,
      showTerms: true,
      termsText:
        'I have read and agree to the Terms of Service and Privacy Policy, and understand non-phone registration requires phone SMS verification.',
      registerFields: 'portal',
      footerLinks: [
        { label: 'Back to Home', href: marketingOrigin, external: true },
        { label: 'Help Center', href: '#' },
        { label: 'Privacy Policy', href: '#' },
      ],
    },
  },
  'mes-login': {
    zh: {
      id: 'mes-login',
      kind: 'login',
      portal: 'mes',
      title: 'MES Login | 敏捷智造',
      visual: {
        ariaLabel: 'MES 执行入口',
        eyebrowIcon: 'precision_manufacturing',
        eyebrow: 'MES Login',
        title: 'MES 执行入口',
        description:
          '当前系统先兼容简单的账号密码登录，后续将接入邮箱验证码登录、Google / Gmail、LinkedIn、Facebook、微信和手机号等方式。',
        stats: [
          { label: '工单', description: '生产执行与排程' },
          { label: '手机', description: '主身份锚点' },
          { label: '追踪', description: '工序与交付状态' },
        ],
      },
      headTitle: 'MES Login',
      headSubtitle: 'MES 登录入口，进入您的生产执行工作台',
      switchText: '还没有 MES 账号？',
      switchHref: '/mes/register',
      submitLabel: '登录工作台',
      showTabs: true,
      showSocial: true,
      showRemember: true,
      portalNote: {
        title: 'MES Login 后续扩展说明',
        items: [
          '邮箱与 Gmail 登录需要支持邮件验证码，登录成功后仍需绑定手机号并接收短信验证码。',
          'Google / Gmail、LinkedIn、Facebook、微信等第三方应用统一按扫码登录设计，扫码完成后仍需手机号验证。',
          '手机号注册用户登录后，可在个人页面继续绑定邮箱和第三方应用账号。',
        ],
      },
      footerLinks: [
        { label: '返回首页', href: marketingOrigin, external: true },
        { label: '服务条款', href: '#' },
        { label: '隐私政策', href: '#' },
      ],
    },
    en: {
      id: 'mes-login',
      kind: 'login',
      portal: 'mes',
      title: 'MES Login | AgileMakeAI',
      visual: {
        ariaLabel: 'MES execution portal',
        eyebrowIcon: 'precision_manufacturing',
        eyebrow: 'MES Login',
        title: 'MES execution portal',
        description:
          'Password login is supported today. Email verification, Google / Gmail, LinkedIn, Facebook, WeChat, and phone login will follow.',
        stats: [
          { label: 'Work', description: 'Production execution and scheduling' },
          { label: 'Phone', description: 'Primary identity anchor' },
          { label: 'Track', description: 'Process and delivery status' },
        ],
      },
      headTitle: 'MES Login',
      headSubtitle: 'Enter the MES console for production execution.',
      switchText: 'No MES account yet?',
      switchHref: '/mes/register',
      submitLabel: 'Log In to MES',
      showTabs: true,
      showSocial: true,
      showRemember: true,
      portalNote: {
        title: 'Planned MES login extensions',
        items: [
          'Email and Gmail login will require email verification, then phone SMS verification.',
          'Google / Gmail, LinkedIn, Facebook, and WeChat will use QR-based login with phone verification.',
          'Phone-registered users can bind email and third-party accounts in profile settings.',
        ],
      },
      footerLinks: [
        { label: 'Back to Home', href: marketingOrigin, external: true },
        { label: 'Terms of Service', href: '#' },
        { label: 'Privacy Policy', href: '#' },
      ],
    },
  },
  'mes-register': {
    zh: {
      id: 'mes-register',
      kind: 'register',
      portal: 'mes',
      title: 'MES Register | 敏捷智造',
      wide: true,
      visual: {
        ariaLabel: 'MES 注册入口',
        eyebrowIcon: 'domain_add',
        eyebrow: 'MES Register',
        title: '创建 MES 账号',
        description: '以手机号作为主账号完成 MES 开户注册，注册后可在个人页面继续绑定邮箱或第三方应用。',
        stats: [
          { label: 'MES', description: '生产执行工作台' },
          { label: '手机', description: '直接注册与登录' },
          { label: '绑定', description: '邮箱与第三方账号' },
        ],
      },
      headTitle: 'MES Register',
      headSubtitle: '以手机号作为主账号完成 MES 开户注册。',
      switchText: '已经有账号？',
      switchHref: '/mes/login',
      submitLabel: '完成 MES 注册',
      showSocial: true,
      showTerms: true,
      termsText:
        '我已阅读并同意 服务条款 与 隐私政策，并知晓 MES 除手机号直接注册外，其它注册方式都必须绑定手机号并接收短信验证码。',
      registerFields: 'portal',
      footerLinks: [
        { label: '返回首页', href: marketingOrigin, external: true },
        { label: '帮助中心', href: '#' },
        { label: '隐私政策', href: '#' },
      ],
    },
    en: {
      id: 'mes-register',
      kind: 'register',
      portal: 'mes',
      title: 'MES Register | AgileMakeAI',
      wide: true,
      visual: {
        ariaLabel: 'MES registration',
        eyebrowIcon: 'domain_add',
        eyebrow: 'MES Register',
        title: 'Create a MES account',
        description:
          'Register with a phone number as the primary account for the MES execution workspace.',
        stats: [
          { label: 'MES', description: 'Production execution console' },
          { label: 'Phone', description: 'Direct registration and login' },
          { label: 'Binding', description: 'Email and third-party accounts' },
        ],
      },
      headTitle: 'MES Register',
      headSubtitle: 'Complete MES onboarding with phone as the primary account.',
      switchText: 'Already have an account?',
      switchHref: '/mes/login',
      submitLabel: 'Complete MES Registration',
      showSocial: true,
      showTerms: true,
      termsText:
        'I have read and agree to the Terms of Service and Privacy Policy, and understand non-phone registration requires phone SMS verification.',
      registerFields: 'portal',
      footerLinks: [
        { label: 'Back to Home', href: marketingOrigin, external: true },
        { label: 'Help Center', href: '#' },
        { label: 'Privacy Policy', href: '#' },
      ],
    },
  },
  'supplier-login': {
    zh: {
      id: 'supplier-login',
      kind: 'login',
      portal: 'supplier',
      title: 'Supplier Login | 敏捷智造',
      visual: {
        ariaLabel: '供应商端入口',
        eyebrowIcon: 'local_shipping',
        eyebrow: 'Supplier Login',
        title: '供应商协同入口',
        description:
          '当前系统先兼容简单的账号密码登录，后续将接入邮箱验证码登录、Google / Gmail、LinkedIn、Facebook、微信和手机号等方式。',
        stats: [
          { label: '订单', description: '协同与交付响应' },
          { label: '手机', description: '主身份锚点' },
          { label: '资质', description: '供应商资料管理' },
        ],
      },
      headTitle: 'Supplier Login',
      headSubtitle: '供应商登录入口，进入您的协同工作台',
      switchText: '还没有供应商账号？',
      switchHref: '/supplier/register',
      submitLabel: '登录工作台',
      showTabs: true,
      showSocial: true,
      showRemember: true,
      portalNote: {
        title: 'Supplier Login 后续扩展说明',
        items: [
          '邮箱与 Gmail 登录需要支持邮件验证码，登录成功后仍需绑定手机号并接收短信验证码。',
          'Google / Gmail、LinkedIn、Facebook、微信等第三方应用统一按扫码登录设计，扫码完成后仍需手机号验证。',
          '手机号注册用户登录后，可在个人页面继续绑定邮箱和第三方应用账号。',
        ],
      },
      footerLinks: [
        { label: '返回首页', href: marketingOrigin, external: true },
        { label: '服务条款', href: '#' },
        { label: '隐私政策', href: '#' },
      ],
    },
    en: {
      id: 'supplier-login',
      kind: 'login',
      portal: 'supplier',
      title: 'Supplier Login | AgileMakeAI',
      visual: {
        ariaLabel: 'Supplier portal entry',
        eyebrowIcon: 'local_shipping',
        eyebrow: 'Supplier Login',
        title: 'Supplier collaboration portal',
        description:
          'Password login is supported today. Email verification, Google / Gmail, LinkedIn, Facebook, WeChat, and phone login will follow.',
        stats: [
          { label: 'Orders', description: 'Collaboration and delivery response' },
          { label: 'Phone', description: 'Primary identity anchor' },
          { label: 'Profile', description: 'Supplier credential management' },
        ],
      },
      headTitle: 'Supplier Login',
      headSubtitle: 'Enter the supplier collaboration workspace.',
      switchText: 'No supplier account yet?',
      switchHref: '/supplier/register',
      submitLabel: 'Log In to Supplier Console',
      showTabs: true,
      showSocial: true,
      showRemember: true,
      portalNote: {
        title: 'Planned supplier login extensions',
        items: [
          'Email and Gmail login will require email verification, then phone SMS verification.',
          'Google / Gmail, LinkedIn, Facebook, and WeChat will use QR-based login with phone verification.',
          'Phone-registered suppliers can bind email and third-party accounts in profile settings.',
        ],
      },
      footerLinks: [
        { label: 'Back to Home', href: marketingOrigin, external: true },
        { label: 'Terms of Service', href: '#' },
        { label: 'Privacy Policy', href: '#' },
      ],
    },
  },
  'supplier-register': {
    zh: {
      id: 'supplier-register',
      kind: 'register',
      portal: 'supplier',
      title: 'Supplier Register | 敏捷智造',
      wide: true,
      visual: {
        ariaLabel: '供应商注册入口',
        eyebrowIcon: 'domain_add',
        eyebrow: 'Supplier Register',
        title: '创建供应商账号',
        description: '以手机号作为主账号完成供应商开户注册，注册后可在个人页面继续绑定邮箱或第三方应用。',
        stats: [
          { label: '供应', description: '协同与交付工作台' },
          { label: '手机', description: '直接注册与登录' },
          { label: '绑定', description: '邮箱与第三方账号' },
        ],
      },
      headTitle: 'Supplier Register',
      headSubtitle: '以手机号作为主账号完成供应商开户注册。',
      switchText: '已经有账号？',
      switchHref: '/supplier/login',
      submitLabel: '完成供应商注册',
      showSocial: true,
      showTerms: true,
      termsText:
        '我已阅读并同意 服务条款 与 隐私政策，并知晓供应商端除手机号直接注册外，其它注册方式都必须绑定手机号并接收短信验证码。',
      registerFields: 'portal',
      footerLinks: [
        { label: '返回首页', href: marketingOrigin, external: true },
        { label: '帮助中心', href: '#' },
        { label: '隐私政策', href: '#' },
      ],
    },
    en: {
      id: 'supplier-register',
      kind: 'register',
      portal: 'supplier',
      title: 'Supplier Register | AgileMakeAI',
      wide: true,
      visual: {
        ariaLabel: 'Supplier registration',
        eyebrowIcon: 'domain_add',
        eyebrow: 'Supplier Register',
        title: 'Create a supplier account',
        description:
          'Register with a phone number as the primary account for the supplier collaboration workspace.',
        stats: [
          { label: 'Supply', description: 'Collaboration and delivery console' },
          { label: 'Phone', description: 'Direct registration and login' },
          { label: 'Binding', description: 'Email and third-party accounts' },
        ],
      },
      headTitle: 'Supplier Register',
      headSubtitle: 'Complete supplier onboarding with phone as the primary account.',
      switchText: 'Already have an account?',
      switchHref: '/supplier/login',
      submitLabel: 'Complete Supplier Registration',
      showSocial: true,
      showTerms: true,
      termsText:
        'I have read and agree to the Terms of Service and Privacy Policy, and understand non-phone registration requires phone SMS verification.',
      registerFields: 'portal',
      footerLinks: [
        { label: 'Back to Home', href: marketingOrigin, external: true },
        { label: 'Help Center', href: '#' },
        { label: 'Privacy Policy', href: '#' },
      ],
    },
  },
}
