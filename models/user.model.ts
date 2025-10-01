import mongoose,{Schema,model,models} from "mongoose";
import bcrypt from "bcryptjs";

export interface MyUser{
    email:string;
    password:string;
    role: "role" | "admin" | string;
    _id?: mongoose.Types.ObjectId;
    createdAt?:Date;
    updatedAt?:Date;
}

const userSchema = new Schema<MyUser>({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
},{timestamps:true}

)
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
    next()
})
const User = models?.User || model<MyUser>("User",userSchema);
export default User