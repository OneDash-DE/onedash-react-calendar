/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-array-index-key */
import dayjs, { Dayjs } from "dayjs";
import React, { Component } from "react";
import CalendarToolbar from "./CalendarToolbar";
import CalendarItem from "./CalendarItem";
import CalendarCurrentIndicator from "./CalendarCurrentIndicator";
import CalendarToolbarItem from "./CalendarToolbarItem";
import { CalendarItems, CalendarItemType, CalendarProps, CalendarState } from "../types";
import DateUtils from "../utils/DateUtils";
import MediaRender from "../utils/MediaRender";
import localeMessages from "../localization/LocaleMessages";
import { LocaleCodes } from "../localization/localeTypes";

export default class Calendar extends Component<CalendarProps, CalendarState> {
	interval: NodeJS.Timeout | undefined;

	constructor(props: CalendarProps) {
		super(props);
		this.state = {
			startOfInterval: dayjs(),
			endOfInterval: dayjs(),
			hourFrom: props.hourFrom ?? 8,
			hourTo: props.hourTo ?? 17
		};
	}

	componentDidMount() {
		this.setPropsDate();
	}

	componentDidUpdate(lastProps: CalendarProps) {
		if (lastProps.startDate !== this.props.startDate) {
			this.setPropsDate();
		}
		if (lastProps.hourFrom !== this.props.hourFrom && this.props.hourFrom && this.props.hourFrom < this.state.hourTo) {
			this.setState({ hourFrom: this.props.hourFrom ?? 8 });
		}
		if (lastProps.hourTo !== this.props.hourTo && this.props.hourTo && this.props.hourTo > this.state.hourFrom) {
			this.setState({ hourTo: this.props.hourTo ?? 17 });
		}
	}

	componentWillUnmount() {
		clearInterval(this.interval as any);
	}

	getDayNum = () => this.props.dayNum ?? 7;

	setPropsDate = () => {
		this.setState(this.getDateInverval(dayjs(this.props.startDate)));
	};

	changeInterval = (next: boolean) => {
		const dayNum = this.getDayNum();
		this.setState((state) => {
			const newDate = state.startOfInterval.add(next === true ? 1 * dayNum : -1 * dayNum, "day");
			this.props.onStartDateChange?.(newDate.timestamp());
			return {
				startOfInterval: newDate.clone(),
				endOfInterval: newDate.clone().add(dayNum, "day").subtract(1, "second")
			};
		});
	};

	getDateInverval = (date?: Dayjs) => {
		const dayNum = this.getDayNum();
		const startOfInterval = dayNum === 7 ? DateUtils.setTime(dayjs(date).startOf("week")) : DateUtils.setTime(dayjs(date));
		const endOfInterval = startOfInterval.clone().add(dayNum, "day").subtract(1, "second");

		return { startOfInterval, endOfInterval };
	};

	setToday = () => {
		const interval = this.getDateInverval(dayjs());
		this.props.onStartDateChange?.(interval.startOfInterval.timestamp());
		this.setState(interval);
	};

	dayNumClassName = (baseClassName: string, dayNum: number) => {
		let className = baseClassName;
		if (dayNum === 0) className += " first";

		if (dayNum === this.getDayNum() - 1) className += " last";
		return className;
	};

	calendarItemStyle = (item: CalendarItemType) => {
		const { endOfInterval, startOfInterval } = this.state;
		const { from, to } = item;
		const dayNum = this.getDayNum();

		const hourAmp = this.state.hourTo - this.state.hourFrom + 1;
		const hourOffset = 1 / (hourAmp * 2);
		const fromHour = from.get("hour") + from.get("minute") / 60;
		const toHour = to.get("hour") + to.get("minute") / 60;

		let width = `${(1 / dayNum) * (100 / (item.laneNum ?? 1))}%`;

		// If it's over two days (e.g. sunday to monday, monday shouldn't be showed)
		if (to.timestamp() > endOfInterval.timestamp() || !from.isSameOrAfter(startOfInterval)) {
			const end = to.timestamp() > endOfInterval.timestamp() ? endOfInterval : to;
			const start = from.isSameOrAfter(startOfInterval) ? from : startOfInterval;

			const days = end.diff(start, "day") + 1;

			width = `${(days / dayNum) * 100}%`;
		}

		const top = `${((fromHour - this.state.hourFrom) / hourAmp + hourOffset) * 100}%`;
		const height = `${
			((toHour - this.state.hourFrom) / hourAmp + hourOffset) * 100 - ((fromHour - this.state.hourFrom) / hourAmp + hourOffset) * 100
		}%`;
		// Calculate left offset
		const leftOffset = from.diff(this.state.startOfInterval, "day");

		const conflictOffset = item.lane > 1 ? (100 / dayNum / item.laneNum) * (item.lane - 1) : 0;

		const left = `${((leftOffset > 0 ? leftOffset : 0) / dayNum) * 100 + conflictOffset}%`;

		return { width, top, height, left };
	};

	getConflictingCalenderItems = () => {
		const { endOfInterval, startOfInterval } = this.state;
		let calendarItems: CalendarItems = [];

		const getItems = (c: any, cItems: CalendarItems) => {
			React.Children.forEach(c, (child) => {
				if (!child) return;
				if (child.props && child.props.children && typeof child.props.children === "object") {
					getItems(child.props.children, cItems);
				}
				if (child.type === CalendarItem) {
					const origFrom = dayjs(child.props.from);
					const origTo = dayjs(child.props.to);
					const diff = DateUtils.setTime(origTo).diff(DateUtils.setTime(origFrom), "day");
					for (let ii = 0; ii <= diff; ii++) {
						let from = origFrom.clone();
						let to = origTo.clone();
						const day = origFrom.add(ii, "d");
						if (
							ii > 0 ||
							from.isBefore(
								from
									.clone()
									.set("h", this.state.hourFrom - 1)
									.set("m", 30)
							)
						) {
							from = DateUtils.setTime(day, this.state.hourFrom - 1, 30);
						}
						if (ii < diff) {
							to = DateUtils.setTime(day, this.state.hourTo, 30);
						}

						const toHour = to.get("hour") + to.get("minute") / 60;

						if (
							from.isSameOrBefore(endOfInterval) &&
							to.isSameOrAfter(startOfInterval) &&
							!(ii === diff && toHour < this.state.hourFrom - 0.5)
						) {
							cItems.push({ from, to, origFrom, origTo, child, occurence: ii, lane: 1, laneNum: 1 });
						}
					}
				}
			});
		};
		getItems(this.props.children, calendarItems);

		const assignedItems: CalendarItems = [];

		// Order calendar items
		calendarItems = calendarItems.sort((x, y) => y.to.timestamp() - y.from.timestamp() - (x.to.timestamp() - x.from.timestamp()));

		// Assign calendar items to lanes
		calendarItems.forEach((item) => {
			let lane = 1;
			let assigned = false;
			while (!assigned) {
				const conflicting = assignedItems.filter((x) => item.from.isBefore(x.to) && item.to.isAfter(x.from));

				if (conflicting.length === 0) {
					item.lane = lane;
					item.laneNum = lane;
					assignedItems.push(item);
					assigned = true;
					return;
				}
				const laneNum = conflicting.reduce((prev, current) => (prev.laneNum > current.laneNum ? prev : current)).laneNum;

				// eslint-disable-next-line @typescript-eslint/no-loop-func
				if (conflicting.find((x) => x.lane === lane)) {
					lane++;
					if (lane > laneNum) {
						// eslint-disable-next-line @typescript-eslint/no-loop-func
						conflicting.forEach((i) => {
							i.laneNum = lane;
						});
					}
				} else {
					item.lane = lane;
					item.laneNum = laneNum;
					assignedItems.push(item);
					assigned = true;
				}
			}
		});

		return assignedItems;
	};

	cloneCalendarItems = (calendarItems: CalendarItems) => {
		return calendarItems.map((item) => {
			const { child, from, origFrom, origTo, to, occurence } = item;
			const element = React.cloneElement(
				child,
				{
					_origFrom: origFrom.timestamp(),
					_origTo: origTo.timestamp(),
					from: from.timestamp(),
					to: to.timestamp(),
					style: {
						...child.props.style,
						...this.calendarItemStyle(item)
					},
					key: `${child.key}-${occurence}`
				},
				[]
			);

			return element;
		});
	};

	getCalendarItemElements = () => {
		const calendarItems = this.getConflictingCalenderItems();
		return this.cloneCalendarItems(calendarItems);
	};

	getToolbarItems = () => {
		const children: React.ReactNode[] = [];
		React.Children.forEach(this.props.children as any, (child) => {
			if (!child) return;
			if (child?.type === CalendarToolbarItem) {
				children.push(child);
			}
		});
		return children;
	};

	hourHeight = () => this.props.hourHeight ?? "75px";

	render() {
		const { endOfInterval, hourFrom, hourTo, startOfInterval } = this.state;
		const dayNum = this.getDayNum();

		const hourAmp = hourTo - hourFrom + 1;
		const hourOffset = 1 / (hourAmp * 2);

		return (
			<div className="onedash-calendar">
				<CalendarToolbar
					onNextInterval={() => this.changeInterval(true)}
					onPrevInterval={() => this.changeInterval(false)}
					onToday={this.setToday}
					todayEnabled={!(startOfInterval.isBefore(dayjs()) && endOfInterval.isAfter(dayjs()))}
					calendarTitle={`${startOfInterval.format("D.MM")} - ${endOfInterval.format("D.MM YYYY")}`}
					additionalItems={this.getToolbarItems()}
					dateChangeDisabled={this.props.dateChangeDisabled}
				/>
				<div className="onedash-calendar-content">
					<div className="onedash-calendar-head" style={{ gridTemplateColumns: `100px repeat(${dayNum}, 1fr)` }}>
						{/* 			HEADER 				*/}
						<div className="onedash-calendar-head-legend" />
						{[...Array(dayNum)].map((_, i) => {
							const day = startOfInterval.clone().add(i, "day");
							return (
								<div key={day.timestamp()} className={this.dayNumClassName("onedash-calendar-head-day-head", i)}>
									<MediaRender type="desktop" size={dayNum * 165}>
										<span className={day.isSame(dayjs(), "day") ? "same-day" : ""}>{day.format("D")}</span>
										<h2>{day.format("dddd")}</h2>
									</MediaRender>
									<MediaRender type="mobile" size={dayNum * 165}>
										<span className={day.isSame(dayjs(), "day") ? "same-day small" : "small"}>{day.format("D")}</span>
										<h2>{day.format("dd")}</h2>
									</MediaRender>
								</div>
							);
						})}
					</div>
					<div className="onedash-calendar-body-wrapper">
						<div className="onedash-calendar-body" style={{ gridTemplateColumns: `100px repeat(${dayNum}, 1fr)` }}>
							{/* 			BODY TEMPLATE				*/}
							<div
								className="onedash-calendar-body-legend"
								style={{ gridTemplateRows: `repeat(${hourTo - hourFrom + 1},${this.hourHeight()})` }}>
								{[...Array(hourTo - hourFrom + 1)].map((_, i) => (
									// eslint-disable-next-line react/no-array-index-key
									<p key={i}>
										{(hourFrom + i).toFixed(2)} {localeMessages()[LocaleCodes.oClock]}
									</p>
								))}
							</div>
							{[...Array(dayNum)].map((_, i) => {
								// eslint-disable-next-line react/no-array-index-key
								return <div key={i} className={this.dayNumClassName("onedash-calendar-body-day", i)} />;
							})}

							<div className="onedash-calendar-body-lines">
								{/* 			HOUR LINES				*/}
								{[...Array(hourAmp)].map((_, i) => {
									return (
										<div
											// eslint-disable-next-line react/no-array-index-key
											key={i}
											style={{ top: `calc(${(hourOffset + i / hourAmp) * 100}%)` }}
											className="onedash-calendar-body-lines-hour"
										/>
									);
								})}

								{/* 			CURRENT TIME		 */}
								<CalendarCurrentIndicator hourAmp={hourAmp} hourFrom={hourFrom} hourOffset={hourOffset} hourTo={hourTo} />
							</div>

							<div className="onedash-calendar-items">{this.getCalendarItemElements()}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
