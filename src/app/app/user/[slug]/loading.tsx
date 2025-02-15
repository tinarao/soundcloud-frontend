import { LoaderCircle } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <LoaderCircle className="size-8 animate-spin" />
    </div>
  );
};

export default Loading;
