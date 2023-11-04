import subprocess
import json

from .node import StreamNode


def start():
    res = 'error'
    proc = subprocess.run(
        ['iperf3', '-c', '192.168.10.254', '-P4', '-t3'], capture_output=True, check=True)

    if proc.returncode == 0:
        res = "started"

    print(res)
    return {"message": res}


class Iperf3(StreamNode):
    __IPERF3_PATH = '../iperf/src/iperf3'
    __SHELL_PATH = '/usr/bin/bash'

    def __init__(self, saddr, bw, psize, load, direct) -> None:
        super().__init__('iperf3', saddr, bw, psize, load, direct)
        print("Iperf3 created")
        self.stream_num = 4
        self.timeout = 30
        pass

    def detect(self):
        print('iperf3 detect')
        try:
            proc = subprocess.run([self.__IPERF3_PATH, '-c', self.nvitem('ServerAddr'),
                                   '-P4', '-t1'], capture_output=True, check=True, timeout=3)
            if proc.returncode == 0:
                message = proc.stdout
                self.set_status('ready')
            else:
                message = proc.stderr
                self.set_status('error')
            print(message.decode('utf-8'))
        except subprocess.CalledProcessError as e:
            print("Detect busy:", e.stderr)
        except Exception as e:
            print("Detection: ", e)
            self.set_status("error")
            pass
        return True

    def start(self):
        stream_num = self.stream_num
        timeout = self.timeout
        server_addr = self.nvitem('ServerAddr')
        if timeout == 0:
            timeout = 604800
        print('iperf3 start {} {} {}...'.format(
            server_addr, stream_num, timeout))
        rc = 0
        try:
            proc = subprocess.run([self.__SHELL_PATH, self.__IPERF3_PATH, '-c', server_addr, '-P {}'.format(stream_num), '-t {}'.format(timeout), '&'],
                                  capture_output=True, check=True, timeout=timeout)
            rc = proc.returncode
            if rc == 0:
                message = proc.stdout
                self.set_status('ready')
            else:
                message = proc.stderr
                self.set_status('error')
            print("rc: {}".format(rc), message.decode('utf-8'))
        except subprocess.CalledProcessError as e:
            self.set_status('running')
            print("Start busy:", e.stderr)
            pass
        except Exception as e:
            print("Start: ", e)
            return True
        return True

    def halt(self):
        self.set_status('idle')
        return True
