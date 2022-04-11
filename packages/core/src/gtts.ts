import fetch from 'axios'
import { textToSentences } from './utils'

export type GttsOptions = {
  lang?: string,
  slow?: boolean,
}

let _tld = 'cn'

// 目前这个函数用处不大，node环境直接是axios的默认设置就可以获得结果，electron是通过钩子修改http头
function init (tld?: string) {
  _tld = tld || _tld
  fetch.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
  fetch.defaults.headers.common.Referer = `https://translate.google.${_tld}/`
  fetch.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
}

// debug
// 这种debug只能输出不是很真实，如果是node环境就设置环境变量NODE_DEBUG=http(powershell: $env:NODE_DEBUG='http')，electron在
// mainWindow.webContents.session.webRequest.onBeforeSendHeaders中截获也可修改
// fetch.interceptors.request.use(request => {
//   console.log(request.headers)
//   return request
// })

async function * getAudio (text: string, opts: GttsOptions = {}): AsyncIterableIterator<Buffer> {
  const { lang = 'en', slow = false } = opts
  const url = `https://translate.google.${_tld}/_/TranslateWebserverUi/data/batchexecute`

  const getBuffer = async (textLine: string) => {
    const req = await fetch(url, {
      method: 'POST',
      data  : `f.req=%5B%5B%5B%22jQ1olc%22%2C%22%5B%5C%22${encodeURIComponent(textLine.replace(/[\r\n]/g, ''))}%5C%22%2C%5C%22${lang}%5C%22%2C${slow}%2C%5C%22null%5C%22%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&`,
    })

    const data = await req.data

    const audioBase64 = data.match(/jQ1olc","\[\\"(.*)\\"]/)[1]

    return Buffer.from(audioBase64, 'base64')
  }

  for (const sentence of textToSentences(text)) {
    try {
      const buffer = await getBuffer(sentence)

      yield buffer
    } catch (e) {
      console.error('error:' + sentence)
    }
  }
}

export {
  init,
  getAudio,
}
