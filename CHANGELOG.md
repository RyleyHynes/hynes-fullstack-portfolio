# Changelog

All notable changes to this project should be documented in this file.

The format is based on Keep a Changelog and the project uses semantic versioning.

## [Unreleased]

- Added GitHub Actions quality gates for pull requests targeting `develop` and `main`
- Restricted production deployment to pushes on `main`
- Added frontend and backend build metadata/version surfacing for release visibility

## [0.1.0]

- Established initial versioning for the frontend and backend
- Added backend `/version` and `/health` endpoints with build metadata
- Added frontend build labeling with app version and git SHA
