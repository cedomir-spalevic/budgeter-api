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
 * getWeeklyOcurrenceLength(0, 0, 2021)
 * Result: 5
 * @param dayOfWeek
 * @param month
 * @param year
 */
export const getWeeklyOccurrenceLength = (
   dayOfWeek: number,
   month: number,
   year: number
): number => {
   let counter = 0;
   const monthToUse = new Date(year, month, 1);
   while (monthToUse.getMonth() === month) {
      if (monthToUse.getDay() === dayOfWeek) {
         counter += 1;
         monthToUse.setDate(monthToUse.getDate() + 7);
         continue;
      }
      monthToUse.setDate(monthToUse.getDate() + 1);
   }
   return counter;
};

/**
 *
 * @param dayOfWeek
 * @param month
 * @param year
 */
export const getBiweeklyOccurrenceLength = (
   dayOfWeek: number,
   month: number,
   year: number
): number => {
   let counter = 0;
   const monthToUse = new Date(year, month, 1);
   while (monthToUse.getMonth() === month) {
      if (monthToUse.getDay() === dayOfWeek) {
         counter += 1;
         monthToUse.setDate(monthToUse.getDate() + 14);
         continue;
      }
      monthToUse.setDate(monthToUse.getDate() + 1);
   }
   return counter;
};
