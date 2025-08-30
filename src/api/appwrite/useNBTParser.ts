import { functions } from '@/config/appwrite';
import { ExecutionMethod } from 'appwrite';
import type { SchematicMetadata } from '@/utils/nbtParser';

export async function parseNBTWithFunction(file: File): Promise<SchematicMetadata | null> {
  try {
    // Convert file to base64 using FileReader for better compatibility
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix if present
        const base64Data = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Execute the Appwrite function
    const response = await functions.createExecution(
      'parse-nbt-schematic',
      JSON.stringify({ file: base64 }),
      false,
      '/',
      ExecutionMethod.POST,
      {
        'Content-Type': 'application/json',
      }
    );

    // Check if execution was successful
    if (response.status === 'completed' && response.responseStatusCode === 200) {
      const result = JSON.parse(response.responseBody);
      if (result.success) {
        return result.metadata;
      } else {
        console.error('Server parsing failed:', result.error);
        throw new Error(`Server parsing failed: ${result.error}`);
      }
    }

    // Log detailed execution info for debugging
    console.log('Function execution details:', {
      status: response.status,
      statusCode: response.responseStatusCode,
      responseBody: response.responseBody,
      errors: response.errors,
      logs: response.logs,
    });

    throw new Error(response.errors || `Function execution failed with status: ${response.status}`);
  } catch (error) {
    console.error('Error calling NBT parser function:', error);
    return null;
  }
}
