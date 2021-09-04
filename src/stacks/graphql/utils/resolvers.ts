import ApiKeyResolvers from "../resolvers/apiKeys/resolver";
import BudgetResolvers from "../resolvers/budgets/resolver";
import IncomeResolvers from "../resolvers/incomes/resolver";
import MeResolvers from "../resolvers/me/resolver";
import PaymentResolvers from "../resolvers/payments/resolver";
import PaymentTagResolvers from "../resolvers/paymentTags/resolver";
import UserResolvers from "../resolvers/users/resolver";

const resolvers = {
   ...ApiKeyResolvers,
   ...BudgetResolvers,
   ...IncomeResolvers,
   ...MeResolvers,
   ...PaymentResolvers,
   ...PaymentTagResolvers,
   ...UserResolvers
};

export default resolvers;
