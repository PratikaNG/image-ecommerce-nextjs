import mongoose,{Schema,model,models} from "mongoose";


export const IMAGE_VARIANTS = {
    SQUARE:{
        type:"SQUARE",
        dimensions:{width:1200 , height:1200 },
        label:"Square (1:1)",
        aspectRation:"1:1"
    },
    WIDE:{
        type:"WIDE",
        dimensions:{width: 1920, height:1080 },
        label:"WideScreen (16:9)",
        aspectRation:"16:9"
    },
    PORTAIT:{
        type:"PORTAIT",
        dimensions:{width: 1080, height: 1440},
        label:"Portrait (3:4)",
        aspectRation:"3:4"
    },
}as const;
export type ImageVariantType = keyof typeof IMAGE_VARIANTS;

export interface ImageVariant{
    type:ImageVariantType;
    price:number;
    license:"personal" | "commercial"

}
export interface MyProduct{
    _id?:mongoose.Types.ObjectId;
    name:string;
    description:string;
    imageUrl:string;
    variants:ImageVariant[];
}

const imageVarientSchema = new Schema<ImageVariant>({
    type:{
        type:String,
        required:true,
        enum:["SQUARE","WILD","PORTRAIT"]
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    license:{
        type:String,
        required:true,
        enum:["personal","commercial"]
    }
})
const productSchema = new Schema<MyProduct>({
   name:{
    type:String,
    required:true,
   },
   description:{
    type:String,
    required:true,
   },
   imageUrl:{
    type:String,
    required:true,
   },
   variants:[imageVarientSchema],
},{timestamps:true}

)



const Product = models?.Product || model<MyProduct>("Product",productSchema);
export default Product