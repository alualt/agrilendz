from web3 import providers,Web3
import os,json,time,flask,web3,threading,litedb
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

accounts=litedb.get_conn("accounts")

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
    threading.Thread(target=send_message,args=(args["phonenumber"],f"Hello {args['name']}. Your account has been successfully registered with ID : {args['id']} in the {args['region']} region. \nAs an early joining bonus, we have credited $100 into your account!")).start()
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
    price=int(get_price(quality_index,25))
    if price==0:
        price+=1
    call_func("add_trade",[args["id"],int(args["weight"]),int(args["hardness"]),int(args["size"]),int(args["quantity"]),quality_index,args["produce"],price])
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

@app.get("/trades")
def trades():
    final_trades=[]
    trades_list=local_call("get_all_trades")
    for x in trades_list:
        if x[5]==True:
            trade_data=x
            farmer_id=x[1]
            farmer_details=local_call("get_farmer",[farmer_id])
            new_trade_data={
                "id":trade_data[0],
                "farmer_id":trade_data[1],
                "weight":trade_data[2],
                "hardness":trade_data[3],
                "size":trade_data[4],
                "open":trade_data[5],
                "quantity":trade_data[6],
                "quality_index":trade_data[7],
                "produce":trade_data[8],
                "price":trade_data[9],
                "phone_number":farmer_details[2],
                "region":farmer_details[3],
                "farmer_name":farmer_details[0],
            }
            final_trades.append(new_trade_data)
    return make_response(final_trades)

@app.get("/login")
def login():
    args=dict(request.args)
    pull_request=accounts.get(args["email"])
    balance=local_call("get_balance",[args["email"]])
    if pull_request in [None,False]:
        return make_response(False)
    else:
        return make_response(pull_request|{"balance":balance})

@app.get("/register")
def register():
    args=request.args
    pull_request=accounts.get(args["email"])
    account_details={
        "bank":(args["bank"]=="true"),
        "wholesaler":(args["wholesaler"]=="true"),
        "agent":(args["agent"]=="true"),
    }
    if pull_request in [None,False]:
        accounts.set(args["email"],account_details)
        print(args["email"])
        call_func("set_balance",[args["email"]])
        return make_response(account_details)
    else:
        return make_response(pull_request)

def average(array):
    if len(array)==0:
        return 0
    else:
        return sum(array)/len(array)

def sort_trade(x):
    trade_data=x
    return {
        "id":trade_data[0],
        "farmer_id":trade_data[1],
        "weight":trade_data[2],
        "hardness":trade_data[3],
        "size":trade_data[4],
        "open":trade_data[5],
        "quantity":trade_data[6],
        "quality_index":trade_data[7],
        "produce":trade_data[8],
        "price":trade_data[9]
    }

def sort_loan(x):
    return {
        "id":x[0],
        "farmer_id":x[1],
        "amount":x[2],
        "paid":x[3],
        "giver":x[4]
    }

@app.get("/farmer")
def farmer_details():
    args=dict(request.args)
    farmer_stats=local_call("get_farmer",[args["id"]])
    farmer_loans=[sort_loan(x) for x in farmer_stats[10]]
    new_farmer_stats={
        "name":farmer_stats[0],
        "farmer_id":farmer_stats[1],
        "number":farmer_stats[2],
        "region":farmer_stats[3],
        "index":farmer_stats[4],
        "aqi":average(farmer_stats[5]),
        "order_sizes":average(farmer_stats[6]),
        "order_volumes":sum(farmer_stats[7]),
        "total_orders":len(farmer_stats[7]),
        "balance":local_call("get_balance",[farmer_stats[1]]),
        "ratings":average(farmer_stats[8]),
        "trades":[sort_trade(x) for x in farmer_stats[9]],
        "pending_loans":[x["amount"] for x in farmer_loans if x["paid"]==False],
        "paid_loans":len([x["amount"] for x in farmer_loans if x["paid"]==True])
        }
    return make_response(new_farmer_stats)

@app.get("/trade")
def trade_details():
    args=dict(request.args)
    trade_data=local_call("get_trade",[int(args["id"])])
    new_trade_data=sort_trade(trade_data)
    return make_response(new_trade_data)

@app.get("/rate")
def rate():
    args=dict(request.args)
    call_func("add_rating",[args["id"],int(args["rating"])])
    return make_response(True)

@app.get("/buy")
def buy():
    args=dict(request.args)
    trade_data=local_call("get_trade",[int(args["id"])])
    new_trade_data=sort_trade(trade_data)
    farmer_stats=local_call("get_farmer",[new_trade_data["farmer_id"]])
    farmer_stats={
        "name":farmer_stats[0],
        "farmer_id":farmer_stats[1],
        "number":farmer_stats[2],
        "region":farmer_stats[3],
        "index":farmer_stats[4],
        "aqi":average(farmer_stats[5]),
        "order_sizes":average(farmer_stats[6]),
        "order_volumes":sum(farmer_stats[7]),
        "total_orders":len(farmer_stats[7]),
        "balance":local_call("get_balance",[farmer_stats[1]]),
        "ratings":average(farmer_stats[8]),
        "trades":[sort_trade(x) for x in farmer_stats[9]]
        }
    call_func("remove_trade",[int(args["id"]),args["email"]])
    threading.Thread(target=send_message,args=(farmer_stats["number"],f"Congratulations {farmer_stats['name']}!\nAn order has been placed for {new_trade_data['quantity']} Kg of {new_trade_data['produce']} at the price of ${new_trade_data['price']} per unit.\nTotal order amount: ${new_trade_data['quantity']*new_trade_data['price']}")).start()
    return make_response(True)

@app.get("/apply_for_loan")
def apply_for_loan():
    args=dict(request.args)
    call_func("apply_for_loan",[args["id"],int(args["amount"])])
    farmer_id=args["id"]
    farmer_stats=local_call("get_farmer",[farmer_id])
    farmer_stats={
        "name":farmer_stats[0],
        "farmer_id":farmer_stats[1],
        "number":farmer_stats[2],
        "region":farmer_stats[3],
        "index":farmer_stats[4],
        "aqi":average(farmer_stats[5]),
        "order_sizes":average(farmer_stats[6]),
        "order_volumes":sum(farmer_stats[7]),
        "total_orders":len(farmer_stats[7]),
        "balance":local_call("get_balance",[farmer_stats[1]]),
        "ratings":average(farmer_stats[8]),
        "trades":[sort_trade(x) for x in farmer_stats[9]]
        }
    threading.Thread(target=send_message,args=(farmer_stats["number"],f"Congratulations {farmer_stats['name']}!\nYour loan request for ${args['amount']} has been successfully listed and is currently waiting for approval. \nThe money will be credit in your account once it has been approved by the bank.")).start()
    return make_response(True)

def sort_loan_request(x):
    return {
        "id":x[0],
        "farmer_id":x[1],
        "amount":x[2],
        "disapproved":x[3],
        "approved":x[4]
    }

@app.get("/loans")
def loans():
    all_loans=local_call("give_loan_requests")
    print(all_loans)
    new_loans=[sort_loan_request(x) for x in all_loans if x[3]==False and x[2]!=0 and x[4]==False]
    i=0
    for x in new_loans.copy():
        farmer_stats=local_call("get_farmer",[x["farmer_id"]])
        farmer_stats={
            "name":farmer_stats[0],
            "farmer_id":farmer_stats[1],
            "number":farmer_stats[2],
            "region":farmer_stats[3],
            "index":farmer_stats[4],
            "aqi":average(farmer_stats[5]),
            "order_sizes":average(farmer_stats[6]),
            "order_volumes":sum(farmer_stats[7]),
            "total_orders":len(farmer_stats[7]),
            "balance":local_call("get_balance",[farmer_stats[1]]),
            "rating":average(farmer_stats[8]),
            "trades":[sort_trade(x) for x in farmer_stats[9]],
            "pending_loans":[sort_loan(x)["amount"] for x in farmer_stats[10] if sort_loan(x)["paid"]==False]
            }
        new_loans[i]=new_loans[i]|{"name":farmer_stats["name"],"region":farmer_stats["region"],"rating":farmer_stats["rating"],"pending_loans":sum(farmer_stats["pending_loans"]),"farmer_id":farmer_stats["farmer_id"]}
        i+=1
    return make_response(new_loans)

@app.get("/approve_loan")
def approve_loan():
    args=dict(request.args)
    farmer_id=(local_call("get_loan_request",[int(args["id"])]))[1]
    print(farmer_id)
    call_func("give_loan",[int(args["id"]),args["email"]])
    farmer_stats=local_call("get_farmer",[farmer_id])
    farmer_stats={
        "name":farmer_stats[0],
        "farmer_id":farmer_stats[1],
        "number":farmer_stats[2],
        "region":farmer_stats[3],
        "index":farmer_stats[4],
        "aqi":average(farmer_stats[5]),
        "order_sizes":average(farmer_stats[6]),
        "order_volumes":sum(farmer_stats[7]),
        "total_orders":len(farmer_stats[7]),
        "balance":local_call("get_balance",[farmer_stats[1]]),
        "ratings":average(farmer_stats[8]),
        "trades":[sort_trade(x) for x in farmer_stats[9]]
        }
    threading.Thread(target=send_message,args=(farmer_stats["number"],f"Congratulations {farmer_stats['name']}!\nYour loan has been granted to you! \nThe money has been credited in your account.\nLoan ID: {int(local_call('get_loan_count'))-1}\nDo not lose your Loan ID as it will be required to settle the Loan.\nCurrent balance: {farmer_stats['balance']}")).start()
    return make_response(True)

@app.get("/disapprove_loan")
def disapprove_loan():
    args=dict(request.args)
    loan_request=(local_call("get_loan_request",[int(args["id"])]))
    call_func("disapprove_loan",[int(args["id"])])
    farmer_id=loan_request[1]
    farmer_stats=local_call("get_farmer",[farmer_id])
    farmer_stats={
        "name":farmer_stats[0],
        "farmer_id":farmer_stats[1],
        "number":farmer_stats[2],
        "region":farmer_stats[3],
        "index":farmer_stats[4],
        "aqi":average(farmer_stats[5]),
        "order_sizes":average(farmer_stats[6]),
        "order_volumes":sum(farmer_stats[7]),
        "total_orders":len(farmer_stats[7]),
        "balance":local_call("get_balance",[farmer_stats[1]]),
        "ratings":average(farmer_stats[8]),
        "trades":[sort_trade(x) for x in farmer_stats[9]]
        }
    threading.Thread(target=send_message,args=(farmer_stats["number"],f"Hello {farmer_stats['name']}!\nWe are sorry to inform you that your loan request of ${loan_request[2]} has been rejected by the bank.\nThis could have been due to several reason like low yield, low quality index, pending loans etc.\nCurrent balance: {farmer_stats['balance']}")).start()
    return make_response(True)

@app.get("/settle_loan")
def settle_loan():
    args=dict(request.args)
    loan_request=(local_call("get_loan",[int(args["id"])]))
    call_func("mark_loan_as_paid",[int(args["id"])])
    farmer_id=loan_request[1]
    farmer_stats=local_call("get_farmer",[farmer_id])
    amount=loan_request[2]
    farmer_stats={
        "name":farmer_stats[0],
        "farmer_id":farmer_stats[1],
        "number":farmer_stats[2],
        "region":farmer_stats[3],
        "index":farmer_stats[4],
        "aqi":average(farmer_stats[5]),
        "order_sizes":average(farmer_stats[6]),
        "order_volumes":sum(farmer_stats[7]),
        "total_orders":len(farmer_stats[7]),
        "balance":local_call("get_balance",[farmer_stats[1]]),
        "ratings":average(farmer_stats[8]),
        "trades":[sort_trade(x) for x in farmer_stats[9]]
        }
    threading.Thread(target=send_message,args=(farmer_stats["number"],f"Congratulation {farmer_stats['name']}! You have settled your Loan of ${amount} successfully!\nLoan ID: {args['id']}\nCurrent Balance: ${farmer_stats['balance']}")).start()
    return make_response(True)