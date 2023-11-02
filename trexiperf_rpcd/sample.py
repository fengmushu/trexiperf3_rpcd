import subprocess
import json


def greeting(name="world"):
    return {"message": "Hello, %s!" % name}


def start():
    res = 'error'
    proc = subprocess.run(
        ['iperf3', '-c', '192.168.10.254', '-P4', '-t3'], capture_output=True, check=True)

    if proc.returncode == 0:
        res = "started"

    print(res)
    return {"message": res}


def stop():
    proc = subprocess.run(['killall', 'iperf3'])
    return {"message": 'stoped'}


def server():
    return {"message": json.dumps(['192.168.10.117', '10.10.16.241', '192.168.10.254'])}
