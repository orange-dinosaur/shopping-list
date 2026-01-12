'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signup } from '@/lib/actions/auth/signup';
import { RegisterFormState } from '@/lib/types/auth';
import { useActionState, useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const initialState: RegisterFormState = {};
    const [state, formAction, pending] = useActionState(signup, initialState);
    const [showPassword, setShowPassword] = useState(false);

    // Derive dialog open state directly instead of using useEffect + setState
    const isDialogOpen = state?.status === 200;

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Dialog open={isDialogOpen}>
                <DialogContent showCloseButton={false} className="sm:max-w-md">
                    <div className="flex flex-col items-center gap-4">
                        <div className="grid h-20 w-20 place-items-center rounded-full bg-green-500/10">
                            <Check className="h-10 w-10 text-green-500" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-xl text-center">
                                Check your email
                            </DialogTitle>
                            <DialogDescription className="text-center">
                                We&apos;ve sent a verification link to your
                                email address. Please verify your email to
                                continue.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <DialogFooter className="w-full sm:justify-center">
                        <Button asChild className="w-full">
                            <Link href="/login">Go to Login</Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <form action={formAction}>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="username">Username</FieldLabel>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            defaultValue={state?.username}
                            placeholder="username"
                            required
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={state?.email}
                            placeholder="m@example.com"
                            required
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                defaultValue={state?.password}
                                placeholder="••••••••"
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }>
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </Field>

                    <Field>
                        <Button type="submit" disabled={pending}>
                            {pending && <Spinner />} Create Account
                        </Button>
                    </Field>

                    {state?.message && (
                        <p className="text-red-500 text-sm">{state?.message}</p>
                    )}
                </FieldGroup>
            </form>
        </div>
    );
}
