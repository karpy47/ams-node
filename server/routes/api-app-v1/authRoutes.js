const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const appAuthController = require('../../controllers/appAuthController')

/**
 * @openapi
 * /auth/logout:
 *   get:
 *     description: User logout. Will cancel accesstoken and refreshToken
 *     responses:
 *       200:
 *         description: User logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logoutAt:
 *                   type: string
 *             example:
 *               logoutAt: 2020-07-07T:07:07.007Z
 *       500:
 *         description: Internal error (logout failed)
 */
router.get('/logout', appAuthController.logout)

module.exports = router
