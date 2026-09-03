import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        courses: "Courses",
        instructors: "Instructors",
        pricing: "Pricing",
        about: "About",
        contact: "Contact",
        login: "Log in",
        signup: "Sign up",
        dashboard: "Dashboard",
        logout: "Log out"
      },
      hero: {
        title: "Learn the skills that move careers forward.",
        subtitle: "Premium, no-fluff courses taught by operators from the teams you admire. Build real momentum in weeks, not years.",
        cta1: "Browse Courses",
        cta2: "Learn More"
      }
    }
  },
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        courses: "الدورات",
        instructors: "المدربون",
        pricing: "الأسعار",
        about: "عن المنصة",
        contact: "اتصل بنا",
        login: "تسجيل الدخول",
        signup: "إنشاء حساب",
        dashboard: "لوحة التحكم",
        logout: "تسجيل الخروج"
      },
      hero: {
        title: "تعلم المهارات التي تدفع بمسيرتك المهنية للأمام.",
        subtitle: "دورات احترافية خالية من الحشو يقدمها خبراء من أفضل الشركات. ابدأ بناء مستقبلك في أسابيع، وليس سنوات.",
        cta1: "تصفح الدورات",
        cta2: "اعرف المزيد"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

// Update the html dir attribute when language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = i18n.dir(lng);
  document.documentElement.lang = lng;
});

// Set initial direction
document.documentElement.dir = i18n.dir(i18n.language);

export default i18n;
