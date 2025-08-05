import ServiceListing from '../models/ServiceListing.js';

class ListingService {
  async listOwnListings(providerId, { status = 'active', page = 1, limit = 20 }) {
    const query = { provider: providerId };
    if (status) query.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [listings, totalCount] = await Promise.all([
      ServiceListing.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ServiceListing.countDocuments(query)
    ]);
    return { listings, totalCount, page: parseInt(page), limit: parseInt(limit) };
  }

  async createListing(providerId, data) {
    const listing = new ServiceListing({ ...data, provider: providerId });
    await listing.save();
    return listing;
  }

  async getListingById(id) {
    return await ServiceListing.findById(id);
  }

  async updateListing(id, providerId, updateData) {
    return await ServiceListing.findOneAndUpdate(
      { _id: id, provider: providerId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async deleteListing(id, providerId) {
    return await ServiceListing.findOneAndUpdate(
      { _id: id, provider: providerId },
      { $set: { status: 'archived' } },
      { new: true }
    );
  }
}

export default new ListingService(); 