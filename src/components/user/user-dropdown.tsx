import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

type UserDropdownProps = {
  userProfile: string | null;
};

const UserDropdown = ({ userProfile }: UserDropdownProps) => {
  const menus = [
    {
      href: "/r/create",
      text: "Create community",
    },
    {
      href: "/r/crossfit/post",
      text: "Create post",
    },
    {
      href: "/settings",
      text: "Settings",
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-x-4 border rounded-full py-2 px-5 items-center">
        <MenuIcon size={24} />
        {userProfile ? (
          <img
            src={userProfile}
            alt="User profile"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <UserIcon className="w-8 h-8" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {menus.map((menu, index) => (
          <DropdownMenuItem key={index}>
            <Link href={menu.href}>{menu.text}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutLink>Log out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
