import * as fs from 'fs';
import * as path from 'path';

export interface ProgramAnalysis {
  programName: string;
  filePath: string;
  fileSize: number;
  isValidSolanaProgram: boolean;
  instructionCount?: number;
  metadata?: any;
}

export function analyzeBinary(filePath: string): ProgramAnalysis {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;

    // Read the file
    const fileBuffer = fs.readFileSync(filePath);

    // Basic validation - check if it's an ELF file (Solana programs are ELF format)
    const isValidSolanaProgram = fileBuffer.length > 0 && 
                                fileBuffer[0] === 0x7f && 
                                fileBuffer[1] === 0x45 && 
                                fileBuffer[2] === 0x4c && 
                                fileBuffer[3] === 0x46; // ELF magic bytes

    // Extract program name from file path
    const programName = path.basename(filePath, '.so');

    return {
      programName,
      filePath,
      fileSize,
      isValidSolanaProgram,
      instructionCount: 0, // TODO: Parse actual instruction count
      metadata: null // TODO: Extract more metadata
    };

  } catch (error) {
    throw new Error(`Failed to analyze binary: ${error.message}`);
  }
}

// Additional utility functions we'll need later
export function getBinarySize(filePath: string): number {
  const stats = fs.statSync(filePath);
  return stats.size;
}

export function validateSolanaProgram(filePath: string): boolean {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer.length > 0 && 
         fileBuffer[0] === 0x7f && 
         fileBuffer[1] === 0x45 && 
         fileBuffer[2] === 0x4c && 
         fileBuffer[3] === 0x46;
}