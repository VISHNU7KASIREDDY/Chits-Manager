import mongoose, { Schema } from "mongoose"
import { IUser } from "../utils/interfaces/user.interface"
import bcrypt from "bcryptjs";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true ,length:10},
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "viewer",
    },
  },
  { timestamps: true }
)

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword=async function (enteredPassword:string){
  return await bcrypt.compare(enteredPassword,this.password);
};
const User = mongoose.model<IUser>("User", userSchema)
export default User;
