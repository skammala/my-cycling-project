import axios from 'axios';

interface Coordinates {
  lat: number;
  lng: number;
}

interface DirectionsRequest {
  start: Coordinates;
  end: Coordinates;
  waypoints?: Coordinates[];
}

interface DirectionsResponse {
  type: string;
  features: Array<{
    type: string;
    properties: {
      summary: {
        distance: number;
        duration: number;
      };
    };
    geometry: {
      type: string;
      coordinates: number[][];
    };
  }>;
}

export class DirectionsService {
  private readonly baseUrl = 'https://api.openrouteservice.org/v2/directions/cycling-regular/geojson';
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.ORS_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('ORS_API_KEY is not defined in environment variables');
    }
  }

  async getDirections(request: DirectionsRequest): Promise<DirectionsResponse> {
    try {
      const coordinates = [
        [request.start.lng, request.start.lat],
        ...(request.waypoints?.map(wp => [wp.lng, wp.lat]) || []),
        [request.end.lng, request.end.lat]
      ];

      const response = await axios.post(
        this.baseUrl,
        {
          coordinates
        },
        {
          headers: {
            'Authorization': `${this.apiKey}`
          }
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`OpenRouteService API error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error(`Failed to get directions: ${error}`);
    }
  }
} 