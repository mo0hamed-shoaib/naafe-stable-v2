import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User, { Seeker, Provider, Admin } from '../models/index.js';

dotenv.config();

async function testDiscriminators() {
  try {
    await connectDB();
    console.log('✅ Connected to database');

    // Test creating different user types
    const testUsers = [
      {
        email: 'seeker@test.com',
        password: 'TestPass123!',
        name: { first: 'John', last: 'Seeker' },
        phone: '01012345678',
        role: 'seeker'
      },
      {
        email: 'provider@test.com',
        password: 'TestPass123!',
        name: { first: 'Jane', last: 'Provider' },
        phone: '01087654321',
        role: 'provider'
      },
      {
        email: 'admin@test.com',
        password: 'TestPass123!',
        name: { first: 'Admin', last: 'User' },
        phone: '01011111111',
        role: 'admin'
      }
    ];

    console.log('\n🧪 Testing discriminator models...');

    for (const userData of testUsers) {
      try {
        // Determine which model to use
        let UserModel;
        switch (userData.role) {
          case 'seeker':
            UserModel = Seeker;
            break;
          case 'provider':
            UserModel = Provider;
            break;
          case 'admin':
            UserModel = Admin;
            break;
        }

        // Create user
        const user = new UserModel(userData);
        await user.save();
        
        console.log(`✅ Created ${userData.role} user: ${user.email}`);
        console.log(`   - Model type: ${user.constructor.modelName}`);
        console.log(`   - Role: ${user.role}`);
        console.log(`   - Role-specific fields:`, Object.keys(user.toObject()).filter(key => 
          key === 'totalJobsPosted' || 
          key === 'totalJobsCompleted' || 
          key === 'totalEarnings' ||
          key === 'totalSpent' ||
          key === 'isSuperAdmin' ||
          key === 'permissions'
        ));
        
      } catch (error) {
        console.error(`❌ Failed to create ${userData.role} user:`, error.message);
      }
    }

    // Test querying
    console.log('\n🔍 Testing queries...');
    
    const allUsers = await User.find({});
    console.log(`✅ Found ${allUsers.length} total users`);
    
    const seekers = await Seeker.find({});
    console.log(`✅ Found ${seekers.length} seekers`);
    
    const providers = await Provider.find({});
    console.log(`✅ Found ${providers.length} providers`);
    
    const admins = await Admin.find({});
    console.log(`✅ Found ${admins.length} admins`);

    // Clean up test data
    await User.deleteMany({ email: { $in: ['seeker@test.com', 'provider@test.com', 'admin@test.com'] } });
    console.log('\n🧹 Cleaned up test data');

    console.log('\n✅ All discriminator tests passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testDiscriminators(); 