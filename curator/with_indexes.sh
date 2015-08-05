#!/bin/bash
#
# Utility script to execute a curate command against the target Elasticsearch instance, selecting
# the appropriate indexes.

set -euo pipefail

ACTION=${1-}
shift

[ -z "${DAYS}" ] && {
  echo "You must set a DAYS argument to this command." >&2
  exit 1
}

exec ${ROOT}/cmd_curate.sh ${ACTION} indices \
  --older-than ${DAYS} --time-unit days \
  --timestring %Y.%m.%d --prefix logstash \
  $@
