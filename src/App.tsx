import { BrowserRouter, Routes, Route, Router, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import LoadingOverlay from "./components/LoadingOverlays/LoadingOverlay";
import SchematicsPageLoadingOverlay from "./components/LoadingOverlays/SchematicPageLoadingOverlay";

const NoPage = lazy(() => import("./pages/404/NoPage"));
const Home = lazy(() => import("./pages/Home/Home"));
const Addons = lazy(() => import("./pages/Addons/Addons"));
const SchematicsPage = lazy(() => import("./pages/Schematics/Schematics"));
const About = lazy(() => import("./pages/About/About"));
const Schematic3DViewer = lazy(() => import("./pages/Schematics/Schematic3DViewer/Schematic3DViewer"));
const SchematicsUploadPage = lazy(() => import("./pages/Schematics/SchematicsUpload/SchematicsUpload"));

// Login
const LoginPage = lazy(() => import("./pages/Login/Login"));
import ProtectedComponent from './components/UserSystem/ProtectedComponent';

const Layout = lazy(() => import('./components/Layout'));

import Translations from "./assets/translations.json";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-http-backend";

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
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingOverlay />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="addons" element={<Addons />} />
            <Route path="schematics" element={<SchematicsPage />} />
            <Route path="login" element={<LoginPage />} ></Route>
            <Route path="about" element={<About />} />
            <Route path="*" element={<NoPage />} />
            <Route path="schematics/3dviewer" element={<Schematics3DViewerWithLoading />} />
            <Route path="schematics/upload" element={<SchematicsUploadPage />} />
            <Route path="/protected" element={isAuthenticated() ? <ProtectedComponent /> : <Navigate to="/login" />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

const Schematics3DViewerWithLoading = () => {
  return (
    <Suspense fallback={<SchematicsPageLoadingOverlay />}>
      <Schematic3DViewer />
    </Suspense>
  );
};