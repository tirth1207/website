"use client"
import { useLoading } from "@/context/loading-context";
import Navbar from "./navbar";

export function NavbarWrapper() {
  const { loading } = useLoading();
  
  if (loading) {
    return null;
  }
  
  return <Navbar />;
}
