import litedb
accounts=litedb.get_conn("accounts")
accounts.clear_collection()