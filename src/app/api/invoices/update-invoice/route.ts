import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import connect from "@/dbConfig/dbConfig";

connect()

export async function POST(request: NextRequest){
    try{
        const { userId, invoiceId, invoiceData } = await request.json();

        const user = await User.updateOne(
            {_id: userId, "invoices._id": invoiceId },
            { $set: {"invoices.$": invoiceData }}
        );

        if(!user){
            return NextResponse.json({error: "Invalid User"}, {status: 401});
        }

        return NextResponse.json(user, {status: 200});

    }catch(error: any){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}