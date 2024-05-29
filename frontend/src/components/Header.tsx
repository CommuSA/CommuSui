// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useGenerateDemoData } from "@/mutations/demo";

import logo from '../images/logo.jpg';

import { Box, Button, Container, Flex, Heading } from "@radix-ui/themes";
import { NavLink } from "react-router-dom";
import AccountDropdown, { AccountData } from "./zkloginconnect/zkloginconnect";
import { useState } from "react";

const menu = [
  {
    title: "Escrows",
    link: "/escrows",
    params: { type: "escrows" },

  },
  {
    title: "Manage Objects",
    link: "/locked",
    params: { type: "locked" },
  },
];



export function Header() {
  const [account, setAccounts] = useState<AccountData[]>([]);
  const { mutate: demoBearMutation, isPending } = useGenerateDemoData(account);

  // function clicks() {
  //   console.log(account[0].userAddr)
  // }
  return (
    <Container>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        className="border-b flex flex-wrap"
      >
        <Box>
          <Heading className="flex items-center gap-3">
            <img src={logo} width={38} height={38} alt="logo" />
            CommuSui
          </Heading>
        </Box>

        <Box className="flex gap-5 items-center">
          {menu.map((item) => (
            <NavLink
              key={item.link}
              // to={item.link}
              to={{
                pathname: item.link,
                search: new URLSearchParams({ ...item.params, account: JSON.stringify(account) }).toString(),
              }}
              className={({ isActive, isPending }) =>
                `cursor-pointer flex items-center gap-2 ${isPending
                  ? "pending"
                  : isActive
                    ? "font-bold text-blue-600"
                    : ""
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </Box>
        <Box>
          <Button
            className="cursor-pointer"
            disabled={isPending}
            onClick={() => {
              demoBearMutation();
              console.log(account)
            }}
          >
            Create Data Assert
          </Button>
        </Box>

        <Box className="connect-wallet-wrapper">
          <AccountDropdown onAccountsChange={setAccounts} />
        </Box>
      </Flex>
    </Container>
  );
}
