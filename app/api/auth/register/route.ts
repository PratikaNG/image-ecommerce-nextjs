import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        // check if we are getting email and password
        const {email,password} = await req.json()
        if(!email || !password){
            return NextResponse.json({error:"Email and password are required"},{status:400})
        }
        // to register
        await connectDB()
        const existingUser = await User.findOne({email:email})
         if(existingUser){
            return NextResponse.json({error:"User already exisits"},{status:400})
        }
        // const hashedPassword = bcrypt.hash(password,10)
        // const newUser = await User.create({email:email,password:hashedPassword,role:"user"})
        await User.create({email,password,role:"user"})
        return NextResponse.json({message:"User registered successfully"},{status:201})
    } catch (error) {
        console.error("Registration error",error)
            return NextResponse.json({error:"Registration failed"},{status:400})

    }
}