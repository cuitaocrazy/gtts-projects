import { textToSentences } from './utils'

test('test spiltter', () => {
  const str = `
  Hello, world!
  This is a test.
  Node.js is well.
  English story.
  Long time ago, there was a Alice.
  She was a good girl.
  She has a long tail.
  She headed to the forest.
  She said, "Hello, world!".
  But after forty days without a fish the boy's parents had told him that the old man was now definitely and finally salao, which is the worst form of unlucky, and the boy had gone at their orders in another boat which caught three good fish the first week.
  It made the boy sad to see the old man come in each day with his skiff empty and he always went down to help him carry either the coiled lines or the gaff and harpoon and the sail that was furled around the mast.
  `

  const expected = [
    'Hello, world! This is a test. Node.js is well. English story. Long time ago, there was a Alice. She was a good girl. She has a long tail. She headed to the forest. She said, \\\\\\"Hello, world!\\\\\\".',
    'But after forty days without a fish the boy\'s parents had told him that the old man was now definitely and finally salao, which is the worst form of unlucky,',
    'and the boy had gone at their orders in another boat which caught three good fish the first week. It made the boy sad to see the old man come in each day with his skiff empty and he always went down',
    'to help him carry either the coiled lines or the gaff and harpoon and the sail that was furled around the mast.',
  ]

  const actural = textToSentences(str)

  expect([...actural])
    .toStrictEqual(expected)
})
