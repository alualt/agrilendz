pragma solidity ^0.8.1;

contract Box {
    mapping ( 
        string => int256
    ) balanceSheet;
    uint public blockNumber;
    function name() public {
        blockNumber=block.number;
    }
}