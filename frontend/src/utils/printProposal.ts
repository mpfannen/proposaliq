import { ProposalDetail } from '../services/proposalService';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  generating: 'Generating',
  completed: 'Completed',
};

const OUTCOME_LABELS: Record<string, string> = {
  won: 'Won',
  lost: 'Lost',
  pending: 'Pending',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function printProposal(proposal: ProposalDetail): void {
  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) {
    alert('Please allow pop-ups for this site to print proposals.');
    return;
  }

  const statusText = STATUS_LABELS[proposal.status] || proposal.status;
  const outcomeText = OUTCOME_LABELS[proposal.outcome || 'pending'] || 'Pending';
  const createdText = new Date(proposal.created_at).toLocaleString();
  const printedText = new Date().toLocaleDateString();

  const responseHtml = proposal.proposal_response
    ? `<div class="response">${escapeHtml(proposal.proposal_response)}</div>`
    : '<p class="no-response">No AI response generated yet.</p>';

  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(proposal.rfp_filename)} — ProposalIQ</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      max-width: 820px;
      margin: 40px auto;
      padding: 0 24px;
      color: #222;
      line-height: 1.65;
      font-size: 14px;
    }
    .brand { font-size: 22px; font-weight: 700; color: #667eea; }
    .brand span { color: #764ba2; }
    hr { border: none; border-top: 2px solid #667eea; margin: 10px 0 24px; }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 28px;
    }
    .meta-cell {
      padding: 12px 16px;
      border-right: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
    }
    .meta-cell:nth-child(2n) { border-right: none; }
    .meta-cell:nth-last-child(-n+2) { border-bottom: none; }
    .meta-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #888;
      margin-bottom: 4px;
    }
    .meta-value { font-size: 14px; font-weight: 500; }
    h2 { font-size: 17px; color: #333; margin-bottom: 14px; margin-top: 0; }
    .response {
      white-space: pre-wrap;
      font-size: 13.5px;
      line-height: 1.8;
      color: #222;
    }
    .no-response { color: #999; font-style: italic; }
    .footer {
      margin-top: 48px;
      border-top: 1px solid #ddd;
      padding-top: 12px;
      font-size: 11px;
      color: #aaa;
      text-align: center;
    }
    @media print {
      body { margin: 20px auto; }
    }
  </style>
</head>
<body>
  <div class="brand">Proposal<span>IQ</span></div>
  <hr />

  <div class="meta-grid">
    <div class="meta-cell">
      <div class="meta-label">RFP Filename</div>
      <div class="meta-value">${escapeHtml(proposal.rfp_filename)}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-label">Status</div>
      <div class="meta-value">${statusText}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-label">Outcome</div>
      <div class="meta-value">${outcomeText}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-label">Date Created</div>
      <div class="meta-value">${createdText}</div>
    </div>
  </div>

  <h2>AI-Generated Proposal Response</h2>
  ${responseHtml}

  <div class="footer">Printed from ProposalIQ &middot; ${printedText}</div>

</body>
</html>`);

  win.document.close();
  setTimeout(() => win.print(), 250);
}
