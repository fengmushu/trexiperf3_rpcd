#!/usr/bin/sh

mkdir -p /tmp/paster/

../iperf/src/iperf3 $*

RC=$?

echo $$ >  /tmp/paster/iperf3-${STREAM_ID}.pid

return $RC
