import LoadingGif from '../assets/loading.gif';

import '../styles/loading.scss';

function Loading() {
    return (
        <>
            <div className="loading">
                <h1>Blueprint</h1>
                <img src={LoadingGif} alt="Loading" />
            </div>
        </>
    );
}

export default Loading;