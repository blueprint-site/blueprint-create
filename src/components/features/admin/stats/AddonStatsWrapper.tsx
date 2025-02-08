
import {AddonStatsDisplayScanned, AddonStatsDisplayValidated} from "@/components/features/admin/stats/AddonStats.tsx";
import {AddonsProvider} from "@/context/addons/addonsContext.tsx";
import {UsersStatsDisplayRegistered} from "@/components/features/admin/stats/UsersStats.tsx";
import {UsersProvider} from "@/context/users/usersContext.tsx";

const AddonStatsWrapper = () => {
    return(
                <AddonsProvider>
                    <div className="flex flex-wrap gap-4 mt-4">
                        <AddonStatsDisplayScanned/>
                        <AddonStatsDisplayValidated/>
                        <UsersProvider>
                            <UsersStatsDisplayRegistered/>
                        </UsersProvider>
                    </div>
                </AddonsProvider>
    )
}
export default AddonStatsWrapper;