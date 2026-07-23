import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthFooter } from '../components/AuthFooter'
import { AuthShell } from '../components/AuthShell'
import { getRedirectForPage } from '../config/redirects'
import type { AuthPageConfig, Locale } from '../data/authPages'
import { localePathPrefix } from '../data/authPages'
import { useAuthTabs, useDemoSubmit, useSendCode } from '../interactions/authInteractions'

const SOCIAL_PROVIDERS = [
  { id: 'google', mark: 'G', label: 'Google / Gmail', labelEn: 'Google / Gmail' },
  { id: 'linkedin', mark: 'in', label: 'LinkedIn', labelEn: 'LinkedIn' },
  { id: 'facebook', mark: 'f', label: 'Facebook', labelEn: 'Facebook' },
  { id: 'wechat', mark: '微', markEn: 'W', label: '微信', labelEn: 'WeChat' },
] as const

function SocialGrid({ locale }: { locale: Locale }) {
  return (
    <div className="social-grid">
      {SOCIAL_PROVIDERS.map((provider) => (
        <button className="social-button" type="button" key={provider.id}>
          <span className={`social-mark ${provider.id}`}>
            {locale === 'en' && 'markEn' in provider && provider.markEn
              ? provider.markEn
              : provider.mark}
          </span>
          {locale === 'en' ? provider.labelEn : provider.label}
        </button>
      ))}
    </div>
  )
}

function switchLinkLabel(config: AuthPageConfig, locale: Locale): string {
  if (config.kind === 'login') {
    return locale === 'en' ? 'Register' : '注册'
  }
  return locale === 'en' ? 'Log in' : '登录'
}

function LoginForm({
  config,
  locale,
  forgotHref,
}: {
  config: AuthPageConfig
  locale: Locale
  forgotHref: string
}) {
  const isEnglish = locale === 'en'
  const { setMode, isAccount, isSms } = useAuthTabs('account')
  const smsCode = useSendCode(isEnglish, isEnglish ? 'Send Code' : '发送验证码')
  const redirect = getRedirectForPage(config, locale)
  const { submit, buttonLabel, disabled } = useDemoSubmit(isEnglish, redirect)

  const accountTabLabel = isEnglish ? 'Account / Email' : '账号 / 邮箱'
  const smsTabLabel = isEnglish ? 'Phone' : '手机号'
  const rememberLabel = isEnglish ? 'Remember this account for 30 days' : '30 天内记住账号'
  const dividerLabel = isEnglish ? 'Or use another access route' : '或使用其他方式'

  return (
    <>
      {config.showTabs && (
        <div className="tabs">
          <button
            className={`tab-button${isAccount ? ' is-active' : ''}`}
            type="button"
            onClick={() => setMode('account')}
          >
            {accountTabLabel}
          </button>
          <button
            className={`tab-button${isSms ? ' is-active' : ''}`}
            type="button"
            onClick={() => setMode('sms')}
          >
            {smsTabLabel}
          </button>
        </div>
      )}

      <form onSubmit={submit}>
        <div className="field-group" hidden={!isAccount}>
          <div className="field">
            <label htmlFor="identifier">
              {isEnglish ? 'Phone / Email / Legacy Account' : '手机号 / 邮箱 / 历史账号'}
            </label>
            <div className="control">
              <span className="material-symbols-outlined">alternate_email</span>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                placeholder={
                  isEnglish
                    ? 'Enter phone, email, or legacy account'
                    : '请输入手机号、邮箱或历史账号'
                }
              />
            </div>
          </div>
          <div className="field">
            <div className="field-line">
              <label htmlFor="password">{isEnglish ? 'Password' : '密码'}</label>
              <Link className="auth-switch" to={forgotHref}>
                {isEnglish ? 'Forgot password?' : '忘记密码？'}
              </Link>
            </div>
            <div className="control">
              <span className="material-symbols-outlined">lock</span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder={isEnglish ? 'Enter password' : '请输入密码'}
              />
            </div>
          </div>
        </div>

        <div className="field-group" hidden={!isSms}>
          <div className="field">
            <label htmlFor="phone">{isEnglish ? 'Phone Number' : '手机号'}</label>
            <div className="control">
              <span className="material-symbols-outlined">smartphone</span>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder={isEnglish ? 'Enter phone number' : '请输入手机号'}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="sms-code">{isEnglish ? 'SMS Code' : '短信验证码'}</label>
            <div className="inline-field">
              <div className="control">
                <span className="material-symbols-outlined">verified_user</span>
                <input
                  id="sms-code"
                  name="sms-code"
                  type="text"
                  inputMode="numeric"
                  placeholder={isEnglish ? '6-digit code' : '6 位验证码'}
                />
              </div>
              <button
                className="secondary-button"
                type="button"
                disabled={smsCode.disabled}
                onClick={smsCode.sendCode}
              >
                {smsCode.label}
              </button>
            </div>
          </div>
        </div>

        {config.showRemember && (
          <label className="remember">
            <input type="checkbox" name="remember" />
            {rememberLabel}
          </label>
        )}

        <button className="primary-button" type="submit" disabled={disabled}>
          {buttonLabel(config.submitLabel)}
        </button>
      </form>

      {config.portalNote && (
        <div className="auth-note">
          <strong>{config.portalNote.title}</strong>
          <ul>
            {config.portalNote.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {config.showSocial && (
        <>
          <div className="divider">
            <span>{dividerLabel}</span>
          </div>
          <SocialGrid locale={locale} />
        </>
      )}

      {config.showGuestStrip && config.guestStrip && (
        <div className="guest-strip">
          <strong>{config.guestStrip.title}</strong>
          {config.guestStrip.body}
        </div>
      )}
    </>
  )
}

function RegisterForm({ config, locale }: { config: AuthPageConfig; locale: Locale }) {
  const isEnglish = locale === 'en'
  const smsCode = useSendCode(isEnglish, isEnglish ? 'Send Code' : '发送验证码')
  const redirect = getRedirectForPage(config, locale)
  const { submit, buttonLabel, disabled } = useDemoSubmit(isEnglish, redirect)

  const isCustomer = config.registerFields === 'customer'
  const dividerLabel = isEnglish
    ? 'Or register with a third-party account'
    : '也可使用第三方账号注册'

  return (
    <form onSubmit={submit}>
      <div className="register-grid">
        <div className="field full">
          <label htmlFor="company">
            {isCustomer
              ? isEnglish
                ? 'Company Name'
                : '公司名称'
              : isEnglish
                ? 'Organization'
                : '管理组织'}
          </label>
          <div className="control">
            <span className="material-symbols-outlined">factory</span>
            <input
              id="company"
              name="company"
              type="text"
              placeholder={
                isCustomer
                  ? isEnglish
                    ? 'Enter company name'
                    : '请输入公司名称'
                  : isEnglish
                    ? 'Organization name'
                    : '某某管理组织'
              }
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="contact">
            {isCustomer
              ? isEnglish
                ? 'Contact Name'
                : '联系人'
              : isEnglish
                ? 'Super Admin'
                : '超级管理员'}
          </label>
          <div className="control">
            <span className="material-symbols-outlined">person</span>
            <input
              id="contact"
              name="contact"
              type="text"
              placeholder={
                isCustomer
                  ? isEnglish
                    ? 'Enter contact name'
                    : '请输入联系人姓名'
                  : isEnglish
                    ? 'Super admin name'
                    : '请输入超级管理员姓名'
              }
            />
          </div>
        </div>

        {isCustomer && (
          <div className="field">
            <label htmlFor="role">{isEnglish ? 'Role / Department' : '职位 / 部门'}</label>
            <div className="control">
              <span className="material-symbols-outlined">badge</span>
              <input
                id="role"
                name="role"
                type="text"
                placeholder={isEnglish ? 'Procurement / Engineering' : '采购 / 工程 / 项目'}
              />
            </div>
          </div>
        )}

        <div className="field full">
          <label htmlFor="mobile">{isEnglish ? 'Phone Number' : '手机号'}</label>
          <div className="inline-field">
            <div className="control">
              <span className="material-symbols-outlined">phone_iphone</span>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                placeholder={isEnglish ? 'Enter phone number' : '请输入手机号'}
              />
            </div>
            <button
              className="secondary-button"
              type="button"
              disabled={smsCode.disabled}
              onClick={smsCode.sendCode}
            >
              {smsCode.label}
            </button>
          </div>
          <p className="form-note">
            {isEnglish
              ? 'Phone number is the primary account for registration and login.'
              : '手机号是主账号，可直接用于注册和登录。'}
          </p>
        </div>

        {isCustomer && (
          <div className="field">
            <label htmlFor="mobile-code">{isEnglish ? 'SMS Code' : '短信验证码'}</label>
            <div className="control">
              <span className="material-symbols-outlined">verified_user</span>
              <input
                id="mobile-code"
                name="mobile-code"
                type="text"
                inputMode="numeric"
                placeholder={isEnglish ? '6-digit code' : '6 位验证码'}
              />
            </div>
          </div>
        )}

        <div className="field">
          <label htmlFor="email">
            {isEnglish ? 'Corporate Email (optional)' : '企业邮箱（可选）'}
          </label>
          <div className="control">
            <span className="material-symbols-outlined">mail</span>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={isEnglish ? 'name@company.com' : 'name@company.com'}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="password">{isEnglish ? 'Password' : '密码'}</label>
          <div className="control">
            <span className="material-symbols-outlined">lock</span>
            <input
              id="password"
              name="password"
              type="password"
              placeholder={isEnglish ? 'Enter password' : '请输入密码'}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="confirm-password">
            {isEnglish ? 'Confirm Password' : '确认密码'}
          </label>
          <div className="control">
            <span className="material-symbols-outlined">lock_reset</span>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder={isEnglish ? 'Re-enter password' : '请再次输入密码'}
            />
          </div>
        </div>
      </div>

      {config.showSocial && (
        <>
          <div className="divider">
            <span>{dividerLabel}</span>
          </div>
          <SocialGrid locale={locale} />
        </>
      )}

      {config.showTerms && config.termsText && (
        <label className="terms">
          <input type="checkbox" name="terms" />
          <span>{config.termsText}</span>
        </label>
      )}

      <button className="primary-button" type="submit" disabled={disabled}>
        {buttonLabel(config.submitLabel)}
      </button>

      {config.showGuestStrip && config.guestStrip && (
        <div className="guest-strip">
          <strong>{config.guestStrip.title}</strong>
          {config.guestStrip.body}
        </div>
      )}
    </form>
  )
}

export function AuthPage({ config, locale }: { config: AuthPageConfig; locale: Locale }) {
  useEffect(() => {
    document.title = config.title
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
  }, [config.title, locale])

  const forgotHref = localePathPrefix(locale, '/forgot-password')

  return (
    <AuthShell visual={config.visual} locale={locale}>
      <section className={`auth-card${config.wide ? ' wide' : ''}`}>
        <div className="auth-head">
          <div>
            <h2>{config.headTitle}</h2>
            <p>{config.headSubtitle}</p>
          </div>
          {config.switchText && config.switchHref && (
            <div className="auth-switch">
              {config.switchText}{' '}
              <Link to={config.switchHref}>{switchLinkLabel(config, locale)}</Link>
            </div>
          )}
        </div>

        {config.kind === 'login' ? (
          <LoginForm config={config} locale={locale} forgotHref={forgotHref} />
        ) : (
          <RegisterForm config={config} locale={locale} />
        )}
      </section>
      <AuthFooter links={config.footerLinks} />
    </AuthShell>
  )
}
