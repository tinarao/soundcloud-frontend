import React from "react";

const PageSubHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="py-2">
      <h1 className="w-fit border-b-4 text-3xl">{children}</h1>
    </div>
  );
};

export default PageSubHeader;
