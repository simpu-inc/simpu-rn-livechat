import {
  differenceInDays,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
  format,
  formatDistanceToNow,
  formatRelative,
  isToday,
  isYesterday
} from 'date-fns';

//snippet to format message time
export const messgeTimeFormater = (time: Date) => {
  try {
    let TimePased;
    const currrentDate = new Date();
    const olDDate = new Date(time);

    let DateDiff = currrentDate?.getTime() - olDDate?.getTime();
    let msDays = 1000 * 3600 * 24;
    let DaysPassed = DateDiff / msDays;

    TimePased =
      DaysPassed > 2
        ? format(new Date(time), 'd/M/yyyy')
        : formatDistanceToNow(new Date(time), {
            addSuffix: true,
            includeSeconds: true,
          });

    return TimePased?.replace(/about/g, '');
  } catch (error) {
    console.log(error);
  }
};

//snippet to format general date
export const formatDate = (time: string) => {
  const formatedDate = format(new Date(time), 'dd-MMM-yyyy h:m aaaa');
  return formatedDate;
};

//snippet to format notification date
export const notificationDateFormat = (time: string) => {

  const formatedDate = formatRelative(new Date(time), new Date());

  return formatedDate;
};

//get the date of a specific day ago
export const getDateXDaysAgo = (numOfDays: any, date = new Date()) => {
  const daysAgo = new Date(date?.getTime());
  daysAgo?.setDate(date.getDate() - numOfDays);
  return daysAgo;
};



export const formatMediaDate = (time: Date) => {
  const now = new Date();
  switch (true) {
    case isToday(time):
      return format(time, 'hh:mm a');
    case isYesterday(time):
      return `Yesterday, ${format(time, 'hh:mm a')}`;
    case differenceInDays(now, time) < 7:
      return format(time, 'eee, hh:mm a ');
    case differenceInYears(now, time) === 0:
      return format(time, 'dd MMM hh:mm a');
    default:
      return format(time, 'dd MMM yyyy hh:mm a');
  }
};

export const formatMarginalDate = (time: Date) => {
  const now = new Date();
  switch (true) {
    case isToday(time):
      return `Today`;
    case isYesterday(time):
      return `Yesterday`;
    case differenceInDays(now, time) < 7:
      return format(time, 'eeee');
    case differenceInMonths(now, time) < 1:
      return format(time, 'MMM d, yyy ');
    case differenceInYears(now, time) === 0:
      return format(time, 'MMM d, yyy');
    default:
      return format(time, 'MMM d, YYY');
  }
};


export const formatMessageDateTime = (time:Date | string) => {
  const now = new Date();
  switch (true) {
    case differenceInSeconds(now, time) < 60:
      return 'a few seconds ago';
    case isToday(time):
      return format(time, 'hh:mm a');
    case isYesterday(time):
      return `Yesterday, ${format(time, 'hh:mm a')}`;
    case differenceInDays(now, time) < 7:
      return format(time, 'eee, hh:mm a ');
    case differenceInYears(now, time) === 0:
      return format(time, 'dd MMM hh:mm a');
    default:
      return format(time, 'dd MMM yyyy hh:mm a');
  }
};



