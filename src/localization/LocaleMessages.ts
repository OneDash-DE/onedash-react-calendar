import { EN } from "./locales";
import { LocaleMessages } from "./localeTypes";

let LOCALE_MESSAGES: LocaleMessages = EN;

export const setLocaleMessages = (messages: LocaleMessages) => {
	LOCALE_MESSAGES = messages;
};
const localeMessages = () => LOCALE_MESSAGES;
export default localeMessages;
