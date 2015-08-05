#!/bin/bash

[ -z "${DAYS}" ] && {
  echo "You must set a DAYS argument to this command." >&2
  exit 1
}

exec ${ROOT}/cmd_curate.sh delete indices \
  --older-than ${DAYS} --time-unit days \
  --timestring %Y.%m.%d --prefix logstash \
  $@
