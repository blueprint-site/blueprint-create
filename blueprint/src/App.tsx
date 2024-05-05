import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import NoPage from "./components/NoPage";
import Home from "./components/Home";
import { Suspense } from "react";
import Loading from "./components/Loading";

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