pragma solidity ^0.8.1;

contract Box {
    struct Farmer {
        string name;
        string id;
        string number;
        string region;
        uint index;
    }
    mapping ( string => Farmer ) public farmers;
    Farmer[] public farmers_list;
    uint count;
    function add_farmer(string memory name,string memory id,string memory number,string memory region) public {
        Farmer memory current_farmer = Farmer(name,id,number,region,count);
        farmers[id]=current_farmer;
        farmers_list.push(current_farmer);
        count+=1;
    }
    function get_farmers() public view returns (Farmer[] memory) {
        return farmers_list;
    }
    function change_number(string memory id) public {
        farmers[id].number="Hello";
        farmers_list[farmers[id].index].number="Hello";
    }
}