

class StreamNode(object):
    def __init__(self, stype='iperf3', saddr='0.0.0.0', bw=1000, psize=1518, load=0.1, direct='UL', status='idle', action='-') -> None:
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
        print("Basic node created")
        pass

    def nvitem(self, key):
        # print("nvitem: ", key)
        return self.config[key]

    def set_status(self, status):
        self.config['Status'] = status
        return True

    def detect(self):
        print("base detect")
        return True

    def start(self):
        print("base start")
        return True

    def halt(self):
        print("base halt")
        return True
