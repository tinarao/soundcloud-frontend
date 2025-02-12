"use client";

import { logout } from "@/actions/auth";
import { useEffect } from "react";

const LogoutPage = () => {
  useEffect(() => {
    logout();
  }, []);

  return <></>;
};

export default LogoutPage;
