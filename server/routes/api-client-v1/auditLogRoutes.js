const express = require('express')
const router = express.Router()
const auditLogController = require('../../controllers/auditLogController')

/**
 * @openapi
 * /audit-log:
 *   get:
 *     description: Return list of audit logs, authorization required
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AuditLog'
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error
 */
router.get('/', auditLogController.readAll)

/**
 * @openapi
 * /audit-log/{auditLogId}:
 *   get:
 *     description: Return one audit log, if allowed by authorization
 *     parameters:
 *       - $ref: '#/components/parameters/AuditLogId'
 *     responses:
 *       200:
 *         description: Audit log returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditLog'
 *       403:
 *         description: Permission not granted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.get('/:auditLogId', auditLogController.read)

module.exports = router

/**
 * @openapi
 * components:
 *   schemas:
 *     AuditLog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Internal id.
 *           example: 77
 *         table:
 *           type: string
 *           description: Name of table that was changed.
 *           example: Users
 *         tableId:
 *           type: number
 *           description: Row in table that was changed (id).
 *           example: 17
 *         action:
 *           type: string
 *           description: Type of change.
 *           example: New password
 *         before:
 *           type: string
 *           description: Row content before change (JSON).
 *           example: { name: 'James Bond', password: 'IloveQ' }
 *         changed:
 *           type: string
 *           description: Changes in row compared to before (JSON).
 *           example: { password: 'IloveQ4ever' }
 *         sourceType:
 *           type: string
 *           description: Source type that initiated change.
 *           example: User
 *         sourceId:
 *           type: number
 *           description: Source id that initiated change.
 *           example: 77
 *         createdAt:
 *           type: string
 *           description: Time of creation (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 *         updatedAt:
 *           type: string
 *           description: Timestamp of latest update (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 */

/**
 * @openapi
 * components:
 *   parameters:
 *     AuditLogId:
 *       name: auditLogId
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *       description: An audit log's id
 *       example: 17
 */
