import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import LoadingOverlay from "./components/LoadingOverlay";

const NoPage = lazy(() => import("./pages/404/NoPage"));
const Home = lazy(() => import("./pages/Home/Home"));
const Addons = lazy(() => import("./pages/Addons/Addons"));

const Layout = lazy(() => import('./components/Layout'));

import Translations from "./assets/translations.json";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-http-backend";
import SchematicsPage from "./pages/Schematics/Schematics";
import Login from "./pages/Login/Login";

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: Translations,
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingOverlay />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="addons" element={<Addons />} />
            <Route path="schematics" element={<SchematicsPage />} />
            <Route path="login" element={<Login />} ></Route>
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
