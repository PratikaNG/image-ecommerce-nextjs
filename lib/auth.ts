// NextAuthOptions
// a. Make sure to export the authOptions
// b. Bring in providers, callbacks, pages, session, secret
// c. Providers have credentials and authorize
// d. Callbacks have jwt and session
// e. Pages is where you specify URLs to be used if you want to create custom sign in, sign out and error pages.
// f. session is where you mention the strategy and expiry time
// g. secret is random string used to hash tokens and comes from env file 
import { NextAuthOptions } from "next-auth";
// Refer to nextauth.js docs -> Configuration -> Providers -> Credentials
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "./db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
        if(!credentials?.email || !credentials.password){
            throw Error("Invalid credentials")
        }
        try {
            await connectDB();
            const user = await User.findOne({email:credentials.email})
            if(!user){
                throw new Error("No user found with this email!")
            }
            const validPassword = await bcrypt.compare(credentials.password,user.password)
            if(!validPassword){
                throw new Error("Invalid password!")
            }

            return {
                id: user._id.toString(),
                email:user.email,
                role:user.role,
            }

        } catch (error:any) {
            console.log("Auth Error",error)
            throw Error("Invalid credentials",error.message)
        }
      
    }
  })
    ],
    // refer to nextauth.js docs -> Configuration -> Providers -> Callbacks -> session and jwt
    callbacks:{
        async jwt({ token, user }) {
            if (user) {
            token.id = user.id
            token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            //whatever userId you have got in the session, inject that to token.id
            session.user.role = token.role as string
      return session
    },
    
    },
    pages:{
        signIn:"/login",
        error:"/login"
    },
    session:{
        strategy:"jwt",
        maxAge:30 * 24 *60 *60
    },
    secret:process.env.NEXTAUTH_SECRET
}