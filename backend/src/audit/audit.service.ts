import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  private readonly patterns = [
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/gi, // email
    /\b\d{6,}\b/g, // long digit sequences (possible phone/id)
    /(token\s*[:=]\s*\S+)/gi,
    /(secret\s*[:=]\s*\S+)/gi,
    /(password\s*[:=]\s*\S+)/gi,
  ];

  maskSensitive(value: unknown): unknown {
    if (typeof value !== 'string') return value;
    let masked = value;
    for (const p of this.patterns) {
      masked = masked.replace(p, '[MASKED]');
    }
    return masked;
  }
}

