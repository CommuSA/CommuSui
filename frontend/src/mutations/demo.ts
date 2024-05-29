// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { AccountData } from "@/components/zkloginconnect/zkloginconnect";
import { CONSTANTS, QueryKey } from "@/constants";
import { useTransactionExecution } from "@/hooks/useTransactionExecution";
// import { useCurrentAccount } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * A mutation to generate demo data as part of our demo.
 */
export function useGenerateDemoData(account: AccountData[]) {
  // const account = useCurrentAccount();
  const executeTransaction = useTransactionExecution();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!account[0]?.userAddr)
        throw new Error("You need to connect your wallet!");
      const txb = new TransactionBlock();

      const bear = txb.moveCall({
        target: `${CONSTANTS.demoContract.packageId}::demo_bear::new`,
        arguments: [txb.pure.string(`A happy bear`)],
      });

      txb.transferObjects([bear], txb.pure.address(account[0].userAddr));

      return executeTransaction(txb);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GetOwnedObjects],
      });
    },
  });
}
