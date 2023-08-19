import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connect()

export async function POST(request: NextRequest) {
    try {
        const { userId, invoiceId } = await request.json();

        const deletedItem = await User.findOneAndUpdate({
            _id: userId,
            $pull: {
                invoices: {
                    _id: invoiceId
                }
            }
        })

        if(deletedItem){
            return NextResponse.json({
                message: "Invoice deleted successfully",
                success: true,
                deletedItem
            })
        }
        else{
            return NextResponse.json({
                message: "Invoice not found",
                success: false,
            })
        }
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
};