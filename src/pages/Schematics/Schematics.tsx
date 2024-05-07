import { Schematic3DViewer } from "../../components/Schematic3DViewer/Schematic3DViewer";
import styles from "./Schematics.module.scss";

function SchematicsPage() {
  return (
    <div className={styles.container}>
      <Schematic3DViewer />
    </div>
  );
}

export default SchematicsPage;
