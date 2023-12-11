import os
import subprocess


class StreamNode(object):
    __TIMEOUT_VAL_7x24H = 600

    def __init__(self, id, stype='base', saddr='0.0.0.0', bw=1000, psize=1518, load=0.1, direct='UL', status='idle', action='-') -> None:
        self.config = {
            'ServerType': stype,
            'ServerAddr': saddr,
            'BandWidth': bw,
            'PacketSize': psize,
            'Load': load,
            'Direction': direct,
            'Status': status,
            'Actions': action,
            'handler': None
        }
        self.__ID = id
        self.__message = []
        self.__refresh_need = False
        self.MAX_STAT_COUNT = 512
        self.nvitem('WlanCardAddr', "192.168.10.230")
        self.SCRIPTS_STAT_SYNC = './traffic_gen/streams/scripts/rsync_statistics.sh'
        print("Basic node created")
        pass

    def ID(self):
        return self.__ID

    def nvitem(self, key, val=None) -> str:
        oval = self.config.get(key)
        if val != None:
            if oval != val:
                print("update {} from {} to {}".format(key, oval, val))
            self.config[key] = val
        return oval

    def update(self, co):
        rc = False
        for k, v in co.items():
            if self.nvitem(k, v):
                rc = True
        return rc

    def set_status(self, status, info=None):
        prev = self.config.get('Status')
        if prev != status:
            self.__refresh_need = True
        self.config['Status'] = status
        if info != None:
            self.__message.append({status: info})
            print(status, info)
        return True

    def env_patch(self, kvm):
        env = os.environ.copy()
        env['STREAM_ID'] = self.ID()
        for k, v in kvm.items():
            env[k] = "{}".format(v)
        return env

    def run(self, num=0, trans_time=None):
        if num > 0:
            self.nvitem("StreamNum", num)
        timeout = 0
        if trans_time != None:
            timeout = trans_time
        if timeout == 0:
            timeout = self.__TIMEOUT_VAL_7x24H
        stream_num = self.nvitem("StreamNum")
        server_addr = self.nvitem('ServerAddr')
        scripts_start = self.nvitem("ScriptStart")
        cmd = [scripts_start, '-c', server_addr,
               '-P {}'.format(stream_num), '-t {}'.format(timeout)]
        print('node run', cmd)
        rc = 0
        try:
            self.set_status('running', cmd)
            proc = subprocess.run(cmd,
                                  capture_output=True, check=True, timeout=timeout+3, env=self.env_patch({"RUN_TIMEOUT": timeout}))
            rc = proc.returncode
            if rc == 0:
                message = proc.stdout.decode('utf-8')
                self.set_status('ready')
            else:
                message = proc.stderr.decode('utf-8')
                if rc == 2:
                    self.set_status('idle', message)
                else:
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

    def stat_rsync(self, tov=5):
        try:
            cmd = self.SCRIPTS_STAT_SYNC
            proc = subprocess.run(cmd, capture_output=True, check=True, timeout=tov, env=self.env_patch({
                "WLAN_CARD_ADDR": self.nvitem("WlanCardAddr"),
            }))
            rc = proc.returncode
            if rc == 0:
                message = proc.stdout.decode("utf-8")
            else:
                message = proc.stderr.decode('utf-8')
            print(message)
        except Exception as e:
            message = "UHE: rsync - {}".format(e)
            print(message)
            pass

    def status(self):
        return self.config.get('Status')

    def detect(self):
        print("base detect")
        return True

    def start(self):
        print("base start")
        return True

    def stop(self):
        print("base stop")
        if self.status() != 'running':
            return False
        scripts_stop = self.nvitem("ScriptStop")
        cmd = [scripts_stop, ]
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
        print("base halt")
        return True

    def monitor(self):
        # print("base monitor")
        if self.__refresh_need:
            self.__refresh_need = False
            return False
        return True

    def statistics(self):
        ''' load csv '''
        # print("base statistics")
        self.stat_rsync(tov=10)

        dm = {}
        import csv
        import re
        CSV_DIR_PREFIX = '/tmp/trex/csv/trex-sta1/'
        for root, dirs, _ in os.walk(CSV_DIR_PREFIX):
            for dir in dirs:
                ifname = re.search(r'ath[0-9]+', dir, re.M | re.I)
                if ifname:
                    ifname = ifname.group()
                    print(ifname)
                else:
                    continue
                files = os.listdir(os.path.join(root, dir))
                for file in files:
                    if re.search('if_octets', file) == None:
                        continue
                    fp = os.path.join(root, dir, file)
                    fa = file.split('-')
                    print(ifname, fp, fa)
                    ds = []
                    try:
                        with open(fp) as stat:
                            dialect = csv.Sniffer().sniff(stat.readline(128))
                            stat.seek(0)
                            stat.readline(128)  # ignore header line
                            rows = csv.reader(stat, dialect, delimiter=',')
                            for row in rows:
                                # print(row)
                                ds.append(row)
                    except Exception as e:
                        print(e)
                    def sort_by_time(elem):
                        return elem[0]
                    ds.sort(key=sort_by_time)
                    if len(ds) > self.MAX_STAT_COUNT:
                        ignore = len(ds) - self.MAX_STAT_COUNT
                        ds = ds[ignore:]
                dm.update({ifname: ds})
        # print(dm)
        return dm
