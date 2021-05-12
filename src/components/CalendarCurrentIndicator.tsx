import dayjs from "dayjs";
import React from "react";
import localeMessages from "../localization/LocaleMessages";
import { LocaleCodes } from "../localization/localeTypes";
import { CalendarCurrentIndicatorProps } from "../types";

const CalendarCurrentIndicator = (props: CalendarCurrentIndicatorProps) => {
	const { hourAmp, hourFrom, hourTo, hourOffset } = props;
	const [currentDate, updateDate] = React.useState(dayjs());

	React.useEffect(() => {
		const interval = setInterval(() => {
			updateDate(dayjs());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const currentHour = currentDate.get("hour") + currentDate.get("minute") / 60;

	if (currentHour > hourFrom - 30 && currentHour <= hourTo + 30) {
		return (
			<div
				style={{
					top: `calc(${((currentHour - hourFrom) / hourAmp + hourOffset) * 100}%)`
				}}
				className="onedash-calendar-body-lines-current">
				<span>
					{currentDate.format("HH:mm")} {localeMessages()[LocaleCodes.oClock]}
				</span>
			</div>
		);
	}

	return <></>;
};

export default CalendarCurrentIndicator;
