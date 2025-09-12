import { auth } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';

import { ReactElement } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Logo from '../public/images/logo.png';

import { LogIn } from 'lucide-react';

export default async function Page()
{
    const { userId } = await auth();

    if (userId !== null)
        return redirect('/dashboard');

    const jsx: ReactElement =   <>
                                    <div className="h-screen flex flex-col items-center justify-center gap-y-10">
                                        <Image src={ Logo } alt="Lorem" title="Lorem" />

                                        <p className="text-xl tracking-tight text-balance">Sign-in to access your Dashboard</p>

                                        <Link href="/sign-in">
                                            <LogIn className="hover:scale-125 duration-150 ease-in-out" name="Back" color="white" size={ 40 } />
                                        </Link>
                                    </div>
                                </>;

    return jsx;
};
