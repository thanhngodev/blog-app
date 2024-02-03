import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-3xl font font-semibold text-center my-7">
            {t("ABOUT_T-BLOG")}
          </h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>{t("WELCOME_TO_T-BLOG")}</p>
            <p>{t("WELCOME_TO_T-BLOG_1")}</p>
            <p>{t("WELCOME_TO_T-BLOG_2")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
