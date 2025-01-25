import "@/styles/discoveraddonstext.scss";
import { useTranslation } from "react-i18next";

function DiscoverAddonsText() {
    const { t } = useTranslation();
    return (
        <>
            <h1 className="text">{t('home.discover')}</h1>
        </>)
}
export default DiscoverAddonsText;
