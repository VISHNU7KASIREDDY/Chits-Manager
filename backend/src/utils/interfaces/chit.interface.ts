import { Document, Types } from "mongoose"

export interface IMonthlyPayment {
  member: Types.ObjectId
  isPaid: boolean
  paidDate?: Date
}

export interface IMonth {
  monthNumber: number
  auctionAmount?: number
  winner?: Types.ObjectId
  bonusPerMember?: number
  payments: IMonthlyPayment[]
  finalChitAmount?:number
}

export type ChitStatus = "active" | "completed"

export interface IChit extends Document {
  name: string
  chitValue: number
  monthlyAmount: number
  totalMembers: number
  duration: number
  startDate: Date
  endDate: Date
  members: Types.ObjectId[]
  months: IMonth[]
  status: ChitStatus
  createdAt: Date
  updatedAt: Date
}
