import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { fetchModrinthModDependencies } from "@/utils/getExternalAddon";
import { Download, FileCog, History, Users, Database } from 'lucide-react';
interface ExpandedAddonCompatibilityAndVersionsProps {
  versions: string[];
  authors?: string[];
  modloaders: string[];
  lastUpdated?: string;
  modrinthId?: string;
  curseforgeId?: string;
  downloads?: number;
}

export const ExpandedAddonCompatibilityAndVersions = ({
  versions = [],
  authors = [],
  modloaders = [],
  lastUpdated = undefined,
  modrinthId = undefined,
  curseforgeId = undefined,
  downloads = 0,
}: ExpandedAddonCompatibilityAndVersionsProps) => {
  // const dependency_data = fetchModrinthModDependencies('create')
  // console.log(dependency_data)

  return (
    <div className='w-80 space-y-4 text-white'>
      <Card>
        <CardHeader>
          <CardTitle className='font-minecraft text-xl'>
            <History />
            Versions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            {versions.map((version) => (
              <Badge variant='secondary' key={version}>
                {version}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='font-minecraft text-xl'>
            <FileCog />
            Modloaders
          </CardTitle>
        </CardHeader>
        <CardContent className='flex gap-2'>
          {modloaders && modloaders.length > 0 ? (
            modloaders.map((loader) => (
              <Badge variant='secondary' key={loader}>
                {loader}
              </Badge>
            ))
          ) : (
            <span>No modloaders available.</span>
          )}
        </CardContent>
      </Card>
      {/*<Card>
        <CardHeader>
          <CardTitle className='font-minecraft text-xl'>Compatibility</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm'>No compatibility information available.</p>
        </CardContent>
      </Card>*/}
      <Card>
        <CardHeader>
          <CardTitle className='font-minecraft text-xl'>
            <Download />
            Downloads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm'>{downloads.toLocaleString()} downloads</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='font-minecraft text-xl'>
            <Users />
            Authors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            {authors.map((author) => (
              <Badge variant='secondary' key={author}>
                {author}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='font-minecraft text-xl'>
            <Database />
            Sources data
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col font-minecraft'>
          {modrinthId && <span>Modrinth ID: {modrinthId}</span>}
          {curseforgeId && <span>CurseForge ID: {curseforgeId}</span>}
        </CardContent>
      </Card>
      <Card>
        <CardContent className='opacity-80'>
          Last updated on:{' '}
          {lastUpdated && <span>{new Date(lastUpdated).toLocaleDateString()}</span>}
        </CardContent>
      </Card>
    </div>
  );
};
