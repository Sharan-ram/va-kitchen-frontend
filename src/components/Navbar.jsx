import { useState } from "react";

const items = [
  {
    title: "Meal Plan",
    subItems: [
      {
        title: "Create new plan",
        pathname: "/mealPlan/create",
      },
      {
        title: "View existing plan",
        pathname: "/mealPlan/render",
      },
    ],
  },
  {
    title: "Orders",
    subItems: [
      {
        title: "Monthly order",
        pathname: "/oms/monthly",
      },
      {
        title: "Weekly order",
        pathname: "/oms/weekly",
      },
    ],
  },
  {
    title: "Ingredients",
    subItems: [
      {
        title: "Create new",
        pathname: "/ingredients/create",
      },
      {
        title: "Prices",
        pathname: "/ingredients/price/manual-update",
      },
      {
        title: "Stock",
        pathname: "/ingredients/stock/manual-update",
      },
    ],
  },
  {
    title: "Recipes",
    subItems: [
      {
        title: "Create new recipe",
        pathname: "/recipes/create",
      },
    ],
  },
  {
    title: "Username",
    subItems: [
      {
        title: "Reset Password",
        pathname: "/user/reset-password",
      },
      {
        title: "Logout",
        pathname: "/user/logout",
      },
      {
        title: "Register new user",
        pathname: "/user/register",
      },
    ],
  },
];

const Navbar = () => {
  const [activeItem, setActiveItem] = useState(null);

  const handleMouseEnter = (itemTitle) => {
    setActiveItem(itemTitle);
  };

  const handleMouseLeave = () => {
    setActiveItem(null);
  };

  return (
    <div className="flex items-center">
      {items.map((item) => (
        <div
          key={item.title}
          className="relative px-2.5 text-white"
          onMouseEnter={() => handleMouseEnter(item.title)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative">
            <div className="title">{item.title}</div>
            {activeItem === item.title && (
              <div
                className="absolute left-0 bg-[#8E7576] rounded-[5px] border-y-8 border-[#735E5F] min-w-[200px] text-left"
                style={{ boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)" }}
                onMouseEnter={() => handleMouseEnter(item.title)}
                onMouseLeave={handleMouseLeave}
              >
                {item.subItems.map((subItem) => (
                  <a
                    key={subItem.title}
                    href={subItem.pathname}
                    className="block px-4 py-2 hover:bg-[#8a7879] hover:cursor-pointer hover:opacity-60 whitespace-nowrap"
                  >
                    {subItem.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// activeItem === item.title &&

export default Navbar;
