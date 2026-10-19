# Changelog

## 2026.10.3

- Congatudo remembers **Double pass**, **Carpet mode**, **fan speed** and **water level**
  and sends them to the robot again before every cleanup started from Congatudo or
  Home Assistant. The robot resets some of them when a cleanup ends (double pass goes
  back to off, water back to medium), so they no longer have to be set every time.
  Cleanups started from the robot's button or its own schedules still use the robot's values.

## 2026.10.2

- New "Cleaning options" card on the home controls with **Double pass**: the robot
  cleans everything twice and starts the second pass where the first one ends,
  instead of returning to the dock. **Carpet mode** moved there from Robot settings.
  Both settings are stored on the robot and keep their value between cleanups.
- The version shown by Congatudo (About, Updater) now matches the add-on version.

## 2026.10.1

- The add-on image is now prebuilt by GitHub Actions and published to ghcr.io;
  Home Assistant only pulls it. Same Congatudo code as 2026.10.0.

## 2026.10.0

- First release of the fork's add-on, based on upstream `master` (`b0740893`).
- Fill map segments by enclosed regions, so rooms wrapped around furniture are
  drawn and clickable ([congatudo/Congatudo#211](https://github.com/congatudo/Congatudo/pull/211)).
- Non-admin users can open the panel (`panel_admin: false`).
