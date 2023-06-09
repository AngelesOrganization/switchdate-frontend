import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import jwtDecode from 'jwt-decode';

export default NextAuth({
  secret: "SUPERMEGASECRETO",
  providers: [
    CredentialsProvider({
      id: "username-login",
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/auth/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            grant_type: "password",
            username: credentials?.username,
            password: credentials?.password,
          }).toString(),
        });

        const user = await res.json();
  
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null
  
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  callbacks: {
    async jwt({token, account, user}) {
      
      if (account) {
          token.accessToken = user.access_token;
          
          const decodedJwt = jwtDecode(user.access_token);

          // Extrae la información del usuario del token decodificado y la agrega al token
          token.user = {
            id: decodedJwt.id,
            name: decodedJwt.sub, // Asumiendo que 'sub' es el nombre de usuario
            role: decodedJwt.role,
            // Aquí puedes agregar cualquier otra información del usuario que necesites
          };
      }
    
      return token;
  },
  async session({ session, token }) {
    session.user = token.user;
    session.accessToken = token.accessToken;

    return session;
  }
  },
  session: {
    strategy: "jwt",
  },  
})
