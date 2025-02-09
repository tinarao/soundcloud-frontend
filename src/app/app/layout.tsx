import { me } from "@/actions/auth";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";
import UserPopover from "./_components/user-popover";

const Layout = async ({ children }: PropsWithChildren) => {
  try {
    await me();
  } catch {
    redirect("/login");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <header className="w-full border-b py-4">
        <div className="container mx-auto flex items-center justify-between">
          Soundcloud
          <UserPopover />
        </div>
      </header>
      <main className="container mx-auto flex-1">{children}</main>
    </div>
  );
};

export default Layout;
