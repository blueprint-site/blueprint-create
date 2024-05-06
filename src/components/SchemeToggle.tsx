interface SchemeToggleProperties {
    onClick: () => void
}

import '../styles/schemetoggle.scss';

const SchemeToggle = ({ onClick }: SchemeToggleProperties) => {
    return (
        <>
            <div id="dark-mode-toggle" onClick={onClick}><span>Change theme</span></div>
        </>
    )
}

export default SchemeToggle;