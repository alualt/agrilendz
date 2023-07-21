from web3 import providers,Web3
import os,json,time,flask,web3
from flask import Flask,request

app=Flask(__name__)

provider=providers.rpc.HTTPProvider("https://rpc.api.moonbase.moonbeam.network")
w3=Web3(provider)
caller = "0xd16C18c0262F5e159a8EBcc5dac86bAE72038c48"
private_key="e4394b0bf6d0fb1be14e50ef91d753ed2ca0a5f0a67e2d64dbf2c2ac2bdb33cc"
Chain_id = w3.eth.chain_id
info=os.listdir("artifacts/build-info/")[0]
abi=json.loads(open("artifacts/build-info/"+info).read())
abi=abi["output"]["contracts"]
abi=abi[list(abi.keys())[0]]
abi=abi[list(abi.keys())[0]]["abi"]

def get_contract_address():
    return open("contract_hash").read()

def call_func(name,args=[]):
    contract_address=get_contract_address()
    contract = w3.eth.contract(address=contract_address,abi=abi)
    statement=f"call_function = contract.functions.{name}({','.join([json.dumps(x) for x in args])}).build_transaction("+"""
        {
            'from': caller,
            'nonce': w3.eth.get_transaction_count(caller),
        }
    )
"""
    new_locals,new_globals={}|globals()|locals(),{}|globals()|locals()
    exec(statement,new_globals,new_locals)
    call_function=new_locals["call_function"]
    tx_create = w3.eth.account.sign_transaction(call_function, private_key)
    tx_hash = w3.eth.send_raw_transaction(tx_create.rawTransaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_hash

def local_call(name,args=[]):
    contract_address=get_contract_address()
    contract = w3.eth.contract(address=contract_address,abi=abi)
    statement=f"call_function = contract.functions.{name}({','.join([json.dumps(x) for x in args])}).call()"
    new_locals,new_globals={}|globals()|locals(),{}|globals()|locals()
    exec(statement,new_globals,new_locals)
    call_function=new_locals["call_function"]
    return call_function

def make_response(data):
    if type(data)!=str:
        data=json.dumps(data)
    resp=flask.Response(data)
    resp.headers["Access-Control-Allow-Origin"]="*"
    resp.headers["Content-Type"]="application/json"
    return resp

@app.get("/upload")
def upload():
    args=dict(request.args)
    call_func("add_farmer",[args["name"],args["id"],args["phonenumber"],args["region"]])
    return make_response(args)

@app.get("/farmers")
def farmers_list():
    res=local_call("get_farmers")
    i=0
    for x in res.copy():
        res[i]=list(res[i])
        res[i][4]="Active"
        i+=1
    return make_response(res)