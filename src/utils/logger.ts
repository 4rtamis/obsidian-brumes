export type LogLevel = "none" | "error" | "warn" | "info" | "debug";
type ActiveLogLevel = Exclude<LogLevel, "none">;
type LogArgs = readonly unknown[];

// Global shared log level
let currentLogLevel: LogLevel = "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
	none: 5,
	error: 4,
	warn: 3,
	info: 2,
	debug: 1,
};

const LEVEL_STYLES: Record<LogLevel, string> = {
	debug: "color: #9CDCFE;",
	info: "color: #B5CEA8;",
	warn: "color: #DCDCAA;",
	error: "color: #F48771;",
	none: "",
};

class Logger {
	private context: string;

	// eslint-disable-next-line obsidianmd/prefer-active-doc
	constructor(context = "Brumes") {
		this.context = context;
	}

	// Shared global setter
	setLevel(level: LogLevel) {
		currentLogLevel = level;
	}

	private shouldLog(level: LogLevel): boolean {
		return LEVEL_ORDER[currentLogLevel] <= LEVEL_ORDER[level];
	}

	private logStyled(level: ActiveLogLevel, ...args: LogArgs) {
		if (!this.shouldLog(level)) return;

		const style = LEVEL_STYLES[level];
		const prefix = `%c[${this.context}]`;
		this.writeToConsole(level, prefix, style, args);
	}

	private writeToConsole(
		level: ActiveLogLevel,
		prefix: string,
		style: string,
		args: LogArgs,
	) {
		/* eslint-disable obsidianmd/rule-custom-message */
		switch (level) {
			case "debug":
				console.debug(prefix, style, ...args);
				return;
			case "info":
				console.info(prefix, style, ...args);
				return;
			case "warn":
				console.warn(prefix, style, ...args);
				return;
			case "error":
				console.error(prefix, style, ...args);
				return;
		}
		/* eslint-enable obsidianmd/rule-custom-message */
	}

	debug(...args: LogArgs) {
		this.logStyled("debug", ...args);
	}
	info(...args: LogArgs) {
		this.logStyled("info", ...args);
	}
	warn(...args: LogArgs) {
		this.logStyled("warn", ...args);
	}
	error(...args: LogArgs) {
		this.logStyled("error", ...args);
	}
}

// Default logger instance for global use
export const log = new Logger();

// Scoped loggers — share global log level, only change context
export function logScope(name: string): Logger {
	return new Logger(`Brumes:${name}`);
}
