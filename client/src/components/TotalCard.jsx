import React from "react";
import { useTranslation } from "react-i18next";
import { HiArrowNarrowUp, HiOutlineUserGroup } from "react-icons/hi";

const TotalCard = ({ total, lastMonth, icon }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
      <div className="flex justify-between">
        <div className="">
          <h3 className="text-gray-500 text-md uppercase">
            {total.label || ''}
          </h3>
          <p className="text-2xl">{total.value || ""}</p>
        </div>
        {icon}
      </div>
      <div className="flex  gap-2 text-sm">
        <span className="text-green-500 flex items-center">
          <HiArrowNarrowUp />
          {lastMonth || ""}
        </span>
        <div className="text-gray-500">{t("LAST_MONTH")}</div>
      </div>
    </div>
  );
};

export default TotalCard;
