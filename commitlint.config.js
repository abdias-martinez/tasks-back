module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['ci', 'chore', 'feat', 'fix', 'perf', 'refactor', 'style'],
    ],
  },
}
