import { DiscordLoginButton } from 'react-social-login-buttons';

import '../../styles/login.scss';
import { useTranslation } from 'react-i18next';

function Login() {
    const { t } = useTranslation();

    return (
        <>
            <div className="login-container">
                <h1>{t("login.header")}</h1>
                <hr />
                <DiscordLoginButton>{t("login.button.discord")}</DiscordLoginButton>
            </div>
        </>
    )
}

export default Login;