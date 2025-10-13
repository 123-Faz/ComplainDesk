import { Document, model, ObjectId, Schema } from "mongoose";
import validator from "validator"
import { hashPassword } from "../modules/bcrypt.module";
import { generateToken } from "../services/token.service";
import jwt from "jsonwebtoken";

export enum AdminRole {
    admin = "admin",
    super = "super"
}
interface IAdmin extends Document {
    _id: ObjectId;
    username: string;
    email: string;
    password: string;
    role: AdminRole;
    status: boolean
    createAccessToken: () => Promise<string>;
    publicResponse: () => Promise<any>;
    newUserResponse: () => Promise<any>;
}

const adminSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: [(value: string) => validator.isEmail(value), 'Please Enter A Valid Email']
        },
        password: {
            type: String,
            required: false,
            select: false,
            default: ""
        },
        role: {
            type: String,
            default: AdminRole.admin,
            enum: Object.values(AdminRole)
        },
        status: {
            type: Boolean,
            required: true,
            default: true,
        }

    },
    {
        collection: "admins",
        timestamps: true
    }
)

adminSchema.pre<IAdmin>('save', async function (this: IAdmin, next) {
    try {
        if (this.isNew) {
            this.password = await hashPassword(this.password)
        }
        next()
    }
    catch (error: any) {
        next(error)
    }

})

adminSchema.methods.createAccessToken = async function (this: IAdmin) {
    return await generateToken({ userId: this._id }, process.env.ADMIN_JWT_SECRET as jwt.Secret, '365d')

}

adminSchema.methods.publicResponse = function (this: IAdmin) {
    const res = this.toObject();
    delete res['password'];
    delete res['__v'];
    return res;
}

adminSchema.methods.newUserResponse = function (this: IAdmin) {
    const res = this.toObject();
    delete res['password'];
    delete res['__v'];
    return res;
}

export default model<IAdmin>('Admin', adminSchema)