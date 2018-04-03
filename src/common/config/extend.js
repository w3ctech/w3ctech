const view = require('think-view');
const model = require('think-model');
const cache = require('think-cache');
const session = require('think-session');
const createI18n = require('think-i18n');
const path = require('path');

const i18n = createI18n({
    app: think.app,
    i18nFolder: path.resolve(__dirname, './locales'),
    defaultLocale: 'zh-cn',
    // getLocale: {by: 'query', name: 'locale'},
    getLocale: (ctx) => {
        return [ctx.lang];
    },
    localesMapping(locales) {
        if (locales.some((locale) => /^en/.test(locale))) return 'en';

        return 'zh-cn';
    }
    // debugLocale: 'cn'
});

module.exports = [
    view, // make application support view
    model(think.app),
    cache,
    session,
    i18n
];
