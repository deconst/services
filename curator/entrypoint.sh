#!/bin/bash

set -euo pipefail

export ROOT=$(cd $(dirname $0) && pwd)

SCRIPT=${1:-curate}
shift

[ -x "/home/curator/cmd_${SCRIPT}.sh" ] || {
  echo "Unrecognized command: ${SCRIPT}" >&2
  echo "Available commands:" >&2

  ls /home/curator/cmd_* >&2

  exit 1
}

exec /home/curator/cmd_${SCRIPT}.sh $@
