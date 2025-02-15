import { me } from "@/actions/auth";
import axios from "axios";
import { cookies } from "next/headers";
import React from "react";
import AuthVerifier from "./auth-provider";

const MasterAuthProvider = async () => {
  const user = await me();
  if (!user) {
    return;
  }

  const cookieStorage = await cookies();
  const accessToken = cookieStorage.get("accessToken");
  if (!accessToken) {
    return;
  }

  return <AuthVerifier token={accessToken.value} />;
};

export default MasterAuthProvider;
