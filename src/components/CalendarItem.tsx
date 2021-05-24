/* eslint-disable no-underscore-dangle */
import dayjs from "dayjs";
import React from "react";
import { CalendarItemProps } from "../types";
import DateUtils from "../utils/DateUtils";

const defaultColor = "#36aeb3";

const CalendarItem = (props: CalendarItemProps) => {
	const { description, style, title } = props;
	const from = dayjs(props.from);
	const to = dayjs(props.to);

	const origFrom = dayjs((props as any)._origFrom);
	const origTo = dayjs((props as any)._origTo);

	const diff = DateUtils.setTime(origTo).diff(DateUtils.setTime(origFrom), "day");

	let dateTime;
	if (diff > 0) {
		// Multiple days
		if (
			origFrom.get("h") +
				origFrom.get("m") +
				origFrom.get("s") +
				origTo.get("millisecond") +
				origTo.get("h") +
				origTo.get("m") +
				origTo.get("s") +
				origTo.get("millisecond") ===
			0
		) {
			// Full day event
			if (diff === 1) {
				dateTime = origFrom.format("D.MM");
			} else {
				dateTime = `${origFrom.format("D.MM")} - ${origTo.subtract(1, "millisecond").format("D.MM")}`;
			}
		} else {
			dateTime = `${origFrom.format("D.MM")} - ${origTo.format("D.MM")}`;
		}
	} else {
		dateTime = `${from.format("HH:mm")} - ${to.format("HH:mm")}`;
	}

	const getClassName = () => {
		let className = "onedash-calendar-item";
		if (props.className) className += ` ${props.className}`;
		if (props.active) className += " active";
		return className;
	};

	const color = props.color ?? defaultColor;
	const content = (
		<div style={{ backgroundColor: `${color}60`, borderColor: color, color }}>
			<div>
				<div>
					<h2 title={title} className="title">
						{title}
					</h2>
					<p title={description} className="description">
						{description}
					</p>
				</div>
				<div>
					<p className="time" title={dateTime}>
						{dateTime}
					</p>
				</div>
			</div>
		</div>
	);
	return (
		<>
			{props.onClick && (
				<button onClick={() => props.onClick?.()} style={style} className={getClassName()}>
					{content}
				</button>
			)}
			{!props.onClick && (
				<div style={style} className={getClassName()}>
					{content}
				</div>
			)}
		</>
	);
};

export default CalendarItem;
