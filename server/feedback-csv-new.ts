import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';

export async function saveFeedbackToCsv(name: string, email: string, feedback: string): Promise<void> {
  try {
    const csvFilePath = path.join(process.cwd(), 'userfeedback.csv');
    const fileExists = fs.existsSync(csvFilePath);
    
    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'feedback', title: 'Feedback' },
        { id: 'timestamp', title: 'Timestamp' }
      ],
      append: fileExists
    });
    
    const data = [{
      name,
      email,
      feedback,
      timestamp: new Date().toISOString()
    }];
    
    await csvWriter.writeRecords(data);
    console.log('Feedback saved to CSV file');
  } catch (error) {
    console.error('Error saving feedback to CSV:', error);
    throw error;
  }
}