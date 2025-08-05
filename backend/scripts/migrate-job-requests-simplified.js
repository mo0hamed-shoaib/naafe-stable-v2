import mongoose from 'mongoose';
import JobRequest from '../models/JobRequest.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const migrateJobRequests = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all job requests
    const jobRequests = await JobRequest.find({});
    console.log(`Found ${jobRequests.length} job requests to migrate`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const jobRequest of jobRequests) {
      let needsUpdate = false;
      const updates = {};

      // Handle location structure - remove street, apartmentNumber, additionalInformation
      if (jobRequest.location) {
        const newLocation = {
          government: jobRequest.location.government || '',
          city: jobRequest.location.city || '',
          address: jobRequest.location.address || ''
        };

        // Remove old fields if they exist
        if (jobRequest.location.street || jobRequest.location.apartmentNumber || jobRequest.location.additionalInformation) {
          updates.location = newLocation;
          needsUpdate = true;
          console.log(`Updating location for job request ${jobRequest._id}: removing street, apartmentNumber, additionalInformation`);
        }
      }

      // Handle budget - make it optional if it doesn't exist
      if (!jobRequest.budget) {
        // Remove budget field entirely if it doesn't exist
        updates.$unset = { budget: 1 };
        needsUpdate = true;
        console.log(`Removing budget field for job request ${jobRequest._id}`);
      }

      // Handle estimatedDuration - make it optional if it doesn't exist
      if (jobRequest.estimatedDuration === undefined || jobRequest.estimatedDuration === null) {
        updates.$unset = { estimatedDuration: 1 };
        needsUpdate = true;
        console.log(`Removing estimatedDuration field for job request ${jobRequest._id}`);
      }

      if (needsUpdate) {
        await JobRequest.findByIdAndUpdate(jobRequest._id, updates);
        updatedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`Migration completed:`);
    console.log(`- Updated: ${updatedCount} job requests`);
    console.log(`- Skipped: ${skippedCount} job requests (already in correct format)`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateJobRequests();
}

export default migrateJobRequests; 