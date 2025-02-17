import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const exchangeCodeForToken = async () => {
            const code = searchParams.get('code');
            const redirectUri = 'http://localhost:5173/auth/callback'; // URL de redirection
            const clientId = 'TON_CLIENT_ID'; // Remplace par ton client_id Supabase
            const codeVerifier = localStorage.getItem('code_verifier'); // Doit être stocké lors de l'auth initiale

            if (code && codeVerifier) {
                try {
                    const response = await fetch('http://localhost:8000/auth/v1/token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: new URLSearchParams({
                            grant_type: 'authorization_code',
                            code: code,
                            client_id: clientId,
                            redirect_uri: redirectUri,
                            code_verifier: codeVerifier
                        })
                    });

                    const data = await response.json();

                    if (data.access_token) {
                        // Stocke le token et redirige l'utilisateur
                        localStorage.setItem('access_token', data.access_token);
                        navigate('/', { replace: true });
                    } else {
                        console.error('Erreur lors de l\'échange du code:', data);
                        navigate('/auth/auth-code-error', { replace: true });
                    }
                } catch (error) {
                    console.error('Erreur lors de la requête:', error);
                }
            } else {
                navigate('/auth/auth-code-error', { replace: true });
            }
        };

        exchangeCodeForToken();
    }, [searchParams, navigate]);

    return null;
};

export default AuthCallback;
