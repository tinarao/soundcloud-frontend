import { me } from "@/actions/auth";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";
import UserPopover from "./_components/user-popover";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Layout = async ({ children }: PropsWithChildren) => {
  const user = await me();
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <header className="w-full border-b py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Button>
            <Link href="/app">Soundcloud</Link>
          </Button>
          <UserPopover />
        </div>
      </header>
      <main className="container mx-auto flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
