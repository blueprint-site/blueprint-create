import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VersionEntry {
  id: string;
  version: string;
}

export default function ModifyVersions() {
  const [versions, setVersions] = useState<VersionEntry[]>([{ id: 'mXfmc8qO', version: '6.0' }]);
  const [newId, setNewId] = useState('');
  const [newVersion, setNewVersion] = useState('');

  const addVersion = () => {
    if (newId && newVersion) {
      setVersions([...versions, { id: newId, version: newVersion }]);
      setNewId('');
      setNewVersion('');
    }
  };

  const updateVersion = (index: number, updatedVersion: string) => {
    const updatedVersions = [...versions];
    updatedVersions[index].version = updatedVersion;
    setVersions(updatedVersions);
  };

  const deleteVersion = (index: number) => {
    const updatedVersions = versions.filter((_, i) => i !== index);
    setVersions(updatedVersions);
  };

  return (
    <div className='p-4'>
      <h1 className='mb-4 text-xl font-bold'>Modify Create Mod Versions</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {versions.map((entry, index) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.id}</TableCell>
              <TableCell>
                <Input
                  value={entry.version}
                  onChange={(e) => updateVersion(index, e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Button variant='destructive' onClick={() => deleteVersion(index)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>
              <Input
                placeholder='New ID'
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Input
                placeholder='New Version'
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Button onClick={addVersion}>Add</Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
