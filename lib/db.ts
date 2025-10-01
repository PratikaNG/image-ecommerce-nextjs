import mongoose from "mongoose"

const mongodb_url = process.env.MONGODB_URL!;
if(!mongodb_url){
    throw new Error("Check your database connection string")
}

// usually global will be empty.In order for it to access mongoose we need to declare it in types.d.ts
let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn:null,promise:null}
}

export async function connectDB(){
    if(cached.conn){
        return cached.conn
    }
    // if there is no promise on the go, make that promise
    if(!cached.promise){
        const options = {
            bufferCommands: true,
            maxPoolSize:10
        }
        cached.promise = mongoose.connect(mongodb_url,options).then(()=>mongoose.connection)
    }
    
    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null
    }

    return cached.conn
}