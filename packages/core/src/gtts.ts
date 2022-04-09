import fetch from 'axios'
import { textToSentences } from './utils'

export type GttsOptions = {
  lang?: string,
  slow?: boolean,
  tld?: string,
}

async function * getAudio (text: string, opts: GttsOptions = {}): AsyncIterableIterator<Buffer> {
  const { lang = 'en', slow = false, tld = 'cn' } = opts
  const url = `https://translate.google.${tld}/_/TranslateWebserverUi/data/batchexecute`

  const getBuffer = async (textLine: string) => {
    const req = await fetch(url, {
      method : 'POST',
      data   : `f.req=%5B%5B%5B%22jQ1olc%22%2C%22%5B%5C%22${encodeURIComponent(textLine.replace(/[\r\n]/g, ''))}%5C%22%2C%5C%22${lang}%5C%22%2C${slow}%2C%5C%22null%5C%22%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Referer       : `https://translate.google.${tld}/`,
        'User-Agent'  : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
      },
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

export default getAudio
