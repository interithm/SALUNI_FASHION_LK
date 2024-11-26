import {NextResponse} from "next/server";

export async function GET(){
    return NextResponse.json({ status: 'Call back endpoint for koko is up and running' });

}
