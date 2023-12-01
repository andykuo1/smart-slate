module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSameLine: true,
  importOrder: ['react', '<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
