import auth from '../../../config/firebase'
import { isInstructor,isAdmin,isStudent } from '../../../utils/SharedPermission'

export class UserRoleService {
  static async setAdmin(uid) {
    await auth.setCustomUserClaims(uid,{
        isAdmin: true,
        isInstructor:false,
        isStudent:false,
    })};
    static async setInstructor(uid) {
        await auth.setCustomUserClaims(uid,{
            isAdmin: false,
            isInstructor:true,
            isStudent:false,
        })};
    static async setStudent(uid) {
            await auth.setCustomUserClaims(uid,{
                isAdmin: false,
                isInstructor:false,
                isStudent:true,
            })};
    static async getRoles(uid) {
                const user = await auth.getUser(uid);
                return {
                  isAdmin: user.customClaims?.isAdmin || false,
                  isInstructor: user.customClaims?.isInstructor || false,
                  isStudent: user.customClaims?.isStudent || false,
                }
};
}