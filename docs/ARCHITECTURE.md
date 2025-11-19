# E-Platform Architecture

## Overview

This document describes the architecture of the E-Platform, a modular monolith e-learning system.

## Architecture Pattern: Modular Monolith

A modular monolith combines the benefits of monolithic and microservices architectures:
- Single deployable unit (simpler operations)
- Clear module boundaries (easier to extract to microservices later)
- Shared database and infrastructure

## System Components

### 1. Frontend Layer

#### Mobile Application (Flutter)
- **Technology**: Flutter 3.35.6, Dart
- **Platforms**: iOS, Android
- **State Management**: Provider/Bloc (to be implemented)
- **Features**: 
  - User authentication
  - Course browsing and enrollment
  - Video playback
  - Offline content access
  - Push notifications

#### Web Application (React)
- **Technology**: React.js, TypeScript
- **Features**: 
  - Full course management
  - Admin dashboard
  - Instructor portal
  - Student learning interface

### 2. Backend For Frontend (BFF) - API Gateway

#### Express.js Server
- **Purpose**: Acts as both BFF and API Gateway - aggregates backend services for frontend consumption
- **Technology**: Node.js, Express, TypeScript
- **Responsibilities**:
  - API composition and orchestration
  - Business logic execution
  - Firebase Admin SDK operations
  - Request routing and rate limiting
  - CORS handling
  - Authentication middleware
  - Response transformation for frontends
  - Request/response logging

### 3. Backend Services (Firebase)

#### Firebase Authentication
- User registration and login
- Social authentication providers
- Custom claims for roles (admin, instructor, student)
- Email verification and password reset

#### Cloud Firestore
- NoSQL document database
- Collections:
  - `users` - User profiles and preferences
  - `courses` - Course content and metadata
  - `enrollments` - Student-course relationships
  - `lessons` - Lesson content within courses
  - `progress` - Student learning progress
  - `assessments` - Quizzes and assignments
  - `certificates` - Completion certificates

#### Firebase Storage
- Video content
- Course materials (PDFs, documents)
- User uploads
- Profile images

#### Firebase Analytics
- User behavior tracking
- Course engagement metrics
- Conversion funnels

### 4. Caching Layer (Redis) - Optional

- Session storage
- API response caching
- Real-time data caching
- Rate limiting counters

## Data Flow

### Typical Request Flow

```
Mobile/Web Client
    ↓
BFF Server / API Gateway (port 3001)
    ↓
Firebase Services (Authentication, Firestore, Storage)
    ↓
Response back to client
```

### Authentication Flow

```
1. User submits credentials to Frontend
2. Frontend → BFF (API Gateway)
3. BFF validates with Firebase Auth
4. Firebase returns ID token
5. BFF creates session (optional: Redis)
6. Session token returned to Frontend
7. Frontend includes token in subsequent requests
```

## Security

### Authentication & Authorization
- JWT-based authentication via Firebase
- Role-based access control (RBAC)
- Custom claims for fine-grained permissions
- Firestore security rules enforce data access

### API Security
- HTTPS in production
- CORS configuration in BFF
- Rate limiting middleware in BFF
- Input validation and sanitization
- SQL injection prevention (NoSQL context)
- Authentication middleware

## Scalability Considerations

### Current Architecture
- Vertical scaling (increase server resources)
- Firebase automatically scales
- BFF handles routing and load balancing
- Redis can be clustered (optional)

### Future Migration Path
- Extract modules into microservices
- Add dedicated API Gateway if needed (Kong, AWS API Gateway, etc.)
- Event-driven architecture with pub/sub
- Separate databases per service

## Module Boundaries

### Core Modules (Logical Separation)

1. **User Management Module**
   - Authentication
   - Profile management
   - Role assignment

2. **Course Module**
   - Course CRUD operations
   - Curriculum design
   - Content management

3. **Enrollment Module**
   - Course enrollment
   - Access control
   - Progress tracking

4. **Assessment Module**
   - Quizzes and tests
   - Grading
   - Feedback

5. **Analytics Module**
   - Reporting
   - Metrics collection
   - Business intelligence

## Technology Stack Summary

| Component | Technology |
|-----------|-----------|
| Mobile | Flutter 3.35.6 |
| Web | React.js + TypeScript |
| BFF / API Gateway | Express.js + TypeScript |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| Auth | Firebase Authentication |
| Analytics | Firebase Analytics |
| Cache | Redis 7 (optional) |
| Container | Docker |

## Development vs Production

### Development
- Docker Compose for local services (optional)
- Firebase Emulators (optional)
- BFF running locally on port 3001
- Debug logging enabled

### Production
- BFF deployed as API Gateway
- Firebase production project
- Redis cluster (optional)
- CDN for static assets
- Monitoring and alerting
- Load balancer in front of BFF (if scaling horizontally)
