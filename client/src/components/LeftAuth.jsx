import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const LeftAuth = () => {
  const { t } = useTranslation();
  return (
    <div className="flex-1">
      <Link to="/" className="font-bold dark:text-white text-4xl">
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          T-
        </span>
        Blog
      </Link>
      <p className="text-sm mt-5">{t("SLOGAN")}</p>
    </div>
  );
};

export default LeftAuth;
