export type OAuthProvidersDisplayProps = {
  provider: string;
  size: number;
};

export const OAuthProvidersDisplay = ({ provider = '', size = 32 }: OAuthProvidersDisplayProps) => {
  if (!provider) {
    return null;
  }
  if (provider === 'email') {
    return <img height={size} width={size} src={`https://cdn.simpleicons.org/Gmail`} />;
  }
  if (provider != '') {
    return <img height={size} width={size} src={`https://cdn.simpleicons.org/${provider}`} />;
  }
};

export default OAuthProvidersDisplay;
