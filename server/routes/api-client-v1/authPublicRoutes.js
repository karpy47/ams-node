const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const clientAuthController = require('../../controllers/clientAuthController')

/**
 * @openapi
 * /auth/login:
 *   post:
 *     description: Login and recieve access tokens
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: 007@mi6.co.uk
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: IloveQ
 *     responses:
 *       200:
 *         description: Logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokensUser'
 *       400:
 *         description: Parameter validation failed
 *       401:
 *         description: Wrong credentials
 *       500:
 *         description: Internal error (login failed)
 */
router.post('/login', [
  body('email')
    .exists().withMessage('required').bail()
    .isEmail().withMessage('wrong format'),
  body('password', 'required').exists()
], clientAuthController.login)

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     description: Logout and disable all tokens
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
 *                   description: Time of logout (UTC time).
 *                   example: 2020-07-07T:07:07.007Z
 *       401:
 *         description: Wrong credentials
 *       500:
 *         description: Internal error (logout failed)
 */
router.post('/logout', [], clientAuthController.logout)

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     description: Use refreshtoken to get a new accesstoken and refreshtoken
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, refreshToken]
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The user's id.
 *               refreshToken:
 *                 type: string
 *                 description: Previously received refreshtoken.
 *                 example: a8K5AWnwTb%UOkgzfhK1.1627719612
 *     responses:
 *       200:
 *         description: Tokens refreshed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       400:
 *         description: Parameter validation failed
 *       403:
 *         description: Wrong credentials
 *       500:
 *         description: Internal error (refresh failed)
 */
router.post('/refresh', [
  body('userId', 'required').exists(),
  body('refreshToken', 'required').exists()
], clientAuthController.refresh)

/**
 * @openapi
 * /auth/reset-password-request:
 *   post:
 *     description: Request to reset password by sending mail with token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: 007@mi6.co.uk
 *     responses:
 *       200:
 *         description: Request was handled (success or failed)
 *       400:
 *         description: Parameter validation failed
 *       500:
 *         description: Internal error
 */
router.post('/reset-password-request', [
  body('email', 'required').exists()
], clientAuthController.resetPasswordRequest)

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     description: Reset password if reset token validates
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, resetToken, password]
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: 007@mi6.co.uk
 *               resetToken:
 *                 type: string
 *                 description: Previously sent reset token.
 *                 example: g4sW63Q9YRsvH8&4M!Ww.1623718167
 *               password:
 *                 type: string
 *                 description: New password.
 *                 example: IloveQ4Ever
 *     responses:
 *       200:
 *         description: Password was reset
 *       400:
 *         description: Parameter validation failed
 *       401:
 *         description: Wrong credentials
 *       500:
 *         description: Internal error
 */
router.post('/reset-password', [
  body('email', 'required').exists(),
  body('resetToken', 'required').exists(),
  body('password', 'required').exists()
], clientAuthController.resetPassword)

module.exports = router

/**
 * @openapi
 * components:
 *   schemas:
 *     TokensUser:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Time limited accesstoken for http bearer authentication of every request.
 *           example: a+gu63Q9YRsvH8&4M!Ww.1623718167
 *         accessTokenExpiresIn:
 *           type: string
 *           description: Time in seconds until accesstoken expires.
 *           example: 3600
 *         refreshToken:
 *           type: string
 *           description: Time limited refreshtoken to recieve a new accesstoken.
 *           example: fqreyzNFwC64UHimNTJQ.1627678167
 *         refreshTokenExpiresIn:
 *           type: string
 *           description: Time in seconds until refreshtoken expires.
 *           example: 86400
 *         user:
 *           $ref: '#/components/schemas/User'
 *     Tokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Time limited accesstoken for http bearer authentication of every request.
 *           example: a+gu63Q9YRsvH8&4M!Ww.1623718167
 *         accessTokenExpiresIn:
 *           type: string
 *           description: Time in seconds until accesstoken expires.
 *           example: 3600
 *         refreshToken:
 *           type: string
 *           description: Time limited refreshtoken to recieve a new accesstoken.
 *           example: fqreyzNFwC64UHimNTJQ.1627678167
 *         refreshTokenExpiresIn:
 *           type: string
 *           description: Time in seconds until refreshtoken expires.
 *           example: 86400
 */
