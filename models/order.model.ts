import mongoose,{Schema, model,models} from "mongoose";
import User from "./user.model";
import Product, { ImageVariant,ImageVariantType } from "./product.model";

interface populatedUser{
    _id?:mongoose.Types.ObjectId;
    email:string;
}
interface populatedProduct{
    _id?:mongoose.Types.ObjectId;
    name:string;
    imageUrl:string;
}

export interface MyOrder{
    _id?:mongoose.Types.ObjectId;
    userId?:mongoose.Types.ObjectId | populatedUser;
    productId?:mongoose.Types.ObjectId | populatedProduct;
    variant:ImageVariant;
    razorpayOrderId:string;
    razorpayPaymentId:string;
    amount:number;
    status: "pending" | "completed" | "failed" ;
    downloadUrl?:string;
    previewUrl?:string;
    createdAt?:Date;
    updatedAt?:Date
}

const orderSchema = new Schema<MyOrder>({
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    productId:{
        type: Schema.Types.ObjectId,
        ref:"Product"
    },
    variant:{
        type:{type:String,required:true,enum:["SQUARE","WILD","PORTRAIT"] as ImageVariantType[],
            set:(v:string)=>v.toUpperCase()
        },
        price:{type:Number,required:true},
        license:{type:String,required:true,enum:["personal","commercial"]}
    },
    razorpayOrderId:{
        type:String,
        required:true
    },
    razorpayPaymentId:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:["pending","completed","failed"],
        default:"pending"
    },
    downloadUrl:{
        type:String,
    },
    previewUrl:{
        type:String,
    }
    
},{timestamps:true})

const Order = models?.Order || mongoose.model<MyOrder>("Order",orderSchema)
export default Order