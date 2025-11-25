import {getCurrentUserAction} from "@/lib/users/users.actions";
import { redirect } from 'next/navigation';
import ProfileForm from "@/app/profile/ProfileForm";
import {handleUnauthorized} from "@/lib/utils/handleUnauthorized";

export default async function ProfilePage() {
    const result = await getCurrentUserAction();
    handleUnauthorized(result, '/profile');

    if(!result.ok) {
        const callbackUrl = encodeURIComponent('/profile');
        redirect(`/auth/login?callbackUrl=${callbackUrl}&reason=session-expired`);
    }


    const initialData = result.response;

    return (
        <div className={`flex flex-col items-center justify-center`}>
            <ProfileForm initialData={initialData}/>
        </div>
    )
}