import type { ReactNode } from 'react'

type PaymentBrand = {
  key: string
  className: string
  title: string
  icon?: ReactNode
}

/** Brand marks for footer payment grid — structure matches static homepage. */
export const PAYMENT_BRANDS: PaymentBrand[] = [
  {
    key: 'wechat',
    className: 'footer-payment-brand footer-payment-brand--wechat',
    title: 'WeChat Pay',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#07C160" />
        <path
          d="M13.1 8.2c-4.2 0-7.6 2.7-7.6 6.1 0 1.9 1 3.6 2.8 4.8l-.7 2.6 3-1.5c.8.2 1.7.3 2.5.3 4.2 0 7.6-2.7 7.6-6.1s-3.4-6.2-7.6-6.2Z"
          fill="#fff"
        />
        <path
          d="M20.1 13.1c3.6 0 6.5 2.3 6.5 5.2 0 1.6-.9 3.1-2.4 4.1l.6 2.2-2.6-1.3c-.7.2-1.4.3-2.1.3-3.6 0-6.5-2.3-6.5-5.2s2.9-5.3 6.5-5.3Z"
          fill="#fff"
          stroke="#07C160"
          strokeWidth="1"
        />
        <circle cx="10.7" cy="13.7" r="1" fill="#07C160" />
        <circle cx="15.3" cy="13.7" r="1" fill="#07C160" />
      </svg>
    ),
  },
  {
    key: 'alipay',
    className: 'footer-payment-brand footer-payment-brand--alipay',
    title: 'Alipay',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#1677FF" />
        <path
          d="M8 10h16M16 6v14M10 15c2.5 3.2 6.4 5.4 12 6.8M22 13c-1.5 5.5-5.2 9.1-12 11"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: 'unionpay',
    className: 'footer-payment-brand footer-payment-brand--unionpay',
    title: 'UnionPay',
    icon: (
      <svg viewBox="0 0 40 28" aria-hidden="true">
        <path d="M3 3h15l-5 22H0L3 3Z" fill="#D81E35" />
        <path d="M15 3h14l-5 22H11l4-22Z" fill="#1676B8" />
        <path d="M27 3h13l-4 22H23l4-22Z" fill="#14956C" />
        <path d="M7 9h25M5 14h25M4 19h24" stroke="#fff" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: 'visa',
    className: 'footer-payment-brand footer-payment-brand--visa',
    title: 'Visa',
  },
  {
    key: 'mastercard',
    className: 'footer-payment-brand footer-payment-brand--mastercard',
    title: 'Mastercard',
    icon: (
      <svg viewBox="0 0 42 28" aria-hidden="true">
        <circle cx="16" cy="14" r="10" fill="#EB001B" />
        <circle cx="26" cy="14" r="10" fill="#F79E1B" />
        <path d="M21 6.3a10 10 0 0 1 0 15.4 10 10 0 0 1 0-15.4Z" fill="#FF5F00" />
      </svg>
    ),
  },
  {
    key: 'paypal',
    className: 'footer-payment-brand footer-payment-brand--paypal',
    title: 'PayPal',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path
          d="M10 4h10.2c5 0 7.2 2.7 6.2 7-1.1 4.7-4.1 7-9 7h-3l-1.7 9H7L10 4Z"
          fill="#003087"
        />
        <path
          d="M13.3 8h8c4.4 0 6.1 2.5 5 6.3-1 3.8-3.6 5.7-7.6 5.7h-3.2l-1.3 7H9.5l3.8-19Z"
          fill="#009CDE"
          opacity=".9"
        />
      </svg>
    ),
  },
  {
    key: 'bank',
    className: 'footer-payment-brand footer-payment-brand--bank',
    title: 'Bank Transfer',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#F4B528" />
        <path
          d="M6 13h20M8 13v9m5-9v9m6-9v9m5-9v9M6 24h20M16 6l10 5H6l10-5Z"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]
