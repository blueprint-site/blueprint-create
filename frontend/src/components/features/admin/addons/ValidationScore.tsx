import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Clock,
  User,
} from 'lucide-react';
import type { AddonValidationScore, ValidationResult } from '@/utils/validation/addonValidator';
import { addonValidator } from '@/utils/validation/addonValidator';
import { cn } from '@/config/utils.ts';

interface ValidationScoreProps {
  score: AddonValidationScore;
  onApprove?: () => void;
  onReject?: () => void;
  onRequestReview?: () => void;
  showActions?: boolean;
}

export function ValidationScore({
  score,
  onApprove,
  onReject,
  onRequestReview,
  showActions = true,
}: ValidationScoreProps) {
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const summary = addonValidator.getValidationSummary(score);

  const getResultIcon = (result: ValidationResult) => {
    if (result.passed && result.score === result.score) {
      return <CheckCircle2 className='h-4 w-4 text-green-500' />;
    } else if (result.passed) {
      return <AlertCircle className='h-4 w-4 text-yellow-500' />;
    }
    return <XCircle className='h-4 w-4 text-red-500' />;
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='text-2xl'>{summary.icon}</div>
            <div>
              <CardTitle className='text-lg'>Validation Score</CardTitle>
              <CardDescription>{summary.label}</CardDescription>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Badge
              variant='outline'
              className={cn('px-3 py-1 font-mono text-lg', getConfidenceColor(score.confidence))}
            >
              {score.percentage}%
            </Badge>
            {score.autoApprovalReady && (
              <Badge variant='default' className='bg-green-600'>
                <Sparkles className='mr-1 h-3 w-3' />
                Auto-Ready
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Overall Score</span>
            <span className='font-medium'>
              {score.totalScore} / {score.maxScore}
            </span>
          </div>
          <Progress value={score.percentage} className='h-2' />
        </div>

        <Alert
          className={cn(
            'border-l-4',
            score.confidence === 'high'
              ? 'border-l-green-500'
              : score.confidence === 'medium'
                ? 'border-l-yellow-500'
                : 'border-l-red-500'
          )}
        >
          <ShieldCheck className='h-4 w-4' />
          <AlertTitle>Recommendation</AlertTitle>
          <AlertDescription>{summary.recommendation}</AlertDescription>
        </Alert>

        {score.suggestions.length > 0 && (
          <div className='space-y-2'>
            <h4 className='text-muted-foreground text-sm font-medium'>Suggestions</h4>
            <ul className='space-y-1'>
              {score.suggestions.map((suggestion, index) => (
                <li key={index} className='flex items-start gap-2 text-sm'>
                  <AlertCircle className='mt-0.5 h-3 w-3 text-yellow-500' />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant='ghost' size='sm' className='w-full'>
              {detailsOpen ? (
                <>
                  <ChevronUp className='mr-2 h-4 w-4' />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className='mr-2 h-4 w-4' />
                  Show Details
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='space-y-3 pt-3'>
            {Object.entries(score.results).map(([key, result]) => (
              <div key={key} className='bg-muted/30 space-y-2 rounded-lg p-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    {getResultIcon(result)}
                    <span className='text-sm font-medium capitalize'>{key.replace(/_/g, ' ')}</span>
                  </div>
                  <Badge variant='secondary' className='text-xs'>
                    {result.score} pts
                  </Badge>
                </div>
                <p className='text-muted-foreground text-xs'>{result.message}</p>
                {result.details && result.details.length > 0 && (
                  <ul className='ml-6 space-y-0.5 text-xs'>
                    {result.details.map((detail, idx) => (
                      <li key={idx} className='text-muted-foreground'>
                        • {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {showActions && (
          <div className='flex gap-2 pt-2'>
            {score.confidence === 'high' && (
              <>
                <Button onClick={onApprove} className='flex-1 bg-green-600 hover:bg-green-700'>
                  <CheckCircle2 className='mr-2 h-4 w-4' />
                  Auto-Approve
                </Button>
                <Button onClick={onRequestReview} variant='outline' className='flex-1'>
                  <User className='mr-2 h-4 w-4' />
                  Manual Review
                </Button>
              </>
            )}
            {score.confidence === 'medium' && (
              <>
                <Button
                  onClick={onApprove}
                  variant='outline'
                  className='flex-1 border-green-500 text-green-600 hover:bg-green-50'
                >
                  <CheckCircle2 className='mr-2 h-4 w-4' />
                  Approve
                </Button>
                <Button onClick={onRequestReview} variant='outline' className='flex-1'>
                  <Clock className='mr-2 h-4 w-4' />
                  Review Later
                </Button>
                <Button
                  onClick={onReject}
                  variant='outline'
                  className='flex-1 border-red-500 text-red-600 hover:bg-red-50'
                >
                  <XCircle className='mr-2 h-4 w-4' />
                  Reject
                </Button>
              </>
            )}
            {score.confidence === 'low' && (
              <>
                <Button onClick={onRequestReview} variant='outline' className='flex-1'>
                  <User className='mr-2 h-4 w-4' />
                  Request Review
                </Button>
                <Button
                  onClick={onReject}
                  variant='outline'
                  className='flex-1 border-red-500 text-red-600 hover:bg-red-50'
                >
                  <XCircle className='mr-2 h-4 w-4' />
                  Reject
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
