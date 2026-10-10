import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export const metadata = { title: "বাজার দর", description: "প্রয়োজনীয় পণ্যের দাম এক নজরে" };
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <head><link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@100..900&display=swap" rel="stylesheet" /></head>
      <body><Toaster position="top-center" /><Navbar /><main className="max-w-6xl mx-auto px-4">{children}</main><Footer /></body></html>
  );
}
