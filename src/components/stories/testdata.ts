import dayjs from "dayjs";

interface TestDataTimeslot {
	from: number;
	to: number;
	name: string;
}
const timeslots = [
	{
		from: { day: 0, hour: 10, minute: 30 },
		to: { day: 0, hour: 12, minute: 0 },
		name: "Meeting with richard"
	},
	{
		from: { day: 0, hour: 8, minute: 0 },
		to: { day: 0, hour: 10, minute: 0 },
		name: "Project X"
	},
	{
		from: { day: 2, hour: 8, minute: 0 },
		to: { day: 3, hour: 10, minute: 0 },
		name: "Two day event"
	},
	{
		from: { day: 5, hour: 0, minute: 0 },
		to: { day: 6, hour: 0, minute: 0 },
		name: "Full day event"
	}
];
const getTestData = (timestamp: number) => {
	const date = dayjs(timestamp);
	const startOfWeek = date.startOf("week");
	return timeslots.map((slot) => {
		return {
			name: slot.name,
			from: startOfWeek.add(slot.from.day, "day").set("hour", slot.from.hour).set("minute", slot.from.minute).timestamp(),
			to: startOfWeek.add(slot.to.day, "day").set("hour", slot.to.hour).set("minute", slot.to.minute).timestamp()
		} as TestDataTimeslot;
	});
};
export default getTestData;
