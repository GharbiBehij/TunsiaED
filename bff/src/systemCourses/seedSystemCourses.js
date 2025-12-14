// Seeder for system courses
// Inserts hardcoded courses into Firestore only if they don't exist
// Also creates the system instructor user profile

import { db } from '../config/firebase.js';
import { SYSTEM_COURSES, SYSTEM_INSTRUCTOR_PROFILE, SYSTEM_INSTRUCTOR_UID } from './systemCourses.data.js';
import { SYSTEM_CHAPTERS } from './systemChapters.data.js';
import { SYSTEM_LESSONS } from './systemLessons.data.js';
import { validateAllSystemCourses } from './validateSystemCourses.js';
import { seedSubscriptionPlans } from './seedSubscriptionPlans.js';

const COLLECTIONS = {
  USERS: 'User',
  COURSES: 'Courses',
  CHAPTERS: 'Chapters',
  LESSONS: 'Lessons',
};

/**
 * Seed system instructor profile into users collection
 */
async function seedSystemInstructor() {
  try {
    const userRef = db.collection(COLLECTIONS.USERS).doc(SYSTEM_INSTRUCTOR_UID);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set(SYSTEM_INSTRUCTOR_PROFILE);
      console.log('✅ System instructor profile created');
    } else {
      console.log('ℹ️  System instructor profile already exists');
    }
  } catch (error) {
    console.error('❌ Failed to seed system instructor:', error.message);
    throw error;
  }
}

/**
 * Seed system courses into Firestore
 * Only inserts courses that don't already exist (by courseId)
 */
async function seedSystemCourses() {
  try {
    // Validate all courses first
    const validation = validateAllSystemCourses(SYSTEM_COURSES);
    if (!validation.valid) {
      console.error('❌ System courses validation failed:');
      console.error(JSON.stringify(validation.errors, null, 2));
      throw new Error('Invalid system courses data');
    }

    console.log('✅ System courses validation passed');

    // Seed each course
    let insertedCount = 0;
    let existingCount = 0;

    for (const course of SYSTEM_COURSES) {
      const courseRef = db.collection(COLLECTIONS.COURSES).doc(course.courseId);
      const courseDoc = await courseRef.get();

      if (!courseDoc.exists) {
        await courseRef.set({
          ...course,
          enrolledCount: 0,
          rating: 0,
          createdAt: course.createdAt || new Date(),
          updatedAt: course.updatedAt || new Date(),
        });
        insertedCount++;
        console.log(`  ✓ Inserted: ${course.title}`);
      } else {
        existingCount++;
        console.log(`  ⊙ Skipped (exists): ${course.title}`);
      }
    }

    console.log(`\n✅ System courses seeding complete:`);
    console.log(`   - Inserted: ${insertedCount}`);
    console.log(`   - Already existed: ${existingCount}`);
    console.log(`   - Total system courses: ${SYSTEM_COURSES.length}`);

    return { insertedCount, existingCount };
  } catch (error) {
    console.error('❌ Failed to seed system courses:', error.message);
    throw error;
  }
}

/**
 * Seed system chapters into Firestore
 * Only inserts chapters that don't already exist (by chapterId)
 */
async function seedSystemChapters() {
  try {
    let insertedCount = 0;
    let existingCount = 0;

    for (const courseId in SYSTEM_CHAPTERS) {
      const chapters = SYSTEM_CHAPTERS[courseId];
      
      for (const chapter of chapters) {
        const chapterRef = db.collection(COLLECTIONS.CHAPTERS).doc(chapter.chapterId);
        const chapterDoc = await chapterRef.get();

        if (!chapterDoc.exists) {
          await chapterRef.set({
            ...chapter,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          insertedCount++;
        } else {
          existingCount++;
        }
      }
    }

    console.log(`\n✅ System chapters seeding complete:`);
    console.log(`   - Inserted: ${insertedCount}`);
    console.log(`   - Already existed: ${existingCount}`);

    return { insertedCount, existingCount };
  } catch (error) {
    console.error('❌ Failed to seed system chapters:', error.message);
    throw error;
  }
}

/**
 * Seed system lessons into Firestore
 * Only inserts lessons that don't already exist (by lessonId)
 */
async function seedSystemLessons() {
  try {
    let insertedCount = 0;
    let existingCount = 0;

    for (const chapterId in SYSTEM_LESSONS) {
      const lessons = SYSTEM_LESSONS[chapterId];
      
      for (const lesson of lessons) {
        const lessonRef = db.collection(COLLECTIONS.LESSONS).doc(lesson.lessonId);
        const lessonDoc = await lessonRef.get();

        if (!lessonDoc.exists) {
          await lessonRef.set({
            ...lesson,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          insertedCount++;
        } else {
          existingCount++;
        }
      }
    }

    console.log(`\n✅ System lessons seeding complete:`);
    console.log(`   - Inserted: ${insertedCount}`);
    console.log(`   - Already existed: ${existingCount}`);

    return { insertedCount, existingCount };
  } catch (error) {
    console.error('❌ Failed to seed system lessons:', error.message);
    throw error;
  }
}

/**
 * Main seeder function
 * Call this on server startup or manually via script
 */
export async function seedSystemData() {
  console.log('🌱 Starting system data seeding...\n');

  try {
    // Step 1: Seed system instructor
    await seedSystemInstructor();

    // Step 2: Seed system courses
    await seedSystemCourses();

    // Step 3: Seed system chapters
    await seedSystemChapters();

    // Step 4: Seed system lessons
    await seedSystemLessons();

    // Step 5: Seed subscription plans
    await seedSubscriptionPlans();

    console.log('\n🎉 System data seeding complete!');
    return { success: true };
  } catch (error) {
    console.error('\n❌ System data seeding failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Allow running as standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSystemData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
