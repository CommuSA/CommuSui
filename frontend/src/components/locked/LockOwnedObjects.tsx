// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import { SuiObjectDisplay } from "@/components/SuiObjectDisplay";
import { Button } from "@radix-ui/themes";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { InfiniteScrollArea } from "@/components/InfiniteScrollArea";
import { useLockObjectMutation } from "@/mutations/locked";
import { AccountData } from "../zkloginconnect/zkloginconnect";
import { suiClient } from "@/mutations/dataLabeling";
import { CONSTANTS } from "@/constants";

/**
 * A component that fetches all the objects owned by the connected wallet address
 * and allows the user to lock them, so they can be used in escrow.
 * 
 * 
 */

interface LockOwnedObjectsProps {
  account: AccountData;
}


export function LockOwnedObjects({ account }: LockOwnedObjectsProps) {

  const { mutate: lockObjectMutation, isPending } = useLockObjectMutation();



  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } =
    useSuiClientInfiniteQuery(
      "getOwnedObjects",
      {
        owner: account?.userAddr,
        options: {
          showDisplay: true,
          showType: true,
        },
      },
      {
        enabled: !!account,
        select: (data) =>
          data.pages
            .flatMap((page) => page.data)
        // .filter(
        //   (x) => !!x.data?.display && !!x.data?.display?.data?.image_url,
        // ),
      },
    );

  return (<>
    <Button
      variant="soft"
      className="cursor-pointer"
      disabled={isPending}

      onClick={() => { console.log(data) }}
    >
      Create Data Assert
    </Button><InfiniteScrollArea
      loadMore={() => fetchNextPage()}
      hasNextPage={hasNextPage}
      loading={isFetchingNextPage}
    >
      {data?.map((obj) => (
        <SuiObjectDisplay object={obj.data!}>
          <div className="text-right flex items-center justify-between">
            <p className="text-sm">
              Lock the item so it can be used for escrows.
            </p>
            <Button
              className="cursor-pointer"
              disabled={isPending}
              onClick={() => {
                lockObjectMutation(
                  { object: obj.data! },
                  {
                    onSuccess: () => refetch(),
                  }
                );
              }}
            >
              <LockClosedIcon />
              Lock Item
            </Button>
          </div>
        </SuiObjectDisplay>
      ))}
    </InfiniteScrollArea></>
  );
}

export async function getDataShare(account: AccountData) {
  let ownedObjects = await suiClient.getOwnedObjects({
    owner: account.userAddr
  });

  let ownedObjectsDetails = await Promise.all(ownedObjects.data.map(async (obj) => {
    return await suiClient.getObject({ id: obj.data ? obj.data.objectId : '', options: { showType: true, showContent: true } });
  }));

  return ownedObjectsDetails.filter(obj => {
    return `${CONSTANTS.demoContract.packageId}::data_label::DataLabeling` === obj.data?.type
  }).map(obj => obj.data.content['fields']);

}
