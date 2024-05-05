import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import NoPage from "./components/NoPage";
import Home from "./components/Home";
import { Suspense } from "react";
import Loading from "./components/Loading";


import EnglishTranslation from './assets/en_us.json';
import GermanTranslation from './assets/de_de.json';

import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-http-backend';

i18n
    .use(XHR)
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            en: EnglishTranslation,
            de: GermanTranslation
        },
        fallbackLng: "en",

        interpolation: {
            escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        }
    });

const App = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="*" element={<NoPage />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App;