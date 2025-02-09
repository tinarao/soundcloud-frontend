"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const res = await login(value.email, value.password);
      if (res.ok) {
        router.replace("/app");
      } else {
        toast({
          title: res.message ?? "Ошибка авторизации",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <h1 className="text-3xl font-bold">Авторизация</h1>
        <div className="space-y-4">
          <div className="w-96">
            <form.Field name="email">
              {(field) => (
                <>
                  <Label>Электронная почта</Label>
                  <Input
                    required
                    maxLength={96}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </>
              )}
            </form.Field>
          </div>
          <div>
            <form.Field name="password">
              {(field) => (
                <>
                  <Label>Пароль</Label>
                  <Input
                    required
                    type="password"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </>
              )}
            </form.Field>
          </div>
          <div>
            <Button>Войти</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
