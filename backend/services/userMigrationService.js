import mongoose from 'mongoose';
import User, { Seeker, Provider } from '../models/index.js';
import { logger } from '../middlewares/logging.middleware.js';

class UserMigrationService {
  /**
   * Migrate a user from seeker to provider
   * @param {string} userId - User ID to migrate
   * @param {Object} verificationData - Verification data to include
   * @returns {Object} Migration result with new user ID
   */
  async migrateSeekerToProvider(userId, verificationData = {}) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the seeker user
      const seeker = await Seeker.findById(userId).session(session);
      if (!seeker) {
        throw new Error('Seeker user not found');
      }

      if (seeker.role !== 'seeker') {
        throw new Error('User is not a seeker');
      }

      // Prepare provider data
      const providerData = {
        email: seeker.email,
        password: seeker.password,
        name: seeker.name,
        phone: seeker.phone,
        avatarUrl: seeker.avatarUrl,
        role: 'provider',
        verification: {
          status: verificationData.status || 'verified',
          method: verificationData.method || 'manual',
          documents: seeker.verification?.documents || [],
          verifiedAt: verificationData.verifiedAt || new Date(),
          verifiedBy: verificationData.verifiedBy || null,
          rejectionReason: verificationData.rejectionReason || null
        },
        profile: seeker.profile || {},
        isActive: seeker.isActive,
        isBlocked: seeker.isBlocked,
        blockedReason: seeker.blockedReason,
        lastLoginAt: seeker.lastLoginAt,
        // Provider-specific fields with defaults
        rating: 0,
        reviewCount: 0,
        totalJobsCompleted: 0,
        totalEarnings: 0
      };

      // Create new provider document
      const newProvider = new Provider(providerData);
      await newProvider.save({ session });

      // Delete the old seeker document
      await seeker.deleteOne({ session });

      // Commit the transaction
      await session.commitTransaction();

      logger.info(`Successfully migrated user ${userId} from seeker to provider. New ID: ${newProvider._id}`);

      return {
        success: true,
        oldUserId: userId,
        newUserId: newProvider._id,
        message: 'User successfully migrated from seeker to provider'
      };

    } catch (error) {
      // Rollback the transaction
      await session.abortTransaction();
      logger.error(`Migration failed for user ${userId}: ${error.message}`);
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Migrate a user from provider to seeker (if needed)
   * @param {string} userId - User ID to migrate
   * @returns {Object} Migration result with new user ID
   */
  async migrateProviderToSeeker(userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the provider user
      const provider = await Provider.findById(userId).session(session);
      if (!provider) {
        throw new Error('Provider user not found');
      }

      if (provider.role !== 'provider') {
        throw new Error('User is not a provider');
      }

      // Prepare seeker data
      const seekerData = {
        email: provider.email,
        password: provider.password,
        name: provider.name,
        phone: provider.phone,
        avatarUrl: provider.avatarUrl,
        role: 'seeker',
        verification: {
          status: 'rejected',
          method: provider.verification?.method || null,
          documents: provider.verification?.documents || [],
          verifiedAt: null,
          verifiedBy: null,
          rejectionReason: 'Role downgraded to seeker'
        },
        profile: provider.profile || {},
        isActive: provider.isActive,
        isBlocked: provider.isBlocked,
        blockedReason: provider.blockedReason,
        lastLoginAt: provider.lastLoginAt,
        // Seeker-specific fields with defaults
        totalJobsPosted: 0,
        rating: 0,
        reviewCount: 0,
        totalSpent: 0
      };

      // Create new seeker document
      const newSeeker = new Seeker(seekerData);
      await newSeeker.save({ session });

      // Delete the old provider document
      await provider.deleteOne({ session });

      // Commit the transaction
      await session.commitTransaction();

      logger.info(`Successfully migrated user ${userId} from provider to seeker. New ID: ${newSeeker._id}`);

      return {
        success: true,
        oldUserId: userId,
        newUserId: newSeeker._id,
        message: 'User successfully migrated from provider to seeker'
      };

    } catch (error) {
      // Rollback the transaction
      await session.abortTransaction();
      logger.error(`Migration failed for user ${userId}: ${error.message}`);
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get migration history for a user
   * @param {string} userId - User ID
   * @returns {Object} Migration history
   */
  async getMigrationHistory(userId) {
    try {
      // Check if user exists in any collection
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // For now, we'll return basic info
      // In a production system, you might want to maintain a separate migration log
      return {
        currentRole: user.role,
        currentUserId: user._id,
        verificationStatus: user.verification?.status || 'none',
        message: 'Migration history tracking not implemented yet'
      };
    } catch (error) {
      logger.error(`Get migration history error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate if a user can be migrated
   * @param {string} userId - User ID
   * @param {string} targetRole - Target role ('seeker' or 'provider')
   * @returns {Object} Validation result
   */
  async validateMigration(userId, targetRole) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { canMigrate: false, reason: 'User not found' };
      }

      if (user.role === targetRole) {
        return { canMigrate: false, reason: `User is already a ${targetRole}` };
      }

      // Additional validation rules can be added here
      if (targetRole === 'provider' && user.verification?.status !== 'verified') {
        return { canMigrate: false, reason: 'User must be verified to become a provider' };
      }

      return { canMigrate: true, currentRole: user.role, targetRole };
    } catch (error) {
      logger.error(`Validate migration error: ${error.message}`);
      throw error;
    }
  }
}

export default new UserMigrationService(); 