import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  maskSensitive(value: unknown): unknown {
    if (typeof value !== 'string') return value;
    return value.replace(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|([0-9]{6,})|(token\s*[:=]\s*\S+)|(secret\s*[:=]\s*\S+)/gi, '[MASKED]');
  }
}

