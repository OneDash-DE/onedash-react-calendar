import { Dayjs } from "dayjs";

export interface CalendarItemProps {
	from: number;
	to: number;
	description?: string;
	title?: string;
	style?: React.CSSProperties;
	color?: string;
	className?: string;
	onClick?: () => void;
	active?: boolean;
}

export interface CalendarCurrentIndicatorProps {
	hourFrom: number;
	hourTo: number;
	hourAmp: number;
	hourOffset: number;
}
export interface CalendarItemType {
	from: Dayjs;
	to: Dayjs;
	origFrom: Dayjs;
	origTo: Dayjs;
	child: any;
	lane: number;
	laneNum: number;
	occurence: number;
}
export type CalendarItems = CalendarItemType[];

export interface CalendarState {
	startOfInterval: Dayjs;
	endOfInterval: Dayjs;
	hourFrom: number;
	hourTo: number;
}

export interface FullPageCalendarToolbarProps {
	calendarTitle?: string;
	onNextInterval?: () => void;
	onPrevInterval?: () => void;
	onToday?: () => void;
	todayEnabled: boolean;
	additionalItems?: React.ReactNode[];
	dateChangeDisabled?: boolean;
}

export interface CalendarProps {
	/**
	 * Selected Startdate of full page calendar
	 */
	startDate?: number;

	/**
	 * Hour from which the calendar should start
	 */
	hourFrom?: number;

	/**
	 * Hour where the calendar should end
	 */
	hourTo?: number;
	/**
	 * How much days should be shown. Adjust for mobile to 3 or 1
	 */
	dayNum?: number;

	/**
	 * Hour height. Defaults to 75px
	 */
	hourHeight?: string;

	dateChangeDisabled?: boolean;

	onStartDateChange?: (startDate: number) => void;
}
