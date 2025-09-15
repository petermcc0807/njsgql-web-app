'use client';

import { useAuth, UserButton } from '@clerk/nextjs';

import { useRouter } from 'next/navigation';

import { useRef, useEffect, RefObject, ReactElement } from 'react';

import Image from 'next/image';

import Logo from '../../public/images/logo.png';

import Books from '../components/Books';

export default function Page()
{
    const { isLoaded, isSignedIn, getToken } = useAuth();

    const router = useRouter();

    const useEffectCalled: RefObject<boolean> = useRef(false);

    useEffect(() =>
    {
        if ((isLoaded === true) && (isSignedIn !== undefined))
        {
            if (useEffectCalled.current === false)
            {
                useEffectCalled.current = true;

                if (isSignedIn === false)
                    router.push('/');
            }
        }
    }, [ isLoaded, isSignedIn, getToken, router ]);

    let jsx: ReactElement;

    if ((isLoaded === true) && (isSignedIn === true))
    {
        jsx =   <>
                    <div className="absolute top-5 left-5">
                        <Image src={ Logo } height="35" alt="Lorem" title="Lorem" />
                    </div>

                    <div className="absolute top-5 right-5">
                        <UserButton />
                    </div>

                    <div className="absolute top-20 pl-5 pr-5 w-full">
                        <p className="text-2xl tracking-tight text-balance">Books</p>

                        <Books />
                    </div>
                </>;
    }
    else
        jsx =   <></>;

    return jsx;
};
