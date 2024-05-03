import classNames from "classnames";

const Tabs = ({ tabs, selected, setSelectedTab }) => {
  return (
    <div className="flex items-center">
      {tabs.map((tab, index) => {
        console.log({ tab, selected });
        return (
          <div
            className={classNames(
              "px-3 py-2 rounded mr-2",
              tab === selected
                ? "bg-[#8e7576] text-white"
                : "bg-[#f3f1f1] cursor-pointer"
            )}
            key={index}
            onClick={() => {
              if (tab !== selected) {
                setSelectedTab(tab);
              }
            }}
          >
            {tab}
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;
