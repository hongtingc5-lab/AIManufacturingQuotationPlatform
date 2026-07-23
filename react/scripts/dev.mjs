#!/usr/bin/env node
/**
 * Start marketing (:5173) and entry (:5175) as independent Vite apps.
 * One command, two ports — no proxy / no path merge.
 */
import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

const children = []

function run(label, args) {
  const child = spawn('npm', args, {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  })
  child.on('exit', (code, signal) => {
    if (signal) return
    if (code && code !== 0) {
      console.error(`[dev] ${label} exited with code ${code}`)
    }
  })
  children.push(child)
  return child
}

function shutdown() {
  for (const child of children) {
    try {
      child.kill('SIGTERM')
    } catch {
      // ignore
    }
  }
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

console.log('[dev] starting marketing :5173 + entry :5175')
run('entry', ['run', 'dev', '-w', '@zhizao/frontend-entry'])
await sleep(600)
run('marketing', ['run', 'dev', '-w', '@zhizao/frontend-marketing'])

console.log('')
console.log('  Marketing  http://localhost:5173')
console.log('  Entry      http://localhost:5175')
console.log('  Login      http://localhost:5175/login')
console.log('')
