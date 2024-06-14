// components/LoginForm.js
"use client";

import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "/firebase-config";
import { useState } from "react";
import Image from "next/image";

const loginSchema = yup.object({
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
}).required();

const LoginForm = () => {
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(loginSchema),
  });
  const [error, setError] = useState(null);
  const [viewPassword, setViewPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      console.log("User logged in successfully:", user);
      router.push(`/hospitals/${user.uid}`);
    } catch (e) {
      console.error("Error logging in:", e);
      setError("Invalid email or password");
    }
  };

  const handleViewPassword = () => {
    setViewPassword((view) => !view);
  };

  return (
    <div className="w-full lg:w-1/3 mx-auto mt-12 p-8 border rounded-lg shadow-lg">
      <h2 className="text-4xl font-semibold mb-6">Hospital Login</h2>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col">
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              {...methods.register("email")}
              type="text"
              className={`outline-none border rounded-lg py-2 px-4 w-full ${
                methods.formState.errors.email ? "border-red-500" : ""
              }`}
            />
            {methods.formState.errors.email && (
              <p className="text-red-500 text-sm">{methods.formState.errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <div className="relative">
              <input
                {...methods.register("password")}
                type={viewPassword ? "text" : "password"}
                className={`outline-none border rounded-lg py-2 px-4 w-full ${
                  methods.formState.errors.password ? "border-red-500" : ""
                }`}
              />
              <Image
                src={viewPassword ? "/images/view.svg" : "/images/view-off.svg"}
                alt="view password"
                width={28}
                height={28}
                className="absolute right-4 top-2 cursor-pointer"
                onClick={handleViewPassword}
              />
            </div>
            {methods.formState.errors.password && (
              <p className="text-red-500 text-sm">{methods.formState.errors.password.message}</p>
            )}
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-blue-1 px-6 py-3 text-lg rounded-lg font-semibold text-white"
          >
            Login
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default LoginForm;
