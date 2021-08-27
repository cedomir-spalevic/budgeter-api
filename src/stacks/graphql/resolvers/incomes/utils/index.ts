import { Income, PublicIncome } from "models/schemas/income"
import { WithId } from "mongodb"

export const transformResponse = (income: WithId<Income>): PublicIncome => ({
   id: income._id.toHexString(),
   title: income.title,
   amount: income.amount,
   initialDay: income.initialDay,
   initialDate: income.initialDate,
   initialMonth: income.initialMonth,
   initialYear: income.initialYear,
   recurrence: income.recurrence,
   createdOn: income.createdOn,
   modifiedOn: income.modifiedOn
})