import { useSuiClientInfiniteQuery } from '@mysten/dapp-kit';
import { AccountData } from '../zkloginconnect/zkloginconnect';

interface MyObjectsProps {
    account: AccountData;
}


export function MyComponent({ account }: MyObjectsProps) {

    const { data, isPending, isError, error, isFetching, fetchNextPage, hasNextPage } =
        useSuiClientInfiniteQuery('getOwnedObjects', {
            owner: "0x3fbc08fd439d999e679d0b9536227927f58928dff3166a8830053375041b2066",
        });

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}