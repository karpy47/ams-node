const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const userGroupController = require('../../controllers/userGroupController')

/**
 * @openapi
 * /user-groups:
 *   get:
 *     description: Return list of usergroups, scoped by authorization
 *     responses:
 *       200:
 *         description: Usergroups returned
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserGroup'
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error (read all failed)
 */
router.get('/', userGroupController.readAll)

/**
 * @openapi
 * /user-groups/{userGroupId}:
 *   get:
 *     description: Return one user, if allowed by authorization
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Usergroup returned
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
router.get('/:userGroupId', userGroupController.read)

/**
 * @openapi
 * /user-groups:
 *   post:
 *     description: Create a new usergroup depending on authorization
 *     requestBody:
 *       $ref: '#/components/requestBodies/UserGroupBody'
 *     responses:
 *       201:
 *         description: Usergroup created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserGroup'
 *       400:
 *         description: Parameter validation failed
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error (create failed)
 */
router.post('/', [
  body('name').exists().withMessage('required')
], userGroupController.create)
/**
 * @openapi
 * /user-groups/{userGroupId}:
 *   put:
 *     description: Update a usergroup depending on authorization
 *     parameters:
 *       - $ref: '#/components/parameters/UserGroupId'
 *     requestBody:
 *       $ref: '#/components/requestBodies/UserGroupBody'
 *     responses:
 *       200:
 *         description: Usergroup updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserGroup'
 *       403:
 *         description: Permission not granted
 *       404:
 *         description: Usergroup not found
 *       500:
 *         description: Internal error (update failed)
 */
router.put('/:userGroupId', [
  body('name').exists().withMessage('required')
], userGroupController.update)

/**
 * @openapi
 * /user-groups/{userGroupId}:
 *   delete:
 *     description: Usergroup deleted
 *     parameters:
 *        - $ref: '#/components/parameters/UserGroupId'
 *     responses:
 *       200:
 *         description: Usergroup deleted
 *       404:
 *         description: Usergroup not found
 *       500:
 *         description: Internal error (delete failed)
 */
router.delete('/:userGroupId', userGroupController.destroy)

module.exports = router

/**
 * @openapi
 * components:
 *   schemas:
 *     UserGroup:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The usergroup id.
 *           example: 17
 *         name:
 *           type: string
 *           description: The usergroup's name.
 *           example: MI6
 *         description:
 *           type: string
 *           description: A description of the usergroup
 *           example: A most secret group
 */

/**
 * @openapi
 * components:
 *   requestBodies:
 *     UserGroupBody:
 *       description: Properties of a usergroup. A usergroup has many users and many clinics.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 description: The usergroup's name.
 *                 example: MI6
 *               description:
 *                 type: string
 *                 description: A description of the usergroup
 *                 example: A most secret group
 */

/**
 * @openapi
 * components:
 *   parameters:
 *     UserGroupId:
 *       name: userGroupId
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *       description: A usergroup's id
 *       example: 77
 */
