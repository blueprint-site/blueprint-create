import LoadingCheckmark from '@/assets/loading_checkmark.png';

import '@/styles/loading.scss';

function LoadingOverlay() {
    return (
        <>
            <div className="loading">
                <h1>Blueprint</h1>
                <img src={LoadingCheckmark} alt="Loading" />
            </div>
        </>
    );
}

export default LoadingOverlay;