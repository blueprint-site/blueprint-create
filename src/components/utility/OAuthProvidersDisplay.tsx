export type OAuthProvidersDisplayProps = {
  provider: string;
  size: number;
};

const OAuthProvidersDisplay = ({ provider = '', size = 32 }: OAuthProvidersDisplayProps) => {
  if (!provider) {
    return null;
  }
  if (provider === 'email') {
    return <img height={size} width={size} src={`https://cdn.simpleicons.org/Gmail`} alt='email' />;
  }
  if (provider != '') {
    return (
      <img
        height={size}
        width={size}
        src={`https://cdn.simpleicons.org/${provider}`}
        alt={provider}
      />
    );
  }
};

export default OAuthProvidersDisplay;
