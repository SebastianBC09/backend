import { Item } from './item.entity';
import { ItemType } from '../enums/item-type.enum';

export class Event extends Item {
  eventDate: Date;
  eventTime?: string;
  location: string;
  venue?: string;
  artist?: string;
  genre?: string;
  duration?: number; // in minutes
  ageRestriction?: number;
  seatType?: string; // e.g., "VIP", "General Admission", "Reserved"
  section?: string;
  row?: string;
  seatNumber?: string;

  constructor(partial: Partial<Event>) {
    super({ ...partial, type: ItemType.EVENT });
    Object.assign(this, partial);
  }

  validate(): void {
    super.validate();

    // Event-specific validations
    if (!this.eventDate) {
      throw new Error('Event date is required');
    }

    if (!this.location || this.location.trim().length === 0) {
      throw new Error('Event location is required');
    }

    if (this.eventDate < new Date()) {
      throw new Error('Event date cannot be in the past');
    }

    if (this.duration && this.duration <= 0) {
      throw new Error('Event duration must be positive');
    }

    if (this.ageRestriction && this.ageRestriction < 0) {
      throw new Error('Age restriction cannot be negative');
    }
  }

  isUpcoming(): boolean {
    return this.eventDate > new Date();
  }

  isToday(): boolean {
    const today = new Date();
    const eventDate = new Date(this.eventDate);
    return (
      today.getFullYear() === eventDate.getFullYear() &&
      today.getMonth() === eventDate.getMonth() &&
      today.getDate() === eventDate.getDate()
    );
  }

  getDaysUntilEvent(): number {
    const now = new Date();
    const event = new Date(this.eventDate);
    const diffTime = event.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDisplayName(): string {
    const details: string[] = [];
    if (this.artist) details.push(this.artist);
    details.push(this.name);
    details.push(`in ${this.location}`);
    return details.join(' - ');
  }

  getFormattedDate(): string {
    return this.eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
