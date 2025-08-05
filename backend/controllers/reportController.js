import Report from '../models/Report.js';
import JobRequest from '../models/JobRequest.js';
import User from '../models/User.js';
import { logger } from '../middlewares/logging.middleware.js';

class ReportController {
  /**
   * Create a new report
   * POST /api/reports
   */
  async createReport(req, res) {
    try {
      const { type, targetId, reason, description } = req.body;
      const reporterId = req.user._id;

      // Validate report type and target
      if (!['service_request', 'user', 'service_listing'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TYPE',
            message: 'Invalid report type'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check if target exists
      let targetExists = false;
      if (type === 'service_request') {
        targetExists = await JobRequest.findById(targetId);
      } else if (type === 'user') {
        targetExists = await User.findById(targetId);
      }

      if (!targetExists) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Target not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check if user already reported this target
      const existingReport = await Report.findOne({
        reporter: reporterId,
        type,
        targetId
      });

      if (existingReport) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'ALREADY_REPORTED',
            message: 'You have already reported this item'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Create the report
      const report = new Report({
        reporter: reporterId,
        type,
        targetId,
        reason,
        description,
        status: 'pending'
      });

      await report.save();

      res.status(201).json({
        success: true,
        data: {
          report
        },
        message: 'Report submitted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Create report error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get user's own reports
   * GET /api/reports
   */
  async getMyReports(req, res) {
    try {
      const userId = req.user._id;
      const { page = 1, limit = 10, status } = req.query;

      const query = { reporter: userId };
      if (status) {
        query.status = status;
      }

      const reports = await Report.find(query)
        .populate('targetId', 'title name')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const totalCount = await Report.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          reports,
          totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit)
        },
        message: 'Reports retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Get my reports error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get all reports (admin only)
   * GET /api/reports/admin
   */
  async getAllReports(req, res) {
    try {
      const { page = 1, limit = 10, status, type } = req.query;

      const query = {};
      if (status) query.status = status;
      if (type) query.type = type;

      const reports = await Report.find(query)
        .populate('reporter', 'name email')
        .populate('targetId', 'title name')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const totalCount = await Report.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          reports,
          totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit)
        },
        message: 'All reports retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Get all reports error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update report status (admin only)
   * PATCH /api/reports/admin/:id
   */
  async updateReportStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      if (!['pending', 'investigating', 'resolved', 'dismissed'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Invalid status'
          },
          timestamp: new Date().toISOString()
        });
      }

      const report = await Report.findByIdAndUpdate(
        id,
        {
          status,
          adminNotes,
          resolvedAt: status === 'resolved' ? new Date() : undefined,
          resolvedBy: req.user._id
        },
        { new: true }
      );

      if (!report) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Report not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      res.status(200).json({
        success: true,
        data: {
          report
        },
        message: 'Report status updated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Update report status error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default new ReportController(); 