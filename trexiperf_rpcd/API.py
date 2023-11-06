import json

from .streams.streams import *

ss = stream_nodes()


def server():
    return {"message": json.dumps(ss.get_servers())}


'''
idle -> remove/edit/detect
error -> remove/edit/detect
ready -> start/stop/halt
running -> stop/finished/faileds
'''


def stream(node_type):
    print("stream: ", node_type)
    if node_type == 'header':
        return {'message': json.dumps(ss.get_header())}
    elif node_type == 'list':
        return {"message": json.dumps(ss.get_dataset())}
    else:
        print("error stream node_type: ", node_type)


def stream_add(node_type, server, bw, psize, load, dirx):
    ss.append(node_type, server, bw, psize,
              load, dirx)
    return {"message": json.dumps(ss.get_dataset())}


def stream_action(dosome):
    args = dosome.split('-', )
    action = 'ss.{}("{}")'.format(args[0], args[1])
    print(action)
    rc = eval(action)
    print(rc)

    return {"message": json.dumps(ss.get_dataset())}


def monitor(mp=None):
    return {"message": json.dumps(ss.monitor())}
