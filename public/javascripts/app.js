/**
 * Created by USER
 */


(function(){

    var myApp =  angular.module("GeekStore", []);
    var cop = 1;
    var usd = 2500;
    var mxn = 168;
    var iva = 0.19;

    //controllers

    myApp.controller("ProductsController" , ProductsController);

    ProductsController.$inject = ['$scope' , '$http'];
    function ProductsController($scope, $http) {
        $scope.products = [];
        var URL = "/api/matrix";
        var valueCop_aux=0;
        var valueTot_aux=0;
        var valueOri_aux=0;
        var iva_aux = 0;
        var coin_aux="";
        var name_aux="";
        $scope.quantity = 1;
        $scope.product = "";
        $scope.idClient = "";
        $scope.nameClient = "";


        $scope.message = "Usted no ha realizado ninguna compra aún";
        $scope.addProduct =  function(){
            //Generates the value in COP of the product and its total value depending on the quantity
            name_aux = $scope.product.split("-")[0];
            coin_aux = $scope.product.split("-")[1];
            valueOri_aux = $scope.product.split("-")[2];
            if(coin_aux == "COP")
                valueCop_aux = valueOri_aux*cop;
            else if(coin_aux == "USD")
                valueCop_aux = valueOri_aux * usd;
            else
                valueCop_aux = valueOri_aux * mxn;
            iva_aux = valueCop_aux * iva;
            valueTot_aux = (valueCop_aux + iva_aux) * $scope.quantity
            //
            $scope.products.push(  {name: name_aux, quantity: $scope.quantity , valueCop: valueCop_aux , valueIva: iva_aux ,  valueTotal: valueTot_aux });
            $scope.product = "";
            $scope.quantity = 1;
            $scope.valueCop = 0;
        };



        $scope.removeProduct =  function(productName){
            for(var i = 0 ;  i < $scope.products.length; i++){
                if(  $scope.products[i].name == productName){
                    $scope.products.splice(i, 1);
                }
            }
        };

        $scope.buyProducts =  function(){
            //TODO
            var URL = "/api/invoice";
            var jsondata =  {idClient: $scope.idClient, nameClient: $scope.nameClient, products: $scope.products};

            $http.post(URL, jsondata).
            success(function(data, status, headers, config) {
                $scope.products = [];
                $scope.currentInvoice = data.currentInvoice;
                $scope.invoicesClient = data.invoicesClient;
            }).
            error(function(data, status, headers, config) {
                console.log("Error " + data + " " + status);
                $scope.message = "There was an error creating the matrix";
            });
        };

        $scope.removeAll = function(){
            $scope.products = [];
            $scope.currentInvoice = null;
            $scope.invoicesClient = null;
            $scope.quantity = 1;
            $scope.product = "";
            $scope.idClient = "";
            $scope.nameClient = "";
        };

        $scope.printCurrentInvoice = function(uuid){
            var dataCurrentInvoice = $scope.currentInvoice;
            var docDefinition = {
                content:[
                    {text: 'Tienda de Figuras de Coleccion'},
                    {text: ' '},
                    {text: 'Factura No: ' + dataCurrentInvoice.key.number},
                    {text: 'Fecha: '+ dataCurrentInvoice.key.date},
                    {text: ' '},
                    {text: 'Cliente: '+ dataCurrentInvoice.client.id + ' - ' + dataCurrentInvoice.client.name},
                    {text: ' '},
                    {text: ' '},
                    table(JSON.parse(angular.toJson($scope.currentInvoice.products)), ['name','quantity', 'valueCop', 'valueIva','valueTotal']),
                    {text: ' '},
                    {text: 'Total Factura: ' + dataCurrentInvoice.totalInvoice}
                ],
                style: {
                    header: {
                        bold: true,
                        color: '#000',
                        fontSize: 12
                    },
                    demoTable: {
                        color: '#666',
                        fontSize: 11
                    }
                }
            };
            pdfMake.createPdf(docDefinition).download();
        };

        function table(data, columns) {
            return {
                table: {
                    headerRows: 1,
                    body: buildTableBody(data, columns)
                }
            };
        }

        function buildTableBody(data, columns) {
            var body = [];
            body.push(columns);
            data.forEach(function(row) {
                var dataRow = [];
                columns.forEach(function(column) {
                    dataRow.push(row[column] =="" || row[column] == null || row[column] == undefined ? "null": row[column].toString());
                })
                body.push(dataRow);
            });
            return body;
        }

    }

})();