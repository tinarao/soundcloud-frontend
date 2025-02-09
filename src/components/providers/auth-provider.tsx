"use client";

import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

const AuthVerifier = () => {
  const { verify } = useAuth();

  useEffect(() => {
    verify();
  }, []);

  return <></>;
};

export default AuthVerifier;
