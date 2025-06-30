// Shared types for cycling app

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Obstacle {
  id: string;
  type: 'road_construction' | 'pothole' | 'debris' | 'flooding' | 'traffic_light' | 'other';
  coordinates: Coordinates;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  reportedAt: Date;
  status: 'active' | 'resolved' | 'pending';
  images?: string[];
}

export interface Route {
  id: string;
  name: string;
  startPoint: Coordinates;
  endPoint: Coordinates;
  waypoints: Coordinates[];
  distance: number; // in meters
  duration: number; // in seconds
  elevation: number; // in meters
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  surface: 'paved' | 'unpaved' | 'mixed';
  traffic: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: Date;
  isPublic: boolean;
}

export interface WeatherData {
  coordinates: Coordinates;
  temperature: number; // in Celsius
  humidity: number; // percentage
  windSpeed: number; // in km/h
  windDirection: number; // in degrees
  precipitation: number; // in mm
  visibility: number; // in km
  timestamp: Date;
}

export interface TrafficData {
  coordinates: Coordinates;
  congestionLevel: 'low' | 'medium' | 'high' | 'severe';
  averageSpeed: number; // in km/h
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  preferences: {
    preferredRouteTypes: string[];
    maxDistance: number; // in km
    avoidHighways: boolean;
    avoidUnpaved: boolean;
  };
  createdAt: Date;
  lastActive: Date;
} 