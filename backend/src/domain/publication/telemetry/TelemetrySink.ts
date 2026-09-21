export interface TelemetryEvent {
  eventName: string;
  dimensions: Record<string, any>;
}

export interface TelemetrySink {
  incrementMetric(metricName: string, dimensions: Record<string, string>): void;
  recordEvent(event: TelemetryEvent): void;
  warn(message: string, context?: Record<string, any>): void;
}

export class NoOpTelemetrySink implements TelemetrySink {
  incrementMetric() {}
  recordEvent() {}
  warn() {}
}
