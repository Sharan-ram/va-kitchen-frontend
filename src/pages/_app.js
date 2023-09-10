import "../global.css";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }) {
  return (
    <main>
      <Layout />
      <div className="max-w-[1500px] h-full mx-auto pt-[120px] pb-10">
        <Component {...pageProps} />
      </div>
    </main>
  );
}
