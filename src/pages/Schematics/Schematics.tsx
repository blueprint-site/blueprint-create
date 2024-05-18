import { useTranslation } from "react-i18next";
import ExploreSchematicsMain from "../../components/ExploreSchematicsTitle";
import ExploreSchematicsSearch from "../../components/ExploreSchematicsSearch";
import ExploreSchematicsSchematics from "../../components/ExploreSchematicsSchematics";

function SchematicsPage() {
  return (
    <div>
      <ExploreSchematicsMain />
      <ExploreSchematicsSearch />
      <ExploreSchematicsSchematics />
    </div>
  );
}

export default SchematicsPage;
