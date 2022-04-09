/* The code above does the following, explained in English:
1. Split the input string into an array of lines.
2. Map each line to a trimmed string, removing any whitespace at the beginning and end.
3. Filter out any empty lines.
4. Map the array of lines to a new array of strings, the same length, but with the last character replaced if it is a
   closing symbol (a '.', '!', or '?'). This is to strip off the punctuation at the end of the lines. */
const splitterBuilder = (punctuation: RegExp | string, appendPunctuation: string) => (str: string) => str.split(punctuation)
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .map(line => isClosingSymbol(line[line.length - 1]) ? line : line + appendPunctuation)

/* The code above does the following, explained in English:
1. We create a new array called closingSymbols.
2. In the array, we add all the closing symbols that we want to find in the text.
3. We export the array. */
const closingSymbols = ['.', '!', '?', ';']

/* The code above does the following, explained in English:
1. Create a new array containing the closing symbols
2. Check if the provided character is in the array containing the closing symbols */
const isClosingSymbol = (c: string) => closingSymbols.includes(c)

/* 按换行符分割给定文本，并返回。 */
/**
 * 按换行符分割给定文本，并返回。
 * @param str 给定文本
 * @returns 分割后的文本
 */
const paragraphSplitter = splitterBuilder(/[\r\n]/, '.')

/**
 * 按句点分割给定文本，并返回。
 * @param str 给定的文本
 * @returns 分割后的文本
 */
const fullStopSplitter = splitterBuilder(/\.\s/, '.')

/**
 * 按问号分割给定文本，并返回。
 * @param str 给定的文本
 * @returns 分割后的文本
 */
const questionMarkSplitter = splitterBuilder('?', '?')

/**
 * 按分号分割给定文本，并返回。
 * @param str 给定的文本
 * @returns 分割后的文本
 */
const semicolonSplitter = splitterBuilder(';', ';')

/**
 * 按感叹号分割给定文本，并返回。
 * @param str 给定的文本
 * @returns 分割后的文本
 */
const exclamationSplitter = splitterBuilder('!', '!')

/**
 * 按冒号分割给定文本，并返回。
 * @param str 给定的文本
 * @returns 分割后的文本
 */
const colonSplitter = splitterBuilder(':', ':')

/**
 * 按逗号分割给定文本，并返回。
 * @param str 给定的文本
 * @returns 分割后的文本
 */
const commaSplitter = splitterBuilder(',', ',')

/**
 * 分割文本中的单词，并返回。
 * @param str 文本
 * @returns 分割后的文本
 */
const wordSplitter = splitterBuilder(/\s+/, '')

/**
 * 字符最大长度
 */
const maxLength = 200

/**
 * 文本分割
 * @param str 文本
 * @param splitters 分割器
 * @returns 分割后的文本
 */
function * textSplit (str: string, splitters: ((str: string) => string[])[]): IterableIterator<string> {
  if (str.length > maxLength) {
    const [currentSplitter, ...otherSplitter] = splitters
    const lines = currentSplitter(str)

    for (const line of lines) {
      if (line.length > maxLength) {
        if (otherSplitter.length > 0) {
          yield * textSplit(line, otherSplitter)
        } else {
          yield line
        }
      } else yield line
    }
  } else {
    yield str
  }
}

/**
 * 文本转换为句子
 * @param str 文本
 */
export function * textToSentences (str: string): IterableIterator<string> {
  str = str.replace(/"/g, '\\\\\\"')
  let tmp = ''

  for (const sentence of textSplit(str, [paragraphSplitter, fullStopSplitter, questionMarkSplitter, exclamationSplitter, semicolonSplitter, colonSplitter, commaSplitter, wordSplitter])) {
    const newSentence = tmp === '' ? sentence : tmp + ' ' + sentence

    if (tmp.length > maxLength || newSentence.length > maxLength) {
      yield tmp
      tmp = sentence
    } else {
      tmp = newSentence
    }
  }
  yield tmp
}
