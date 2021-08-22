import ApiKeyResolvers from "../resolvers/apiKeys/resolver";
import UserResolvers from "../resolvers/users/resolver";

const resolvers = {
   ...ApiKeyResolvers,
   ...UserResolvers
}

export default resolvers;