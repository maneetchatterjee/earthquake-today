export type AlertType = 'earthquake' | 'aqi' | 'wildfire' | 'uv';
export type AlertSeverity = 'red' | 'orange' | 'yellow';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
}

export interface AlertData {
  maxMagnitude?: number;
  aqi?: number;
  uvIndex?: number;
  wildfireCount?: number;
}

const THRESHOLDS = {
  earthquakeMagRed: 7.0,
  earthquakeMagOrange: 6.0,
  aqiRed: 200,
  aqiOrange: 150,
  uvRed: 11,
  uvOrange: 8,
  wildfireRed: 100,
  wildfireOrange: 50,
};

export function evaluateAlerts(data: AlertData): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();

  if (data.maxMagnitude !== undefined) {
    if (data.maxMagnitude >= THRESHOLDS.earthquakeMagRed) {
      alerts.push({
        id: `earthquake-${now.getTime()}`,
        type: 'earthquake',
        severity: 'red',
        message: `Major earthquake detected: M${data.maxMagnitude.toFixed(1)}`,
        timestamp: now,
      });
    } else if (data.maxMagnitude >= THRESHOLDS.earthquakeMagOrange) {
      alerts.push({
        id: `earthquake-${now.getTime()}`,
        type: 'earthquake',
        severity: 'orange',
        message: `Strong earthquake detected: M${data.maxMagnitude.toFixed(1)}`,
        timestamp: now,
      });
    }
  }

  if (data.aqi !== undefined) {
    if (data.aqi >= THRESHOLDS.aqiRed) {
      alerts.push({
        id: `aqi-${now.getTime()}`,
        type: 'aqi',
        severity: 'red',
        message: `Very unhealthy air quality: AQI ${data.aqi}`,
        timestamp: now,
      });
    } else if (data.aqi >= THRESHOLDS.aqiOrange) {
      alerts.push({
        id: `aqi-${now.getTime()}`,
        type: 'aqi',
        severity: 'orange',
        message: `Unhealthy air quality: AQI ${data.aqi}`,
        timestamp: now,
      });
    }
  }

  if (data.uvIndex !== undefined) {
    if (data.uvIndex >= THRESHOLDS.uvRed) {
      alerts.push({
        id: `uv-${now.getTime()}`,
        type: 'uv',
        severity: 'red',
        message: `Extreme UV index: ${data.uvIndex}`,
        timestamp: now,
      });
    } else if (data.uvIndex >= THRESHOLDS.uvOrange) {
      alerts.push({
        id: `uv-${now.getTime()}`,
        type: 'uv',
        severity: 'orange',
        message: `Very high UV index: ${data.uvIndex}`,
        timestamp: now,
      });
    }
  }

  if (data.wildfireCount !== undefined) {
    if (data.wildfireCount >= THRESHOLDS.wildfireRed) {
      alerts.push({
        id: `wildfire-${now.getTime()}`,
        type: 'wildfire',
        severity: 'red',
        message: `Critical wildfire activity: ${data.wildfireCount} active fires`,
        timestamp: now,
      });
    } else if (data.wildfireCount >= THRESHOLDS.wildfireOrange) {
      alerts.push({
        id: `wildfire-${now.getTime()}`,
        type: 'wildfire',
        severity: 'orange',
        message: `High wildfire activity: ${data.wildfireCount} active fires`,
        timestamp: now,
      });
    }
  }

  return alerts;
}
