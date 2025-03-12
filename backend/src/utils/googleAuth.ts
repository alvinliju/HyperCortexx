import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { users } from "../db/schema";
import db from "../db";
import { eq } from "drizzle-orm";



const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;



const googleStratergy =  new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID!,
        clientSecret: GOOGLE_CLIENT_SECRET!,
        callbackURL: 'http://localhost:8000/auth/google/callback',
      },
      async function (accessToken, refreshToken, profile, email, done) {
  
        let user;
        const newUser = {
          googleId: email.id, 
          userEmail: email.emails[0].value,
          name: email.displayName,
        };
  
        //find user
        const {userEmail, name, googleId} = await newUser;
       
        const [existingUser] = await db.select().from(users).where(eq(users.email, userEmail));
  
        if(existingUser){
          user = existingUser;
        } else {
          const [newUserdb]= await db.insert(users).values({email: userEmail, name, googleId, authType:'google'}).returning();
          user = newUserdb;
        }
      
  
        const token = jwt.sign({...user, userEmail} ,JWT_SECRET, { expiresIn: "1h" });
        return done(null, { token });
      }
    )


  export default googleStratergy;