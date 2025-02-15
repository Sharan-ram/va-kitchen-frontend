import Logo from "@/assets/images/va-logo.png";
import Image from "./Image";
import { useRouter } from "next/router";
import Navbar from "./Navbar";

const Layout = () => {
  const router = useRouter();
  return (
    <div className="fixed w-full py-4 bg-[#8e7576] z-[999]">
      <div className="max-w-[1500px] 2xl:mx-auto xl:mx-[40px]">
        <div className="flex justify-between items-center">
          <div
            className="cursor-pointer w-[240px] h-[70px] relative"
            onClick={() => router.push("/")}
          >
            <Image
              src={Logo}
              fill={true}
              className="object-contain"
              alt="Vedanta Academy logo"
            />
          </div>
          <div>
            <Navbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
