from web3 import providers,Web3
import os,json,time,flask,web3,threading
from flask import Flask,request

secret=json.loads(open("secret.json").read())

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

def send_message(to,body):
    from twilio.rest import Client
    account_sid = secret["account_sid"]
    auth_token = secret["auth_token"]
    client = Client(account_sid, auth_token)
    message = client.messages \
        .create(
            body=body,
            from_='+19123729455',
            to=to
        )

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
    threading.Thread(target=send_message,args=(args["phonenumber"],f"Hello {args['name']}. Your account has been successfully registered with ID : {args['id']} in the {args['region']} region.")).start()
    return make_response(args)

def find_linear_match(value,best):
    difference=best-value
    if difference<0:
        return 5
    else:
        return int(round(1-(difference/best),2)*5)

def find_quality_index(weight,hardness,size):
    weight=find_linear_match(weight,65)
    hardness=find_linear_match(hardness,5)
    size=find_linear_match(size,7)
    return int((weight+hardness+size)/3)

def get_price(quality_index,base_price):
    return base_price*(quality_index/5)

@app.get("/upload_quality")
def upload_quality():
    args=dict(request.args)
    quality_index=find_quality_index(int(args["weight"]),int(args["hardness"]),int(args["size"]))
    call_func("add_trade",[args["id"],int(args["weight"]),int(args["hardness"]),int(args["size"]),int(args["quantity"]),quality_index,args["produce"]])
    res=local_call("get_all_farmers")
    farmer=None
    for x in res:
        if x[1]==args["id"]:
            to=x[2]
            farmer=x[0]
    threading.Thread(target=send_message,args=(to,f"Hello {farmer}. Here is the latest quality report of your produce: \nSize: {args['size']} mm \nWeight Per Grain: {args['weight']} mg \nHardness: {args['hardness']} / 5 \nOverall Quality Index: {quality_index} / 5\nEstimated Price Per Unit: {get_price(quality_index,25)}. \nSince your quality index meets the minimum requirements, your trade has been openly listed to wholesalers!")).start()
    return make_response(True)

@app.get("/farmers")
def farmers_list():
    res=local_call("get_all_farmers")
    i=0
    for x in res.copy():
        res[i]=list(res[i])
        res[i][4]="Active"
        i+=1
    return make_response(res)