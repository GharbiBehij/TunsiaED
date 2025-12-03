# User & Actor Module Standardization

This document summarizes the standardized naming patterns and relationships across User and Actor modules (Admin, Instructor, Student).

## Standardization Completed

All User and Actor backend modules now follow consistent naming patterns with operation comments throughout the DAO → Repository → Service layers.

---

## Naming Pattern Standards

### User Module (Base Entity)

**DAO Layer Methods:**
```javascript
// Create a new user document in Firestore
async create(uid, data)

// Get a single user by UID from Firestore
async getByUid(uid)

// Update user fields in Firestore
async update(uid, updates)

// Delete a user document from Firestore
async delete(uid)

// Get all users with admin role from Firestore
async getAllAdmins()

// Get all users with instructor role from Firestore
async getAllInstructors()

// Get all users with student role from Firestore
async getAllStudents()
```

**Repository Layer Methods:**
```javascript
// Create user profile via DAO
async onboard(uid, data)

// Find a user by UID via DAO
async findByUid(uid)

// Update user profile via DAO
async updateProfile(uid, updates)

// Delete user profile via DAO
async deleteProfile(uid)

// Get all admin users via DAO
async getAdmins()

// Get all instructor users via DAO
async getInstructors()

// Get all student users via DAO
async getStudents()
```

**Service Layer Methods:**
```javascript
// Create new user profile with role assignment (public - during registration)
async onboardUser(user, parsedData)

// Get user profile by UID (admin/self only)
async getProfile(uid)

// Update user profile (admin/self only, role changes admin only)
async updateProfile(targetUserId, actor, updates)

// Delete user profile (admin/self only)
async deleteProfile(targetUserId, actor)
```

---

### Admin Module (Actor - Analytics & Management)

**DAO Layer Methods:**
```javascript
// Get total revenue from completed transactions in Firestore
async getTotalRevenue()

// Get count of new users in last 30 days from Firestore
async getNewUsersCount()

// Get count of active/published courses from Firestore
async getActiveCoursesCount()

// Get count of active subscriptions from Firestore
async getActiveSubscriptionsCount()

// Get monthly revenue data (last 6 months) from Firestore
async getMonthlyRevenue()

// Get recent activity (enrollments and certificates) from Firestore
async getRecentActivity(limit = 10)

// Get course performance data with enrollment stats from Firestore
async getCoursePerformance()

// Get user engagement metrics (active users) from Firestore
async getUserEngagement()

// Helper method to format relative time
_formatRelativeTime(date)
```

**Repository Layer Methods:**
```javascript
// Aggregate dashboard statistics via DAO
async getStats()

// Get revenue data with growth calculation via DAO
async getRevenue()

// Get recent platform activity via DAO
async getRecentActivity(limit = 10)

// Get course performance metrics via DAO
async getCoursePerformance()

// Get user engagement metrics via DAO
async getUserEngagement()
```

**Service Layer Methods:**
```javascript
// Get dashboard statistics (admin only)
async getStats(user)

// Get revenue analytics (admin only)
async getRevenue(user)

// Get recent platform activity (admin only)
async getRecentActivity(user, limit = 10)

// Get course performance metrics (admin only)
async getCoursePerformance(user)

// Get user engagement metrics (admin only)
async getUserEngagement(user)
```

---

### Instructor Module (Actor - Content Creation)

**Service Layer Methods:**
```javascript
// Get instructor's courses (admin/instructor only)
async getCourses(user)

// Get instructor's enrolled students (admin/instructor only)
async getStudents(user)

// Get instructor's revenue data (admin/instructor only)
async getRevenue(user)

// Get instructor's course performance metrics (admin/instructor only)
async getCoursePerformance(user)

// Get instructor's dashboard statistics (admin/instructor only)
async getStats(user)

// Get instructor's revenue trends over time (admin/instructor only)
async getRevenueTrends(user)

// Get instructor's recent activity (admin/instructor only)
async getRecentActivity(user, limit = 10)
```

---

### Student Module (Actor - Learning)

**Service Layer Methods:**
```javascript
// Get student's course enrollments (admin/student only)
async getEnrollments(user)

// Get student's learning progress (admin/student only)
async getProgress(user)

// Get student's earned certificates (admin/student only)
async getCertificates(user)

// Get student's dashboard statistics (admin/student only)
async getStats(user)

// Get student's enrolled courses (admin/student only)
async getCourses(user)

// Update student's course progress (admin/student only)
async updateProgress(user, enrollmentId, progress)

// Mark a lesson as completed and update progress (admin/student only)
async completeLesson(user, enrollmentId, lessonId)
```

---

## Architecture Patterns

### User Module Architecture

The User module serves as the **base entity** for all actors in the system:

```
Authentication (Firebase Auth)
         ↓
    User Profile (Firestore User collection)
         ↓
    Role Flags: { isAdmin, isInstructor, isStudent }
         ↓
    Actor-Specific Behavior (Admin/Instructor/Student services)
```

**Key Design Decisions:**
1. **Role Storage:** Boolean flags (`isAdmin`, `isInstructor`, `isStudent`) instead of single string role
2. **Multi-Role Support:** Users can have multiple roles simultaneously
3. **UID as Primary Key:** Firebase Auth UID used as Firestore document ID
4. **Permission Layer:** Centralized `SharedPermission.js` with predicate functions

---

### Actor Module Architecture

Actor modules (Admin, Instructor, Student) are **behavior modules** that:
- Do NOT have their own Firestore collections
- Aggregate data from multiple collections
- Provide role-specific views and operations
- Use User module for identity and permissions

**Admin Actor:**
- **Purpose:** Platform analytics, management, oversight
- **Data Sources:** Transactions, Courses, Enrollments, Certificates, Payments
- **Operations:** Read-only analytics, aggregations, performance metrics

**Instructor Actor:**
- **Purpose:** Course creation, student management, revenue tracking
- **Data Sources:** Courses (owned), Enrollments (for owned courses), Transactions (for owned courses)
- **Operations:** Course CRUD, student lists, revenue analytics

**Student Actor:**
- **Purpose:** Learning, progress tracking, certificate collection
- **Data Sources:** Enrollments (own), Certificates (own), Course progress
- **Operations:** Enrollment management, lesson completion, progress updates

---

## Firestore Collection Structure

### User Collection
```javascript
{
  uid: '<Firebase Auth UID>',  // Document ID
  email: 'user@example.com',
  name: 'John Doe',
  phone: '+1234567890',
  
  // Role flags (boolean)
  isAdmin: false,
  isInstructor: true,
  isStudent: false,
  
  // Profile data
  birthDate: '1990-01-01',
  birthPlace: 'City, Country',
  level: 'beginner|intermediate|advanced',
  bio: 'User biography',
  avatar: 'https://...',
  profileImage: 'https://...',
  
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Role Assignment Logic:**
```javascript
// During onboarding
const isAdmin = email === "admin@tunisiaed.com";
const roleFlags = {
  isInstructor: parsedData.role === 'instructor',
  isStudent: parsedData.role === 'student' || !parsedData.role,
};
```

---

## Permission System Integration

All User and Actor modules use centralized permission predicates from `SharedPermission.js`:

### User Module Permissions

**UserPermission.js:**
```javascript
// Read/update/delete own profile or admin access
update: (actor, targetUserId) => isAdminOrSelf(actor, targetUserId)
delete: (actor, targetUserId) => isAdminOrSelf(actor, targetUserId)

// Only admins can change roles
updateRole: (actor) => isAdmin(actor)
```

### Actor Module Permissions

**AdminPermission.js:**
```javascript
// All admin operations require admin role
getStats: (user) => isAdmin(user)
getRevenue: (user) => isAdmin(user)
getActivity: (user) => isAdmin(user)
getCoursePerformance: (user) => isAdmin(user)
getUserEngagement: (user) => isAdmin(user)
```

**InstructorPermission.js:**
```javascript
// Admin or instructor can access
getStats: (user) => isAdmin(user) || isInstructor(user)
getCourses: (user) => isAdmin(user) || isInstructor(user)
getStudents: (user) => isAdmin(user) || isInstructor(user)
getRevenue: (user) => isAdmin(user) || isInstructor(user)
getActivity: (user) => isAdmin(user) || isInstructor(user)
```

**StudentPermission.js:**
```javascript
// Admin or student can access
getStats: (user) => isAdmin(user) || isStudent(user)
getCourses: (user) => isAdmin(user) || isStudent(user)
getEnrollments: (user) => isAdmin(user) || isStudent(user)
getProgress: (user) => isAdmin(user) || isStudent(user)
getCertificates: (user) => isAdmin(user) || isStudent(user)
updateProgress: (user) => isAdmin(user) || isStudent(user)
```

---

## Data Flow Patterns

### User Onboarding Flow
```
1. Firebase Auth creates user (uid)
2. Controller receives req.user from auth middleware
3. Service applies business rules (admin email check)
4. Repository calls DAO
5. DAO creates User document with role flags
6. Response includes complete user profile
```

### Admin Analytics Flow
```
1. Controller validates admin permission
2. Service checks AdminPermission
3. Repository aggregates from multiple DAOs
4. AdminDao queries multiple collections
5. Repository calculates derived metrics (growth %)
6. Service returns formatted data
7. Controller sends JSON response
```

### Instructor Dashboard Flow
```
1. Controller validates instructor permission
2. Service checks InstructorPermission
3. Repository filters by instructorId
4. DAO queries only instructor's resources
5. Service returns instructor-scoped data
```

### Student Learning Flow
```
1. Controller validates student permission
2. Service checks StudentPermission
3. Repository filters by studentId (user.uid)
4. DAO queries only student's enrollments
5. Service calculates progress, updates completion
6. Auto-triggers certificate issuance at 100%
```

---

## Comment Format Standards

Every method follows this comment format:

**DAO Layer:**
```javascript
// <Action> <entity/data> <qualifier> from Firestore
// Examples:
// Get total revenue from completed transactions in Firestore
// Create a new user document in Firestore
```

**Repository Layer:**
```javascript
// <Action> <entity/data> <qualifier> via DAO
// Examples:
// Aggregate dashboard statistics via DAO
// Find a user by UID via DAO
```

**Service Layer:**
```javascript
// <Action> <entity/data> <qualifier> (<access level>)
// Examples:
// Get dashboard statistics (admin only)
// Update user profile (admin/self only, role changes admin only)
```

**Controller Layer:**
```javascript
// <Action> <entity/data> <qualifier>
// Examples:
// Create new user profile during registration
// Get authenticated user's profile
```

---

## Key Differences from Course Modules

| Aspect | Course Modules | User/Actor Modules |
|--------|---------------|-------------------|
| **Collections** | Each module has Firestore collection | Only User has collection, actors aggregate |
| **Entities** | Independent entities with IDs | User is base, actors are behaviors |
| **Relationships** | Parent-child (Course → Chapter) | Single User → Multiple actor roles |
| **DAO Operations** | CRUD on specific collection | User: CRUD; Actors: Multi-collection queries |
| **Repository** | Entity mapping | User: Entity; Actors: Aggregations |
| **Service** | Permission + CRUD | User: CRUD; Actors: Analytics/Views |
| **ID Field** | Auto-generated IDs | Firebase Auth UID (pre-existing) |

---

## Actor Data Aggregation Patterns

### Admin DAO Aggregation Pattern
```javascript
// Multiple collection queries + aggregation
async getStats() {
  const [revenue, users, courses, subs] = await Promise.all([
    db.collection('Transactions').where('status', '==', 'completed').get(),
    db.collection('User').where('createdAt', '>=', thirtyDaysAgo).get(),
    db.collection('Courses').where('isPublished', '==', true).get(),
    db.collection('Payments').where('status', '==', 'completed').get()
  ]);
  
  // Calculate metrics from snapshots
  return { totalRevenue, newUsers, activeCourses, activeSubscriptions };
}
```

### Instructor Repository Scoping Pattern
```javascript
// Filter all queries by instructorId
async getInstructorCourses(instructorId) {
  const courses = await db.collection('Courses')
    .where('instructorId', '==', instructorId)
    .get();
    
  return courses.docs.map(doc => doc.data());
}
```

### Student Repository Scoping Pattern
```javascript
// Filter all queries by userId (studentId)
async getStudentEnrollments(userId) {
  const enrollments = await db.collection('Enrollments')
    .where('userId', '==', userId)
    .get();
    
  return enrollments.docs.map(doc => doc.data());
}
```

---

## Controller Layer Patterns

### User Controller Pattern
```javascript
// Standard RESTful CRUD with Zod validation
export const updateProfile = async (req, res) => {
  // 1. Validate input
  const parsed = UpdateUserSchema.safeParse(req.body);
  
  // 2. Get authenticated user
  const userId = req.user.uid;
  const user = await userRepository.findByUid(userId);
  
  // 3. Call service with permission context
  const updated = await userService.updateProfile(userId, user, parsed.data);
  
  // 4. Handle errors
  if (err.message === 'Unauthorized') {
    return res.status(403).json({ error: err.message });
  }
  
  // 5. Return result
  res.json({ message: "Profile updated successfully", profile: updated });
};
```

### Actor Controller Pattern
```javascript
// Dashboard data retrieval with permission check in service
export const getAdminStats = async (req, res) => {
  // 1. Get authenticated user
  const user = await userRepository.findByUid(req.user.uid);
  
  // 2. Call service (permission check inside)
  const stats = await adminService.getStats(user);
  
  // 3. Return result
  res.json(stats);
};
```

---

## Validation Schemas

### OnboardUserSchema (Zod)
```javascript
{
  email: z.string().email(),         // Required
  name: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['admin', 'instructor', 'student']).optional(),
  birthDate: z.string().optional(),
  birthPlace: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  bio: z.string().optional(),
}
```

### UpdateUserSchema (Zod)
```javascript
{
  name: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['admin', 'instructor', 'student']).optional(),
  birthDate: z.string().optional(),
  birthPlace: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  profileImage: z.string().url().optional(),
  isAdmin: z.boolean().optional(),
  isInstructor: z.boolean().optional(),
  isStudent: z.boolean().optional(),
}
```

---

## Summary of Changes Applied

### User Module
✅ Added 7 operation comments to DAO methods
✅ Added 7 operation comments to Repository methods
✅ Added 4 operation comments to Service methods
✅ Added 4 operation comments to Controller methods
✅ **Total: 22 comments added**

### Admin Module
✅ Added 8 operation comments to DAO methods
✅ Added 5 operation comments to Repository methods
✅ Added 5 operation comments to Service methods
✅ **Total: 18 comments added**

### Instructor Module
✅ Added 7 operation comments to Service methods
✅ **Total: 7 comments added**

### Student Module
✅ Added 7 operation comments to Service methods
✅ **Total: 7 comments added**

---

## Comparison with Course Composition Modules

| Feature | Course Modules | User/Actor Modules |
|---------|---------------|-------------------|
| **Total Comments Added** | 102+ | 54+ |
| **Modules Standardized** | 5 (Course, Certificate, Chapter, Lesson, Quiz) | 4 (User, Admin, Instructor, Student) |
| **Layers Affected** | DAO → Repository → Service → Controller | DAO → Repository → Service (+ Controller for User) |
| **Naming Pattern** | `get/find/create/update/delete` | Same + actor-specific methods |
| **Permission Model** | Resource-based (course ownership) | Role-based (admin/instructor/student) |
| **Data Model** | Independent collections | User base + actor aggregations |

---

## Quick Reference Cheat Sheet

| Layer | User Module | Actor Module (Admin/Instructor/Student) |
|-------|------------|----------------------------------------|
| **DAO** | CRUD on User collection | Aggregate queries across collections |
| **Repository** | Wrapper for User DAO | Aggregations + calculations |
| **Service** | Permission + CRUD | Permission + role-specific views |
| **Controller** | RESTful CRUD endpoints | Dashboard data endpoints |

**Permission Flow:**
```
Controller → Get user from DB → Service → Permission Check → Repository → DAO(s) → Firestore
```

**Actor Permission Pattern:**
```
if (!<Actor>Permission.<operation>(user)) throw new Error('Unauthorized');
```

---

## Testing Considerations

1. **User Module:**
   - Test role assignment logic (admin email, default student)
   - Test multi-role support (user can be instructor AND student)
   - Test permission checks (admin/self access)
   - Test role update restrictions (admin only)

2. **Admin Module:**
   - Test aggregation accuracy (revenue, user counts)
   - Test date range filters (30 days, 6 months)
   - Test permission enforcement (admin only)
   - Test error handling for missing collections

3. **Instructor Module:**
   - Test data scoping (only instructor's resources)
   - Test permission checks (admin OR instructor)
   - Test revenue calculations (only instructor's earnings)

4. **Student Module:**
   - Test data scoping (only student's enrollments)
   - Test progress calculations (lesson completion)
   - Test certificate auto-issuance (100% completion)
   - Test permission checks (admin OR student)

---

**Document Created:** December 2, 2025
**Status:** ✅ Standardization Complete
**Affected Modules:** User, Admin, Instructor, Student
**Total Comments Added:** 54+
**Total Files Updated:** 10+ (DAO/Repository/Service/Controller across modules)
