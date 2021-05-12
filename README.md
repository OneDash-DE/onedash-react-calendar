# React.js week calendar

This guide will help you render calendar component with React.js.
If you're not familiar with setting up a new React web project, please refer to the React documentation.

## Install

In order to install the components run the following:

```bash
npm install onedash-react-calendar
```

## Usage

All the described components can be imported from "onedash-react-calendar".

_Example:_

```jsx
const [calenderDate, changeDate] = React.useState(dayjs().timestamp());
const events = React.useMemo(() => getTestData(calenderDate), [calenderDate]);
return (
	<div className="onedash-calendar-example">
		<Calendar dayNum={dayNum} onStartDateChange={changeDate} startDate={calenderDate} hourFrom={hourFrom} hourTo={hourTo}>
			<CalendarToolbarItem>
				<button>New Event</button>
			</CalendarToolbarItem>

			{events?.map((e, i) => (
				<CalendarItem key={i as any} title={e.name} from={e.from} to={e.to} className="event" />
			))}
		</Calendar>
	</div>
);
```

## Styling

Most components come without any style. You can adjust it yourself by CSS. If you like the style in this documentation, you can use our stylesheet from [here](https://github.com/OneDash-DE/onedash-react-calendar/blob/main/src/components/stories/calendar.sass).
