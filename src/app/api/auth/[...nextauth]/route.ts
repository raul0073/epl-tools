import NextAuth from "next-auth";
import { authOptions } from "./_utils";

// handler
const handler = NextAuth(authOptions);

// export
export { handler as GET, handler as POST };