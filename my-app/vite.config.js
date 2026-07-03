import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// 로컬 개발에서 /api 서버리스 함수(Vercel Functions)를 그대로 실행하기 위한 미들웨어
function localApiPlugin() {
  const wrapHandler = (handlerPath) => async (req, res) => {
    try {
      const { default: handler } = await import(handlerPath)

      // Vercel 런타임이 제공하는 res.status().json() 흉내
      res.status = (code) => { res.statusCode = code; return res }
      res.json = (obj) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(obj))
        return res
      }

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        const raw = Buffer.concat(chunks).toString('utf8')
        try { req.body = raw ? JSON.parse(raw) : {} } catch { req.body = {} }
      }

      await handler(req, res)
    } catch (error) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: error.message }))
    }
  }

  return {
    name: 'local-api',
    configureServer(server) {
      const apiFile = (name) => pathToFileURL(path.resolve(process.cwd(), 'api', name)).href
      server.middlewares.use('/api/products', wrapHandler(apiFile('products.js')))
      server.middlewares.use('/api/checkout', wrapHandler(apiFile('checkout.js')))
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // .env의 POLAR_* 값을 로컬 API 핸들러(process.env)에서 쓸 수 있게 로드
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), localApiPlugin()]
  }
})
