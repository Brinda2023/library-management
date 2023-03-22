let path = require('path');

/**
 *
 * @param {string} key The message key to be searched in the locale files
 * @param {string} lang The language code, ideally coming from req.getLocale(), based on the user input. The message will be returned in that given language
 * @returns string - the message text
 */
const getMessage = function (key, lang) {
	let localeFile = path.join(__dirname, 'locales', `${lang}.json`);
	let msgs = require(localeFile);
	return msgs[key];
};

module.exports.utils = {
	getMessage,
};
