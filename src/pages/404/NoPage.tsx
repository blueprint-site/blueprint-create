import { Link } from "react-router-dom";
import styles from "./NoPage.module.scss";

function NoPage() {
  return (
    <div className={styles.noPageContainer}>
      <h1>
        Whoops! This page is unavailable or it doesn't exist!
        <br /> Check the url for errors or contact: <br />
        <a href="mailto:blueprint-site@proton.me">blueprint-site@proton.me</a>
      </h1>
      <Link to="/">
        Go back to homepage
      </Link>
    </div>
  );
}

export default NoPage;
