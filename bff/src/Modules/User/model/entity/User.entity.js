// src/modules/User/entity/User.entity.js
export class User {
  constructor(userId, email, name, role, createdAt, hashedPassword, phoneNumber) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.role = role;
    this.createdAt = createdAt;
    this.hashedPassword = hashedPassword;
    this.phoneNumber = phoneNumber;
  }
}