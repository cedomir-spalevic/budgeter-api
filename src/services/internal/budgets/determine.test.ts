import { test, expect, describe } from "@jest/globals";
import { IBudgetItem } from "models/data/budgetItem";
import { ObjectId } from "mongodb";
import { getBudgetItems } from "./determine";

/**
 * date 1-31
 * month 0-11
 * year [0-9][0-9][0-9][0-9]
 */
describe("A one time payment worth $10 due April 30th, 2021", () => {
   const items: IBudgetItem[] = [
      {
         _id: new ObjectId(),
         userId: new ObjectId(),
         createdOn: new Date(),
         modifiedOn: new Date(),
         title: "",
         amount: 10,
         initialDay: 5,
         initialDate: 30,
         initialMonth: 3,
         initialYear: 2021,
         recurrence: "oneTime"
      }
   ];
   test("It should show up on the budget for April 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 3,
         month: 3,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("The total amount should be 10 for April 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 3,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].totalAmount).toBe(10);
   });
   test("It should not be due April 29th", () => {
      const budgetItems = getBudgetItems(items, {
         date: 29,
         month: 3,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should be due April 30th", () => {
      const budgetItems = getBudgetItems(items, {
         date: 30,
         month: 3,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeTruthy();
   });
   test("It should show up once in April 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 30,
         month: 3,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].numberOfOccurrences).toBe(1);
   });
   test("It should not show up on the budget for May 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 4,
         year: 2021
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should not show up on the budget for April 2020", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 3,
         year: 2020
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should not show up on the budget for April 2022", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 3,
         year: 2022
      });
      expect(budgetItems.length).toBe(0);
   });
});

describe("A payment worth $25.25 due every day starting January 10th, 2021", () => {
   const items: IBudgetItem[] = [
      {
         _id: new ObjectId(),
         userId: new ObjectId(),
         createdOn: new Date(),
         modifiedOn: new Date(),
         title: "",
         amount: 25.25,
         initialDay: 0,
         initialDate: 10,
         initialMonth: 0,
         initialYear: 2021,
         recurrence: "daily"
      }
   ];
   test("It should show up on the budget for January 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 0,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
   });
   test("It should not show up for December 2020", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 11,
         year: 2020
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should not show up for July 2020", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 6,
         year: 2020
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should be due today", () => {
      const today = new Date();
      const budgetItems = getBudgetItems(items, {
         date: today.getDate(),
         month: today.getMonth(),
         year: today.getFullYear()
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeTruthy();
   });
   test("It should occur 22 times in January 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 11,
         month: 0,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].numberOfOccurrences).toBe(22);
   });
   test("It should occur 2 times in January 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 0,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].numberOfOccurrences).toBe(22);
   });
   test("The total amount should be $530.25 for January 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 0,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].totalAmount).toBe(555.5);
   });
   test("The total amount should be $707 for February 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 1,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].totalAmount).toBe(707);
   });
   test("It should occur 31 times in July 2023", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 6,
         year: 2023
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].numberOfOccurrences).toBe(31);
   });
   test("It should be due on December 25th, 2022", () => {
      const budgetItems = getBudgetItems(items, {
         date: 25,
         month: 11,
         year: 2022
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeTruthy();
   });
});

describe("A payment worth $1 due every day starting May 1st, 2021", () => {
   const items: IBudgetItem[] = [
      {
         _id: new ObjectId(),
         userId: new ObjectId(),
         createdOn: new Date(),
         modifiedOn: new Date(),
         title: "",
         amount: 1,
         initialDay: 6,
         initialDate: 1,
         initialMonth: 4,
         initialYear: 2021,
         recurrence: "daily"
      }
   ];
   test("It should show up on the budget for January 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 0,
         year: 2021
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should show up for May 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 4,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
   });
   test("It should show occur 31 times in May 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 4,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].numberOfOccurrences).toBe(31);
   });
   test("The total amount should be $31 for May 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 4,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].totalAmount).toBe(31);
   });
});

describe("A payment worth $300 every Month on the 10th day starting October 1999", () => {
   const items: IBudgetItem[] = [
      {
         _id: new ObjectId(),
         userId: new ObjectId(),
         createdOn: new Date(),
         modifiedOn: new Date(),
         title: "",
         amount: 300,
         initialDay: 0,
         initialDate: 10,
         initialMonth: 9,
         initialYear: 1999,
         recurrence: "monthly"
      }
   ];
   test("It should show up on the budget for October 1999", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 9,
         year: 1999
      });
      expect(budgetItems.length).toBe(1);
   });
   test("It should not show up for December 1998", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 11,
         year: 1998
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should show up for July 2020", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 6,
         year: 2020
      });
      expect(budgetItems.length).toBe(1);
   });
   test("It should be due on January 10th, 2010", () => {
      const budgetItems = getBudgetItems(items, {
         date: 10,
         month: 0,
         year: 2010
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeTruthy();
   });
   test("It should occur 1 time in January 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 11,
         month: 0,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].numberOfOccurrences).toBe(1);
   });
   test("It should occur 1 times in August 2007", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 7,
         year: 2007
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].numberOfOccurrences).toBe(1);
   });
   test("It should not be due on August 7th, 2007", () => {
      const budgetItems = getBudgetItems(items, {
         date: 7,
         month: 7,
         year: 2007
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should not be due on October 11, 2000", () => {
      const budgetItems = getBudgetItems(items, {
         date: 11,
         month: 9,
         year: 2000
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should be due on June 10th, 2013", () => {
      const budgetItems = getBudgetItems(items, {
         date: 10,
         month: 5,
         year: 2013
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeTruthy();
   });
   test("The total amount should be $300 for January 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 0,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].totalAmount).toBe(300);
   });
   test("The total amount should be $300 for February 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 1,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].totalAmount).toBe(300);
   });
   test("It should not show up for August 1999", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 7,
         year: 1999
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should show up for December 1999", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 11,
         year: 1999
      });
      expect(budgetItems.length).toBe(1);
   });
});

describe("A payment worth $750 every year the 8th day of August starting in 2012", () => {
   const items: IBudgetItem[] = [
      {
         _id: new ObjectId(),
         userId: new ObjectId(),
         createdOn: new Date(),
         modifiedOn: new Date(),
         title: "",
         amount: 750,
         initialDay: 3,
         initialDate: 8,
         initialMonth: 7,
         initialYear: 2012,
         recurrence: "yearly"
      }
   ];
   test("It should show not up on the budget for October 1999", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 9,
         year: 1999
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should not show up for August 2011", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 7,
         year: 2011
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should show up for August 2012", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 7,
         year: 2012
      });
      expect(budgetItems.length).toBe(1);
   });
   test("It should show up for August 2013", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 7,
         year: 2013
      });
      expect(budgetItems.length).toBe(1);
   });
   test("It should not show up for July 2012", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 6,
         year: 2012
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should not show up for September 2012", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 8,
         year: 2012
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should not show up for July 2017", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 6,
         year: 2017
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should not be due on August 9th, 2012", () => {
      const budgetItems = getBudgetItems(items, {
         date: 9,
         month: 7,
         year: 2012
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should not be due on August 7th, 2012", () => {
      const budgetItems = getBudgetItems(items, {
         date: 7,
         month: 7,
         year: 2012
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should not be due on August 9th, 2019", () => {
      const budgetItems = getBudgetItems(items, {
         date: 9,
         month: 7,
         year: 2019
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should not be due on August 7th, 2019", () => {
      const budgetItems = getBudgetItems(items, {
         date: 7,
         month: 7,
         year: 2019
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should be due on August 8th, 2012", () => {
      const budgetItems = getBudgetItems(items, {
         date: 8,
         month: 7,
         year: 2012
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeTruthy();
   });
   test("It should occur 1 time in August 2012", () => {
      const budgetItems = getBudgetItems(items, {
         date: 11,
         month: 7,
         year: 2012
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].numberOfOccurrences).toBe(1);
   });
   test("It should occur 1 times in August 2013", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 7,
         year: 2013
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].numberOfOccurrences).toBe(1);
   });
   test("The total amount should be $750 for August 2012", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 7,
         year: 2012
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].totalAmount).toBe(750);
   });
   test("The total amount should be $750 for August 2019", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 7,
         year: 2019
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].totalAmount).toBe(750);
   });
});

describe("An income for $700 every week starting Friday June 22nd, 2007", () => {
   const items: IBudgetItem[] = [
      {
         _id: new ObjectId(),
         userId: new ObjectId(),
         createdOn: new Date(),
         modifiedOn: new Date(),
         title: "",
         amount: 700,
         initialDay: 5,
         initialDate: 22,
         initialMonth: 5,
         initialYear: 2007,
         recurrence: "weekly"
      }
   ];
   test("It should show not up on the budget for October 1999", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 9,
         year: 1999
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should not show up for May 2007", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 4,
         year: 2007
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should show up for June 2007", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 5,
         year: 2007
      });
      expect(budgetItems.length).toBe(1);
   });
   test("It should show up for July 2007", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 6,
         year: 2007
      });
      expect(budgetItems.length).toBe(1);
   });
   test("It should show up for January 2012", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 0,
         year: 2012
      });
      expect(budgetItems.length).toBe(1);
   });
   test("It should be due on June 22nd, 2007", () => {
      const budgetItems = getBudgetItems(items, {
         date: 22,
         month: 5,
         year: 2007
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeTruthy();
   });
   test("It should be due on June 29th, 2007", () => {
      const budgetItems = getBudgetItems(items, {
         date: 29,
         month: 5,
         year: 2007
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeTruthy();
   });
   test("It should not be due on June 15th, 2007", () => {
      const budgetItems = getBudgetItems(items, {
         date: 15,
         month: 5,
         year: 2007
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should be due on June 21, 2007", () => {
      const budgetItems = getBudgetItems(items, {
         date: 21,
         month: 5,
         year: 2007
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should be due on June 23, 2007", () => {
      const budgetItems = getBudgetItems(items, {
         date: 23,
         month: 5,
         year: 2007
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should not be due on August 9th, 2012", () => {
      const budgetItems = getBudgetItems(items, {
         date: 9,
         month: 7,
         year: 2012
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should be due on August 10th, 2012", () => {
      const budgetItems = getBudgetItems(items, {
         date: 10,
         month: 7,
         year: 2012
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeTruthy();
   });
   test("It should not be due on August 11th, 2012", () => {
      const budgetItems = getBudgetItems(items, {
         date: 11,
         month: 7,
         year: 2012
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should be due on August 17th, 2012", () => {
      const budgetItems = getBudgetItems(items, {
         date: 17,
         month: 7,
         year: 2012
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeTruthy();
   });
   test("It should occur 5 time in August 2012", () => {
      const budgetItems = getBudgetItems(items, {
         date: 11,
         month: 7,
         year: 2012
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].numberOfOccurrences).toBe(5);
   });
   test("It should occur 2 times in June 2007", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 5,
         year: 2007
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].numberOfOccurrences).toBe(2);
   });
   test("It should occur 4 times in July 2007", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 6,
         year: 2007
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].numberOfOccurrences).toBe(4);
   });
   test("The total amount should be $1400 for June 2007", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 5,
         year: 2007
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].totalAmount).toBe(1400);
   });
   test("The total amount should be $2800 for July 2007", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 6,
         year: 2007
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].totalAmount).toBe(2800);
   });
});

describe("An income for $3200 every 2 weeks starting Friday April 30th, 2021", () => {
   const items: IBudgetItem[] = [
      {
         _id: new ObjectId(),
         userId: new ObjectId(),
         createdOn: new Date(),
         modifiedOn: new Date(),
         title: "",
         amount: 3200,
         initialDay: 5,
         initialDate: 30,
         initialMonth: 3,
         initialYear: 2021,
         recurrence: "biweekly"
      }
   ];
   test("It should show not up on the budget for October 1999", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 9,
         year: 1999
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should not show up for March 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 2,
         year: 2021
      });
      expect(budgetItems.length).toBe(0);
   });
   test("It should show up for April 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 3,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
   });
   test("It should show up for May 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 4,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
   });
   test("It should show up for January 2022", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 0,
         year: 2022
      });
      expect(budgetItems.length).toBe(1);
   });
   test("It should not be due on May 7th, 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 7,
         month: 4,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should be due on May 14th, 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 14,
         month: 4,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeTruthy();
   });
   test("It should be due on June 25th, 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 25,
         month: 5,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeTruthy();
   });
   test("It should not be due on April 23rd, 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 23,
         month: 3,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should be due on April 30th, 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 30,
         month: 3,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeTruthy();
   });
   test("It should not be due on May 1st, 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 4,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].dueToday).toBeFalsy();
   });
   test("It should occur 1 time in April 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 11,
         month: 3,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].numberOfOccurrences).toBe(1);
   });
   test("It should occur 2 times in May 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 4,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].numberOfOccurrences).toBe(2);
   });
   test("The total amount should be $6000 for June 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 5,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].totalAmount).toBe(6400);
   });
   test("The total amount should be $3000 for April 2021", () => {
      const budgetItems = getBudgetItems(items, {
         date: 1,
         month: 3,
         year: 2021
      });
      expect(budgetItems.length).toBe(1);
      expect(budgetItems[0].totalAmount).toBe(3200);
   });
});

describe("An income for $0.05 due daily starting May 10th, 2021", () => {
   const items: IBudgetItem[] = [
      {
         _id: new ObjectId(),
         userId: new ObjectId(),
         createdOn: new Date(),
         modifiedOn: new Date(),
         title: "",
         amount: 0.05,
         initialDay: 1,
         initialDate: 10,
         initialMonth: 4,
         initialYear: 2021,
         recurrence: "daily"
      }
   ];
   test("It should not be due May 9", () => {
      const budgetItems = getBudgetItems(items, {
         date: 9,
         month: 4,
         year: 2021
      });
      expect(budgetItems[0].dueToday).toBe(false);
   });
   test("It should be due May 10", () => {
      const budgetItems = getBudgetItems(items, {
         date: 10,
         month: 4,
         year: 2021
      });
      expect(budgetItems[0].dueToday).toBe(true);
   });
   test("It should be due May 11", () => {
      const budgetItems = getBudgetItems(items, {
         date: 11,
         month: 4,
         year: 2021
      });
      expect(budgetItems[0].dueToday).toBe(true);
   });
});
