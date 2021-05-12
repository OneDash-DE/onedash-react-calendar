export enum LocaleCodes {
	UnknownDate,
	Today,
	oClock
}
export type LocaleMessages = { [key in LocaleCodes]: string };
