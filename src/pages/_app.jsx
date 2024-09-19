import "../global.css";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const unprotectedRoutes = [
  "/user/login",
  "/user/request-password-reset",
  "/user/reset-password",
];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    console.log({ token });
    if (!token && !unprotectedRoutes.includes(router.pathname)) {
      console.log("unprotected routes");
      router.push("/user/login");
    }
  }, [router.pathname]);

  return (
    <main>
      {/* <Layout /> */}
      <div className="max-w-[1500px] 2xl:mx-auto pt-[120px] pb-10 xl:mx-[40px]">
        <Component {...pageProps} />
        <SpeedInsights />
        {/* <Analytics />
        <ToastContainer /> */}
      </div>
    </main>
  );
}
