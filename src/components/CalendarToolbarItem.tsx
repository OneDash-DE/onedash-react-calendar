import React from "react";

interface CalendarToolbarItemProps {
	children: React.ReactChild;
}

const CalendarToolbarItem = (props: CalendarToolbarItemProps) => {
	return <>{props.children}</>;
};

export default CalendarToolbarItem;
