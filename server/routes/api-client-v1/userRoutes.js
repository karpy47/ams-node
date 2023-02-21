const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const userController = require('../../controllers/userController')

/**
 * @openapi
 * /users:
 *   get:
 *     description: Return list of users, scoped by authorization
 *     responses:
 *       200:
 *         description: Users returned
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error (read all failed)
 */
router.get('/', userController.readAll)

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     description: Return one user, if allowed by authorization
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: User returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Permission not granted
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal error (read failed)
 */
router.get('/:userId', userController.read)

/**
 * @openapi
 * /users:
 *   post:
 *     description: Create a new user in own usergroup or global depending on authorization
 *     requestBody:
 *       $ref: '#/components/requestBodies/UserBody'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Parameter validation failed
 *       403:
 *         description: Permission not granted / Insufficient role
 *       422:
 *         description: Validation of data failed
 *       500:
 *         description: Internal error (create failed)
 */
router.post('/', [
  body('email')
    .exists().withMessage('required').bail()
    .isEmail().withMessage('not an email'),
  body('password')
    .exists().withMessage('required').bail()
    .isLength({ min: 8 }).withMessage('minimum length is 8 characters'),
  body('role', 'required').exists(),
  body('userGroupId')
    .exists().withMessage('required').bail()
    .isNumeric().withMessage('must be numeric')
], userController.create)
/**
 * @openapi
 * /users/{userId}:
 *   put:
 *     description: Update a user in own usergroup or global depending on authorization
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     requestBody:
 *       $ref: '#/components/requestBodies/UserBody'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Permission not granted / Insufficient role
 *       404:
 *         description: User not found
 *       422:
 *         description: Validation of data failed
 *       500:
 *         description: Internal error (update failed)
 */
router.put('/:userId', [
  body('email').isEmail().withMessage('not an email'),
  body('password').isLength({ min: 8 }).optional({ nullable: true }).withMessage('minimum length is 8 characters'),
  body('userGroupId').isNumeric().withMessage('must be numeric')
], userController.update)

/**
 * @openapi
 * /users/{userId}:
 *   delete:
 *     description: User deleted
 *     parameters:
 *        - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal error (delete failed)
 */
router.delete('/:userId', userController.destroy)

module.exports = router

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user id.
 *           example: 17
 *         status:
 *           type: string
 *           description: Current user status (Active/Locked/Deleted)
 *           example: Active
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: James Bond
 *         email:
 *           type: string
 *           description: A unique email identifiying the user
 *           example: 007@mi6.co.uk
 *         phone:
 *           type: string
 *           description: The user's phone.
 *           example: +46-007-123456
 *         role:
 *           type: string
 *           description: The user's role (User/Admin/SuperUser/SuperAdmin).
 *           example: User
 *         lastLoginAt:
 *           type: string
 *           description: Last login time (UTC time).
 *           example: 2020-07-07T:07:27.007Z
 *         autoLogoutAfter:
 *           type: integer
 *           description: Auto-logout after idle time (in seconds). Min 60 and max 3600.
 *           example: 600
 *         createdAt:
 *           type: string
 *           description: Time of creation (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 *         updatedAt:
 *           type: string
 *           description: Timestamp of latest update (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 *         userGroupId:
 *           type: integer
 *           description: Id of the usergroup that this user belongs to.
 *           example: 77
 *         UserGroup:
 *           $ref: '#/components/schemas/UserGroup'
 */

/**
 * @openapi
 * components:
 *   requestBodies:
 *     UserBody:
 *       description: |
 *         Required properties must be set to successfully save a user, but are also subject to various authorizations.
 *         * A user can not assign a "higher" role to other users than it has on its own
 *         * A user must belong to a usergroup, but only superusers may assign usergroups other than their own.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role, userGroupId]
 *             properties:
 *               status:
 *                 type: string
 *                 description: User status (Active/Locked/Deleted)
 *                 example: Active
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 example: James Bond
 *               email:
 *                 type: string
 *                 description: A unique email identifiying the user
 *                 example: 007@mi6.co.uk
 *               password:
 *                 type: string
 *                 description: Set a new user password.
 *                 example: NoTimeToDie
 *               phone:
 *                 type: string
 *                 description: The user's phone.
 *                 example: +46-007-123456
 *               role:
 *                 type: string
 *                 description: The user's role (requires proper authorization).
 *                 example: User
 *               userGroupId:
 *                 type: integer
 *                 description: Usergroup that user belong to (requires proper authorization).
 *                 example: User
 */

/**
 * @openapi
 * components:
 *   parameters:
 *     UserId:
 *       name: userId
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *       description: A user's id
 *       example: 17
 */
