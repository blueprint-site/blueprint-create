import { useTranslation } from "react-i18next";
import ExploreSchematicsTitle from "../../components/ExploreSchematicsTitle";
import ExploreSchematicsSearch from "../../components/ExploreSchematicsSearch";

function SchematicsPage() {
  return (
    <div>
      <ExploreSchematicsTitle />
      <ExploreSchematicsSearch />
    </div>
  );
}

export default SchematicsPage;
