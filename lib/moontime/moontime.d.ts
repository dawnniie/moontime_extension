export interface MoonSettings {
    /** On/off toggle for the 'smooth time' between local and API, off prevents any API requests @default true */
    smooth: boolean;
    /** Speed of smooth syncing, where smaller values sync faster but will change the speed of the clock more - recommended between 50 and 10 @default 10 */
    smoothFactor: number;
    /** If large sync offsets (> 5 seconds) should be jumped, instead of making the clock change unnaturally fast @default true */
    smoothJumpLargeDiffs: boolean;
    /** Whether to log API request errors in the console @default false */
    logAPIErrors: boolean;
    /** How often to send API requests for syncing (in ms) @default 5000 */
    fetchInterval: 5000;
}
export declare class Moon extends EventTarget {
    static EPOCH: number;
    static MICRO_MOMENT_LEN: number;
    static API_ENDPOINT: string;
    static FORMATS: readonly [readonly ["microMoonMoments", "m"], readonly ["microMoonMomentsPadded", "mP"], readonly ["miniMoonMoments", "M"], readonly ["miniMoonMomentsPadded", "MP"], readonly ["moonMoments", "MM"], readonly ["moonMomentsPadded", "MMP"], readonly ["moonSegments", "MS"], readonly ["moonSegmentsPadded", "MSP"], readonly ["moonDays", "Md"], readonly ["moonDaysPadded", "MdP"], readonly ["moonDaysWithSuffix", "MdT"], readonly ["megaMoonMoment", "MeM"], readonly ["megaMoonMomentByName", "MeMT"], readonly ["moonAnnual", "MA"], readonly ["moonAnnualByName", "MAT"], readonly ["moonChunk", "MC"]];
    settings: MoonSettings;
    private _time;
    constructor(settings?: Partial<MoonSettings>);
    /**
     * Calculates the current moon time, using the 'smooth' time if smooth time is enabled or the 'API' time, falling back to the 'local' time.
     * @returns current moon time in micro moon moments.
     */
    now(): number;
    /**
     * Calculates a 'local' moon time based on the current device's clock.
     * @param t local process time to calculate the time for, defaults to the current time.
     * @returns 'local' moon time in micro moon moments.
     */
    local(t?: number): number;
    /**
     * Calculates a 'smooth' moon time based on a smooth transition from the 'local' moon time to the latest 'API' moon time.
     * @param t local process time to calculate the time for, defaults to the current time.
     * @returns 'smooth' moon time in micro moon moments.
     */
    smooth(t?: number): number;
    /**
     * Calculates an 'API' moon time based on the latest Moon API request data.
     * @param t local process time to calculate the time for, defaults to the current time.
     * @returns 'API' moon time in micro moon moments, or null if unavailable.
     */
    api(t?: number): number | null;
    /**
     * Convert a solar time to the equivalent moon time.
     * @param milliseconds solar time in unix milliseconds.
     * @returns moon time in micro moon moments.
     */
    solarToMoon(milliseconds: number): number;
    /**
     * Converts a moon time to the equivalent solar time.
     * @param micromoments moon time in micro moon moments.
     * @returns solar time in unix milliseconds.
     */
    moonToSolar(micromoments: number): number;
    private _updateSmooth;
    private _fetchAPI;
    /**
     * Formats the given moon time by breaking it down into the various time components and presenting them in useful ways.
     * @param micromoments moon time in micro moon moments, defaults to `moon.now()`.
     * @returns an object with all of the moon time units in varying formats.
     */
    formatMoonTime(micromoments?: number): {
        microMoonMoments: number;
        microMoonMomentsPadded: string;
        miniMoonMoments: number;
        miniMoonMomentsPadded: string;
        moonMoments: number;
        moonMomentsPadded: string;
        moonSegments: number;
        moonSegmentsPadded: string;
        moonDays: number;
        moonDaysPadded: string;
        moonDaysWithSuffix: string;
        megaMoonMoment: number;
        megaMoonMomentByName: string;
        moonAnnual: number;
        moonAnnualByName: string;
        moonChunk: number;
    };
    /**
     * Formats the given moon time by inserting the respective components into the given format string. Refer to the README or `Moon.FORMATS` for a reference of the available format keys.
     * @param string string to parse, replacing format keys with the moon time components.
     * @param micromoments moon time in micro moon moments, defaults to `moon.now()`.
     * @returns parsed string.
     */
    formatMoonString(string: string, micromoments?: number): string;
}
/** Event to indicate that the moon time has updated, dispatched every mini moon moment. */
export declare class MoonUpdateEvent extends Event {
    time: number;
    constructor(time: number);
}
/** Event to indicate that the moon time offset has updated, dispatched at the same frequency as main updates. */
export declare class MoonOffsetUpdateEvent extends Event {
    offset: number;
    constructor(offset: number);
}
/** Event to indicate the status of API connectivity, dispatched after every attempted request. */
export declare class MoonAPIStatusUpdateEvent extends Event {
    connected: boolean;
    constructor(connected: boolean);
}
export declare interface Moon {
    addEventListener(type: 'update', callback: ((evt: MoonUpdateEvent) => void) | null | EventListenerObject, options?: AddEventListenerOptions | boolean): void;
    addEventListener(type: 'offset_update', callback: ((evt: MoonOffsetUpdateEvent) => void) | null | EventListenerObject, options?: AddEventListenerOptions | boolean): void;
    addEventListener(type: 'api_status_update', callback: ((evt: MoonAPIStatusUpdateEvent) => void) | null | EventListenerObject, options?: AddEventListenerOptions | boolean): void;
}
