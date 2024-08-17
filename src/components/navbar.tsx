import Image from "next/image";
import Link from "next/link";

import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./theme/mode-toggle";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import UserDropdown from "./user/user-dropdown";

export async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <nav className="h-[10vh] w-full flex justify-between items-center border-b px-5 lg:px-14">
      <Link href="/" className="flex flex-row items-center justify-center">
        <Image
          src="/reddit-logo.png"
          alt="Reddit logo"
          width={100}
          height={100}
        />
        <Image
          src="/reddit-text.png"
          alt="Reddit text"
          className="hidden md:block"
          width={100}
          height={100}
        />
      </Link>
      <div className="flex space-x-4 items-center">
        <ModeToggle />

        {user ? (
          <>
            <UserDropdown userProfile={user.picture} />
          </>
        ) : (
          <>
            <Button className="hidden md:block" variant={"secondary"} asChild>
              <LoginLink>Log in</LoginLink>
            </Button>
            <Button className="hidden md:block" asChild>
              <RegisterLink>Sign up</RegisterLink>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
