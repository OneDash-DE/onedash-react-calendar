import dayjs from "dayjs";
import Calendar from "./components/Calendar";
import CalendarItem from "./components/CalendarItem";
import CalendarToolbarItem from "./components/CalendarToolbarItem";
import { DE, EN } from "./localization/locales";
import { setLocaleMessages } from "./localization/LocaleMessages";
import { LocaleCodes } from "./localization/localeTypes";
import CalendarUtils from "./utils/CalendarUtils";
import DateUtils from "./utils/DateUtils";

const CalendarLocales = {
	DE,
	EN
};

export { Calendar, CalendarItem, CalendarToolbarItem, setLocaleMessages, LocaleCodes, CalendarLocales, CalendarUtils, DateUtils };
declare module "dayjs" {
	export interface Dayjs {
		timestamp(): number;
	}
}
const timestampExtension = (_option: any, dayjsClass: any) => {
	// extend dayjs()
	// e.g. add dayjs().isSameOrBefore()
	// eslint-disable-next-line func-names
	dayjsClass.prototype.timestamp = function () {
		return this.toDate().getTime();
	};
};

dayjs.extend(timestampExtension);
