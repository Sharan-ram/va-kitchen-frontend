import Logo from "@/assets/images/va-logo.png";
import Image from "./Image";
import { useRouter } from "next/router";

const Layout = () => {
  const router = useRouter();
  return (
    <div className="fixed w-full py-4 bg-[#8e7576]">
      <div className="max-w-[1500px] mx-auto">
        <div
          className="cursor-pointer w-[240px] h-[70px] relative"
          onClick={() => router.push("/")}
        >
          <Image src={Logo} fill={true} className="object-contain" />
        </div>
      </div>
    </div>
  );
};

export default Layout;
