import { useCallback, useEffect, useRef, useState } from 'react'

export type AuthTabMode = 'account' | 'sms'

const REDIRECT_STORAGE_KEY = 'agileLoginRedirect'

export function getRedirectTarget(fallback?: string): string | undefined {
  const params = new URLSearchParams(window.location.search)
  return params.get('redirect') || sessionStorage.getItem(REDIRECT_STORAGE_KEY) || fallback
}

export function useAuthTabs(initialMode: AuthTabMode = 'account') {
  const [mode, setMode] = useState<AuthTabMode>(initialMode)
  return { mode, setMode, isAccount: mode === 'account', isSms: mode === 'sms' }
}

export function useSendCode(isEnglish: boolean, defaultLabel: string) {
  const [secondsLeft, setSecondsLeft] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current)
      }
    }
  }, [])

  const sendCode = useCallback(() => {
    if (secondsLeft > 0) return

    let seconds = 60
    setSecondsLeft(seconds)

    timerRef.current = window.setInterval(() => {
      seconds -= 1
      setSecondsLeft(seconds)
      if (seconds <= 0 && timerRef.current !== null) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
    }, 1000)
  }, [secondsLeft])

  const label =
    secondsLeft > 0
      ? `${secondsLeft}s`
      : isEnglish
        ? defaultLabel
        : defaultLabel === 'Send Code'
          ? '发送验证码'
          : defaultLabel

  return {
    sendCode,
    disabled: secondsLeft > 0,
    label,
  }
}

type DemoSubmitState = 'idle' | 'processing' | 'completed'

export function useDemoSubmit(isEnglish: boolean, redirectTarget?: string) {
  const [state, setState] = useState<DemoSubmitState>('idle')
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  const submit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      if (state !== 'idle') return

      setState('processing')

      const firstTimer = window.setTimeout(() => {
        setState('completed')

        const secondTimer = window.setTimeout(() => {
          setState('idle')
          const target = getRedirectTarget(redirectTarget)
          if (target && target !== '#') {
            window.location.href = target
          }
        }, 650)

        timersRef.current.push(secondTimer)
      }, 900)

      timersRef.current.push(firstTimer)
    },
    [redirectTarget, state],
  )

  const buttonLabel = (original: string) => {
    if (state === 'processing') return isEnglish ? 'Processing...' : '处理中...'
    if (state === 'completed') return isEnglish ? 'Completed' : '已完成'
    return original
  }

  const disabled = state !== 'idle'

  return { submit, buttonLabel, disabled }
}
