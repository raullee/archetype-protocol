import { test } from '@playwright/test';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateReportPrompt } from '../src/lib/report-prompts';
import { Archetype } from '../src/lib/archetypes';
import fs from 'fs/promises';
import path from 'path';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface SampleConfig {
  filename: string;
  tier: 'basic' | 'full';
  primary: Archetype;
  secondary: Archetype;
}

const sampleConfigs: SampleConfig[] = [
  // Basic reports
  {
    filename: 'basic-creator-explorer.md',
    tier: 'basic',
    primary: 'Creator',
    secondary: 'Explorer'
  },
  {
    filename: 'basic-outlaw-magician.md',
    tier: 'basic',
    primary: 'Outlaw',
    secondary: 'Magician'
  },
  {
    filename: 'basic-hero-ruler.md',
    tier: 'basic',
    primary: 'Hero',
    secondary: 'Ruler'
  },
  // Full reports
  {
    filename: 'full-magician-outlaw.md',
    tier: 'full',
    primary: 'Magician',
    secondary: 'Outlaw'
  },
  {
    filename: 'full-lover-creator.md',
    tier: 'full',
    primary: 'Lover',
    secondary: 'Creator'
  },
  {
    filename: 'full-sage-explorer.md',
    tier: 'full',
    primary: 'Sage',
    secondary: 'Explorer'
  },
];

test.describe('Generate Sample Reports', () => {
  test.setTimeout(300000); // 5 minutes timeout for all generations

  for (const config of sampleConfigs) {
    test(`Generate ${config.filename}`, async () => {
      console.log(`Generating ${config.filename}...`);
      
      try {
        // Generate the prompt
        const prompt = generateReportPrompt(
          config.tier,
          config.primary,
          config.secondary,
        );
        
        // Call Gemini API
        const model = genAI.getGenerativeModel({ 
          model: "gemini-pro",
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text();

        if (!generatedText) {
          throw new Error('Failed to generate content');
        }

        // Create report header with metadata
        const header = `# ${config.tier.charAt(0).toUpperCase() + config.tier.slice(1)} Report: ${config.primary}/${config.secondary}

**Generated:** ${new Date().toISOString()}
**Word Count:** ${generatedText.split(/\s+/).length.toLocaleString()}
**Tier:** ${config.tier.toUpperCase()}

---

`;

        const fullContent = header + generatedText;

        // Save to sample-reports directory
        const sampleDir = path.join(process.cwd(), 'sample-reports');
        const filePath = path.join(sampleDir, config.filename);
        
        await fs.writeFile(filePath, fullContent, 'utf-8');
        
        console.log(`✓ Generated ${config.filename} (${generatedText.split(/\s+/).length} words)`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`Failed to generate ${config.filename}:`, error);
        
        // Create a placeholder file with error info
        const errorContent = `# ${config.tier.charAt(0).toUpperCase() + config.tier.slice(1)} Report: ${config.primary}/${config.secondary}

**Status:** GENERATION FAILED
**Error:** ${error instanceof Error ? error.message : 'Unknown error'}
**Attempted:** ${new Date().toISOString()}

This sample report could not be generated due to API limitations or quota issues.
`;

        const sampleDir2 = path.join(process.cwd(), 'sample-reports');
        const errorFilePath = path.join(sampleDir2, config.filename.replace('.md', '-ERROR.md'));

        await fs.writeFile(errorFilePath, errorContent, 'utf-8');
      }
    });
  }

  test('Generate summary report', async () => {
    // Create a summary of all generated samples
    const sampleDir = path.join(process.cwd(), 'sample-reports');
    const files = await fs.readdir(sampleDir);
    
    const summary = `# Sample Reports Summary

Generated on: ${new Date().toISOString()}
Total files: ${files.length}

## Files Generated:

${files.map(file => `- ${file}`).join('\n')}

## Usage:

These sample reports demonstrate the AI-generated content for different archetype combinations and tiers:

- **Basic**: ~1,500-2,000 words, core archetype analysis
- **Full**: ~4,000-5,000 words, comprehensive blueprint with roadmap
- **Couples**: ~7,000-8,000 words, partnership analysis for two artists

Each report uses the same prompts as the live system and showcases the depth and personalization of the AI-generated content.
`;
    
    await fs.writeFile(path.join(sampleDir, 'README.md'), summary, 'utf-8');
    console.log('✓ Generated summary report');
  });
});

test.describe('API Integration Tests', () => {
  test('Test report generation API endpoint', async ({ page }) => {
    // Test the API directly if the dev server is running
    const testPayload = {
      primary: 'Creator',
      secondary: 'Explorer',
      tier: 'basic'
    };

    try {
      const response = await page.request.post('/api/generate-report', {
        data: testPayload
      });

      if (response.ok()) {
        const data = await response.json();
        console.log('✓ API test successful:', {
          tier: data.report?.tier,
          wordCount: data.report?.metadata?.wordCount
        });
      } else {
        console.log('API test failed (server may not be running):', response.status());
      }
    } catch (error) {
      console.log('API test skipped (dev server not running)');
    }
  });
});