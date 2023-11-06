#!/usr/bin/sh

env

kill `cat "/tmp/paster/iperf3-${STREAM_ID}.pid"`
