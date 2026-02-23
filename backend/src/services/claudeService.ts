import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface KnowledgeBaseEntry {
  document_type: string;
  filename: string;
  content: string;
}

export interface GenerateProposalInput {
  rfpText: string;
  rfpFilename: string;
  knowledgeBase?: KnowledgeBaseEntry[];
  editInstructions?: string;
  previousResponse?: string;
}

export interface GenerateProposalResponse {
  proposalResponse: string;
  tokensUsed?: number;
}

/**
 * Generate a proposal response using Claude AI
 * @param input - RFP text and filename
 * @returns Generated proposal response
 */
export const generateProposalResponse = async (
  input: GenerateProposalInput
): Promise<GenerateProposalResponse> => {
  console.log('🤖 Generating proposal response with Claude AI...');
  console.log('📄 RFP Filename:', input.rfpFilename);
  console.log('📊 RFP Text Length:', input.rfpText.length, 'characters');

  try {
    // Build knowledge base context section if available
    let knowledgeBaseSection = '';
    if (input.knowledgeBase && input.knowledgeBase.length > 0) {
      const typeLabels: Record<string, string> = {
        company_overview: 'Company Overview',
        case_study: 'Case Study',
        pricing: 'Pricing Information',
        team_bio: 'Team Biography',
        capability_statement: 'Capability Statement',
        general: 'Company Document',
      };

      const kbSections = input.knowledgeBase.map((doc) => {
        const label = typeLabels[doc.document_type] || 'Company Document';
        return `--- ${label} (${doc.filename}) ---\n${doc.content}`;
      }).join('\n\n');

      knowledgeBaseSection = `\n\nCOMPANY KNOWLEDGE BASE:\nUse the following company information to personalize and strengthen the proposal response:\n\n${kbSections}\n\n`;
    }

    // Construct the prompt for Claude
    let prompt: string;

    if (input.editInstructions && input.previousResponse) {
      // Revision prompt: incorporate user feedback into the previous response
      prompt = `You are an expert proposal writer. Below is an original RFP, your previous proposal response, and the user's requested edits. Please regenerate the proposal incorporating the requested changes.${knowledgeBaseSection}
RFP Document: ${input.rfpFilename}

RFP Content:
${input.rfpText}

YOUR PREVIOUS RESPONSE:
${input.previousResponse}

USER'S REQUESTED EDITS:
${input.editInstructions}

Please regenerate the full proposal incorporating these changes. Maintain the professional quality and structure while addressing the specific feedback provided.`;
    } else {
      // Standard first-generation prompt
      prompt = `You are an expert proposal writer. You have been provided with a Request for Proposal (RFP) document. Your task is to analyze the RFP and generate a comprehensive, professional proposal response that addresses all requirements.${knowledgeBaseSection}
RFP Document: ${input.rfpFilename}

RFP Content:
${input.rfpText}

Please analyze this RFP and generate a detailed proposal response that includes:

1. **Executive Summary**: A compelling overview of your proposed solution
2. **Understanding of Requirements**: Demonstrate clear comprehension of the client's needs
3. **Proposed Solution**: Detailed description of how you will address each requirement
4. **Methodology/Approach**: Your process and timeline for delivering the solution
5. **Qualifications**: Why you are the best choice for this project
6. **Budget/Pricing**: Cost breakdown (if pricing information can be inferred from the RFP)
7. **Conclusion**: Strong closing statement

Format the response professionally with clear sections and headings. Be specific, persuasive, and tailored to the requirements in the RFP.`;
    }

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the generated text
    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block: any) => block.text)
      .join('\n');

    console.log('✅ Proposal response generated successfully');
    console.log('📊 Tokens used:', message.usage?.input_tokens, 'input,', message.usage?.output_tokens, 'output');

    return {
      proposalResponse: responseText,
      tokensUsed: (message.usage?.input_tokens || 0) + (message.usage?.output_tokens || 0),
    };
  } catch (error: any) {
    console.error('❌ Claude API error:', error.message);

    // Provide more specific error messages
    if (error.status === 401) {
      throw new Error('Invalid Anthropic API key. Please check your ANTHROPIC_API_KEY environment variable.');
    } else if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.status === 500) {
      throw new Error('Anthropic API service error. Please try again later.');
    }

    throw new Error(`Failed to generate proposal response: ${error.message}`);
  }
};
