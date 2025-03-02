import {
    FacebookIcon,
    FacebookShareButton,
    TwitterShareButton,
    RedditIcon,
    RedditShareButton,
    XIcon, BlueskyShareButton, BlueskyIcon, ThreadsShareButton, ThreadsIcon, WhatsappShareButton, WhatsappIcon,

} from "react-share";
import { useLocation } from "react-router-dom";


export interface SocialAddonSharingProps {
    addonName: string;
}

export const SocialAddonSharing = ({addonName}: SocialAddonSharingProps) => {
    const location = useLocation();
    const currentUrl = window.location.origin + location.pathname; // Construct the full URL

    return (
        <>
            <h3>Share on socials</h3>
            <div className={"flex flex-row items-center gap-4 row-4"}>
                <RedditShareButton url={currentUrl} windowWidth={640} windowHeight={420} title={addonName} >
                    <RedditIcon className={'rounded-full'} size={32}/>
                </RedditShareButton>
                <BlueskyShareButton url={currentUrl} windowWidth={640} windowHeight={420}>
                    <BlueskyIcon className={'rounded-full'} size={32}/>
                </BlueskyShareButton>
                <WhatsappShareButton url={currentUrl} windowWidth={640} windowHeight={420}>
                    <WhatsappIcon className={'rounded-full'} size={32}></WhatsappIcon>
                </WhatsappShareButton>
                <FacebookShareButton url={currentUrl} windowWidth={640} windowHeight={420}>
                    <FacebookIcon className={'rounded-full'} size={32}/>
                </FacebookShareButton>
                <TwitterShareButton url={currentUrl} windowWidth={640} windowHeight={420}>
                    <XIcon className={'rounded-full'} size={32}/>
                </TwitterShareButton>
                <ThreadsShareButton url={currentUrl} windowWidth={640} windowHeight={420}>
                    <ThreadsIcon className={'rounded-full'} size={32}/>
                </ThreadsShareButton>
            </div>

        </>

    );
};

export default SocialAddonSharing;
