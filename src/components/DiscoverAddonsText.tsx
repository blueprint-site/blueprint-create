import { useTranslation } from "react-i18next";
import "../styles/discoveraddonstext.scss"

function DiscoverAddonsText() {
    const { t } = useTranslation();
    return (
        <>
            <h1 className="text">{t('home.discover')}</h1>
        </>)
}
export default DiscoverAddonsText;
