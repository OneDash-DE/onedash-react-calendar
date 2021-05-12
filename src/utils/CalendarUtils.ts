export const frequencyTexts: any = {
	D: {
		single: "Tag",
		multiple: "Tage",
		every: "Täglich"
	},
	W: {
		single: "Woche",
		multiple: "Wochen",
		every: "Wöchentlich"
	},
	M: {
		single: "Monat",
		multiple: "Monate",
		every: "Monatlich"
	},
	Y: {
		single: "Jahr",
		multiple: "Jahre",
		every: "Jährlich"
	},
	P: {
		single: "Feiertag",
		multiple: "Feiertage",
		every: "An Feiertagen"
	},
	H: {
		single: "Schulferien",
		multiple: "Schulferien",
		every: "In den Schulferien"
	}
};
export const dayTexts: any = {
	Mo: "Montag",
	Tu: "Dienstag",
	We: "Mittwoch",
	Th: "Donnerstag",
	Fr: "Freitag",
	Sa: "Samstag",
	Su: "Sonntag"
};
export const frequencySelectOptions = (multiple: boolean) => {
	const mode = multiple ? "multiple" : "single";
	return [
		{
			label: frequencyTexts.D[mode],
			value: "D"
		},
		{
			label: frequencyTexts.W[mode],
			value: "W"
		},
		{
			label: frequencyTexts.M[mode],
			value: "M"
		},
		{
			label: frequencyTexts.Y[mode],
			value: "Y"
		},
		{
			label: frequencyTexts.P[mode],
			value: "P"
		}
	];
};

const decodePeriodRule = (rule: string) => {
	// Check syntax
	const regex = /(D|W|M|Y|P|H)(\((\w,?)*\))?\+\d(\+(((Mo)|(Tu)|(We)|(Th)|(Fr)|(Sa)|(Su))(,|$))*)?$/;
	if (!regex.test(rule)) {
		throw new Error("The period rule is not correct. The format is: Frequency[(frequency options)]+Interval[+Days]");
	}
	const [f, i, d] = rule.split("+");

	const frequency = f.split("(")[0];
	const frequencyOptions = f.match(/\((.*?)\)/)?.[1]?.split(",");
	const interval = Number(i);
	const days = d ? d.split(",") : undefined;

	return {
		frequency,
		frequencyOptions,
		interval,
		days
	};
};
const periodRuleToText = (rule?: string | null) => {
	if (!rule) return "Unbekannte Regel";

	const { days, frequency, interval } = decodePeriodRule(rule);
	let dString = "";
	if (days) {
		if (days.length >= 2) {
			const last = dayTexts[days.pop() as string];
			dString = `${days.map((d) => dayTexts[d]).join(", ")} und ${last}`;
		} else {
			dString = `am ${dayTexts[days[0]]}`;
		}
	}

	if (interval === 1) {
		return `${frequencyTexts[frequency].every} ${dString}`;
	}
	if (interval === 2) {
		return `Alle zwei ${frequencyTexts[frequency].multiple} ${dString}`;
	}

	return `Alle ${interval} ${frequencyTexts[frequency].multiple} ${dString}`;
};

const CalendarUtils = { periodRuleToText };

export default CalendarUtils;
