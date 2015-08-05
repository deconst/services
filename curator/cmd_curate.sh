#!/bin/bash
#
# Execute curator connected to our configured Elasticsearch installation.

SSL_OPT=""
[ -n "${ELASTICSEARCH_SSL}" ] && SSL_OPT="--use_ssl"

MISSING=""

[ -z "${ELASTICSEARCH_HOST}" ] && MISSING="${MISSING} ELASTICSEARCH_HOST"
[ -z "${ELASTICSEARCH_PORT}" ] && MISSING="${MISSING} ELASTICSEARCH_PORT"
[ -z "${ELASTICSEARCH_USERNAME}" ] && MISSING="${MISSING} ELASTICSEARCH_USERNAME"
[ -z "${ELASTICSEARCH_PORT}" ] && MISSING="${MISSING} ELASTICSEARCH_PORT"

[ -z "${MISSING}" ] || {
  cat <<EOF >&2
Required environment variables are unset:

${MISSING}

EOF
  exit 1
}

exec /usr/local/bin/curator \
  --host ${ELASTICSEARCH_HOST} --port ${ELASTICSEARCH_PORT} ${SSL_OPT} \
  --http_auth ${ELASTICSEARCH_USERNAME}:${ELASTICSEARCH_PASSWORD} \
  $@
