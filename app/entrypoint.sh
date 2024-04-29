#!/bin/bash
set -e

rm -f /tmp/nitro/*.sock

exec "$@"
