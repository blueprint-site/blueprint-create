import supabase from "@/components/utility/Supabase.tsx";
import {Admin_logs} from "@/types";

class AdminLogsService {

    /** Add the log to the supabase table */
    public static async addLog(type: 'delete' | 'read' | 'write' | 'update' | string, content: string, category: 'blog' | 'schematic' | 'addon' | 'users' | string ): Promise<void> {
        try {
            const { error } = await supabase.from("admin_logs").insert([{ type, content, category }]);
            if (error) {
                console.error("Error while adding the logs :", error);
            }
        } catch (err) {
            console.error("Erreur inattendue :", err);
        }
    }

    /** Get the log with pagination */
    public static async getLogs(limit: number = 10, offset: number = 0): Promise<Admin_logs[]> {
        try {
            const { data, error } = await supabase
                .from("admin_logs")
                .select("*")
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) {
                console.error("Error while getting the logs :", error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error("Erreur inattendue :", err);
            return [];
        }
    }
}

export default AdminLogsService;
