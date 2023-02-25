// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import './roles/Client.sol';
import './roles/Distributor.sol';
import './roles/Manufacturer.sol';
import './roles/Pharmacy.sol';

contract SupplyChain is Client,Distributor,Manufacturer,Pharmacy{
    enum OrderStatus {Ordered ,Accepted , Declined, Completed}
    enum Status {Created  , Ordered , Delivering , Delivered , Sold }
    mapping(uint => Drug) public drugs; 
    uint public drugsNumber=0;   

    mapping(uint => Order) public orders; 
    uint public orderNumber=0;   
    struct Drug {
        uint id ;
        string name;
        string description;
        address manufacturer;
        address ownerID;
        int price;
        Status Status;
    }
    struct Order{
        uint id ;
        uint drugIndex;
        address pharmacy;
        address distributor;
        OrderStatus Status;
    }
    constructor(){       

    }
  function getDrugsNumber() public view returns (uint) {
    return drugsNumber;
}   
    modifier orderCond(uint _index){
        require(drugs[_index].manufacturer != msg.sender ,"erroooooooooooor");
    _;
    }
    modifier DeliveringCond(uint _index){
        require(orders[_index].Status == OrderStatus.Accepted);
    _;
    }
    modifier AcceptCond(uint _Index){
        require(orders[_Index].Status == OrderStatus.Ordered);
        _;
    }
    modifier BuyCond(uint _Index){
        require(orders[_Index].Status == OrderStatus.Completed);
        require(drugs[orders[_Index].drugIndex].Status == Status.Delivered);
        _;
    }
    modifier nameDrug(string memory _name1,string memory _description1){
        require(bytes(_name1).length > 0, "String must not be empty");
        require(bytes(_description1).length > 0, "String must not be empty");
        _;
    }
function drugCreate (string memory name1, string memory description1, int price) public payable onlyManufacturer nameDrug(name1, description1) returns (Drug memory){
    require(msg.value <= 0.01 ether, "Payment amount is insufficient.");
    Drug memory drug = Drug({
        id : drugsNumber ,
        name : name1,
        description : description1,
        manufacturer : msg.sender,
        Status : Status.Created,
        price : price ,
        ownerID : msg.sender
    });

    drugs[drugsNumber]= drug;
    drugsNumber++;
    return drug;

}
//orderCond(index)
    function orderDrug(uint index , address distributor ) public onlyPharmacie  returns(Order memory) {
        Order memory order = Order({
            id : orderNumber ,
            drugIndex : index,
            pharmacy : msg.sender,
            distributor: distributor,
            Status : OrderStatus.Ordered
        });
        orders[orderNumber]= order;
        orderNumber++;
        drugs[index].Status = Status.Ordered;
        return order;
    }
    function priceChanger(uint index , int price) public onlyPharmacie {
        drugs[index].price = price;
    }
    function AcceptOrder(uint orderIndex) public onlyManufacturer AcceptCond(orderIndex) {
        orders[orderIndex].Status = OrderStatus.Accepted;
    }
    function DeclineOrder(uint orderIndex) public onlyManufacturer AcceptCond(orderIndex) {
    orders[orderIndex].Status = OrderStatus.Declined;
    }
    function startDeliverdrug(uint orderIndex) public onlyDistributor DeliveringCond(orderIndex) {
        uint index = orders[orderIndex].drugIndex;
        drugs[index].Status = Status.Delivering;
        drugs[index].ownerID = orders[orderIndex].distributor;

    }
    function endDelivering(uint orderIndex) public onlyDistributor {
        uint index = orders[orderIndex].drugIndex;
        orders[orderIndex].Status = OrderStatus.Completed;
        drugs[index].Status = Status.Delivered;
        drugs[index].ownerID = orders[orderIndex].pharmacy;
    }
    function buyDrug(uint index) public onlyClient {
        drugs[index].Status = Status.Sold;
        drugs[index].ownerID = msg.sender;
    }
    

}