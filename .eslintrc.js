module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2020: true,
  },
  extends: ['plugin:nuxt/recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    semi: [2, 'always'],
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          markers: ['/'],
          exceptions: ['-', '+'],
        },
        block: {
          markers: ['!'],
          exceptions: ['*'],
          balanced: true,
        },
      },
    ],
    'vue/multi-word-component-names': 'off',
    // 'vue/multi-word-component-names': [
    //   'error',
    //   {
    //     ignores: ['index'],
    //   },
    // ],
    'vue/no-deprecated-slot-attribute': 'off',
    // v-if with v-for 같이 사용할수 있게 에러에서 제외
    'vue/no-use-v-if-with-v-for': 'off',
  },
  globals: {
    kakao: true,
  },
};
