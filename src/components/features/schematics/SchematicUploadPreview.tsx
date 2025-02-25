import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ModLoaderDisplay from '@/components/common/ModLoaderDisplay';
import MarkdownDisplay from '@/components/utility/MarkdownDisplay';
import { User } from '@/types';

interface SchematicPreviewProps {
  title: string;
  description: string;
  imagePreviewUrl: string | null;
  gameVersions: string[];
  createVersions: string[];
  modloaders: string[];
  user: User | null;
}

export function SchematicPreview({
  title,
  description,
  imagePreviewUrl,
  gameVersions,
  createVersions,
  modloaders,
  user,
}: SchematicPreviewProps) {
  return (
    <Card className="sticky top-20">
      <CardHeader className="border-b">
        <CardTitle className="flex items-start justify-between">Preview</CardTitle>
        <CardDescription className="text-foreground-muted">
          This is how your schematic will appear to others
        </CardDescription>
      </CardHeader>
      <CardHeader className="text-center">
        <CardTitle>
          <h1 className="text-2xl font-bold md:text-3xl">
            {title || 'Schematic Title'}
          </h1>
        </CardTitle>
        <CardDescription className="text-foreground-muted">
          By {user?.name || 'Anonymous'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-start gap-8 md:flex-row">
          <div className="w-full md:w-full">
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="Schematic Preview"
                className="h-auto w-full rounded-lg object-cover shadow-md"
              />
            ) : (
              <div className="bg-surface-2 flex h-48 w-full items-center justify-center rounded-lg">
                <p className="text-foreground-muted">Image preview will appear here</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold">Description:</h2>
          <div className="prose text-foreground-muted whitespace-pre-wrap">
            {description ? (
              <MarkdownDisplay content={description} />
            ) : (
              <p className="text-foreground-muted">Schematic description will appear here</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Create Versions</h3>
              <div className="flex flex-wrap gap-2">
                {createVersions && createVersions.length > 0 ? (
                  createVersions.map((version) => (
                    <Badge key={version} variant="createVersion">
                      {version}
                    </Badge>
                  ))
                ) : (
                  <p className="text-foreground-muted text-sm">No versions selected</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Minecraft Versions</h3>
              <div className="flex flex-wrap gap-2">
                {gameVersions && gameVersions.length > 0 ? (
                  gameVersions.map((version) => (
                    <Badge key={version} variant="mcVersion">
                      {version}
                    </Badge>
                  ))
                ) : (
                  <p className="text-foreground-muted text-sm">No versions selected</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Modloaders</h3>
              {modloaders && modloaders.length > 0 ? (
                <ModLoaderDisplay loaders={modloaders} />
              ) : (
                <p className="text-foreground-muted text-sm">No modloaders selected</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
