import { useContext } from "react";
import {AddonsContext} from "@/context/addons/addonsContext.tsx";


export const useAddons = () => {
    const context = useContext(AddonsContext);
    if (!context) {
        throw new Error("useAddons must be used within an AddonsProvider");
    }
    return context;
};