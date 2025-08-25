<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Wedding Backend Application

A **NestJS-based backend application** for a wedding/matchmaking platform. Users can create profiles, find matches, like each other's profiles, and have conversations with matches. This application provides all server-side functionality for such a platform, including user management, messaging, and relationship interactions.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Setup](#project-setup)
- [Running the Project](#running-the-project)

  - [Normal Development](#normal-development)
  - [Using Docker](#using-docker)

- [Deployment](#deployment)
- [Resources](#resources)
- [Support](#support)
- [License](#license)

---

## Project Overview

This backend is built with [NestJS](https://nestjs.com/) and TypeScript. Key features include:

- User registration and profile management
- Matching system for users
- Ability to like profiles
- Real-time conversations via messaging
- Support for scalable and efficient server-side operations

---

## Project Setup

1. Clone the repository:

```bash
git clone git@github.com:MahadiHasan2903/wedding-backend-app.git
cd wedding-backend-app
```

2. Create a `.env` file in the root of the project and add environment variables according to the `.env.example` file.

3. Install dependencies:

```bash
npm install
```

---

## Running the Project

### Normal Development / Production

1. **Build the project** (for production):

```bash
npm run build
```

2. **Start the server**:

- Development (with watch mode):

```bash
npm run start:dev
```

- Production:

```bash
npm run start:prod
```

The server should now be running on the port specified in your `.env` file (default `8080`).

---

### Using Docker

You can also run the backend using Docker:

1. **Pull the latest Docker image**:

```bash
docker pull mahadihasan2903/wedding-backend-app:latest
```

2. **Run the Docker container**:

```bash
docker run -p 8080:8080 --env-file .env mahadihasan2903/wedding-backend-app:latest
```

- `-p 8080:8080` maps container port `8080` to your local machine port `8080`.
- `--env-file .env` passes the environment variables to the container.

---

## Deployment

For deploying your NestJS application to production, refer to the [official NestJS deployment documentation](https://docs.nestjs.com/deployment).

You can also use cloud-based platforms like [Mau](https://mau.nestjs.com) for fast and easy deployment on AWS:

```bash
npm install -g @nestjs/mau
mau deploy
```

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Discord support channel](https://discord.gg/G7Qnnhy)
- [Official video courses](https://courses.nestjs.com/)
- [NestJS Devtools](https://devtools.nestjs.com)
- [Enterprise support](https://enterprise.nestjs.com)
- [Jobs board](https://jobs.nestjs.com)

---

## Support

This project is MIT-licensed. Contributions and sponsorships are welcome. See [NestJS Support](https://docs.nestjs.com/support).

---

## License

NestJS framework and this project are [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
