import ApiKeyResolvers from "../resolvers/apiKeys/resolver";
import BudgetResolvers from "../resolvers/budgets/resolver";
//import UserResolvers from "../resolvers/users/resolver";

const resolvers = {
   ...ApiKeyResolvers,
   ...BudgetResolvers
};

export default resolvers;
