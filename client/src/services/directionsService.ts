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

const API_BASE_URL = 'http://localhost:3001';

export const getDirections = async (request: DirectionsRequest): Promise<DirectionsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/directions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching directions:', error);
    throw error;
  }
};

// Hardcoded test coordinates (New York City area)
export const getTestDirections = async (): Promise<DirectionsResponse> => {
  const testRequest: DirectionsRequest = {
    start: { lat: 40.7128, lng: -74.0060 }, // Lower Manhattan
    end: { lat: 40.7589, lng: -73.9851 },   // Midtown Manhattan
  };

  return getDirections(testRequest);
}; 