export type LogLevel = "none" | "error" | "warn" | "info" | "debug";

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

	private logStyled(level: LogLevel, ...args: any[]) {
		if (!this.shouldLog(level)) return;

		const style = LEVEL_STYLES[level];
		const prefix = `%c[${this.context}]`;
		const method =
			level === "debug"
				? console.debug
				: level === "info"
					? console.info
					: level === "warn"
						? console.warn
						: level === "error"
							? console.error
							: console.log;

		method(prefix, style, ...args);
	}

	debug(...args: any[]) {
		this.logStyled("debug", ...args);
	}
	info(...args: any[]) {
		this.logStyled("info", ...args);
	}
	warn(...args: any[]) {
		this.logStyled("warn", ...args);
	}
	error(...args: any[]) {
		this.logStyled("error", ...args);
	}
}

// Default logger instance for global use
export const log = new Logger();

// Scoped loggers — share global log level, only change context
export function logScope(name: string): Logger {
	return new Logger(`Brumes:${name}`);
}
