# nuxt3, Pinia, Quasar

- i18n
- crypto.js
- yup
- eslint,prettier

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install 
```

## ADD MORE
### q-calendar

link : [https://qcalendar.netlify.app/](https://qcalendar.netlify.app/)

> "@quasar/quasar-ui-qcalendar": "^4.0.0-beta.15",

```bash
yarn add @quasar/quasar-ui-qcalendar@4.0.0-beta.15
```

root/plugins/q-calendar.js
```js
import Plugin from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js';
import '@quasar/quasar-ui-qcalendar/src/css/calendar-day.sass';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Plugin, {});
});
```

nuxt.config.ts
```ts
export default defineNuxtConfig({
    plugins: [ 
        {
            src: '~/plugins/q-calendar',
            mode: 'client',
        },
    ],
})
```