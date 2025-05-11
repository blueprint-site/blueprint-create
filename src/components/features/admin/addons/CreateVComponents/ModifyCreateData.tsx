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

import {
  CREATE_VERSIONS as initialCreateVersions,
  MINECRAFT_TO_CREATE_VERSIONS as initialMinecraftToCreateVersions,
  CREATE_MOD_IDS as initialCreateModIds,
} from '@/data/createVersions';

interface CreateVersions {
  [key: string]: CreateVersion;
}

type CreateVersion = {
  value: string;
  label: string;
  sortOrder: number;
};

interface MinecraftToCreateVersions {
  [mcVersion: string]: string[];
}

interface CreateModIds {
  FORGE: string;
  FABRIC: string;
  FLYWHEEL: string;
}

export default function ModifyCreateData() {
  const [createVersions, setCreateVersions] = useState<CreateVersions>(initialCreateVersions);
  const [minecraftToCreateVersions, setMinecraftToCreateVersions] =
    useState<MinecraftToCreateVersions>(initialMinecraftToCreateVersions);
  const [createModIds, setCreateModIds] = useState<CreateModIds>(initialCreateModIds);

  const [unsavedCreateVersions, setUnsavedCreateVersions] =
    useState<CreateVersions>(createVersions);
  const [unsavedMinecraftToCreateVersions, setUnsavedMinecraftToCreateVersions] =
    useState<MinecraftToCreateVersions>(minecraftToCreateVersions);
  const [unsavedCreateModIds, setUnsavedCreateModIds] = useState<CreateModIds>(createModIds);

  const saveChanges = () => {
    const updatedCreateVersions = { ...initialCreateVersions };
    Object.keys(unsavedCreateVersions).forEach((key) => {
      updatedCreateVersions[key] = unsavedCreateVersions[key];
    });
    setCreateVersions(updatedCreateVersions);
    console.log('Saved changes:', updatedCreateVersions);
  };

  return (
    <div className='space-y-8 p-4'>
      <h1 className='bg-red-500'>
        WARNING! THIS IS A VERY EXPERIMENTAL FEATURE THAT WAS MADE IN A HURRY PLEASE BE CAUTIOUS
        WHEN USING
      </h1>
      <span>Lmao it doesnt even work, more like a viewer</span>
      <div>
        <h2 className='text-lg font-semibold'>Create Versions</h2>
        <Table>
          <TableHeader></TableHeader>
          <TableBody>
            {Object.entries(unsavedCreateVersions).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>
                  <h3 className='text-lg font-semibold'>Value</h3>
                  <Input
                    value={value.value}
                    onChange={(e) => {
                      const updatedValue = e.target.value;
                      setUnsavedCreateVersions({
                        ...unsavedCreateVersions,
                        [key]: {
                          value: updatedValue,
                          label: value.label,
                          sortOrder: value.sortOrder,
                        },
                      });
                    }}
                  />
                </TableCell>
                <TableCell>
                  <h3 className='text-lg font-semibold'>Label</h3>
                  <Input
                    value={value.label}
                    onChange={(e) => {
                      const updatedLabel = e.target.value;
                      setUnsavedCreateVersions({
                        ...unsavedCreateVersions,
                        [key]: {
                          value: value.value,
                          label: updatedLabel,
                          sortOrder: value.sortOrder,
                        },
                      });
                    }}
                  />
                </TableCell>
                <TableCell>
                  <h3 className='text-lg font-semibold'>Sort Order</h3>
                  <Input
                    type='number'
                    value={value.sortOrder}
                    onChange={(e) => {
                      const updatedSortOrder = parseInt(e.target.value, 10);
                      setUnsavedCreateVersions({
                        ...unsavedCreateVersions,
                        [key]: {
                          value: value.value,
                          label: value.label,
                          sortOrder: updatedSortOrder,
                        },
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          onClick={() =>
            setUnsavedCreateVersions({
              ...unsavedCreateVersions,
              [`new_version_${Object.keys(unsavedCreateVersions).length}`]: {
                value: '',
                label: '',
                sortOrder: 0,
              },
            })
          }
        >
          Add New Version
        </Button>
      </div>

      <div>
        <h2 className='text-lg font-semibold'>Minecraft to Create Versions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Minecraft Version</TableCell>
              <TableCell>Create Versions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(unsavedMinecraftToCreateVersions).map(([mcVersion, versions]) => (
              <TableRow key={mcVersion}>
                <TableCell>
                  <Input
                    value={mcVersion}
                    onChange={(e) => {
                      const newMcVersion = e.target.value;
                      const { [mcVersion]: oldVersions, ...rest } =
                        unsavedMinecraftToCreateVersions;
                      setUnsavedMinecraftToCreateVersions({
                        ...rest,
                        [newMcVersion]: oldVersions,
                      });
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={Array.isArray(versions) ? versions.join(', ') : ''}
                    onChange={(e) => {
                      const updatedVersions = e.target.value.split(', ').filter(Boolean);
                      setUnsavedMinecraftToCreateVersions({
                        ...unsavedMinecraftToCreateVersions,
                        [mcVersion]: updatedVersions,
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          onClick={() =>
            setUnsavedMinecraftToCreateVersions({
              ...unsavedMinecraftToCreateVersions,
              new_mc_version: [],
            })
          }
        >
          Add New Minecraft Version
        </Button>
      </div>

      <div>
        <h2 className='text-lg font-semibold'>Create Mod IDs</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>ID</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(unsavedCreateModIds).map(([type, id]) => (
              <TableRow key={type}>
                <TableCell>{type}</TableCell>
                <TableCell>
                  <Input
                    value={id}
                    onChange={(e) =>
                      setUnsavedCreateModIds({
                        ...unsavedCreateModIds,
                        [type]: e.target.value,
                      })
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button onClick={saveChanges} className='mt-4'>
        Save Data
      </Button>
    </div>
  );
}
