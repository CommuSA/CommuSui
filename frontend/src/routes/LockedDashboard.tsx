import { useEffect, useState } from "react";
import { Tabs } from "@radix-ui/themes";
import { LockOwnedObjects } from "../components/locked/LockOwnedObjects";
import { MyComponent } from "@/components/locked/test";
import { OwnedLockedList } from "@/components/locked/OwnedLockedList";
import { useLocation } from "react-router-dom";
import { AccountData } from "@/components/zkloginconnect/zkloginconnect";


export function LockedDashboard() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const [account, setAccount] = useState<AccountData | null>(null);
    const [tab, setTab] = useState<string>("My Locked Objects");


    useEffect(() => {
        try {
            const accountString = params.get('account');
            let i = 0;
            if (accountString) {
                i += 1;
                const parsedAccount = JSON.parse(accountString) as AccountData;
                setAccount(parsedAccount);
                console.log(parsedAccount, i)
            }
        } catch (e) {
            console.error("Failed to parse account data", e);
        }
    }, [params.toString()[0]]);

    if (!account) {
        return <div>Loading account data...</div>; // or handle the null case as needed
    }

    const tabs = [
        {
            name: "My Locked Objects",
            component: () => <OwnedLockedList account={account} />,
        },
        {
            name: "Lock Owned objects",
            component: () => <LockOwnedObjects account={account} />,
        },
        {
            name: "Test",
            component: () => <MyComponent account={account} />,
        },
    ];

    // const [tab, setTab] = useState(tabs[0].name);

    return (
        <Tabs.Root value={tab} onValueChange={setTab}>
            <Tabs.List>
                {tabs.map((tab, index) => {
                    return (
                        <Tabs.Trigger
                            key={index}
                            value={tab.name}
                            className="cursor-pointer"
                        >
                            {tab.name}
                        </Tabs.Trigger>
                    );
                })}
            </Tabs.List>
            {tabs.map((tab, index) => {
                return (
                    <Tabs.Content key={index} value={tab.name}>
                        {tab.component()}
                    </Tabs.Content>
                );
            })}
        </Tabs.Root>
    );
}
