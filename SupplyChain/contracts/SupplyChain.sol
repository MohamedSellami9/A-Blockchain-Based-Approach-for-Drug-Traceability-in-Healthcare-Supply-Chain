// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import './roles/Client.sol';
import './roles/Distributor.sol';
import './roles/Manufacturer.sol';
import './roles/Pharmacy.sol';

contract SupplyChain is Client,Distributor,Manufacturer,Pharmacy{
    enum OrderStatus {Ordered ,Accepted , Declined, Completed}
    enum Status {Created  ,Ordered , Delivering , Delivered,Listed, Sold }
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
        address pharmacy;
        address distributor;
        int price;
        Status Status;
        int tempC;
        int quantity;
        string date;

    }
    struct Order{
        uint id ;
        uint drugIndex;
        address pharmacy;
        address distributor;
        OrderStatus Status;
        address manufacturer;
        int quantity;

    }
    constructor(){       

    }
    function getDrugsNumber() public view returns (uint) {
    return drugsNumber;
}   
function getDrug (uint id)public view returns(Drug memory){
    return drugs[id];
}
function getOrder (uint id)public view returns(Order memory){
    return orders[id];
}
function getAllDrug() public view returns (Drug[] memory) {
    Drug[] memory drugsAvailable = new Drug[](drugsNumber);
    uint j=0;
    for (uint i = 0; i < drugsNumber; i++) {    
        if ((drugs[i].Status == Status.Created)&&(drugs[i].price != 0)){
        drugsAvailable[j] = drugs[i];
         j++;}
    }
    return drugsAvailable;
}
function getAllListedDrugs() public view returns (Drug[] memory){
        Drug[] memory drugsListed = new Drug[](drugsNumber);
    uint j=0;
    for (uint i = 0; i < drugsNumber; i++) {    
        if ((drugs[i].Status == Status.Listed)&&(drugs[i].price != 0)&&(drugs[i].quantity != 0)){
        drugsListed[j] = drugs[i];
         j++;}
    }
    return drugsListed;
}
function getAllDeliveredDrugs(address ad) public view returns (Drug[] memory){
        Drug[] memory drugsDelivered = new Drug[](drugsNumber);
    uint j=0;
    for (uint i = 0; i < drugsNumber; i++) {    
        if (((drugs[i].Status == Status.Delivered)||(drugs[i].Status == Status.Created)||(drugs[i].Status == Status.Sold))&&(drugs[i].price != 0)&&(drugs[i].quantity != 0)&&(ad==drugs[i].ownerID)){
        drugsDelivered[j] = drugs[i];
         j++;}
    }
    return drugsDelivered;
}
function getAllOrders(address ad) public view returns (Order[] memory) {
    Order[] memory OrdersAvailable = new Order[](orderNumber);
    uint j=0;
    for (uint i = 0; i < orderNumber; i++ ) {    
        if ((orders[i].Status == OrderStatus.Ordered)&&(orders[i].manufacturer==ad)){
        OrdersAvailable[j] = orders[i];
        j++;}
    }
    return OrdersAvailable;
}

function getAllOrdersAccepted(address ad) public view returns (Order[] memory) {
    Order[] memory OrdersAvailable = new Order[](orderNumber);
    uint j=0;
    for (uint i = 0; i < orderNumber; i++ ) {    
        if ((orders[i].Status == OrderStatus.Accepted)&&(orders[i].distributor==ad)){
        OrdersAvailable[j] = orders[i];
         j++;}
    }
    return OrdersAvailable;
}
function getAllStatus() public view returns (Status[] memory) {
    Status[] memory status = new Status[](orderNumber);
   
    for (uint i = 0; i < orderNumber; i++ ) {    
        
        status[orders[i].id] = drugs[orders[i].id].Status;
        
    }
    return status;
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
event DrugAdded(uint indexed id, string name, string description, address indexed manufacturer, int price);

function drugCreate(string memory name1, string memory description1, int price , int tempC ,int quantity,string memory date) public payable nameDrug(name1, description1) returns (Drug memory) {
    require(msg.value <= 0.01 ether, "Payment amount is insufficient.");
    Drug memory drug = Drug({
        id : drugsNumber ,
        name : name1,
        description : description1,
        manufacturer : msg.sender,
        Status : Status.Created,
        price : price ,
        ownerID : msg.sender,
        pharmacy : msg.sender,
        distributor : msg.sender,
        tempC : tempC,
        quantity : quantity,
        date : date
        
    });

    drugs[drugsNumber]= drug;
    drugsNumber++;
    emit DrugAdded(drug.id, drug.name, drug.description, drug.manufacturer, drug.price);
    return drug;
}

event OrderAdded(
  uint id,
  uint drugIndex,
  address pharmacy,
  address distributor);

    function orderDrug(uint index , int quantity) public  returns(Order memory) {
        Order memory order = Order({
            id : orderNumber ,
            drugIndex : index,
            pharmacy : msg.sender,
            distributor: 0x0000000000000000000000000000000000000000,
            Status : OrderStatus.Ordered,
            manufacturer : drugs[index].manufacturer,
            quantity: quantity
        });
        orders[orderNumber]= order;
        orderNumber++;
        drugs[index].Status = Status.Ordered;
        emit OrderAdded(order.id, order.drugIndex, order.pharmacy, order.distributor);
        return order;
    }
    function priceChanger(uint index , int price) public {
        drugs[index].price = price;
    }
    event OrderAccepted(uint id);
    function AcceptOrder(uint orderIndex) public AcceptCond(orderIndex) {
        int n = drugs[orders[orderIndex].drugIndex].quantity-orders[orderIndex].quantity;
        if (n>0){
            drugs[orders[orderIndex].drugIndex].quantity-=orders[orderIndex].quantity;
            drugs[orders[orderIndex].drugIndex].Status=Status.Created;
            Drug memory drug2 =drugCreate(drugs[orders[orderIndex].drugIndex].name,drugs[orders[orderIndex].drugIndex].description,drugs[orders[orderIndex].drugIndex].price,drugs[orders[orderIndex].drugIndex].tempC,orders[orderIndex].quantity,drugs[orders[orderIndex].drugIndex].date);
            drug2.manufacturer=drugs[orders[orderIndex].drugIndex].manufacturer;
            drug2.Status=Status.Ordered;
            drugs[drug2.id]=drug2;
            orders[orderIndex].drugIndex=drug2.id; 
            drugs[drug2.id].quantity=orders[orderIndex].quantity;            
            orders[orderIndex].Status=OrderStatus.Accepted;
            drugs[drug2.id].ownerID= orders[orderIndex].pharmacy;
            drugs[drug2.id].pharmacy= orders[orderIndex].pharmacy;
        }
        else if(n==0){
            orders[orderIndex].Status = OrderStatus.Accepted;
            drugs[orders[orderIndex].drugIndex].pharmacy= orders[orderIndex].pharmacy;
        }
        else {
            drugs[orders[orderIndex].drugIndex].Status=Status.Created;
            orders[orderIndex].Status = OrderStatus.Declined;
        }
        emit OrderAccepted(orderIndex);
    }
    function DeclineOrder(uint orderIndex) public AcceptCond(orderIndex) {
    orders[orderIndex].Status = OrderStatus.Declined;
    }
    function startDeliverdrug(uint orderIndex) public DeliveringCond(orderIndex) {
        orders[orderIndex].distributor = msg.sender;
        uint index = orders[orderIndex].drugIndex;
        drugs[index].Status = Status.Delivering;
        drugs[index].distributor = orders[orderIndex].distributor;


    }
    function endDelivering(uint orderIndex) public {
        uint index = orders[orderIndex].drugIndex;
        orders[orderIndex].Status = OrderStatus.Completed;
        drugs[index].Status = Status.Delivered;
        drugs[index].ownerID = orders[orderIndex].pharmacy;
    }
    function buyDrug(uint index) public {
        drugs[index].quantity = drugs[index].quantity-1 ;
        Drug memory drug2 =drugCreate(drugs[index].name,drugs[index].description,drugs[index].price,drugs[index].tempC,drugs[index].quantity,drugs[index].date);
        drugs[drug2.id].Status = Status.Sold;
        drugs[drug2.id].quantity = 1;
        if(drugs[index].quantity==0){
        drugs[index].Status = Status.Sold;
        }
        drugs[drug2.id].ownerID = msg.sender;
    }
    function listDrugs(uint index) public{
        drugs[index].Status = Status.Listed;
    }
function setDistributor(uint orderId) public  {
    require(orders[orderId].Status == OrderStatus.Accepted, "Order has not been placed yet");
    orders[orderId].distributor = msg.sender;
}

}