export const getUTCDateObj = (): Date => {
   const date = new Date();
   return convertDateToUTCDate(date);
}

export const convertDateToUTCDate = (date: Date) => {
   const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
   return new Date(utc);
}

export const isISOStr = (value: string) => {
   return value.match("^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$");
}