#!/bin/sh

CONSOLE_PID=$(ps a | grep stl_simple_console.py | grep -v grep | awk '{print $1}')

[ -z "$CONSOLE_PID" ] || {
	kill -$1 $CONSOLE_PID
}
