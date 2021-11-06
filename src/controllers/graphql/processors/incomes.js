const { getIncomeGraphQueries } = require("services/neo4j");

const mapResponse = (income) => ({
   id: income.id,
   title: income.title,
   amount: income.amount,
   recurrence: income.recurrence,
   createdOn: income.createdOn,
   modifiedOn: income.modifiedOn,
   initialDate: income.initialDate,
   initialDay: income.initialDay,
   initialMonth: income.initialMonth,
   initialYear: income.initialYear,
   endDate: income.endDate ?? null,
   endDay: income.endDay ?? null,
   endMonth: income.endMonth ?? null,
   endYear: income.endYear ?? null
});

const addIncome = async (req, input) => {
   const incomeGraphQueries = getIncomeGraphQueries(req);
   const incomes = await incomeGraphQueries.create({
      userId: req.user.id,
      ...input
   });
   return mapResponse(incomes[0]);
};

const removeIncome = async (req, id) => {
   const incomeGraphQueries = getIncomeGraphQueries(req);
   await incomeGraphQueries.delete(id);
};

const getIncomeById = async (req, id) => {
   const incomeGraphQueries = getIncomeGraphQueries(req);
   const payments = await incomeGraphQueries.getById(id);
   return mapResponse(payments[0]);
};

const getAllIncomes = async (req) => {
   const incomeGraphQueries = getIncomeGraphQueries(req);
   const incomes = await incomeGraphQueries.find({
      userId: req.user.id
   });
   return incomes.map(mapResponse);
};

module.exports = {
   getAllIncomes,
   addIncome,
   removeIncome,
   getIncomeById
};
