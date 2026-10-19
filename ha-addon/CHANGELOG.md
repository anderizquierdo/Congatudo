# Changelog

## 2026.10.1

- The add-on image is now prebuilt by GitHub Actions and published to ghcr.io;
  Home Assistant only pulls it. Same Congatudo code as 2026.10.0.

## 2026.10.0

- First release of the fork's add-on, based on upstream `master` (`b0740893`).
- Fill map segments by enclosed regions, so rooms wrapped around furniture are
  drawn and clickable ([congatudo/Congatudo#211](https://github.com/congatudo/Congatudo/pull/211)).
- Non-admin users can open the panel (`panel_admin: false`).
