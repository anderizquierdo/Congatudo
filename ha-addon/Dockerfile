ARG BUILD_ARCH
FROM ghcr.io/home-assistant/${BUILD_ARCH}-base:3.24

ARG BUILD_ARCH
# The Supervisor passes the add-on version; it must match a release tag of the fork
ARG BUILD_VERSION
# sha256 of the valetudo-amd64 asset of that release (update together with config.yml version)
ARG VALETUDO_SHA256=db59edc508ce9399fa951fda9559d1e5aa56bb58b26c2d7e90a487be29cf03d3

RUN apk add --no-cache dumb-init

RUN curl -fsSL -o /usr/local/bin/valetudo \
      "https://github.com/anderizquierdo/Congatudo/releases/download/${BUILD_VERSION}/valetudo-${BUILD_ARCH}" \
    && echo "${VALETUDO_SHA256}  /usr/local/bin/valetudo" | sha256sum -c - \
    && chmod a+x /usr/local/bin/valetudo

WORKDIR /usr/src/app
ENV VALETUDO_CONFIG_PATH=/homeassistant/valetudo.json

COPY valetudo.sh valetudo.sh
RUN chmod a+x valetudo.sh

CMD ["dumb-init", "./valetudo.sh"]
