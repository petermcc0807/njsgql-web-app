'use client';

import { useSignIn, SignIn } from '@clerk/nextjs';

import { ReactElement } from 'react';

import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

export default function Page()
{
    const { isLoaded } = useSignIn();

    let jsx: ReactElement;

    if (isLoaded === true)
        jsx =   <>
                    <div className="h-screen flex flex-col items-center justify-center gap-y-10">
                        <SignIn />

                        <Link href="/">
                            <ArrowLeft className="hover:scale-125 duration-150 ease-in-out" name="Back" color="white" size={ 40 } />
                        </Link>
                    </div>
                </>;
    else
        jsx =   <></>;

    return jsx;
};
