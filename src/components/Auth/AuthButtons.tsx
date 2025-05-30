'use client'

import { SignInButton, useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'

export function AuthButtons() {
    const { isSignedIn, isLoaded } = useAuth()

    if (!isLoaded) {
        return (
            <div className='flex items-center gap-4'>
                <div className='h-8 w-8 animate-pulse rounded-full bg-gray-200' />
            </div>
        )
    }

    if (isSignedIn) {
        return (
            <div className='flex items-center gap-4'>
                <UserButton />
            </div>
        )
    }

    return (
        <div className='flex items-center gap-4'>
            <SignInButton mode='modal'>
                <Button
                    variant='ghost'
                    size='sm'
                    className='font-bold hover:underline md:mt-0 md:text-lg'
                >
                    Sign in
                </Button>
            </SignInButton>
        </div>
    )
}
