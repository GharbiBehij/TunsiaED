/**
 * Permission checks for Course operations
 */
import { isAdmin, isAdminOrCourseOwner, isInstructor } from '../../../utils/SharedPermission.js';

export const CoursePermission = {
  create: (user) => 
    isAdmin(user) || isInstructor(user),
  update: (user,course) => 
    isAdminOrCourseOwner(user,course),
  delete:(user,course) => 
    isAdminOrCourseOwner(user,course),
  read:() => 
    true ,
 }

