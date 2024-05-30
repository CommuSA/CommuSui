// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { CONSTANTS } from "@/constants";
import { InfiniteScrollArea } from "@/components/InfiniteScrollArea";
import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import { LockedObject } from "./LockedObject";
import { AccountData } from "../zkloginconnect/zkloginconnect";

/**
 * Similar to the `ApiLockedList` but fetches the owned locked objects
 * but fetches the objects from the on-chain state, instead of relying on the indexer API.
 */
interface OwnedLockedListProps {
  account: AccountData;
}

export function OwnedLockedList({ account }: OwnedLockedListProps) {

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuiClientInfiniteQuery(
      "getOwnedObjects",
      {
        filter: {
          StructType: CONSTANTS.escrowContract.lockedType,
        },
        owner: account.userAddr!,
        options: {
          showContent: true,
          showOwner: true,
        },
      },
      {
        enabled: !!account.userAddr,
        select: (data) => data.pages.flatMap((page) => page.data),
      },
    );

  return (
    <>
      <InfiniteScrollArea
        loadMore={() => fetchNextPage()}
        hasNextPage={hasNextPage}
        loading={isFetchingNextPage || isLoading}
      >
        {data?.map((item) => (
          <LockedObject key={item.data?.objectId} object={item.data!} />
        ))}
      </InfiniteScrollArea>
    </>
  );
}
