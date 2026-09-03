# InvenTree local instance (Docker)

The automation suite defaults to the public demo at `https://demo.inventree.org`.
Use this folder when you want a local, reviewer-reproducible instance.

Official guide: https://docs.inventree.org/en/stable/start/docker_install/

## Files to download

From the InvenTree repository `contrib/container/`:

- [docker-compose.yml](https://raw.githubusercontent.com/inventree/InvenTree/master/contrib/container/docker-compose.yml)
- [.env](https://raw.githubusercontent.com/inventree/InvenTree/master/contrib/container/.env)
- [Caddyfile](https://raw.githubusercontent.com/inventree/InvenTree/master/contrib/container/Caddyfile)

## First-time setup

```bash
# from this directory, after the three files are present
docker compose run --rm inventree-server invoke update
docker compose run inventree-server invoke superuser
docker compose up -d
```

Then point the suite at the local server:

```bash
# automation/.env
BASE_URL=http://localhost:8000
INVENTREE_USER=<superuser>
INVENTREE_PASSWORD=<password>
```

The demo dataset is **not** included in a fresh Docker install. Tests create their own `QA-ARCH-*` data and do not depend on demo catalog parts.

## Notes

- All `docker compose` commands must run in the directory that contains `docker-compose.yml`.
- Run `invoke update` after every image pull.
- Default image tag is `inventree/inventree:stable`.
