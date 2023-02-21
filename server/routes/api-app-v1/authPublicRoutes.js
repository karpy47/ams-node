const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const appAuthController = require('../../controllers/appAuthController')

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     description: Sign up and login a new patient (anonymous possible)
 *     requestBody:
 *       $ref: '#/components/requestBodies/SignupBody'
 *     responses:
 *       200:
 *         description: Signed up and logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   description: Patient id to use for login
 *                   example: 17
 *       400:
 *         description: Parameter validation failed
 *       401:
 *         description: Wrong crendentials
 *       500:
 *         description: Internal error (login failed)
 */
router.post('/signup', [
  body('password', 'required').exists(),
  body('email').isEmail().withMessage('wrong format').optional(),
  body('phone').isMobilePhone().withMessage('wrong format').optional()
], appAuthController.signup)

/**
 * @openapi
 * /auth/login:
 *   post:
 *     description: Login and recieve access tokens
 *     requestBody:
 *       $ref: '#/components/requestBodies/LoginBody'
 *     responses:
 *       200:
 *         description: Logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       400:
 *         description: Parameter validation failed
 *       403:
 *         description: Wrong crendentials
 *       500:
 *         description: Internal error (login failed)
 */
router.post('/login', [
  body('id').exists().withMessage('required'),
  body('password').exists().withMessage('required')
], appAuthController.login)

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
 *             properties:
 *               id:
 *                 type: integer
 *               refreshToken:
 *                 type: string
 *           example:
 *             refreshToken: a8K5AWnwTb%UOkgzfhK1.1627719612
 *     responses:
 *       200:
 *         description: New tokens sent
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
  body('id', 'required').exists(),
  body('refreshToken', 'required').exists()
], appAuthController.refresh)

module.exports = router

/**
 * @openapi
 * components:
 *   schemas:
 *     Tokens:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user id.
 *           example: 7
 *         accessToken:
 *           type: string
 *           description: Time limited accesstoken for http bearer authentication of every request.
 *           example: a+gu63Q9YRsvH8&4M!Ww.1623718167
 *         refreshToken:
 *           type: string
 *           description: Time limited refreshtoken to recieve a new accesstoken.
 *           example: fqreyzNFwC64UHimNTJQ.1627678167
 */

/**
 * @openapi
 * components:
 *   requestBodies:
 *     SignupBody:
 *       description: Signup properties
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *                 description: Inital password for patient profile.
 *                 example: supersecretpassword
 *               email:
 *                 type: string
 *                 description: The patients's email.
 *                 example: 007@mi6.co.uk
 *               phone:
 *                 type: string
 *                 description: The patients's phone.
 *                 example: +46 70-123 456 789
 *     LoginBody:
 *       description: Login properties
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, password]
 *             properties:
 *               id:
 *                 type: string
 *                 description: The patients's id.
 *                 example: 17
 *               password:
 *                 type: string
 *                 description: The patients's password used at signup
 *                 example: IloveQ
 */
