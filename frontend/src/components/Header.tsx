// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useGeneratDataLabeling } from "@/mutations/dataLabeling";

import logo from '../images/logo.jpg';

import { Box, Button, Container, Flex, Heading } from "@radix-ui/themes";
import * as Dialog from '@radix-ui/react-dialog';

import { NavLink } from "react-router-dom";
import AccountDropdown, { AccountData } from "./zkloginconnect/zkloginconnect";
import { useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [sKey, setKey] = useState('');
  const { mutate: dataLabelMutation, isPending } = useGeneratDataLabeling();


  const handleCreateDataAssert = () => {
    dataLabelMutation({ account, name, url, description, sKey });
    setName('');
    setUrl('');
    setDescription('');
    setKey('');
    setIsModalOpen(false);
  };

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
                search: new URLSearchParams({ ...item.params, account: JSON.stringify(account[0]) }).toString(),
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
          <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Dialog.Trigger asChild>
              <Button
                variant="soft"
                className="cursor-pointer"
                disabled={isPending}

                onClick={() => { setIsModalOpen(true), console.log(account[0].userAddr) }}
              >
                Create Data Assert
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
              <Dialog.Content className="fixed bg-white p-6 rounded-md shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Dialog.Title className="text-lg font-medium">Input Data</Dialog.Title>
                <Dialog.Description className="mt-2 mb-4 text-sm">
                  Please enter the required information below.
                </Dialog.Description>
                <fieldset className="mb-3">
                  <label className="block text-sm font-medium" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="mt-1 p-2 border rounded-md w-full"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="mb-3">
                  <label className="block text-sm font-medium" htmlFor="url">
                    URL
                  </label>
                  <input
                    className="mt-1 p-2 border rounded-md w-full"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </fieldset>
                <fieldset className="mb-3">
                  <label className="block text-sm font-medium" htmlFor="description">
                    Description
                  </label>
                  <input
                    className="mt-1 p-2 border rounded-md w-full"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </fieldset>
                <fieldset className="mb-3">
                  <label className="block text-sm font-medium" htmlFor="sKey">
                    Key
                  </label>
                  <input
                    className="mt-1 p-2 border rounded-md w-full"
                    id="key"
                    type="password"
                    value={sKey}
                    onChange={(e) => setKey(e.target.value)}
                  />
                </fieldset>
                <div className="mt-4 flex justify-end">
                  <Dialog.Close asChild>
                    <button
                      className="mr-2 px-4 py-2 bg-gray-200 rounded-md"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => {
                      // dataLabelMutation();
                      handleCreateDataAssert();
                    }}
                  >
                    Submit
                  </button>
                </div>
                <Dialog.Close asChild>
                  <button className="absolute top-2 right-2">
                    <Cross2Icon />
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>


        </Box>

        <Box className="connect-wallet-wrapper">
          <AccountDropdown onAccountsChange={setAccounts} />
        </Box>
      </Flex>
    </Container>
  );
}
