import mongoose, { Schema } from "mongoose"
import {
  IChit,
  IMonth,
  IMonthlyPayment,
} from "../utils/interfaces/chit.interface"

const monthlyPaymentSchema = new Schema<IMonthlyPayment>({
  member: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidDate: Date,
})

const monthSchema = new Schema<IMonth>({
  monthNumber: { type: Number, required: true },
  auctionAmount: Number,
  winner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bonusPerMember: Number,
  payments: [monthlyPaymentSchema],
  finalChitAmount:Number
})

const chitSchema = new Schema<IChit>(
  {
    name: { type: String, required: true },

    chitValue: { type: Number, required: true },
    monthlyAmount: { type: Number, required: true },
    totalMembers: { type: Number, required: true },
    duration: { type: Number, required: true },

    startDate: {
      type: Date,
      required: true,
      index: true,
    },

    endDate: {
      type: Date,
      required: true,
      index: true,
    },

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    months: [monthSchema],

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
)


chitSchema.index({ members: 1 })
chitSchema.index({ startDate: 1 })
chitSchema.index({ endDate: 1 })

const Chit = mongoose.model<IChit>("Chit", chitSchema)

export default Chit;
