import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import supabase from "@/components/utility/Supabase.tsx";

// TABLE WHERE WE WANT TO HAVE REAL TIME UPDATE
const tablesToListen = ["profiles", "addons", "blog_articles", "mods"];


// LISTENER THAT NEED TO BE INIT AT THE START OF THE APP
export const useSupabaseListener = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const channels = tablesToListen.map((table) => {
            return supabase
                .channel(table)
                .on("postgres_changes", { event: "*", schema: "public", table }, async (payload) => {
                    queryClient.setQueryData([table], (oldData: any[] | undefined) => {
                        if (!oldData) return [];

                        switch (payload.eventType) {
                            case "INSERT":
                                return [...oldData, payload.new];

                            case "UPDATE":
                                return oldData.map((item) =>
                                    item.id === payload.new.id ? payload.new : item
                                );

                            case "DELETE":
                                return oldData.filter((item) => item.id !== payload.old.id);

                            default:
                                return oldData;
                        }
                    });
                })
                .subscribe();
        });

        return () => {
            channels.forEach((channel) => supabase.removeChannel(channel));
        };
    }, [queryClient]);

    return null; // No UI, just managing subscriptions
};
