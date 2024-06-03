import { AccountData } from '../zkloginconnect/zkloginconnect';
import { suiClient } from '@/mutations/dataLabeling';
import { CONSTANTS } from "@/constants";
import { useEffect, useState } from 'react';
import "./test.less"
import { Button } from '@radix-ui/themes';
import { LockClosedIcon } from '@radix-ui/react-icons';
import { useLockObjectMutation } from '@/mutations/locked';
import { SuiObjectResponse } from '@mysten/sui.js/client';

interface MyObjectsProps {
    account: AccountData;
}


export function MyComponent({ account }: MyObjectsProps) {
    const [data, setData] = useState<SuiObjectResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { mutate: lockObjectMutation, isPending } = useLockObjectMutation();

    useEffect(() => {
        async function fetchData() {
            try {
                const assets = await getassets(account);
                // Filter out null values
                const filteredAssets = assets.filter(asset => asset !== null) as SuiObjectResponse[];
                setData(filteredAssets);
            } catch (error) {
                console.error('Error fetching assets:', error);
            } finally {
                setLoading(false);
            }
        }


        fetchData();
    }, [account]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="card-container">
            {data.map((asset) => (
                <div key={asset.data!.objectId} className="card">
                    <img src={asset.data!.content!.fields!.url} alt={asset.data!.content!.fields!.name} className="card-img" />
                    <div className="card-content">
                        <h3>{asset.data!.content!.fields!.name}</h3>
                        <p>{asset.data!.content!.fields!.description}</p>

                        <Button
                            className="cursor-pointer "
                            style={{ position: 'absolute', bottom: '7px' }}
                            disabled={isPending}
                            onClick={() => {
                                lockObjectMutation(
                                    { object: asset.data! },
                                    {
                                        onSuccess: () => console.log(asset),
                                    }
                                );
                            }}
                        >
                            <LockClosedIcon />
                            Lock Item
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );

}

async function getassets(account: AccountData) {
    const sender = account.userAddr;
    const ownedObjects = await suiClient.getOwnedObjects({
        owner: sender
    });
    console.log(ownedObjects)


    const ownedObjectsDetails = await Promise.all(
        ownedObjects.data
            .filter(obj => obj && obj.data)  // Filter out any objects without data early
            .map(async (obj) => {
                if (obj && obj.data) {
                    const details = await suiClient.getObject({
                        id: obj.data.objectId,
                        options: { showType: true, showContent: true }
                    });
                    return details;
                }
                return null;
            })
    );
    // console.log(ownedObjectsDetails)

    ownedObjectsDetails
        .filter(obj => {
            return obj && obj.data && `${CONSTANTS.demoContract.packageId}::data_label::DataLabeling` === obj.data.type;
        })
        .map(obj => {
            if (obj && obj.data && obj.data.content && 'fields' in obj.data.content) {
                // console.log(obj.data.content as { fields: any })

                return (obj.data.content as { fields: any })['fields'];
            }
            return null;
        })
        .filter(fields => fields !== null);

    // console.log(ownedObjectsDetails)
    return ownedObjectsDetails
}

