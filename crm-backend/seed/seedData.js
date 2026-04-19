require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Lead = require('../models/Lead');
const Property = require('../models/Property');
const connectDB = require('../config/db');

const seed = async () => {
  await connectDB();
  console.log('🌱 Starting seed...');

  // Clear
  await Promise.all([User.deleteMany(), Lead.deleteMany(), Property.deleteMany()]);

  // Users
  const users = await User.insertMany([
    { name: 'Admin User', email: 'admin@propcrm.com', password: await bcrypt.hash('admin123', 12), role: 'admin', phone: '+91 9800000001' },
    { name: 'Priya Sharma', email: 'priya@propcrm.com', password: await bcrypt.hash('agent123', 12), role: 'agent', phone: '+91 9800000002' },
    { name: 'Rahul Mehta', email: 'rahul@propcrm.com', password: await bcrypt.hash('agent123', 12), role: 'agent', phone: '+91 9800000003' },
    { name: 'Anika Patel', email: 'anika@propcrm.com', password: await bcrypt.hash('agent123', 12), role: 'manager', phone: '+91 9800000004' },
  ]);

  const [admin, agent1, agent2] = users;

  // Properties
  const properties = await Property.insertMany([
    {
      title: 'Skyline Heights',
      description: 'Luxury apartments with city views',
      location: { address: 'Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
      price: 12000000,
      type: 'residential',
      subType: 'apartment',
      size: 1200,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['Gym', 'Pool', 'Parking', '24/7 Security'],
      status: 'available',
      assignedAgent: agent1._id,
      postedBy: admin._id,
    },
    {
      title: 'Prestige Towers',
      description: 'Premium 3 & 4 BHK sea-facing towers',
      location: { address: 'Juhu', city: 'Mumbai', state: 'Maharashtra', pincode: '400049' },
      price: 28000000,
      type: 'residential',
      subType: 'apartment',
      size: 2200,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ['Pool', 'Gym', 'Concierge', 'Spa', 'Parking'],
      status: 'available',
      assignedAgent: agent2._id,
      postedBy: admin._id,
    },
  ]);

  // Leads
  await Lead.insertMany([
    {
      name: 'Arjun Kapoor',
      phone: '+91 9820011234',
      email: 'arjun@email.com',
      source: 'website',
      budget: 15000000,
      status: 'Qualified',
      score: 87,
      assignedAgent: agent1._id,
      nextAction: 'Schedule Visit',
      lastContacted: new Date(),
      interactionCount: 5,
      interestedProperties: [properties[0]._id],
      visitedProperties: [],
      timeline: [{ action: 'LEAD_CREATED', note: 'Seed data', performedBy: admin._id }],
    },
    {
      name: 'Meera Nair',
      phone: '+91 9810022345',
      email: 'meera@email.com',
      source: 'referral',
      budget: 8000000,
      status: 'Contacted',
      score: 72,
      assignedAgent: agent2._id,
      nextAction: 'Send Property Options',
      lastContacted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      interactionCount: 3,
      interestedProperties: [],
      visitedProperties: [],
      timeline: [{ action: 'LEAD_CREATED', note: 'Seed data', performedBy: admin._id }],
    },
    {
      name: 'Suresh Iyer',
      phone: '+91 9930033456',
      email: 'suresh@email.com',
      source: 'ads',
      budget: 30000000,
      status: 'Qualified',
      score: 91,
      assignedAgent: agent1._id,
      nextAction: 'Move to Negotiation',
      lastContacted: new Date(),
      interactionCount: 8,
      interestedProperties: [properties[1]._id],
      visitedProperties: [properties[1]._id],
      timeline: [{ action: 'LEAD_CREATED', note: 'Seed data', performedBy: admin._id }],
    },
  ]);

  console.log('✅ Seed complete!');
  console.log('\n📋 Test Credentials:');
  console.log('   Admin:   admin@propcrm.com  /  admin123');
  console.log('   Agent:   priya@propcrm.com  /  agent123');
  console.log('   Manager: anika@propcrm.com  /  agent123\n');

  process.exit(0);
};

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});