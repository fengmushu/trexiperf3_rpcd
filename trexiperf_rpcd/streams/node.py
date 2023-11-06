

class StreamNode(object):
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
        self.message = []
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
        self.config['Status'] = status
        if info != None:
            self.message.append({status: info})
            print(status, info)
        return True

    def status(self):
        return self.config.get('Status')

    def detect(self):
        print("base detect")
        return True

    def start(self):
        print("base start")
        return True

    def halt(self):
        print("base halt")
        return True
    
    def monitor(self):
        print("base monitor")
        return True
