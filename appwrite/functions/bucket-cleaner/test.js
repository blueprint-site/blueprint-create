const handler = require('./index.js');

const mockContext = {
  req: {
    body: JSON.stringify({
      bucketIds: null, // null to process all default buckets
      dryRun: true, // Set to false to actually delete files
      batchSize: 50, // Process 50 files at a time
    }),
    headers: {},
  },
  res: {
    json: (data, status = 200) => {
      console.log('Response Status:', status);
      console.log('Response Data:', JSON.stringify(data, null, 2));

      if (data.success && data.results) {
        console.log('\n=== Cleanup Summary ===');
        console.log(`Dry Run: ${data.dryRun}`);
        console.log(`Total Files Checked: ${data.results.totalFilesChecked}`);
        console.log(`Total Orphaned Files: ${data.results.totalOrphaned}`);
        console.log(`Total Files Deleted: ${data.results.totalDeleted}`);

        console.log('\n=== Per-Bucket Results ===');
        for (const [bucketId, bucketData] of Object.entries(data.results.buckets)) {
          console.log(`\nBucket: ${bucketId}`);
          console.log(`  Files Checked: ${bucketData.filesChecked}`);
          console.log(`  Orphaned Files: ${bucketData.orphaned.length}`);
          if (bucketData.orphaned.length > 0 && bucketData.orphaned.length <= 10) {
            bucketData.orphaned.forEach((file) => {
              console.log(`    - ${file.name} (${file.size} bytes, created: ${file.created})`);
            });
          } else if (bucketData.orphaned.length > 10) {
            console.log(`    (Showing first 10 of ${bucketData.orphaned.length} files)`);
            bucketData.orphaned.slice(0, 10).forEach((file) => {
              console.log(`    - ${file.name} (${file.size} bytes)`);
            });
          }
          if (bucketData.errors.length > 0) {
            console.log(`  Errors: ${bucketData.errors.length}`);
          }
        }
      }
    },
  },
  log: (...args) => console.log('[LOG]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
};

// Set environment variables (replace with your actual values)
process.env.APPWRITE_FUNCTION_API_ENDPOINT =
  process.env.APPWRITE_FUNCTION_API_ENDPOINT || 'https://api.blueprint-create.com/v1';
process.env.APPWRITE_FUNCTION_PROJECT_ID =
  process.env.APPWRITE_FUNCTION_PROJECT_ID || 'your-project-id';
process.env.APPWRITE_FUNCTION_API_KEY = process.env.APPWRITE_FUNCTION_API_KEY || 'your-api-key';

if (
  !process.env.APPWRITE_FUNCTION_API_KEY ||
  process.env.APPWRITE_FUNCTION_API_KEY === 'your-api-key'
) {
  console.error('Please set environment variables:');
  console.error('  APPWRITE_FUNCTION_API_ENDPOINT');
  console.error('  APPWRITE_FUNCTION_PROJECT_ID');
  console.error('  APPWRITE_FUNCTION_API_KEY');
  process.exit(1);
}

// Run the function
console.log('Starting bucket cleanup test...\n');
handler(mockContext).catch((err) => {
  console.error('Function execution failed:', err);
});
