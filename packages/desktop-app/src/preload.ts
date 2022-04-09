// preload.js
import { contextBridge } from 'electron'
import * as fs from 'fs'
// import path from 'path'
import { exec } from 'child_process'

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
})

contextBridge.exposeInMainWorld('myAPI', {
  makeAudio: function (content: string) {
    return new Promise((resolve, reject) => {
      fs.writeFileSync('input.txt', content)
      exec('gtts -i input.txt', (error, stdout, stderr) => {
        if (error) {
          reject(error)
        } else if (stderr) {
          reject(stderr)
        } else {
          const buffer = fs.readFileSync('./output.mp3')

          resolve(buffer)
        }
      })
    })
  },
})
