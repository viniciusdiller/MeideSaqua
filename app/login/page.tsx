"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { loginUser } from "@/lib/api";
import { AnimatePresence } from "framer-motion";
import { Notification, NotificationType } from "@/components/ui/notification";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const addNotification = (text: string, type: "success" | "error") => {
    const newNotif: NotificationType = {
      id: Math.random(),
      text,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const removeNotif = (id: number) => {
    setNotifications((pv) => pv.filter((n) => n.id !== id));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loginData = {
      username: email,
      password: password,
    };

    try {
      const userData = await loginUser(loginData);
      addNotification("Login bem-sucedido! Redirecionando...", "success");
      login(userData);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      addNotification("Email ou senha inválidos. Tente novamente.", "error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-1 w-72 fixed top-4 right-4 z-50 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <Notification removeNotif={removeNotif} {...n} key={n.id} />
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center h-screen bg-gray-50 px-4 ">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Link href="/" passHref>
              <Image
                src="/LogoMeideSaqua.png"
                alt="Logo MeideSaquá"
                width={150}
                height={150}
                className="mx-auto"
              />
            </Link>
          </div>
          <div className="mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-[#017DB9] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </Link>
          </div>
          <Card
            className="rounded-2xl border border-[#017DB9]/70 bg-white shadow-lg
                       focus:outline-none focus:ring-2 focus:border-transparent
                       transition-all duration-300 placeholder-gray-400 text-sm
                       hover:shadow-md"
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Efetue o Login</CardTitle>
              <CardDescription>
                Entre com suas credenciais para ter a possibilidade de avaliar
                os estabelecimentos.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailOrUsername">
                    Email / Nome de usuário
                  </Label>
                  <Input
                    id="emailOrUsername"
                    type="text"
                    placeholder="Insira seu email ou nome de usuário"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full py-2
                    rounded-2xl border border-gray-200 bg-white shadow-sm
                    focus:ring-2 focus:border-[#22c362]/70 transition-all duration-300 placeholder:text-gray-400
                    "
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full py-2 pr-10
                      rounded-2xl border border-gray-200 bg-white shadow-sm
                      focus:ring-2 focus:border-[#22c362]/70 transition-all duration-300 placeholder:text-gray-400
                      "
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center space-y-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="hover:bg-[#22c362] rounded-2xl hover:text-white flex justify-center mx-auto px-10 text-gray-700 border border-[#017DB9]/70 w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Aguarde...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
                <Link href="/cadastro" className=" text-gray-600 ">
                  Novo por aqui?{" "}
                  <strong className="underline hover:text-[#017DB9]">
                    {" "}
                    Cadastre-se
                  </strong>
                </Link>
              </CardFooter>
            </form>
          </Card>
          <div className="mt-4 text-center text-sm">
            <Link
              href="/esqueci-senha"
              className="underline text-gray-600 hover:text-[#017DB9]"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

