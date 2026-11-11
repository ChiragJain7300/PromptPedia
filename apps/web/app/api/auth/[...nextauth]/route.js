import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

const NEST_API = process.env.NEST_API_URL || process.env.NEXT_PUBLIC_API_URL;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (NEST_API) {
        try {
          const rawName = (session.user.name || session.user.email.split("@")[0])
            .replace(/[^a-zA-Z0-9._]/g, "")
            .toLowerCase();
          const username =
            rawName.length >= 2
              ? rawName.slice(0, 30)
              : `user_${Date.now().toString().slice(-6)}`;

          const res = await fetch(`${NEST_API}/users/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
              username,
              image: session.user.image,
            }),
          });

          if (res.ok) {
            const apiUser = await res.json();
            session.user.id = apiUser.id;
            return session;
          }
        } catch (err) {
          console.warn("NestJS user session sync fallback:", err.message);
        }
      }

      // MongoDB Fallback
      try {
        await connectToDB();
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
      } catch (err) {
        console.warn("MongoDB session lookup fallback:", err.message);
      }

      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      const rawName = (profile.name || profile.email.split("@")[0])
        .replace(/[^a-zA-Z0-9._]/g, "")
        .toLowerCase();
      const username =
        rawName.length >= 2
          ? rawName.slice(0, 30)
          : `user_${Date.now().toString().slice(-6)}`;

      if (NEST_API) {
        try {
          const res = await fetch(`${NEST_API}/users/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile.email,
              username,
              image: profile.picture,
            }),
          });
          if (res.ok) return true;
        } catch (err) {
          console.warn("NestJS signIn sync fallback:", err.message);
        }
      }

      try {
        await connectToDB();

        // Check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // If not, create a new document in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            username,
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
