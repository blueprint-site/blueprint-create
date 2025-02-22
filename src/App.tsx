// src/App.tsx
import '@/config/i18n';
import {BrowserRouter, useRoutes} from "react-router-dom";
import { LoadingOverlay } from "@/components/loading-overlays/LoadingOverlay";
import { Toaster } from "@/components/ui/toaster.tsx";
import { LoggedUserProvider } from "./api/context/loggedUser/loggedUserContext.tsx";
import { routes } from "./routes";
import {Suspense, useEffect, useState} from 'react';
import 'minecraft-textures-library/src/templates/create-textures.css';

const App = () => {
    const AppRoutes = () => {
        return useRoutes(routes);
    };
    const [envLoaded, setEnvLoaded] = useState(false);


    useEffect(() => {
        const loadEnv = () => {
            const script = document.createElement("script");
            script.src = `/env.js?version=${new Date().getTime()}`;  // Ajoute un timestamp à chaque demande
            script.onload = () => {
                console.log("env.js loaded");
                setEnvLoaded(true);
            };
            script.onerror = () => {
                console.error("❌ Error while loading `env.js`");
            };
            document.head.appendChild(script);
        };

        loadEnv();
    }, []);

    if (!envLoaded) {
        return <LoadingOverlay />;
    }

    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingOverlay />}>
                <LoggedUserProvider>
                    <AppRoutes />
                </LoggedUserProvider>
                <Toaster/>

            </Suspense>
        </BrowserRouter>
    );
};

export default App;