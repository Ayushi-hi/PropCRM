/**
 * Notification Service (Mock Implementation)
 * In production, replace with: Twilio SMS, SendGrid Email, Firebase Push, etc.
 */

const notifyAgent = async ({ agentId, type, message, data = {} }) => {
  // Mock: just log it
  console.log(`\n📢 [NOTIFICATION] → Agent: ${agentId}`);
  console.log(`   Type: ${type}`);
  console.log(`   Message: ${message}`);
  console.log(`   Data:`, data);
  console.log();

  // TODO: Replace with real notification logic:
  // await sendEmail(agent.email, subject, body)
  // await sendSMS(agent.phone, message)
  // await pushNotification(agent.deviceToken, message)

  return { sent: true, channel: 'mock-log', timestamp: new Date() };
};

const notifyLeadAssigned = async (agent, lead) => {
  return notifyAgent({
    agentId: agent._id,
    type: 'LEAD_ASSIGNED',
    message: `New lead assigned to you: ${lead.name}`,
    data: { leadId: lead._id, leadName: lead.name },
  });
};

const notifyFollowUpDue = async (agent, followUp) => {
  return notifyAgent({
    agentId: agent._id,
    type: 'FOLLOWUP_DUE',
    message: `Follow-up due: ${followUp.note || 'Check your schedule'}`,
    data: { followUpId: followUp._id },
  });
};

const notifyDealClosed = async (agent, deal) => {
  return notifyAgent({
    agentId: agent._id,
    type: 'DEAL_CLOSED',
    message: `Deal closed! Value: ₹${deal.dealValue}. Commission: ₹${deal.commission}`,
    data: { dealId: deal._id },
  });
};

module.exports = { notifyAgent, notifyLeadAssigned, notifyFollowUpDue, notifyDealClosed };