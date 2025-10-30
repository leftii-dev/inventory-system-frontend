import { getSession } from "@/app/api/auth/[...nextauth]/route";
import {getCurrentUserAction} from "@/lib/users/users.actions";
import { redirect } from 'next/navigation';
import {SelfUpdateUserSchema, UserResponseSchema} from "@/lib/users/users.schemas";
import {ApiResponseSchema} from "@/lib/utils/api.schema";
import ProfileForm from "@/app/profile/ProfileForm";
import {handleUnauthorized} from "@/lib/utils/handleUnauthorized";

export default async function ProfilePage() {
    // const session = await getSession();
    // if(!session) {
    //     const callbackUrl = encodeURIComponent('/profile');
    //     redirect(`/auth/login?callbackUrl=${callbackUrl}&reason=no-session`);
    // }

    const response = await getCurrentUserAction();

    handleUnauthorized(response, '/profile');

    console.log(response)
    if(!response.success) {
        const callbackUrl = encodeURIComponent('/profile');
        redirect(`/auth/login?callbackUrl=${callbackUrl}&reason=session-expired`);
    }

    // Shape the data to be used in the form
    console.log(response)
    const result = ApiResponseSchema(UserResponseSchema).parse(response);
    const initialData = SelfUpdateUserSchema.parse({
        email: result.data.email ?? '',
        name: result.data.name,
        pictureUrl: result.data.pictureUrl,
    })


    return (
        <div className={`flex flex-col items-center justify-center`}>
            <ProfileForm initialData={initialData}/>
        </div>
    )
}