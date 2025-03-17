import { Monitor, TabletSmartphone } from 'lucide-react';

export type ClientDisplayProps = {
  clientName: string;
};
export const ClientDisplay = ({ clientName }: ClientDisplayProps) => {
  const MobileClientType = ['Mobile Safari'];
  const DesktopClientType = ['Chrome'];

  if (!clientName) {
    return null;
  }
  if (MobileClientType.includes(clientName)) {
    return (
      <div className={'flex gap-1'}>
        <TabletSmartphone size={20}></TabletSmartphone> {clientName}
      </div>
    );
  }
  if (DesktopClientType.includes(clientName)) {
    return (
      <div className={'flex gap-1'}>
        <Monitor size={20}></Monitor> {clientName}
      </div>
    );
  }
};

export default ClientDisplay;
