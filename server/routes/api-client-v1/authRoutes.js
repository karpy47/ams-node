const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const clientAuthController = require('../../controllers/clientAuthController')

/**
 * @openapi
 * /auth/user:
 *   get:
 *     description: Fetch current authenticated user
 *     responses:
 *       200:
 *         description: Fetched user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal error (user fetch failed)
 */
router.get('/user', clientAuthController.user)

/**
 * @openapi
 * /auth/logout:
 *   get:
 *     description: User logout. Will cancel accesstoken and refreshToken
 *     responses:
 *       200:
 *         description: Logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logoutAt:
 *                   type: string
 *             example:
 *               logoutAt: 2020-07-07T:07:07.007Z
 */
router.get('/logout', clientAuthController.logout)

module.exports = router
