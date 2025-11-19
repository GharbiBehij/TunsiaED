// mapper/User.mapper.js
import { User } from '../../User/model/entity/User.entity.js';

export class UserMapper {
  static toResponse(entity, token) {
    return {
      user: {
        userId: entity.UserId,
        email: entity.email,
        name: entity.name,
        photoURL: entity.photoURL,
        role: entity.role,
        createdAt: entity.createdAt.toISOString(),
      },
      token,
    };
  }

  static toEntity(data) {
    return new User(
      data.userId,
      data.email,
      data.name,
      data.photoURL,
      data.role,
      new Date(data.createdAt),
      data.hashedPassword
    );
  }
}