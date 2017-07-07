/**
 * Created by USER on 13/04/2017.
 */



var invoices = [];
var numberInvoice = 0;


module.exports.createInvoice = function (req, res) {
	// params of a invoice
	var productsInvoice = req.body.products;
	var idClient = req.body.idClient;
	var nameClient = req.body.nameClient;
	var dateInvoice = givMeDate();
	var totalInvoice = givMeTotalInvoice(productsInvoice);
	var detailInvoice = givMeDetailProducts(productsInvoice);
	numberInvoice = numberInvoice + 1;

	var currentInvoice = { client : {id: idClient , name: nameClient} , key : {number:numberInvoice , date: dateInvoice} , products: productsInvoice , detailInvoice: detailInvoice , totalInvoice: totalInvoice};

	invoices.push(currentInvoice);

	var data = {currentInvoice: currentInvoice, invoicesClient : givMeInvoicesPerClient(idClient,invoices)}

	console.log(data);

	res.status(200).jsonp(data);

};

//Returns the detail of the products of the invoice
function givMeDetailProducts(products){
	var detail = "";
	for(var i=0; i<products.length; i++){
		detail = detail + products[i].quantity + " - " + products[i].name;
		if(i<(products.length-1))
			detail = detail + "; ";
	}
	return detail;
}

//Returns the total of invoice
function givMeTotalInvoice(products){
	var total=0;
	for(var i=0; i<products.length; i++){
		total = total + products[i].valueTotal;
	}
	return total;
}

//Returns a customer's invoices
function givMeInvoicesPerClient(idClient, invoices){
	var invoicesClient = [];
    for(var i = 0 ;  i < invoices.length; i++){
        if(  invoices[i].client.id == idClient){
            invoicesClient.push(invoices[i]);
        }
    }
    return invoicesClient;
}

//Returnd date of system
function givMeDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 

	return (dd+'-'+mm+'-'+yyyy);
}