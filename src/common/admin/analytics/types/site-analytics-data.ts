export interface DayData {
    date: number;
    pageViews: number;
}

export interface WeeklyPageViews {
    current: DayData[];
    previous: DayData[];
}

export interface MonthlyPageViews {
    current: DayData[];
    previous: DayData[];
}

export interface BrowserData {
    browser: string;
    sessions: number;
}

export interface CountryData {
    country: string;
    sessions: number;
}

export interface SiteAnalyticsData {
    browsers: BrowserData[];
    countries: CountryData[];
    monthlyPageViews: MonthlyPageViews;
    weeklyPageViews: WeeklyPageViews;
}
