import React from "react";
import PageSubHeader from "../_components/page-sub-header";
import { Button } from "@/components/ui/button";
import { Key, User } from "lucide-react";

const page = () => {
  return (
    <div className="flex h-full flex-col">
      <PageSubHeader>Настройки</PageSubHeader>
      <div className="grid flex-1 grid-cols-6 py-4">
        <div className="col-span-1 h-full space-y-1 border-r py-2 pr-2 *:justify-start">
          <Button variant="ghost" className="w-full">
            <User />
            Профиль
          </Button>
          <Button variant="ghost" className="w-full">
            <Key />
            Безопасность
          </Button>
        </div>
        <div className="col-span-5"></div>
      </div>
    </div>
  );
};

export default page;
