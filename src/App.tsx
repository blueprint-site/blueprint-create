// src/App.tsx
import '@/config/i18n';
import {BrowserRouter, useRoutes} from "react-router-dom";
import { LoadingOverlay } from "@/components/loading-overlays/LoadingOverlay";
import { Toaster } from "@/components/ui/toaster.tsx";
import { LoggedUserProvider } from "./context/users/loggedUserContext";
import { routes } from "./routes";
import {Suspense, useEffect, useState} from 'react';

const App = () => {
    const [envLoaded, setEnvLoaded] = useState(false);
    const AppRoutes = () => {
        return useRoutes(routes);
    };

    useEffect(() => {
        const loadEnv = () => {
            const script = document.createElement("script");
            script.src = "/env.js";
            script.onload = () => {
                console.log(script.src)
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