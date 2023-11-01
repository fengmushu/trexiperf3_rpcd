import os


def greeting(name="world"):
    return {"message": "Hello, %s!" % name}


def start():
    os.popen('iperf3 -c 192.168.10.254 -P4 -t3')
    return {"message": 'started'}


def stop():
    os.popen('killall iperf3')
    return {"message": 'stoped'}
