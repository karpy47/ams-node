# Backend description

## Architecture

The backend (Node/Express) exposes and handles two APIs, one for web clients and one for mobile apps. The web client (React/Redux) is intended for administration, and it is described in a separate readme-doc for the Frontend. The mobile app (Flutter) used by patients (having a medical device) is also described in a separate readme-doc.

API-documentation according to OpenAPI (Swagger v3) is auto-generated from comments and provides a fully working (although simple) API test environment.

The overall backend tech stack consists of:

* [Node.js](https://nodejs.org/en/) - JavaScript runtime
  * [ExpressJS](https://expressjs.com/) - Javascript framework
  * [Sequelize](https://sequelize.org/) - Database ORM (supporting Postgres)
  * [Express-Validator](https://express-validator.github.io/docs/) - Request validator
  * [Passport](http://www.passportjs.org/) - Authentication middleware
  * [AccessControl](http://www.passportjs.org/) - Authorization control
  * [Winston](https://www.npmjs.com/package/winston) - A general logger
  * [Morgan](https://www.npmjs.com/package/morgan) - HTTP request logger
  * [Jest](https://jestjs.io/) - Testing framework
  * ...and other packages
* Postgres - Could be exchanged for any relational database supported by the ORM.

---

## Overall business logic

### System entities and their behavior

* **Patient**
  * Someone who uses a **Device** for treatment and login through a mobile app.
  * A patient usually belongs to a **Clinic**, but does not have to. Patients may purchase a device and start treatment without a clinic (although not recommended, but potentially important for demos and testing).
  * A patient may have one (and only one) **Device** reigistered to himself. To connect another device any previous device needs to be disconnected first.
  * All usage reported by the connected device is seen as linked to the **Patient** connected to the device, starting from the connection time. Any previous unlinked usage is disregarded as it cannot be linked to a patient.

* **Device**
  * Is manufactured in a factory and normally registered there as a new **Device** before being shipped.
  * A **Device** consists of 6 different **Component**s
  * A **Patient** usually connects to a **Device** that is already registered in the system. If the **Device** is not recognised, its data (like serial no) is used to create a new device, although important info on the manufacturing process will be missing.

* **Component**
  * Is manufactured in a factory and normally registered there as a new **Component** before being used in further manufacturing.
  * A **Component** is unique and after manufacturing it belongs to one **Device**.

* **DeviceEvent**
  * An event that has occured for a **Device** and/or a **Component** that is recorded, for example a repar or error diagnosis or other change of the part's status .

* **User**
  * Somone who administrates **Patient**s, **Device**s, etc with abilities dependent on authorization.
  * All **Users** must belong to a **UserGroup**.
  * A **User** must have one of these roles:
    * User - Access of its own usergroup, but limited in creating or deleting resources.
    * Admin - Full access within its usergroup.
    * Superuser - Access to all usergroups but limited in creating and deleting some resources.
    * Superadmin - Full system access including all usergroups.
    * Factory - Machine user for automated tasks in a factory, eg registering new devices.

* **UserGroup**
  * Collects a group of **User**s with access to linked **Clinics** and their **Patient**s.

* **Clinic**
  * Must belong to a **UserGroup** and is typcially a place where patients go, but it could also be a clinical trial project.
  * A **User** restricted to a **UserGroup** can only view **Patient**s connected to the **UserGroup**'s  **Clinic**s.

* **DeviceRawData**
  * Raw usage data downloaded from a physical device used for treatments. This data is used for determining a patient's device usage and compliance to a treatment plan.
  * Data is always connected to a **Device** and possibly a **Patient** if connected to the **Device** at the time the data was downloaded from the device.

* **AuditLog**
  * A trail of changes to model attributes most notably the **User** and **Patient** model. This is required for security reviews and regulatory purposes.

* **EventLog**
  * A log of security related events for **User**s and **Patient**s, like login, refresh, failed logins, etc. This is required for security reviews and regulatory purposes.

### Not yet implemented

* **DeviceAction**
  * Commands and/or messages sent to a **Device** or it's user (a **Patient**) when syncing, like messages for product recalls, critical version updates, potentially adding usage licenses, locking a stolen device, etc.

* **Treatment**
  * A log of treatments performed by a **Patient**. A treatment occurs if device usage matches a treatment plan or is recorded manually.

* **TreatmentPlan**
  * Templates for treatment plans that a **Clinic** has recommended for a **Patient**.

* **QForm**
  * Template questionnaires to be sent to **Patient** as part of a **TreatmentPlan**.

* **QFormResponse**
  * **Patient** responses to questionnaries sent out.

---

## Setup dev environment

1. Install dev tools and download codebase
    * Must install: Node.js, Git, Docker desktop
    * Recommended tools: VScode (coding), PostMan (HTTP/API testing)
    * Download latest codebase from git repository
2. Start docker environment (backend, frontend and database)
    * Open a command console and change to folder `/docker`
    * Run docker setup: `docker compose up`
    * Verify all containers are running and connects on these ports:
      * Backend on localhost:3001
      * Frontend on localhost:3002
      * Postgres database on localhost:5433
      * Postgres test database on localhost:5434
3. Run database migrations
    * Open shell to backend container: `docker exec -it ams-server /bin/sh`
    * In backend shell, run migrations: `npx sequelize-cli db:migrate:all` or use the backend commander with `./cli db migrate up`
4. Create a superadmin
    * In backend shell, run: `./cli user setup -e mail@example.com -p password`
5. Try to login to the client API with your superadmin credentials
    * Base URLs for AP
      * <http://localhost:3001/client/v1>
      * <http://localhost:3001/app/v1>
    * API documentation:
      * <http://localhost:3001/client/v1/docs>
      * <http://localhost:3001/app/v1/docs>

## CLI (Command Line Interface)

From a shell certain commands are available to administrate the database, users and to make development easier. Some commands are restricted to dev, test and/or prod environment. (For example it is not possible to reset the database in production mode.)

### CLI setup in Unix

In a Unix shell all environment variables (like the database connection strings) should be set automatically, as part of the deployment settings.

Run `./cli` to see the command help menu

### CLI setup in Windows

 When opening a Windows shell it has do be done manually. Run this sequence once for every new command shell opened to connect with the Docker containers.

* Open Windows PowerShell (better than CMD)
* Run `npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"`
* Run `$env:DATABASE_URL_TEST="postgres://pgroot:pgpwd@localhost:5434/ams"`
* Run `$env:DATABASE_URL_DEV="postgres://pgroot:pgpwd@localhost:5433/ams"`
* Run `node cli` to see the command help menu

### Some useful commands

| Command | Description |
| ------- | ----------- |
| `./cli user show` | Show a list of all SuperUsers and SuperAdmins. |
| `./cli user change-pwd -e mail@example.com -p password` | Set a new password for a user with given email. |
| `./cli user create -e mail@example.com -p password` | Create a new superadmin in a default usergroup called "SuperGroup". |
| `./cli db reset` | Reset database by migrating down and then migrating up. All data is lost! Not available in prod env. |
| `./cli db init` | Setups a default superadmin user in a default usergroup for first access. Password only shown once in shell. Not available in prod env. |
| `./cli db seed` | Populates #n usergroups with users, patients, etc. Not available in prod env.|
| `./cli db migrate up` | Migrates up any pending migrations. |
| `./cli db migrate down` | Migrates down one step. |

There are various options for most commands. Check them out by adding --help.

### Some other useful backend shell commands

Database migration commands (same as `cli db migrate`, see section above)

`npx sequelize-cli db:migrate:all`

`npx sequelize-cli db:migrate:undo:all`

## Testing

The backend uses Jest for tests and is started from console with:

`npm test`

This command will initiate the following actions:

1. Set NODE_ENV to "test"
2. A full migration down of the test database (ie database will be removed)
3. A full migration up of the test database (ie an empty database)
4. Starting Jest test sequence

Due to Docker file sync (probably), testing is very slow and is better run from the host machine. The
`npm test` command also works in Windows 10, se CLI-section on how to setup a windows command shell and how to define environment variables.

### Command line options when running Jest

Please read more about CLI options for jest here: <https://jestjs.io/docs/cli>

* `-- detectOpenHandles` is currently used (packages.json), makes test suits run serially rather than in parallel
* `- o` only test file not commited to GIT
* `- d 'string'` to only run tests suits matching 'string'

---

## Encrytption at rest

Try this, but only PG v12.3 supported for free.
<https://www.cybertec-postgresql.com/en/products/postgresql-transparent-data-encryption/>

MongoDB has enrypt-at-rest in Enterprise version ($8-13k/yr) and would require entire new ORM in code

An alternative is to use a Docker-setup and enrypt an entire partition dedicated for the database.
Problem with partition encryption is that when a partition is mounted it is fully readable from within the entire partition. Gaining access to the shell means access gaining access to the database also.

Some threads on the topic
<https://stackoverflow.com/questions/45848457/postgresql-database-encryption-at-rest>
<https://aws.amazon.com/blogs/database/selecting-the-right-encryption-options-for-amazon-rds-and-amazon-aurora-database-engines/>

## Production environment

### Features to add or consider before production deployment

* API rate limiter - <https://www.npmjs.com/package/express-rate-limit>
* Https support - add nginx server and install free letsencrypt-certificate (certbot)
* Review Express production/safety recommendations
  * <https://expressjs.com/en/advanced/best-practice-security.html>
* Use of encrypted PostGres database (at rest). AWS had good options alternatively setup independently (not as good)
  * <https://stackoverflow.com/questions/45848457/postgresql-database-encryption-at-rest>
  * <https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html>

Not critical but good to do:

* Update API documentation and verify it is correct

### How to deploy backend to production

To be defined
