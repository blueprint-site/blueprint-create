import WrenchIcon from '../assets/wrench.webp';
import '../styles/awardsbanner.scss';

const AwardsBanner = () => {
    return (
        <>
            <div className="twa-banner">
                <img src={WrenchIcon} alt="" /><h2 className="twa-banner-text">The Wrench Awards - <a href="/awards.html">Vote now!</a></h2>
            </div>
        </>
    )
}

export default AwardsBanner;