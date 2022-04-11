#!/usr/bin/env node
import fs from 'fs'
import minimist from 'minimist'

import { getAudio, GttsOptions } from '@gtts/core'

async function run () {
  const params = minimist(process.argv.slice(2))
  const opts: GttsOptions = {
    lang: params.lang || params.l || 'en',
    slow: params.slow || params.s || false,
  }

  const inputFilename = params.i || params.input
  const outputFilename = params.o || params.output || 'output.mp3'

  let text = ''

  if (inputFilename && fs.existsSync(inputFilename)) {
    text = fs.readFileSync(inputFilename, 'utf8')
  } else {
    text = params._.join(' ')
      .trim()
  }

  if (text.length === 0) {
    console.error('please input text')
    process.exit(1)
  }

  const ws = fs.createWriteStream(outputFilename)

  for await (const buffer of getAudio(text, opts)) {
    ws.write(buffer)
  }
  ws.close()
}

run()
