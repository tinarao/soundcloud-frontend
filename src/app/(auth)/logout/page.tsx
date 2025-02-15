"use client";

import { logout } from "@/actions/auth";
import axios from "axios";
import { useEffect } from "react";

const LogoutPage = () => {
  useEffect(() => {
    logout();
  }, []);

  return <></>;
};

export default LogoutPage;
