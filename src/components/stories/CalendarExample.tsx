import dayjs from "dayjs";
import React from "react";
import Calendar from "../Calendar";
import CalendarItem from "../CalendarItem";
import CalendarToolbarItem from "../CalendarToolbarItem";
import getTestData from "./testdata";

interface CalendarExampleProps {
	hourFrom: number;
	hourTo: number;
	dayNum: number;
	hourHeight: string;
}

const CalendarExample = ({ hourFrom, hourTo, dayNum, hourHeight }: CalendarExampleProps) => {
	const [calenderDate, changeDate] = React.useState(dayjs().timestamp());
	const events = React.useMemo(() => getTestData(calenderDate), [calenderDate]);
	return (
		<div className="onedash-calendar-example">
			<Calendar
				dayNum={dayNum}
				hourHeight={hourHeight}
				onStartDateChange={changeDate}
				startDate={calenderDate}
				hourFrom={hourFrom}
				hourTo={hourTo}>
				<CalendarToolbarItem>
					<button className="toolbar-btn highlight-btn">New Event</button>
				</CalendarToolbarItem>

				{events?.map((e, i) => (
					<CalendarItem key={i as any} title={e.name} from={e.from} to={e.to} className="event" />
				))}
			</Calendar>
		</div>
	);
};

export default CalendarExample;
