import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthFooter } from '../components/AuthFooter'
import { AuthShell } from '../components/AuthShell'
import { marketingUrl } from '../config/origins'
import type { Locale } from '../data/authPages'
import { localePathPrefix } from '../data/authPages'
import { useSendCode } from '../interactions/authInteractions'

const copy = {
  zh: {
    title: '找回密码 | 敏捷智造',
    visual: {
      ariaLabel: '找回密码',
      eyebrowIcon: 'lock_reset',
      eyebrow: 'Password Recovery',
      title: '找回账户密码',
      description: '请输入已绑定手机号或邮箱获取验证码。若通过邮箱或第三方应用辅助找回，最终仍需完成手机短信验证。',
      stats: [
        { label: '手机', description: '主找回路径' },
        { label: '邮箱', description: '邮件验证码辅助' },
        { label: '绑定', description: '第三方扫码预留' },
      ],
    },
    headTitle: '找回密码',
    headSubtitle:
      '请输入已绑定手机号或邮箱获取验证码。若通过邮箱或第三方应用辅助找回，最终仍需完成手机短信验证。',
    identifierLabel: '手机号 / 邮箱',
    identifierPlaceholder: '请输入已绑定手机号或邮箱',
    codeLabel: '验证码',
    codePlaceholder: '请输入 6 位验证码',
    resend: '重新发送',
    next: '下一步',
    verify: '验证并继续',
    rulesTitle: '找回规则',
    rules: [
      '手机号找回是主路径，可直接接收短信验证码完成重置。',
      '邮箱与 Gmail 可接收邮件验证码辅助找回，但最后仍需完成手机短信验证码验证。',
      'Google / Gmail、LinkedIn、Facebook、微信等统一按扫码辅助找回预留，扫码完成后仍需手机号验证。',
    ],
    backLogin: '返回登录',
    footer: [
      { label: '返回首页', href: '#marketing-home', external: true },
      { label: '帮助中心', href: '#', external: true },
      { label: '隐私政策', href: '#', external: true },
    ],
  },
  en: {
    title: 'Forgot Password | AgileMakeAI',
    visual: {
      ariaLabel: 'Password recovery',
      eyebrowIcon: 'lock_reset',
      eyebrow: 'Password Recovery',
      title: 'Reset your password',
      description:
        'Enter your bound phone number or email to receive a verification code. Email and third-party recovery still require phone SMS verification.',
      stats: [
        { label: 'Phone', description: 'Primary recovery path' },
        { label: 'Email', description: 'Email code assist' },
        { label: 'Binding', description: 'Third-party QR reserved' },
      ],
    },
    headTitle: 'Forgot Password',
    headSubtitle:
      'Enter your bound phone number or email to receive a verification code. Final reset still requires phone SMS verification.',
    identifierLabel: 'Phone / Email',
    identifierPlaceholder: 'Enter bound phone or email',
    codeLabel: 'Verification Code',
    codePlaceholder: 'Enter 6-digit code',
    resend: 'Resend',
    next: 'Next',
    verify: 'Verify and Continue',
    rulesTitle: 'Recovery rules',
    rules: [
      'Phone recovery is the primary path and can complete reset via SMS code.',
      'Email and Gmail can assist with email codes, but phone SMS verification is still required.',
      'Google / Gmail, LinkedIn, Facebook, and WeChat are reserved for QR-assisted recovery with phone verification.',
    ],
    backLogin: 'Back to login',
    footer: [
      { label: 'Back to Home', href: '#marketing-home', external: true },
      { label: 'Help Center', href: '#', external: true },
      { label: 'Privacy Policy', href: '#', external: true },
    ],
  },
} as const

export function ForgotPasswordPage({ locale }: { locale: Locale }) {
  const t = copy[locale]
  const isEnglish = locale === 'en'
  const [identifier, setIdentifier] = useState('')
  const [step, setStep] = useState<'input' | 'verify'>('input')
  const smsCode = useSendCode(isEnglish, t.resend)
  const loginHref = localePathPrefix(locale, '/login')
  const footerLinks = t.footer.map((link) =>
    link.href === '#marketing-home' ? { ...link, href: marketingUrl('/', locale) } : link,
  )

  useEffect(() => {
    document.title = t.title
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
  }, [locale, t.title])

  const handleNext = () => {
    if (!identifier.trim()) return
    setStep('verify')
  }

  return (
    <AuthShell visual={t.visual} locale={locale}>
      <section className="auth-card">
        <div className="auth-head">
          <div>
            <h2>{t.headTitle}</h2>
            <p>{t.headSubtitle}</p>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (step === 'input') handleNext()
          }}
        >
          <div className="field-group">
            <div className="field">
              <label htmlFor="identifier">{t.identifierLabel}</label>
              <div className="control">
                <span className="material-symbols-outlined">alternate_email</span>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder={t.identifierPlaceholder}
                />
              </div>
            </div>

            <div
              className={`field verification-section${step === 'verify' ? ' is-active' : ' is-locked'}`}
            >
              <div className="field-line">
                <label htmlFor="code">{t.codeLabel}</label>
                <button
                  className="auth-switch"
                  type="button"
                  disabled={smsCode.disabled || step !== 'verify'}
                  onClick={smsCode.sendCode}
                  style={{ background: 'none', border: 0, cursor: 'pointer' }}
                >
                  {smsCode.label}
                </button>
              </div>
              <div className="control">
                <span className="material-symbols-outlined">verified_user</span>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder={t.codePlaceholder}
                />
              </div>
            </div>
          </div>

          <button className="primary-button" type="submit">
            {step === 'input' ? t.next : t.verify}
          </button>
        </form>

        <div className="forgot-rules">
          <h3>{t.rulesTitle}</h3>
          <ul>
            {t.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <div className="social-grid" style={{ marginTop: 14 }}>
            <button className="social-button" type="button">
              <span className="social-mark google">G</span>Google / Gmail
            </button>
            <button className="social-button" type="button">
              <span className="social-mark linkedin">in</span>LinkedIn
            </button>
            <button className="social-button" type="button">
              <span className="social-mark facebook">f</span>Facebook
            </button>
            <button className="social-button" type="button">
              <span className="social-mark wechat">{isEnglish ? 'W' : '微'}</span>
              {isEnglish ? 'WeChat' : '微信'}
            </button>
          </div>
        </div>

        <Link className="back-link" to={loginHref}>
          <span className="material-symbols-outlined">arrow_back</span>
          {t.backLogin}
        </Link>
      </section>
      <AuthFooter links={footerLinks} />
    </AuthShell>
  )
}
