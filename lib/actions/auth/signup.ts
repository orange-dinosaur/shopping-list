'use server';

import { RegisterFormState } from '@/lib/types/auth';
import { signupSchema } from '@/lib/schemas/auth';
import { auth } from '@/lib/auth';

export async function signup(
    inistialState: RegisterFormState,
    formData: FormData
): Promise<RegisterFormState> {
    const validatedFields = signupSchema.safeParse({
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    const returnState: RegisterFormState = {
        username: validatedFields.data?.username,
        email: validatedFields.data?.email,
        password: validatedFields.data?.password,
        status: 200,
        message: '',
    };

    if (!validatedFields.success) {
        const failedFields = [];

        const formattedErrors = validatedFields.error.format();
        if (formattedErrors.username?._errors) {
            failedFields.push(
                `username: ${formattedErrors.username._errors[0]}`
            );
        }
        if (formattedErrors.email?._errors)
            failedFields.push(`email: ${formattedErrors.email._errors[0]}`);
        if (formattedErrors.password?._errors)
            failedFields.push(
                `password: ${formattedErrors.password._errors[0]}`
            );

        // return directly the fields taken from the formData
        returnState.username = formData.get('username') as string;
        returnState.email = formData.get('email') as string;
        returnState.password = formData.get('password') as string;

        returnState.status = 400;
        returnState.message = failedFields.join(', ');
        return returnState;
    }

    try {
        await auth.api.signUpEmail({
            body: {
                name: validatedFields.data?.username,
                email: validatedFields.data?.email,
                password: validatedFields.data?.password,
                image:
                    process.env.NEXT_PUBLIC_DEFAULT_USER_IMAGE_API +
                    validatedFields.data?.email,
                callbackURL: '/login',
            },
        });

        // if auth is successful clear fields
        returnState.username = '';
        returnState.email = '';
        returnState.password = '';
    } catch (error: unknown) {
        console.error(error);
        // Handle BetterAuth APIError
        if (
            error &&
            typeof error === 'object' &&
            'status' in error &&
            'message' in error
        ) {
            returnState.status = (error as { status: number }).status || 500;
            returnState.message =
                (error as { message: string }).message || 'An error occurred';
        } else {
            returnState.status = 500;
            returnState.message = 'Internal Server Error';
        }
    }

    return returnState;
}
