import { useState, useEffect } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

let items = [
  {
    title: "Meal Plan",
    subItems: [
      {
        title: "Create new plan",
        pathname: "/mealPlan/create",
        roles: ["admin"],
      },
      {
        title: "View existing plan",
        pathname: "/mealPlan/render",
        roles: ["admin", "user"],
      },
    ],
  },
  {
    title: "Orders",
    subItems: [
      {
        title: "Monthly order",
        pathname: "/oms/monthly",
        roles: ["admin", "user"],
      },
      {
        title: "Weekly order",
        pathname: "/oms/weekly",
        roles: ["admin", "user"],
      },
    ],
  },
  {
    title: "Ingredients",
    subItems: [
      {
        title: "Create new",
        pathname: "/ingredients/create",
        roles: ["admin"],
      },
      {
        title: "Prices",
        pathname: "/ingredients/price/manual-update",
        roles: ["admin"],
      },
      {
        title: "Stock",
        pathname: "/ingredients/stock/manual-update",
        roles: ["admin"],
      },
      {
        title: "View all",
        pathname: "/ingredients/view",
        roles: ["admin", "user"],
      },
    ],
  },
  {
    title: "Recipes",
    subItems: [
      {
        title: "Create new recipe",
        pathname: "/recipes/create",
        roles: ["admin"],
      },
      {
        title: "View all",
        pathname: "/recipes/view",
        roles: ["admin", "user"],
      },
    ],
  },
  {
    title: "Username",
    subItems: [
      {
        title: "Reset Password",
        pathname: "/user/reset-password",
        roles: ["admin", "user"],
      },
      {
        title: "Register new user",
        pathname: "/user/register",
        roles: ["admin"],
      },
      {
        title: "Logout",
        pathname: "/user/logout",
        roles: ["admin", "user"],
      },
    ],
  },
];

const Navbar = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Function to update the user state from localStorage
    const updateUser = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        console.log({ user });
        setUser(user);
      } else {
        setUser(null); // Handle the case where the user data is removed
      }
    };

    // Run updateUser once when the component mounts
    updateUser();

    // Listen for custom 'userUpdated' event
    window.addEventListener("userUpdated", updateUser);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("userUpdated", updateUser);
    };
  }, []);

  const handleMouseEnter = (itemTitle) => {
    setActiveItem(itemTitle);
  };

  const handleMouseLeave = () => {
    setActiveItem(null);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userUpdated"));
    setActiveItem(null);
    router.push("/user/login");
  };

  if (!user) return null;

  return (
    <div className="flex items-center font-open-sans">
      {items.map((item) => (
        <div
          key={item.title}
          className="relative px-2.5 text-white"
          onMouseEnter={() => handleMouseEnter(item.title)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative">
            <div
              className={classNames(
                "py-2",
                item.title === "Username" && "opacity-70"
              )}
            >
              {item.title === "Username" ? user?.username : item.title}
            </div>
            {activeItem === item.title && (
              <div
                className={classNames(
                  "absolute bg-[#8E7576] rounded-[5px] border-y-8 border-[#735E5F] min-w-[200px] text-left",
                  item.title === "Username" || item.title === "Recipes"
                    ? "right-0"
                    : "left-0"
                )}
                style={{ boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)" }}
                onMouseEnter={() => handleMouseEnter(item.title)}
                onMouseLeave={handleMouseLeave}
              >
                {item.subItems
                  .filter((subItem) => subItem.roles.includes(user?.role))
                  .map((subItem) => {
                    return subItem.title === "Logout" ? (
                      <div
                        className="text-sm block px-4 py-2 hover:bg-[#7B6B6C] hover:cursor-pointer hover:opacity-50 whitespace-nowrap border-b border-b-[#735E5F]"
                        onClick={signOut}
                        key={subItem.title}
                      >
                        {subItem.title}
                      </div>
                    ) : (
                      <a
                        key={subItem.title}
                        href={subItem.pathname}
                        className="text-sm block px-4 py-2 hover:bg-[#7B6B6C] hover:cursor-pointer hover:opacity-50 whitespace-nowrap border-b border-b-[#735E5F]"
                      >
                        {subItem.title}
                      </a>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Navbar;
