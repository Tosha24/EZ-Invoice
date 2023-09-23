import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import connect from "@/dbConfig/dbConfig";

connect()

export async function POST(request: NextRequest){
    try{
        const { userId, invoiceId } = await request.json();

        const user = await User.findById({_id: userId});

        if(!user){
            return NextResponse.json({error: "Invalid User"}, {status: 401});
        }

        const invoice = user.invoices.find((invoice: any) => invoice._id == invoiceId);

        if(!invoice){
            return NextResponse.json({error: "Invalid Invoice"}, {status: 401});
        }

        return NextResponse.json(invoice, {status: 200});
        
    }catch(error: any){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}