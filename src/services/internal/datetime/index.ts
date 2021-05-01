export const getUTCDateObj = (): Date => {
   const date = new Date();
   return convertDateToUTCDate(date);
};

export const convertDateToUTCDate = (date: Date): Date => {
   const utc = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
   );
   return new Date(utc);
};

export const isISOStr = (value: string): RegExpMatchArray => {
   return value.match(
      "^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$"
   );
};

/**
 * Example:
 * Get number of Sundays that appeared in January 2021
 * getWeeklyOccurrenceLength(2021, 0, 0)
 * Result: 5
 *
 * Get number of Sunday that appeared in January 2021 starting January 10th
 * getWeeklyOccurrenceLength(2021, 0, 0, 10)
 * Result: 5
 * @param year
 * @param month
 * @param dayOfWeek
 * @param dayOfMonth
 */
export const getWeeklyOccurrenceLength = (
   year: number,
   month: number,
   dayOfWeek: number,
   dayOfMonth = 1
): number => {
   let counter = 0;
   const specifiedDate = new Date(year, month, dayOfMonth);
   while (specifiedDate.getDay() !== dayOfWeek)
      specifiedDate.setDate(specifiedDate.getDate() + 1);
   while (specifiedDate.getMonth() === month) {
      if (specifiedDate.getDay() === dayOfWeek) {
         counter += 1;
         specifiedDate.setDate(specifiedDate.getDate() + 7);
         continue;
      }
      specifiedDate.setDate(specifiedDate.getDate() + 1);
   }
   return counter;
};

/**
 * Get number of biweekly occurrences of a day of week in a certain month
 * @param year
 * @param month
 * @param dayOfWeek
 * @param dayOfMonth
 */
export const getBiweeklyOccurrenceLength = (
   year: number,
   month: number,
   dayOfWeek: number,
   dayOfMonth = 1
): number => {
   let counter = 0;
   const specifiedDate = new Date(year, month, dayOfMonth);
   while (specifiedDate.getDay() !== dayOfWeek)
      specifiedDate.setDate(specifiedDate.getDate() + 1);
   while (specifiedDate.getMonth() === month) {
      if (specifiedDate.getDay() === dayOfWeek) {
         counter += 1;
         specifiedDate.setDate(specifiedDate.getDate() + 14);
         continue;
      }
      specifiedDate.setDate(specifiedDate.getDate() + 1);
   }
   return counter;
};

/**
 * Get the number of days in a month, given the month and year
 * @param month
 * @param year
 */
export const getNumberOfDaysInMonth = (month: number, year: number): number => {
   const monthToUse = new Date(year, month);
   monthToUse.setMonth(monthToUse.getMonth() + 1);
   monthToUse.setDate(0);
   return monthToUse.getDate();
};
