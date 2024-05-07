import LoadingGif from '../assets/loading.gif';

import '../styles/loading.scss';

function LoadingOverlay() {
    return (
        <>
            <div className="loading">
                <h1>Blueprint</h1>
                <img src={LoadingGif} alt="Loading" />
            </div>
        </>
    );
}

export default LoadingOverlay;