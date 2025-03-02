import {
    FacebookIcon,
    FacebookShareButton,
    TwitterShareButton,
    RedditIcon,
    RedditShareButton,
    XIcon, BlueskyShareButton, BlueskyIcon, ThreadsShareButton, ThreadsIcon, WhatsappShareButton, WhatsappIcon,

} from "react-share";
import { useLocation } from "react-router-dom";


export interface SocialSharingProps {
    title: string;
    details?: boolean;
    size?: number;
}

export const SocialSharing = ({title, details= true, size= 32,}: SocialSharingProps) => {
    const location = useLocation();
    const currentUrl = window.location.origin + location.pathname; // Construct the full URL

    return (
        <>
            {details ? <h3>Share on socials</h3> : null }
            <div className={"flex flex-row items-center gap-4 row-4"}>
                <RedditShareButton url={currentUrl} windowWidth={640} windowHeight={420} title={title} >
                    <RedditIcon className={'rounded-full'} size={size}/>
                </RedditShareButton>
                <BlueskyShareButton url={currentUrl} windowWidth={640} windowHeight={420}>
                    <BlueskyIcon className={'rounded-full'} size={size}/>
                </BlueskyShareButton>
                <WhatsappShareButton url={currentUrl} windowWidth={640} windowHeight={420}>
                    <WhatsappIcon className={'rounded-full'} size={size}></WhatsappIcon>
                </WhatsappShareButton>
                <FacebookShareButton url={currentUrl} windowWidth={640} windowHeight={420}>
                    <FacebookIcon className={'rounded-full'} size={size}/>
                </FacebookShareButton>
                <TwitterShareButton url={currentUrl} windowWidth={640} windowHeight={420}>
                    <XIcon className={'rounded-full'} size={size}/>
                </TwitterShareButton>
                <ThreadsShareButton url={currentUrl} windowWidth={640} windowHeight={420}>
                    <ThreadsIcon className={'rounded-full'} size={size}/>
                </ThreadsShareButton>
            </div>

        </>

    );
};

export default SocialSharing;
