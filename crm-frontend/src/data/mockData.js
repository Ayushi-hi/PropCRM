export const agents = [
  { id: 1, name: 'Priya Sharma', avatar: 'PS', deals: 14, leads: 32, conversion: 43 },
  { id: 2, name: 'Rahul Mehta', avatar: 'RM', deals: 9, leads: 25, conversion: 36 },
  { id: 3, name: 'Anika Patel', avatar: 'AP', deals: 11, leads: 28, conversion: 39 },
  { id: 4, name: 'Vikram Singh', avatar: 'VS', deals: 7, leads: 20, conversion: 35 },
];

export const leads = [
  { id: 1, name: 'Arjun Kapoor', phone: '+91 98200 11234', email: 'arjun@email.com', source: 'Website', budget: '₹1.2 Cr', score: 87, status: 'Hot', agent: 'Priya Sharma', nextAction: 'Call Today', property: 'Skyline Heights' },
  { id: 2, name: 'Meera Nair', phone: '+91 98100 22345', email: 'meera@email.com', source: 'Referral', budget: '₹80 L', score: 72, status: 'Warm', agent: 'Rahul Mehta', nextAction: 'Send Options', property: 'Green Valley' },
  { id: 3, name: 'Suresh Iyer', phone: '+91 99300 33456', email: 'suresh@email.com', source: 'Google Ads', budget: '₹2.5 Cr', score: 91, status: 'Hot', agent: 'Anika Patel', nextAction: 'Schedule Visit', property: 'Prestige Towers' },
  { id: 4, name: 'Kavita Desai', phone: '+91 97200 44567', email: 'kavita@email.com', source: 'Facebook', budget: '₹60 L', score: 45, status: 'Cold', agent: 'Vikram Singh', nextAction: 'Follow Up', property: 'Sunrise Apartments' },
  { id: 5, name: 'Rohan Gupta', phone: '+91 98500 55678', email: 'rohan@email.com', source: 'Website', budget: '₹1.8 Cr', score: 78, status: 'Warm', agent: 'Priya Sharma', nextAction: 'Send Options', property: 'Skyline Heights' },
  { id: 6, name: 'Ananya Joshi', phone: '+91 99800 66789', email: 'ananya@email.com', source: 'Walk-in', budget: '₹95 L', score: 83, status: 'Hot', agent: 'Anika Patel', nextAction: 'Call Today', property: 'Palm Grove' },
  { id: 7, name: 'Deepak Verma', phone: '+91 97600 77890', email: 'deepak@email.com', source: 'Referral', budget: '₹3.2 Cr', score: 65, status: 'Warm', agent: 'Rahul Mehta', nextAction: 'Schedule Visit', property: 'Prestige Towers' },
  { id: 8, name: 'Sonal Bhatia', phone: '+91 98900 88901', email: 'sonal@email.com', source: 'Google Ads', budget: '₹50 L', score: 38, status: 'Cold', agent: 'Vikram Singh', nextAction: 'Follow Up', property: 'Green Valley' },
];

export const properties = [
  { id: 1, title: 'Skyline Heights', location: 'Bandra West, Mumbai', price: '₹1.1 – 2.2 Cr', type: '2/3 BHK', availability: 'Available', amenities: ['Gym', 'Pool', 'Parking', 'Security'], linkedLeads: 3 },
  { id: 2, title: 'Green Valley', location: 'Whitefield, Bengaluru', price: '₹65 – 95 L', type: '2 BHK', availability: 'Limited', amenities: ['Garden', 'Clubhouse', 'Parking'], linkedLeads: 2 },
  { id: 3, title: 'Prestige Towers', location: 'Juhu, Mumbai', price: '₹2.2 – 4 Cr', type: '3/4 BHK', availability: 'Available', amenities: ['Pool', 'Gym', 'Concierge', 'Spa', 'Parking'], linkedLeads: 2 },
  { id: 4, title: 'Sunrise Apartments', location: 'Hadapsar, Pune', price: '₹48 – 72 L', type: '1/2 BHK', availability: 'Sold Out', amenities: ['Parking', 'Security'], linkedLeads: 1 },
  { id: 5, title: 'Palm Grove', location: 'Koregaon Park, Pune', price: '₹85 – 1.1 Cr', type: '2/3 BHK', availability: 'Available', amenities: ['Garden', 'Pool', 'Gym', 'Parking'], linkedLeads: 1 },
];

export const deals = [
  { id: 1, client: 'Suresh Iyer', property: 'Prestige Towers', stage: 'Negotiation', value: '₹2.8 Cr', commission: '₹5.6 L', agent: 'Anika Patel', days: 12 },
  { id: 2, client: 'Arjun Kapoor', property: 'Skyline Heights', stage: 'Site Visit', value: '₹1.4 Cr', commission: '₹2.8 L', agent: 'Priya Sharma', days: 5 },
  { id: 3, client: 'Meera Nair', property: 'Green Valley', stage: 'Proposal', value: '₹82 L', commission: '₹1.64 L', agent: 'Rahul Mehta', days: 8 },
  { id: 4, client: 'Ananya Joshi', property: 'Palm Grove', stage: 'Closed', value: '₹96 L', commission: '₹1.92 L', agent: 'Anika Patel', days: 45 },
  { id: 5, client: 'Rohan Gupta', property: 'Skyline Heights', stage: 'Qualification', value: '₹1.8 Cr', commission: '₹3.6 L', agent: 'Priya Sharma', days: 2 },
  { id: 6, client: 'Deepak Verma', property: 'Prestige Towers', stage: 'Closed', value: '₹3.1 Cr', commission: '₹6.2 L', agent: 'Rahul Mehta', days: 60 },
];

export const followups = [
  { id: 1, lead: 'Arjun Kapoor', agent: 'Priya Sharma', action: 'Call – Discuss 3BHK options', due: 'Today', priority: 'High', status: 'Pending' },
  { id: 2, lead: 'Suresh Iyer', agent: 'Anika Patel', action: 'Send revised quote', due: 'Today', priority: 'High', status: 'Pending' },
  { id: 3, lead: 'Meera Nair', agent: 'Rahul Mehta', action: 'Email property brochures', due: 'Tomorrow', priority: 'Medium', status: 'Pending' },
  { id: 4, lead: 'Kavita Desai', agent: 'Vikram Singh', action: 'Follow-up call', due: 'In 2 days', priority: 'Low', status: 'Pending' },
  { id: 5, lead: 'Rohan Gupta', agent: 'Priya Sharma', action: 'Schedule site visit', due: 'Tomorrow', priority: 'Medium', status: 'Done' },
  { id: 6, lead: 'Ananya Joshi', agent: 'Anika Patel', action: 'Send token amount details', due: 'In 3 days', priority: 'High', status: 'Pending' },
];

export const activities = [
  { id: 1, type: 'lead', text: 'New lead Arjun Kapoor added from Website', time: '2 min ago', icon: 'user-plus' },
  { id: 2, type: 'deal', text: 'Deal closed – Deepak Verma · ₹3.1 Cr', time: '1 hr ago', icon: 'check-circle' },
  { id: 3, type: 'visit', text: 'Site visit scheduled – Ananya Joshi at Palm Grove', time: '3 hr ago', icon: 'calendar' },
  { id: 4, type: 'call', text: 'Call completed with Meera Nair', time: '5 hr ago', icon: 'phone' },
  { id: 5, type: 'lead', text: 'New lead Sonal Bhatia from Google Ads', time: '1 day ago', icon: 'user-plus' },
];

export const monthlyData = [
  { month: 'Oct', leads: 38, deals: 8 },
  { month: 'Nov', leads: 45, deals: 10 },
  { month: 'Dec', leads: 40, deals: 9 },
  { month: 'Jan', leads: 52, deals: 13 },
  { month: 'Feb', leads: 48, deals: 11 },
  { month: 'Mar', leads: 61, deals: 16 },
];

export const sourceData = [
  { name: 'Website', value: 35 },
  { name: 'Referral', value: 25 },
  { name: 'Google Ads', value: 22 },
  { name: 'Facebook', value: 12 },
  { name: 'Walk-in', value: 6 },
];