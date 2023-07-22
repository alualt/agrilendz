pragma solidity ^0.8.1;

contract Box {

    function indexOfTrade(Trade[] memory arr, Trade memory searchFor) pure private returns (uint) {
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i].id == searchFor.id) {
            return i;
            }
        }
        return 99;
    }

    function indexOfLoan(Loan[] memory arr, Loan memory searchFor) pure private returns (uint) {
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i].loan_index == searchFor.loan_index) {
            return i;
            }
        }
        return 99;
    }

    struct Farmer {
        string name;
        string farmer_id;
        string number;
        string region;
        uint index;
    }

    struct Trade {
        uint id;
        string farmer_id;
        uint weight;
        uint hardness;
        uint size;
        bool open;
        uint quantity;
        uint quality_index;
        string produce;
        uint price;
    }

    struct Loan {
        uint loan_index;
        string farmer_id;
        uint amount;
        bool paid;
        string giver;
    }

    struct Loan_Request {
        uint loan_index;
        string farmer_id;
        uint amount;
        bool disapproved;
        bool approved;
    }

    struct Farmer_Stat {
        string name;
        string farmer_id;
        string number;
        string region;
        uint index;
        uint[] aqis;
        uint[] order_sizes;
        uint[] order_volumes;
        uint[] ratings;
        Trade[] trades;
        Loan[] loans;
    }

    mapping ( string => Farmer ) public farmers;
    Farmer[] public farmers_list;
    uint count;
    mapping ( string => Trade[]) public farmer_trades;
    Trade[] public trades;
    uint trade_count;

    // Average Quality Indexes
    mapping ( string => uint[] ) public aqis;
    mapping ( string => uint[] ) public order_sizes;
    mapping ( string => uint[] ) public all_order_volumes;
    mapping ( string => uint[] ) public ratings;

    // Balance Sheet
    mapping ( string => uint ) public balances;

    // Loans
    mapping ( string => Loan[] ) public farmer_loans;
    Loan[] public all_loans;
    uint loan_count;

    // Loan requests
    Loan_Request[] public loan_requests;
    uint loan_request_count;

    function apply_for_loan(string memory farmer_id,uint amount) public {
        if (amount%10==0 && amount>0) {
            loan_requests.push(Loan_Request(loan_request_count,farmer_id,amount,false,false));
            loan_request_count+=1;
        }
    }

    function add_farmer(string memory name,string memory farmer_id,string memory number,string memory region) public {
        if (balances[farmer_id]==0) {
            Farmer memory current_farmer = Farmer(name,farmer_id,number,region,count);
            farmers[farmer_id]=current_farmer;
            farmers_list.push(current_farmer);
            balances[farmer_id]=100;
            count+=1;
        }
    }

    function add_trade(string memory farmer_id,uint weight,uint hardness,uint size,uint quantity,uint quality_index,string memory produce,uint price) public {
        Trade memory current_trade=Trade(trade_count,farmer_id,weight,hardness,size,true,quantity,quality_index,produce,price);
        farmer_trades[farmer_id].push(current_trade);
        trades.push(current_trade);
        trade_count+=1;
        aqis[farmer_id].push(quality_index);
    }

    function remove_trade(uint trade_id,string memory payer) public {
        uint amount;
        amount=trades[trade_id].quantity*trades[trade_id].price;
        if (amount<=balances[payer]) {
            string memory x=trades[trade_id].farmer_id;
            uint index=indexOfTrade(farmer_trades[x], trades[trade_id]);
            farmer_trades[x][index].open=false;
            trades[trade_id].open=false;
            balances[payer]-=amount;
            balances[x]+=amount;
            order_sizes[x].push(trades[trade_id].quantity);
            all_order_volumes[x].push(trades[trade_id].quantity*trades[trade_id].price);
        }
    }

    function get_farmer_trades(string memory farmer_id) public view returns (Trade[] memory) {
        return farmer_trades[farmer_id];
    }

    function get_farmer(string memory farmer_id) public view returns (Farmer_Stat memory) {
        Farmer memory current_farmer=farmers[farmer_id];
        Farmer_Stat memory current_stat=Farmer_Stat(current_farmer.name,current_farmer.farmer_id,current_farmer.number,current_farmer.region,current_farmer.index,aqis[current_farmer.farmer_id],order_sizes[current_farmer.farmer_id],all_order_volumes[current_farmer.farmer_id],ratings[current_farmer.farmer_id],farmer_trades[current_farmer.farmer_id],farmer_loans[farmer_id]);
        return current_stat;
    }

    function get_all_trades() public view returns (Trade[] memory) {
        return trades;
    }

    function get_all_farmers() public view returns (Farmer[] memory) {
        return farmers_list;
    }

    function give_loan(uint request_id,string memory giver) public {
        Loan_Request memory x;
        x=loan_requests[request_id];
        if (x.amount<=balances[giver] && x.disapproved==false) {
            loan_requests[request_id].approved=true;
            balances[x.farmer_id]+=x.amount;
            balances[giver]-=x.amount;
            Loan memory current_loan=Loan(loan_count,x.farmer_id,x.amount,false,giver);
            farmer_loans[x.farmer_id].push(current_loan);
            all_loans.push(current_loan);
            loan_count+=1;
        }
    }

    function get_loan_count() public view returns (uint) {
        return loan_count;
    }

    function disapprove_loan(uint request_id) public {
        loan_requests[request_id].disapproved=true;
        delete loan_requests[request_id];
    }

    function give_loan_requests() public view returns (Loan_Request[] memory) {
        return loan_requests;
    }

    function mark_loan_as_paid(uint loan_index) public {
        string memory farmer_id=all_loans[loan_index].farmer_id;
        uint index=indexOfLoan(farmer_loans[farmer_id], all_loans[loan_index]);
        balances[all_loans[loan_index].giver]+=(all_loans[loan_index].amount+(all_loans[loan_index].amount/10));
        balances[all_loans[loan_index].farmer_id]-=(all_loans[loan_index].amount+(all_loans[loan_index].amount/10));
        farmer_loans[farmer_id][index].paid=true;
        all_loans[loan_index].paid=true;
    }

    function get_balance(string memory farmer_id) public view returns (uint) {
        return balances[farmer_id];
    }

    function get_farmer_loans(string memory farmer_id) public view returns (Loan[] memory) {
        return farmer_loans[farmer_id];
    }

    function set_balance(string memory farmer_id) public {
        balances[farmer_id]=0;
        balances[farmer_id]+=1000;
    }

    function add_rating(string memory farmer_id,uint rating) public {
        ratings[farmer_id].push(rating);
    }

    function get_trade(uint id) public view returns (Trade memory) {
        return trades[id];
    }

    function get_loan_request(uint id) public view returns (Loan_Request memory) {
        return loan_requests[id];
    }

    function get_loan(uint id) public view returns (Loan memory) {
        return all_loans[id];
    }

}