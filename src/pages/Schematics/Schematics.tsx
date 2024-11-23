import ExploreSchematicsMain from "../../components/ExploreSchematicsTitle";
import ExploreSchematicsSearch from "../../components/ExploreSchematicsSearch";
import SchematicsList from "../../components/SchematicsList";

function SchematicsPage() {
  return (
    <div>
      <ExploreSchematicsMain />
      <ExploreSchematicsSearch />
      <SchematicsList />
    </div>
  );
}

export default SchematicsPage;
