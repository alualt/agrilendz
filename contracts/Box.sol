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
    }

    struct Loan {
        uint loan_index;
        string farmer_id;
        uint amount;
        bool paid;
    }

    mapping ( string => Farmer ) public farmers;
    Farmer[] public farmers_list;
    uint count;
    mapping ( string => Trade[]) public farmer_trades;
    Trade[] public trades;
    uint trade_count;

    // Average Quality Indexes
    mapping ( string => uint[] ) public aqis;
    mapping ( string => uint[] ) public avg_order_size;
    mapping ( string => uint[] ) public all_order_volumes;
    mapping ( string => uint[] ) public ratings;

    // Balance Sheet

    mapping ( string => uint ) public balances;

    // Loans
    mapping ( string => Loan[] ) public farmer_loans;
    Loan[] public all_loans;
    uint loan_count;

    function add_farmer(string memory name,string memory farmer_id,string memory number,string memory region) public {
        Farmer memory current_farmer = Farmer(name,farmer_id,number,region,count);
        farmers[farmer_id]=current_farmer;
        farmers_list.push(current_farmer);
        balances[farmer_id]=10;
        count+=1;
    }

    function add_trade(string memory farmer_id,uint weight,uint hardness,uint size,uint quantity,uint quality_index,string memory produce) public {
        Trade memory current_trade=Trade(trade_count,farmer_id,weight,hardness,size,true,quantity,quality_index,produce);
        farmer_trades[farmer_id].push(current_trade);
        trades.push(current_trade);
        trade_count+=1;
    }

    function remove_trade(uint trade_id) public {
        string memory x=trades[trade_id].farmer_id;
        uint index=indexOfTrade(farmer_trades[x], trades[trade_id]);
        farmer_trades[x][index].open=false;
        trades[trade_id].open=false;
    }

    function get_farmer_trades(string memory farmer_id) public view returns (Trade[] memory) {
        return farmer_trades[farmer_id];
    }

    function get_all_trades() public view returns (Trade[] memory) {
        return trades;
    }

    function get_all_farmers() public view returns (Farmer[] memory) {
        return farmers_list;
    }

    function change_number(string memory farmer_id) public {
        farmers[farmer_id].number="Hello";
        farmers_list[farmers[farmer_id].index].number="Hello";
    }

    function give_loan(string memory farmer_id,uint amount) public {
        balances[farmer_id]+=amount;
        Loan memory current_loan=Loan(loan_count,farmer_id,amount,false);
        farmer_loans[farmer_id].push(current_loan);
        all_loans.push(current_loan);
        loan_count+=1;
    }

    function mark_loan_as_paid(uint loan_index) public {
        string memory farmer_id=all_loans[loan_index].farmer_id;
        uint index=indexOfLoan(farmer_loans[farmer_id], all_loans[loan_index]);
        farmer_loans[farmer_id][index].paid=true;
        all_loans[loan_index].paid=true;
    }

    function get_balance(string memory farmer_id) public view returns (uint) {
        return balances[farmer_id];
    }

    function get_farmer_loans(string memory farmer_id) public view returns (Loan[] memory) {
        return farmer_loans[farmer_id];
    }

    function get_all_loans() public view returns (Loan[] memory) {
        return all_loans;
    }
}