'use client';

import { HttpLink } from '@apollo/client';
import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs';

function makeClient()
{
    const httpLinkOptions: HttpLink.Options =
    {
        uri: process.env.NEXT_PUBLIC_NJSGQL_API_SERVER_ENDPOINT,
        fetchOptions: { }
    };

    const apolloClientOptions: ApolloClient.Options =
    {
        link: new HttpLink(httpLinkOptions),
        cache: new InMemoryCache()
    };

    const apolloClient: ApolloClient = new ApolloClient(apolloClientOptions);

    return apolloClient;
}

export function ApolloClientWrapper({ children }: React.PropsWithChildren)
{
    return (
        <ApolloNextAppProvider makeClient={ makeClient }>
            { children }
        </ApolloNextAppProvider>
    );
}
