from web3 import providers,Web3
import os,json,time
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

contract_address="0x67818599eFab7301B1f06fc2625F3A510E9622EB"

def call_func(name,args=[]):
    contract = w3.eth.contract(address=contract_address,abi=abi)
    statement=f"call_function = contract.functions.{name}({','.join([str(x) for x in args])}).build_transaction("+"""
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
    contract = w3.eth.contract(address=contract_address,abi=abi)
    statement=f"call_function = contract.functions.{name}({','.join([str(x) for x in args])}).call()"
    new_locals,new_globals={}|globals()|locals(),{}|globals()|locals()
    exec(statement,new_globals,new_locals)
    call_function=new_locals["call_function"]
    return call_function