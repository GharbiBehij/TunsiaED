export class Notification {
  constructor(id, userId, title, description, type, iconType, color, read, createdAt, raw = {}) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.type = type;
    this.iconType = iconType;
    this.color = color;
    this.read = read;
    this.createdAt = createdAt;
    this.time = this._formatTime(createdAt);
    Object.assign(this, raw);
  }

  _formatTime(date) {
    if (!date) return '';
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  }
}

