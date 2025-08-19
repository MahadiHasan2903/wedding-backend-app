export enum ReportType {
  VIOLENT = 'violent',
  SCAM = 'scam',
  SPAM = 'spam',
  HARASSMENT = 'harassment',
  INAPPROPRIATE = 'inappropriate',
  OTHER = 'other',
}

export enum ReportStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
}

export enum ReportAction {
  PENDING = 'pending',
  LOOKS_FINE = 'looks_fine',
  BANNED_USER = 'banned_user',
  WARNED_USER = 'warned_user',
}
