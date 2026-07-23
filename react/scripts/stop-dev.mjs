#!/usr/bin/env node
/**
 * Stop marketing Vite when the terminal was closed.
 * Usage (from monorepo root): npm run stop
 */
import { execSync } from 'node:child_process'

const ports = [5173, 5174, 5175, 5176, 5177, 5178]

function pidsOnPort(port) {
  try {
    const out = execSync(
      `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique"`,
      { encoding: 'utf8' },
    )
    return out
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => /^\d+$/.test(s))
      .map(Number)
  } catch {
    return []
  }
}

const killed = new Set()
for (const port of ports) {
  for (const pid of pidsOnPort(port)) {
    if (killed.has(pid)) continue
    try {
      execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' })
      killed.add(pid)
      console.log(`stopped PID ${pid} (port ${port})`)
    } catch {
      console.log(`could not stop PID ${pid} (port ${port})`)
    }
  }
}

if (killed.size === 0) {
  console.log('no dev server listening on 5173–5178')
} else {
  console.log('done')
}
