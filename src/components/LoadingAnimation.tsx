import LoadingGif from '../assets/loading.gif';

import '@/styles/loading.scss';

function LoadingAnimation() {
    return (
        <>
            <div className="loader">
                <img src={LoadingGif} alt="Loading" />
            </div>
        </>
    );
}

export default LoadingAnimation;