import mongoose from 'mongoose';
import User from '../models/User.js';
import SwapRequest from '../models/SwapRequest.js';
import config from '../config/config.js';

// Sample users data
const sampleUsers = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    location: 'New York, NY',
    bio: 'Passionate about teaching and learning. I love sharing knowledge and meeting new people!',
    skillsOffered: ['JavaScript', 'React', 'Web Development', 'Photography'],
    skillsWanted: ['Guitar', 'Cooking', 'Spanish', 'Yoga'],
    availability: {
      monday: { morning: true, afternoon: false, evening: true },
      tuesday: { morning: false, afternoon: true, evening: false },
      wednesday: { morning: true, afternoon: true, evening: false },
      thursday: { morning: false, afternoon: false, evening: true },
      friday: { morning: true, afternoon: false, evening: true },
      saturday: { morning: true, afternoon: true, evening: false },
      sunday: { morning: false, afternoon: true, evening: true }
    },
    rating: 4.8,
    swapCount: 12,
    isPublic: true
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
    location: 'San Francisco, CA',
    bio: 'Music enthusiast and guitar teacher. Always looking to learn new skills and share my passion for music.',
    skillsOffered: ['Guitar', 'Music Theory', 'Piano', 'Songwriting'],
    skillsWanted: ['Python', 'Data Science', 'Cooking', 'Fitness Training'],
    availability: {
      monday: { morning: false, afternoon: true, evening: true },
      tuesday: { morning: true, afternoon: false, evening: true },
      wednesday: { morning: false, afternoon: true, evening: false },
      thursday: { morning: true, afternoon: true, evening: false },
      friday: { morning: false, afternoon: false, evening: true },
      saturday: { morning: true, afternoon: true, evening: true },
      sunday: { morning: true, afternoon: false, evening: false }
    },
    rating: 4.6,
    swapCount: 8,
    isPublic: true
  },
  {
    name: 'Carol Davis',
    email: 'carol@example.com',
    password: 'password123',
    location: 'Austin, TX',
    bio: 'Professional chef and cooking instructor. Love teaching people how to cook delicious meals!',
    skillsOffered: ['Cooking', 'Baking', 'Meal Planning', 'Nutrition'],
    skillsWanted: ['Photography', 'Graphic Design', 'French', 'Dancing'],
    availability: {
      monday: { morning: true, afternoon: false, evening: false },
      tuesday: { morning: false, afternoon: true, evening: true },
      wednesday: { morning: true, afternoon: true, evening: false },
      thursday: { morning: false, afternoon: false, evening: true },
      friday: { morning: true, afternoon: false, evening: true },
      saturday: { morning: true, afternoon: true, evening: false },
      sunday: { morning: false, afternoon: true, evening: false }
    },
    rating: 4.9,
    swapCount: 15,
    isPublic: true
  },
  {
    name: 'David Wilson',
    email: 'david@example.com',
    password: 'password123',
    location: 'Seattle, WA',
    bio: 'Software engineer by day, fitness trainer by night. Always eager to learn and share knowledge.',
    skillsOffered: ['Python', 'Machine Learning', 'Fitness Training', 'Running'],
    skillsWanted: ['Guitar', 'Cooking', 'Meditation', 'Public Speaking'],
    availability: {
      monday: { morning: true, afternoon: true, evening: false },
      tuesday: { morning: false, afternoon: false, evening: true },
      wednesday: { morning: true, afternoon: false, evening: true },
      thursday: { morning: false, afternoon: true, evening: false },
      friday: { morning: true, afternoon: true, evening: true },
      saturday: { morning: true, afternoon: false, evening: false },
      sunday: { morning: false, afternoon: true, evening: true }
    },
    rating: 4.7,
    swapCount: 6,
    isPublic: true
  },
  {
    name: 'Emma Brown',
    email: 'emma@example.com',
    password: 'password123',
    location: 'Chicago, IL',
    bio: 'Yoga instructor and wellness coach. Passionate about helping others find balance and peace.',
    skillsOffered: ['Yoga', 'Meditation', 'Wellness Coaching', 'Mindfulness'],
    skillsWanted: ['Spanish', 'Photography', 'Cooking', 'Art'],
    availability: {
      monday: { morning: true, afternoon: false, evening: true },
      tuesday: { morning: false, afternoon: true, evening: false },
      wednesday: { morning: true, afternoon: true, evening: true },
      thursday: { morning: false, afternoon: false, evening: true },
      friday: { morning: true, afternoon: true, evening: false },
      saturday: { morning: true, afternoon: false, evening: false },
      sunday: { morning: false, afternoon: true, evening: true }
    },
    rating: 4.9,
    swapCount: 20,
    isPublic: true
  }
];

// Sample swap requests data
const sampleSwapRequests = [
  {
    requestedSkill: 'JavaScript',
    offeredSkill: 'Guitar',
    status: 'pending',
    message: 'I would love to learn JavaScript! I can teach you guitar in return. I\'m available on weekends.',
    proposedTime: 'Saturday morning'
  },
  {
    requestedSkill: 'Cooking',
    offeredSkill: 'React',
    status: 'accepted',
    message: 'I\'ve been wanting to learn cooking for a while. I can teach you React development!',
    proposedTime: 'Friday evening',
    acceptedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    requestedSkill: 'Yoga',
    offeredSkill: 'Photography',
    status: 'pending',
    message: 'I\'m interested in learning yoga and can offer photography lessons in exchange.',
    proposedTime: 'Wednesday afternoon'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await User.deleteMany({});
    await SwapRequest.deleteMany({});
    console.log('🧹 Cleared existing data');
    
    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.name}`);
    }
    
    // Create swap requests
    if (createdUsers.length >= 2) {
      // Alice requests JavaScript from Bob
      const swap1 = new SwapRequest({
        fromUser: createdUsers[0]._id, // Alice
        toUser: createdUsers[1]._id,   // Bob
        ...sampleSwapRequests[0]
      });
      await swap1.save();
      
      // Bob requests Cooking from Carol
      const swap2 = new SwapRequest({
        fromUser: createdUsers[1]._id, // Bob
        toUser: createdUsers[2]._id,   // Carol
        ...sampleSwapRequests[1]
      });
      await swap2.save();
      
      // David requests Yoga from Emma
      const swap3 = new SwapRequest({
        fromUser: createdUsers[3]._id, // David
        toUser: createdUsers[4]._id,   // Emma
        ...sampleSwapRequests[2]
      });
      await swap3.save();
      
      console.log('🤝 Created swap requests');
    }
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created ${createdUsers.length} users and ${sampleSwapRequests.length} swap requests`);
    console.log('🎯 You can now test the application with this data');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding
seedDatabase(); 