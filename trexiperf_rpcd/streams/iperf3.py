import subprocess
import json
import os

from .node import StreamNode


class Iperf3(StreamNode):
    __IPERF3_PATH_RUN = './scripts/iperf3-run.sh'
    __IPERF3_PATH_KILL = './scripts/iperf3-kill.sh'
    __DEFAULT_STREAM_NUM = 4
    __DEFAULT_TIMEOUT_VAL = 30
    __TIMEOUT_VAL_7x24H = 600

    def __init__(self, key, saddr, bw, psize, load, direct) -> None:
        super().__init__(key, 'iperf3', saddr, bw, psize, load, direct)
        print("Iperf3 created")
        self.nvitem("TransTime", self.__DEFAULT_TIMEOUT_VAL)
        self.nvitem("StreamNum", self.__DEFAULT_STREAM_NUM)
        pass

    def env_patch(self):
        env = os.environ.copy()
        env['STREAM_ID'] = self.ID()
        return env

    def run(self, num, trans_time=None):
        if num:
            stream_num = num
        else:
            stream_num = self.nvitem("StreamNum")

        timeout = 0
        if trans_time != None:
            timeout = trans_time
        else:
            timeout = self.nvitem("TransTime")
        if timeout == 0:
            timeout = self.__TIMEOUT_VAL_7x24H

        server_addr = self.nvitem('ServerAddr')
        cmd = [self.__IPERF3_PATH_RUN, '-c', server_addr,
               '-P {}'.format(stream_num), '-t {}'.format(timeout)]
        print('iperf3 run', cmd)
        rc = 0
        try:
            self.set_status('running', cmd)
            proc = subprocess.run(cmd,
                                  capture_output=True, check=True, timeout=timeout+3, env=self.env_patch())
            rc = proc.returncode
            if rc == 0:
                message = proc.stdout.decode('utf-8')
                self.set_status('ready')
            else:
                message = proc.stderr.decode('utf-8')
                self.set_status('error', message)
        except subprocess.CalledProcessError as e:
            message = "CPE: {}".format(e.stderr.decode('utf-8'))
            self.set_status('error', message)
            pass
        except Exception as e:
            # timeout is normal running
            message = "UHE: {}".format(e)
            self.set_status('error', message)
            pass
        return True

    def detect(self):
        print('iperf3 detect')
        if self.status() == "running":
            return True
        return self.run(num=1, trans_time=1)

    def start(self):
        print("iperf3 start")
        if self.status() == "running":
            return True
        return self.run(num=4)

    def stop(self):
        print("iperf3 stop")
        if self.status() != 'running':
            return False
        cmd = [self.__IPERF3_PATH_KILL]
        try:
            proc = subprocess.run(cmd,
                                  capture_output=True, check=True, env=self.env_patch())
            rc = proc.returncode
            if rc == 0:
                message = proc.stdout.decode('utf-8')
                self.set_status('ready')
            else:
                message = proc.stderr.decode('utf-8')
                self.set_status('error', message)
        except subprocess.CalledProcessError as e:
            message = "CPE: {}".format(e.stderr.decode('utf-8'))
            self.set_status('idle', message)
            pass
        except Exception as e:
            # timeout is normal running
            message = "UHE: {}".format(e)
            self.set_status('idle', message)
            pass
        return True

    def halt(self):
        print("iperf3 halt")
        if self.status() == "running":
            return False
        self.set_status('idle')
        return True

    def monitor(self):
        return super().monitor()
