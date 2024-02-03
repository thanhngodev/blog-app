import React from "react";
import CallToAction from "../components/CallToAction";
import { useTranslation } from "react-i18next";

const Projects = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
      <h1 className="text-3xl font-semibold">{t("POJECTS")}</h1>
      <p className="text-md text-gray-500">{t("PROJECT_DESC")}</p>
      <CallToAction />
    </div>
  );
};

export default Projects;
