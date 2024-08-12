import "../global.css";
import Layout from "@/components/Layout";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    console.log({ token });
    if (!token) {
      router.push("/user/login");
    }
  }, []);

  return (
    <main>
      <Layout />
      <div className="max-w-[1500px] mx-auto pt-[120px] pb-10">
        <Component {...pageProps} />
      </div>
    </main>
  );
}
