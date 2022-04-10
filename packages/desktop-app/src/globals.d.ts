// eslint-disable-next-line no-unused-vars
interface Window {
  myAPI: {
    makeAudio: (content: string) => Promise<Int8Array[]>
  }
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
