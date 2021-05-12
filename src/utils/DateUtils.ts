import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import weekday from "dayjs/plugin/weekday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localeMessages from "../localization/LocaleMessages";
import { LocaleCodes } from "../localization/localeTypes";

dayjs.extend(weekday);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(relativeTime);

declare module "dayjs" {
	export interface Dayjs {
		timestamp(): number;
	}
}
// eslint-disable-next-line func-names
dayjs.prototype.timestamp = function () {
	return this.toDate().getTime();
};

export default class DateUtils {
	public static formatFromNow = (timestamp?: number) => {
		if (!timestamp) return localeMessages()[LocaleCodes.UnknownDate];
		return dayjs(timestamp).fromNow();
	};

	public static adjustTime = (toDate: Dayjs, fromDate: Dayjs) => {
		return DateUtils.setTime(fromDate, toDate.get("h"), toDate.get("m"), toDate.get("s"), toDate.get("ms"));
	};

	public static setTime(date: Dayjs, hours = 0, minutes = 0, seconds = 0, milliseconds = 0) {
		return date.clone().set("millisecond", milliseconds).set("second", seconds).set("minute", minutes).set("hour", hours);
	}
}
