<div align="center">
    <img src="logo.png" alt="congatudo">
    <p align="center"><h2>Free your vacuum from the cloud</h2></p>
</div>

Home Assistant add-on for [this fork of Congatudo](https://github.com/anderizquierdo/Congatudo),
a cloud replacement for Cecotec Conga vacuum robots.

## Installation

[![Open your Home Assistant instance and show the add add-on repository dialog with a specific repository URL pre-filled.](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fanderizquierdo%2FCongatudo)

Or add `https://github.com/anderizquierdo/Congatudo` manually in
**Settings → Add-ons → Add-on store → ⋮ → Repositories**, then install **Congatudo**.

## Differences from the official add-on

- Runs the fork's `master` (fixes not yet released upstream, e.g. rooms with enclosed
  areas that were left unfilled and unclickable on the map).
- `panel_admin: false`: non-admin Home Assistant users can open the Congatudo panel.
  Enable **Show in sidebar** on the add-on page.
- Configuration lives in `valetudo.json` in the Home Assistant configuration folder,
  the same file the official add-on uses, so switching keeps your settings.
- `amd64` only for now.

## Releasing a new version

1. Build the binary: `npm ci && npm run build_openapi_schema && npm run build --workspace=frontend && npm run build_amd64 --workspace=backend`.
2. Create a GitHub release whose tag equals the new add-on version and upload
   `build/amd64/valetudo` as `valetudo-amd64`.
3. Bump `version` in `config.yml`, set `VALETUDO_SHA256` in the `Dockerfile` and
   add an entry to `CHANGELOG.md`.

Icon and logo come from [congatudo-add-on](https://github.com/congatudo/congatudo-add-on) (MIT).
