export const getUTCDateObj = (): Date => {
   const date = new Date();
   return convertDateToUTCDate(date);
}

export const convertDateToUTCDate = (date: Date) => {
   const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
   return new Date(utc);
}