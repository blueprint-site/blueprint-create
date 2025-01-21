import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
// Loading Overlays
import LoadingOverlay from "./components/LoadingOverlays/LoadingOverlay";
import SchematicsPageLoadingOverlay from "./components/LoadingOverlays/SchematicPageLoadingOverlay";

// Pages
const NoPage = lazy(() => import("./pages/404/NoPage"));
const Home = lazy(() => import("./pages/Home/Home"));
const Addons = lazy(() => import("./pages/Addons/Addons"));
const SchematicsPage = lazy(() => import("./pages/Schematics/Schematics"));
const About = lazy(() => import("./pages/About/About"));
const Schematic3DViewer = lazy(() => import("./pages/Schematics/Schematic3DViewer/Schematic3DViewer"));
const SchematicsUploadPage = lazy(() => import("./pages/Schematics/SchematicsUpload/SchematicsUpload"));
const RandomAddon = lazy(() => import("./components/RandomAddon"));
const AddonDetails = lazy(() => import("./components/AddonDetails"));
const SchematicExpanded = lazy(() => import("./components/SchematicExpanded"));

// Login
const LoginPage = lazy(() => import("./pages/Login/Login"));
const RegisterPage = lazy(() => import("./pages/Register/Register"));
const UserPage = lazy(() => import("./pages/User/UserPage"));
const UserSettings = lazy(() => import("./pages/User/Settings/UserSettings"));

// Protected Routes
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy
const Layout = lazy(() => import('./components/Layout'));

// Translations
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import Translations from "./assets/translations.json";

// Updater 
import Updater from "./components/Updater";

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
          <Updater />  {/* Proper JSX usage */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="addons" element={<Addons />} />
            <Route path="schematics" element={<SchematicsPage />} />
            <Route path="login" element={<LoginPage />} ></Route>
            <Route path="register" element={<RegisterPage />} ></Route>
            <Route path="about" element={<About />} />
            <Route path="*" element={<NoPage />} />
            <Route path="schematics/3dviewer" element={<Schematics3DViewerWithLoading />} />
            <Route path="schematics/upload" element={<SchematicsUploadPage />} />
            <Route path="addons/random" element={<RandomAddon />} />
            <Route path="/addons/:slug" element={<AddonDetails />} />
            <Route path="/schematics/:id" element={<SchematicExpanded />} />

            {/* Users */}
            <Route path="/user/:username" element={<UserPage />} />
            <Route path="/user" element={<UserPage />}/>
            {/* Protect the UserPage route */}
            <Route
              path="usersettings"
              element={
                <ProtectedRoute>
                  <UserSettings />
                </ProtectedRoute>
              }
            />

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