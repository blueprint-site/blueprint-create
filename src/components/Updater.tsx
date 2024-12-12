import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import supabase from './Supabase';

const Updater = () => {
    const [status, setStatus] = useState<string | null>();

    useEffect(() => {
        const addonsLastUpdated = localStorage.getItem("addonsLastUpdated");
        const lastUpdatedTime = addonsLastUpdated ? new Date(addonsLastUpdated) : null;
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

        const addonList = localStorage.getItem("addonList");
        console.log("[UPDATER STARTED]: Checking last time addons were updated...");

        if (lastUpdatedTime && lastUpdatedTime > oneHourAgo || addonList === null || addonsLastUpdated === null) {
            console.log("Less than one hour ago")
            console.log("Starting update...");
            try {
                console.log("Fetching addon list...");
                console.log("Sending request...");
                axios.get(import.meta.env.APP_ADDONSAPI_URL)
                    .then(response => {
                        const data = response.data;
                        console.log("Updating localstorage...");
                        localStorage.setItem("addonList", JSON.stringify(data));
                        localStorage.setItem("addonsLastUpdated", Date.now().toString());
                        console.log("Addon list has been updated!");
                        window.location.reload(); // Add this line to reload the page
                        console.warn("RELOAD")
                    })

            } catch (error) {
                if (error instanceof AxiosError) {
                    console.error(error.message);
                }
                else {
                    console.error("Failed to fetch addon list:", error);
                }
            }
        }
        else {
            console.log("Addons were updated less than an hour ago");
            console.log("Doing nothing...");
        }

        getUserData();
    }, []);

    const addonsLastUpdated = localStorage.getItem("addonsLastUpdated");
    const lastUpdatedTime = addonsLastUpdated ? new Date(addonsLastUpdated) : null;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

    const addonList = localStorage.getItem("addonList");

    if (lastUpdatedTime && lastUpdatedTime > oneHourAgo || addonList === null || addonsLastUpdated === null) {
        console.log("More than one hour ago")

        return;
    }
    const getUserData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            // Store the authentication session in local storage
            localStorage.setItem('supabase.auth.token', JSON.stringify(session));
        }

        return (
            <>
            </>
        );
    };
}

export default Updater;