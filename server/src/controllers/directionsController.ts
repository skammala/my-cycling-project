import { Request, Response } from 'express';
import { DirectionsService } from '../services/directionsService';

export class DirectionsController {
  private directionsService: DirectionsService;

  constructor() {
    this.directionsService = new DirectionsService();
  }

  async getDirections(req: Request, res: Response): Promise<void> {
    try {
      const { start, end, waypoints } = req.body;

      // Validate required fields
      if (!start || !end) {
        res.status(400).json({
          error: 'Missing required fields: start and end coordinates are required'
        });
        return;
      }

      // Validate coordinate format
      if (!start.lat || !start.lng || !end.lat || !end.lng) {
        res.status(400).json({
          error: 'Invalid coordinate format. Each coordinate must have lat and lng properties'
        });
        return;
      }

      // Validate coordinate ranges
      if (start.lat < -90 || start.lat > 90 || end.lat < -90 || end.lat > 90) {
        res.status(400).json({
          error: 'Latitude must be between -90 and 90 degrees'
        });
        return;
      }

      if (start.lng < -180 || start.lng > 180 || end.lng < -180 || end.lng > 180) {
        res.status(400).json({
          error: 'Longitude must be between -180 and 180 degrees'
        });
        return;
      }

      const directions = await this.directionsService.getDirections({
        start,
        end,
        waypoints
      });

      res.json(directions);
    } catch (error) {
      console.error('Error getting directions:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
} 