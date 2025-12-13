# Amazon Linux 2023 / Elastic Beanstalk Update

Amazon Linux 2023 no longer supports `Dockerrun.aws.json` bundles. Deployments now use Docker Compose, with separate files for development and production.

## Compose files
- `docker-compose.dev.yml`: local development (Postgres + Redis are provisioned as containers with bind mounts and hot reloading). Run with `docker compose -f docker-compose.dev.yml up --build`.
- `docker-compose.yml`: production/Elastic Beanstalk. Uses pushed images (`${DOCKER_ORG:-likpiits}/multi-*`), no dev volumes, and ships CloudWatch logging config. Required environment variables are pulled from the environment (set them in the EB console): `REDIS_HOST`, `REDIS_PORT` (default 6379), `PGUSER`, `PGHOST`, `PGPASSWORD`, `PGDATABASE`, `PGPORT` (default 5432), `AWS_REGION` (default `eu-north-1`), and optionally `DOCKER_ORG` to point at your Docker Hub org.

## Deploying with Elastic Beanstalk (AL2023)
1. Ensure images are built and pushed (CI already builds/pushes `multi-react`, `multi-nginx`, `multi-server`, `multi-worker` when secrets are present). Set `DOCKER_ORG` in the EB environment to match your Docker Hub username if it differs from the default.
2. Create a deployment bundle that contains only `docker-compose.yml` at the root (e.g., `zip deploy.zip docker-compose.yml`) and upload it to an Elastic Beanstalk environment using the **Docker running on 64bit Amazon Linux 2023** platform.
3. In EB configuration, set the environment variables listed above so the API/worker can reach Redis and Postgres (usually Elasticache + RDS). No `.ebextensions` are needed; logging is handled via the Compose `awslogs` driver definitions.
