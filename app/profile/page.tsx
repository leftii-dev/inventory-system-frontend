import ProfileForm from "@/app/profile/ProfileForm";
import { getSession} from "@/app/api/auth/[...nextauth]/route";
import { getCurrentUserAction } from "@/lib/users/users.actions";
import { redirect } from 'next/navigation';
import {UserResponseSchema} from "@/lib/users/users.schemas";
import {ApiResponseSchema} from "@/lib/utils/api.schema";

export default async function ProfilePage() {
    const session = await getSession();
    // console.log(session);
    if(!session) {
        const callbackUrl = encodeURIComponent('/profile');
        redirect(`/auth/login?callbackUrl=${callbackUrl}`);
    }

    const response = await getCurrentUserAction();

    console.log(response)
    if(!response.success) {
        const callbackUrl = encodeURIComponent('/profile');
        redirect(`/auth/login?callbackUrl=${callbackUrl}`);
    }

    const result = ApiResponseSchema(UserResponseSchema).parse(response);

    return (
        <div className={`flex flex-col items-center justify-center`}>
            <ProfileForm user={result.data} />
        </div>
    )
}