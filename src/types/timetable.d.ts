// TODO: Share types with web

type Timetable = {
  _id?: string;
  title: string;
  university?: string;
  year?: string;
  semester?: number;
  schedules: Schedule[];
};

type Schedule = {
  title: string;
  abbreviation?: string;
  weekTimes: WeekTime[];
  code?: string;
  section?: number;
  creditHours?: number;
  lecturer?: string;
  venue?: string;
  color?: string;
};

type WeekTime = {
  start: string;
  end: string;
  day: number;
};
