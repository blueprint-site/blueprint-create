import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

import WrenchIcon from '@/assets/wrench.webp';
import LazyImage from '@/components/utility/LazyImage';
import '@/styles/awardsbanner.scss';


const AwardsBanner = () => {
    const { t } = useTranslation();

    return (
        <>
            <div className="twa-banner">
                <LazyImage src={WrenchIcon} alt="" /><h2 className="twa-banner-text">{t("awards.banner.label")} - <Link to="/awards">{t("awards.banner.link")}</Link></h2>
            </div>
        </>
    )
}

export default AwardsBanner;