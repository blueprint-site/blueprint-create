import React from 'react';
import SchematicCard from './SchematicCard';
import { Download, Ruler, Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Schematic } from '@/types';
import type { SchematicSearchResult } from '@/types/schematicSearch';
import { normalizeSchematicSearchResult } from '@/types/schematicSearch';

interface SchematicCardAdapterProps {
  schematic: Schematic | SchematicSearchResult;
  onClick: () => void;
}

/**
 * Adapter component that can handle both old Appwrite format and new Meilisearch format
 */
export const SchematicCardAdapter: React.FC<SchematicCardAdapterProps> = ({
  schematic,
  onClick,
}) => {
  // Check if it's from Meilisearch (has flat structure fields)
  const isMeilisearchFormat = 'dimensions_width' in schematic || 'complexity_level' in schematic;

  // If it's the traditional Appwrite format, use the existing SchematicCard
  if (!isMeilisearchFormat && '$id' in schematic) {
    return <SchematicCard schematic={schematic as Schematic} onClick={onClick} />;
  }

  // For Meilisearch format, normalize and adapt the data
  const adaptedSchematic = normalizeSchematicSearchResult(schematic as SchematicSearchResult);

  // Get the first image URL if available
  const thumbnailUrl = adaptedSchematic.image_urls?.[0] || adaptedSchematic.thumbnail;

  // Get author name (already normalized)
  const authorName = adaptedSchematic.author || 'Unknown';

  // Use the normalized nested structures
  const dimensions = adaptedSchematic.dimensions;
  const complexity = adaptedSchematic.complexity;
  const requirements = adaptedSchematic.requirements;

  const complexityColors = {
    simple: 'text-green-600',
    moderate: 'text-yellow-600',
    complex: 'text-orange-600',
    extreme: 'text-red-600',
  };

  const complexityIcons = {
    simple: '🟢',
    moderate: '🟡',
    complex: '🟠',
    extreme: '🔴',
  };

  return (
    <Card
      className='group bg-card/95 relative flex h-full cursor-pointer flex-col overflow-hidden backdrop-blur transition-all hover:shadow-lg'
      onClick={onClick}
    >
      {/* Thumbnail with overlay info - fixed height */}
      <div className='bg-muted relative aspect-video shrink-0 overflow-hidden'>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={adaptedSchematic.title}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
          />
        ) : (
          <div className='from-muted to-muted-foreground/10 flex h-full items-center justify-center bg-gradient-to-br'>
            <Ruler className='text-muted-foreground/30 h-12 w-12' />
          </div>
        )}

        {/* Overlay gradient for text readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

        {/* Title and author overlay */}
        <div className='absolute right-0 bottom-0 left-0 p-3'>
          <h3 className='line-clamp-1 text-lg font-semibold text-white drop-shadow-md'>
            {adaptedSchematic.title}
          </h3>
          <p className='text-sm text-white/80 drop-shadow-md'>by {authorName}</p>
        </div>

        {/* Top badges */}
        <div className='absolute top-2 right-2 left-2 flex items-start justify-between'>
          {/* Category badge */}
          {adaptedSchematic.categories?.[0] && (
            <Badge className='bg-primary/90 text-primary-foreground backdrop-blur'>
              {adaptedSchematic.categories[0]}
            </Badge>
          )}

          {/* Featured badge */}
          {adaptedSchematic.featured && (
            <Badge variant='default' className='gap-1 bg-yellow-500/90 backdrop-blur'>
              <Star className='h-3 w-3' />
              Featured
            </Badge>
          )}
        </div>
      </div>

      {/* Content section - flexible height */}
      <CardContent className='flex flex-1 flex-col space-y-2 p-3'>
        {/* Description - fixed 2 lines height */}
        <p className='text-muted-foreground line-clamp-2 h-8 text-xs'>
          {adaptedSchematic.description || 'No description available'}
        </p>

        {/* Info section - grows to fill space */}
        <div className='flex flex-1 flex-col justify-start space-y-2'>
          {/* Dimensions and block count in one row */}
          <div className='flex h-6 items-center gap-2 text-xs'>
            {dimensions && dimensions.width ? (
              <>
                <Ruler className='text-muted-foreground h-3 w-3 shrink-0' />
                <Badge variant='secondary' className='font-mono'>
                  {dimensions.width}×{dimensions.height}×{dimensions.depth}
                </Badge>
                {dimensions.blockCount > 0 && (
                  <Badge variant='secondary'>{dimensions.blockCount.toLocaleString()} blocks</Badge>
                )}
              </>
            ) : (
              <div className='h-full' /> // Spacer to maintain height
            )}
          </div>

          {/* Complexity and time in one row */}
          <div className='flex h-6 items-center gap-2'>
            {complexity ? (
              <>
                <Badge
                  variant='outline'
                  className={`text-xs font-medium ${complexityColors[complexity.level as keyof typeof complexityColors]}`}
                >
                  {complexityIcons[complexity.level as keyof typeof complexityIcons]}{' '}
                  {complexity.level}
                </Badge>
                {complexity.buildTime > 0 && (
                  <span className='text-muted-foreground flex items-center gap-1 text-xs'>
                    <Clock className='h-3 w-3' />~{complexity.buildTime} min
                  </span>
                )}
              </>
            ) : (
              <div className='h-full' /> // Spacer to maintain height
            )}
          </div>

          {/* Requirements - fixed height */}
          <div className='flex min-h-[1.5rem] items-center gap-2 text-xs'>
            {requirements?.mods && requirements.mods.length > 0 ? (
              <>
                <span className='text-muted-foreground shrink-0'>Requires:</span>
                <div className='flex flex-1 flex-wrap gap-1'>
                  {requirements.mods.map((mod) => (
                    <Badge key={mod} variant='outline' className='px-1.5 py-0 text-xs'>
                      {mod}
                    </Badge>
                  ))}
                </div>
              </>
            ) : (
              <div className='h-full' /> // Spacer to maintain height
            )}
            {requirements?.hasRedstone && (
              <Badge variant='destructive' className='ml-auto gap-1 px-1.5 py-0 text-xs'>
                <span className='text-[10px]'>⚡</span> Redstone
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      {/* Footer with stats - fixed height */}
      <div className='bg-muted/30 mt-auto shrink-0 border-t px-3 py-2'>
        <div className='flex h-4 items-center justify-between text-xs'>
          <div className='text-muted-foreground flex items-center gap-3'>
            {adaptedSchematic.downloads !== undefined && (
              <span className='flex items-center gap-1'>
                <Download className='h-3 w-3' />
                <span className='font-medium'>{adaptedSchematic.downloads.toLocaleString()}</span>
              </span>
            )}
            {adaptedSchematic.rating !== undefined && adaptedSchematic.rating > 0 && (
              <span className='flex items-center gap-1'>
                <Star className='h-3 w-3 text-yellow-500' />
                <span className='font-medium'>{adaptedSchematic.rating.toFixed(1)}</span>
              </span>
            )}
          </div>

          {/* Upload date or other info */}
          {adaptedSchematic.uploadDate && (
            <span className='text-muted-foreground text-xs'>
              {new Date(adaptedSchematic.uploadDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
