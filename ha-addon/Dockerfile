# Built by .github/workflows/ha-addon.yml from the repository root:
#   docker build -f ha-addon/Dockerfile .
ARG BUILD_ARCH=amd64

FROM node:20.10.0-alpine AS build
RUN apk add --no-cache git
WORKDIR /src
COPY . .
RUN npm ci \
    && npm run build_openapi_schema \
    && npm run build --workspace=frontend \
    && npm run build_amd64 --workspace=backend

FROM ghcr.io/home-assistant/${BUILD_ARCH}-base:3.24
ARG BUILD_ARCH
ARG BUILD_VERSION
LABEL io.hass.type="addon" io.hass.arch="${BUILD_ARCH}" io.hass.version="${BUILD_VERSION}"

RUN apk add --no-cache dumb-init

COPY --from=build /src/build/amd64/valetudo /usr/local/bin/valetudo

WORKDIR /usr/src/app
ENV VALETUDO_CONFIG_PATH=/homeassistant/valetudo.json

COPY ha-addon/valetudo.sh valetudo.sh
RUN chmod a+x valetudo.sh

CMD ["dumb-init", "./valetudo.sh"]
