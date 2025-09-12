import type { Metadata } from 'next';

import React, { ReactElement } from 'react';

import { ThemeProvider } from '@/components/ui/theme-provider';

import { ClerkProvider } from '@clerk/nextjs';

import './layout.css';

export const metadata: Metadata =
{
    title: 'njsgql-web-app',
    description: 'Next.js GraphQL web app'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>)
{
    const jsx: ReactElement =   <>
                                    <ClerkProvider>
                                        <html className="" suppressHydrationWarning>
                                            <body className="">
                                                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                                                    { children }
                                                </ThemeProvider>
                                            </body>
                                        </html>
                                    </ClerkProvider>
                                </>;

    return jsx;
};
