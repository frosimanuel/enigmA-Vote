"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeaderMenuLinks } from "./HeaderMenuLinks";
import { ArchiveBoxArrowDownIcon, ArchiveBoxIcon, Bars3Icon, BugAntIcon, ScaleIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="w-4 h-4" />,
  },
  {
    label: "Create Ballot",
    href: "create",
    icon: <ArchiveBoxIcon className="w-4 h-4" />,
  },
  {
    label: "Join",
    href: "join",
    icon: <ScaleIcon className="w-4 h-4" />,
  },
  {
    label: "Vote",
    href: "vote",
    icon: <ArchiveBoxArrowDownIcon className="w-4 h-4" />,
  },
];

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky top-0 z-20 justify-between flex-shrink-0 min-h-0 px-0 shadow-md lg:static navbar bg-base-100 shadow-secondary sm:px-2">
      <div className="w-auto navbar-start lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="items-center hidden gap-2 ml-4 mr-6 lg:flex shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="Enigma Vote logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Enigma Vote</span>
          </div>
        </Link>
        <ul className="hidden gap-2 px-1 lg:flex lg:flex-nowrap menu menu-horizontal">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="flex-grow mr-4 navbar-end">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
