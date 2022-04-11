// preload.js
import { contextBridge } from 'electron'
// import * as fs from 'fs'
// import path from 'path'
// import { exec } from 'child_process'
import { getAudio } from '@gtts/core'

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
})

contextBridge.exposeInMainWorld('myAPI', {
  makeAudio: async function (content: string) {
    const buffers: Buffer[] = []

    for await (const buffer of getAudio(content)) {
      buffers.push(buffer)
    }
    return buffers
  },
})
