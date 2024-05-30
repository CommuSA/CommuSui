// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { NetworkName } from "@polymedia/suits";

import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { AccountData } from "@/components/zkloginconnect/zkloginconnect";
import { CONSTANTS, QueryKey } from "@/constants";
// import { useTransactionExecution } from "@/hooks/useTransactionExecution";
// import { useCurrentAccount } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { genAddressSeed, getZkLoginSignature } from "@mysten/zklogin";
import { SerializedSignature, decodeSuiPrivateKey } from "@mysten/sui.js/cryptography";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

const NETWORK: NetworkName = "devnet";

export const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});

/**
 * A mutation to generate demo data as part of our demo.
 */
export function useGeneratDataLabeling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ account, name, url, description, sKey }:
      { account: AccountData[], name: string, url: string, description: string, sKey: string }) => {
      if (!account[0]?.userAddr)
        throw new Error("You need to connect your wallet!");
      const txb = new TransactionBlock();


      console.log(account, name, url, description, sKey)

      const txData = txb.moveCall({
        target: `${CONSTANTS.demoContract.packageId}::data_label::new`,
        arguments: [txb.pure.string(name), txb.pure.string(url), txb.pure.string(description), txb.pure.string(sKey)],
      });


      // const txData = txb.moveCall({
      //   target: `${CONSTANTS.demoContract.packageId}::data_label::new`,
      //   arguments: [txb.pure.string("panda"), txb.pure.string("https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/%D0%9C%D1%8B%D1%88%D1%8C_2.jpg/1200px-%D0%9C%D1%8B%D1%88%D1%8C_2.jpg"), txb.pure.string("url"), txb.pure.string("description")],
      // });

      txb.transferObjects([txData], txb.pure.address(account[0].userAddr));


      return makeMoveCall(account, txb);

    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GetOwnedObjects],
      });
    },
  });
}


export async function makeMoveCall(account: AccountData[], txb: TransactionBlock) {
  const ephemeralKeyPair = keypairFromSecretKey(account[0]?.ephemeralPrivateKey);
  txb.setSender(account[0]?.userAddr);

  const { bytes, signature: userSignature } = await txb.sign({
    client: suiClient,
    signer: ephemeralKeyPair,
  });
  const addressSeed = genAddressSeed(
    BigInt(account[0]?.userSalt),
    "sub",
    account[0]?.sub,
    account[0]?.aud,
  ).toString();
  const zkLoginSignature: SerializedSignature = getZkLoginSignature({
    inputs: {
      ...account[0]?.zkProofs,
      addressSeed,
    },
    maxEpoch: account[0]?.maxEpoch,
    userSignature,
  });

  console.log(zkLoginSignature)
  await suiClient.executeTransactionBlock({
    transactionBlock: bytes,
    signature: zkLoginSignature,
  });
}

function keypairFromSecretKey(privateKeyBase64: string): Ed25519Keypair {
  const keyPair = decodeSuiPrivateKey(privateKeyBase64);
  return Ed25519Keypair.fromSecretKey(keyPair.secretKey);
}