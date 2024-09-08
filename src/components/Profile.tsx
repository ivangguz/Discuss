'use client';
import { useSession } from "next-auth/react";

export default function Profile(){
    const session = useSession();

    if(session.data?.user){
        return <div>
            From Clint: User is signed in
        </div>
    }
    return <div>From Client: User is NOT signed in</div>
}