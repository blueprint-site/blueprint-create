
import {AddonStatsDisplayScanned, AddonStatsDisplayValidated} from "@/components/features/admin/stats/AddonStats";
import {UsersStatsDisplayRegistered} from "@/components/features/admin/stats/UsersStats";

const AddonStatsWrapper = () => {
  return(

      <div className="flex flex-wrap gap-4 mt-4">
        <AddonStatsDisplayScanned/>
        <AddonStatsDisplayValidated/>
          <UsersStatsDisplayRegistered/>
      </div>

  )
}
export default AddonStatsWrapper;