const JWT_SECRET = process.env.JWT_SECRET;
import db from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from "passport";
import { Request, Response } from "express";

interface GoogleAuthRequest extends Request {
  user?: {
    token?: string;
  };
}

const registerController = async (req, res, next) => {
    try {
        const {email, password, name} = req.body;
    
        if(!email || !password){
          res.status(400).json({message: 'Email and password are required'});
          return;
        }
    
        const [existingUser] = await db.select().from(users).where(eq(users.email, email));
        
        if (existingUser) {
          res.status(400).json({ message: 'User already exists' });
          return;
        }
    
         // Hash the password
         const hashedPassword = await bcrypt.hash(password, 10);
    
        const [newUser] = await db
          .insert(users)
          .values({ email, password:hashedPassword, name })
          .returning();
    
        const token = jwt.sign(newUser ,JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({token})
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        next(error);
      }
}

const loginController = async (req, res) => {
    try{

        const {email, password} = req.body;
    
        if(!email || !password){
          res.status(400).json({message: 'Email and password are required'});
          return;
        }
    
        const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    
        if(!existingUser){
          res.status(400).json({message: 'something went wrong'})
          return;
        }
    
        if (!existingUser.password) {
          res.status(400).json({message: 'This account uses Google authentication'});
          return;
        }
    
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
    
        if (!passwordMatch) {
          res.status(400).json({ message: 'Invalid password' });
          return;
        }
    
        const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    
      }catch(e){
        res.status(500).json({ message: 'Internal server error' });
        console.log(e)
      }
}

const googleCallbackController = async (req:Request, res:Response) => {
  try{
    //@ts-ignore
      if(!req.user?.token){
        return res.redirect('/login')
      }

      //@ts-ignore
      return res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${req.user.token}`)
}catch(err){
  console.log(err)
  res.status(500).json({message:"Server error try again later"})
}
}

export { registerController, loginController, googleCallbackController };