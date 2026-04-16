import React, { useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data && res.data.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", res.data.token);
        }
        // After login, redirect to dashboard, then show biometric lock
        router.push("/admin/dashboard?biometric=1");
      } else {
        setError("Invalid credentials");
      }
