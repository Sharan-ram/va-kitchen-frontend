import Logo from "@/assets/images/va-logo.png";
import Image from "./Image";

const Layout = () => {
  return (
    <div className="fixed w-full py-4 bg-[#8e7576]">
      <div className="max-w-[1500px] mx-auto">
        <Image src={Logo} />
      </div>
    </div>
  );
};

export default Layout;
