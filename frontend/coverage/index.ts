import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { createReadStream, existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPORT_ROOT = path.resolve(__dirname, 'report')
const DEFAULT_PORT = Number(process.env.COVERAGE_PORT ?? 4174)

if (!existsSync(REPORT_ROOT)) {
  console.error('Coverage report not found. Run "npm run test:coverage" to generate it first.')
  process.exit(1)
}

const mimeMap: Record<string, string> = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
}

const server = createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0] || '/')
  let filePath = path.join(REPORT_ROOT, urlPath)

  try {
    const stat = statSync(filePath)
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }
  } catch {
    filePath = path.join(REPORT_ROOT, 'index.html')
  }

  const ext = path.extname(filePath)
  res.setHeader('Content-Type', mimeMap[ext] ?? 'application/octet-stream')

  const stream = createReadStream(filePath)
  stream.on('error', () => {
    res.statusCode = 404
    res.end('File not found')
  })
  stream.pipe(res)
})

server.listen(DEFAULT_PORT, () => {
  const url = `http://localhost:${DEFAULT_PORT}`
  console.log(`Serving coverage from ${REPORT_ROOT}`)
  console.log(`Open ${url} to view the report`)
  openBrowser(url)
})

function openBrowser(url: string) {
  const platform = process.platform
  if (platform === 'darwin') {
    spawn('open', [url], { stdio: 'ignore', detached: true })
  } else if (platform === 'win32') {
    spawn('cmd', ['/c', 'start', '', url], { stdio: 'ignore', detached: true })
  } else {
    spawn('xdg-open', [url], { stdio: 'ignore', detached: true })
  }
}
