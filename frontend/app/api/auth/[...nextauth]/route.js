
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      try {
        const res = await fetch(`${process.env.backendPath}/api/registerOAuth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: user.name, email: user.email }),
          credentials: "include", // helps to send cookie relate info. 
        });


        if (!res.ok) return false;
        const data = await res.json();

        if (!data?.user?.id) return false;
        user.userId = data.user.id;

        return true;
      } catch (err) {
        console.error("Sign-in error:", err);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        console.log("  [jwt] user passed in:", user);
        token.email = user.email;
        token.userId = user.userId || token.userId;
        token.isGoogle = true
      } else {
        console.log(" [jwt] no user - returning existing token");
      }
      return token;
    },

    async session({ session, token }) {
      console.log("session token.userId:", token.userId);
      if (token) {
        session.user.email = token.email;
        session.user.userId = token.userId;
        session.user.isGoogle = token.isGoogle;
      }
      return session;
    }
  },
});

export { handler as GET, handler as POST };

// by default, session may store 30 days in if we use next-auth as OAuth tools, .