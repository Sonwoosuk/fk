import puppeteer from 'puppeteer-core'

const URL = process.argv[2] || 'https://my-app-three-eosin-90.vercel.app/'

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-first-run', '--no-default-browser-check']
})

const page = (await browser.pages())[0] || await browser.newPage()

const log = (tag, msg) => console.log(`[${tag}] ${msg}`)

page.on('console', m => log('console:' + m.type(), m.text()))
page.on('pageerror', e => log('pageerror', e.message))
page.on('requestfailed', r => log('reqfail', `${r.failure()?.errorText} ${r.url().slice(0, 140)}`))
page.on('response', r => { if (r.status() >= 400) log('http' + r.status(), r.url().slice(0, 140)) })

browser.on('targetcreated', async t => {
  log('popup', t.url().slice(0, 200))
  try {
    const p = await t.page()
    if (!p) return
    p.on('requestfailed', r => log('popup-reqfail', `${r.failure()?.errorText} ${r.url().slice(0, 140)}`))
    p.on('response', r => { if (r.status() >= 400) log('popup-http' + r.status(), r.url().slice(0, 140)) })
    p.on('framenavigated', f => log('popup-nav', f.url().slice(0, 200)))
    p.on('close', () => log('popup', 'CLOSED'))
  } catch (e) { log('popup-err', e.message) }
})

await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 })
log('page', 'loaded: ' + page.url())

// find the google button anywhere
const clicked = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button, a')]
  const b = btns.find(x => /google/i.test(x.textContent))
  if (b) { b.click(); return b.textContent.trim() }
  return null
})
log('click', clicked || 'GOOGLE BUTTON NOT FOUND')

if (!clicked) {
  // maybe need to navigate to /login
  await page.goto(new URL('/login', URL).href, { waitUntil: 'networkidle2' }).catch(() => {})
  const c2 = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button, a')]
    const b = btns.find(x => /google/i.test(x.textContent))
    if (b) { b.click(); return b.textContent.trim() }
    return null
  })
  log('click2', c2 || 'STILL NOT FOUND')
}

await new Promise(r => setTimeout(r, 12000))

// dump any visible error text
const errText = await page.evaluate(() => {
  const els = [...document.querySelectorAll('*')]
  return els.filter(e => /auth\/|Firebase|error/i.test(e.textContent) && e.children.length === 0)
    .map(e => e.textContent.trim()).slice(0, 5).join(' | ')
})
log('ui-error', errText || '(none)')

await browser.close()
