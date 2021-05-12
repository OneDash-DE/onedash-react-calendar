import React from "react";
import localeMessages from "../localization/LocaleMessages";
import { LocaleCodes } from "../localization/localeTypes";
import { FullPageCalendarToolbarProps } from "../types";
import MediaRender from "../utils/MediaRender";

const CalendarToolbar = (props: FullPageCalendarToolbarProps) => {
	const { calendarTitle, todayEnabled } = props;
	return (
		<div className="onedash-calendar-toolbar">
			<MediaRender type="desktop">
				<div className="left">{props.additionalItems}</div>
				<div className="center">
					<h1>{calendarTitle}</h1>
				</div>
				<div className="right">
					<div className="period-switch">
						<button disabled={!todayEnabled} className="toolbar-btn highlight-btn" onClick={props.onToday}>
							{localeMessages()[LocaleCodes.Today]}
						</button>
						<button className="nav-btn" onClick={props.onPrevInterval}>
							&lt;
						</button>
						<button className="nav-btn" onClick={props.onNextInterval}>
							&gt;
						</button>
					</div>
				</div>
			</MediaRender>
			<MediaRender type="mobile">
				<button className="nav-btn" onClick={props.onPrevInterval}>
					<i className="lnir lnir-chevron-left" />
				</button>
				<h1>{calendarTitle}</h1>
				<button className="nav-btn" onClick={props.onNextInterval}>
					<i className="lnir lnir-chevron-right" />
				</button>
			</MediaRender>
		</div>
	);
};

export default CalendarToolbar;
