angular.module('starter.controllers', [])

.controller('HomeCtrl', function ($scope, $ionicPlatform, $ionicPopup, $ionicModal, $ionicLoading) {
  $scope.printers = [];
  $scope.emulation = {
      value: ''};
  $scope.printerStatus;
  var StarPRTN;
  var Camera;
  $ionicPlatform.ready(function () {
      StarPRTN = starprnt;
      Camera = navigator.camera;
  });
  
  //Emulation based on printer type (model)
  $scope.printerModels = [
    {text: "mPOP", emulation: "StarPRNT" },
    {text: "FVP10", emulation: "StarLine" },
    {text: "TSP100", emulation: "StarGraphic" },
    {text: "TSP650II", emulation: "StarLine" },
    {text: "TSP700II", emulation: "StarLine" },
    {text: "TSP800II", emulation: "StarLine" },
    {text: "SP700", emulation: "StarDotImpact" },
    {text: "SM-S210i", emulation: "EscPosMobile" },
    {text: "SM-S220i", emulation: "EscPosMobile" },
    {text: "SM-S230i", emulation: "EscPosMobile" },
    {text: "SM-T300i/T300", emulation: "EscPosMobile" },
    {text: "SM-T400i", emulation: "EscPosMobile" },
    {text: "SM-L200", emulation: "StarPRNT" },
    {text: "SM-L300", emulation: "StarPRNT" },
    {text: "BSC10", emulation: "EscPos" },
    {text: "SM-S210i StarPRNT", emulation: "StarPRNT" },
    {text: "SM-S220i StarPRNT", emulation: "StarPRNT" },
    {text: "SM-S230i StarPRNT", emulation: "StarPRNT" },
    {text: "SM-T300i/T300 StarPRNT", emulation: "StarPRNT" },
    {text: "SM-T400i StarPRNT", emulation: "StarPRNT" }
]

   //Find available printers
  $scope.printerTypePopup = function() {
    $scope.selectedType = { value: 'All'};
    $scope.types = [
        { text: "All", value: "All" },
        { text: "LAN", value: "LAN" },
        { text: "Bluetooth", value: "Bluetooth" },
        { text: "USB", value: "USB" }
      ];

     var myPopup = $ionicPopup.show({
      template: '<ion-list><ion-radio ng-repeat="type in types" ng-model="selectedType.value" ng-value="type.value">{{type.text}}</ion-radio>',
      title: 'Select Interface',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>OK</b>',
          type: 'button-dark',
          onTap: function(e) {
          }
        }
      ]
    });
    myPopup.then(function() {
        $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
        $scope.showPortDiscoveryModal(); 
    });
   };

    $scope.showPortDiscoveryModal = function () {
        $ionicModal.fromTemplateUrl('templates/portDiscovery.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.selectedPrinter = {}
            $scope.portDiscoveryModal = modal;
            $scope.portDiscoveryModal.show();
            $scope.portDiscovery();  
        });
    };  
 
    $scope.closePortDiscoveryModal = function () {
            //console.log($scope.selectedPrinter); 
            $scope.portDiscoveryModal.hide();
            $scope.portDiscoveryModal.remove();  
    };
    
    
    $scope.portDiscovery = function(){
        if (StarPRTN) {
            StarPRTN.portDiscovery($scope.selectedType.value, function (result) {
            console.log(result)
                $scope.printers = result;
                $ionicLoading.hide();
          }, function(err){
            $ionicLoading.hide();
            alert(err);
          });
         } else {
            alert('Printer plugin not available');
        }
    };

    $scope.showEmulationPopup = function() {

    var emulationPopup = $ionicPopup.show({
        template: '<ion-list><ion-radio ng-repeat="printerModel in printerModels" ng-model="emulation.value" ng-value="printerModel.emulation">{{printerModel.text}}</ion-radio>',
        title: 'Confirm. What is your printer',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>OK</b>',
            type: 'button-dark',
            onTap: function(e) {
                $scope.closePortDiscoveryModal();
            }
          }
        ]
      });    
    }

    //Check Printer status

    $scope.showPrinterStatusModal = function () {
        if($scope.selectedPrinter.printer){
            $ionicModal.fromTemplateUrl('templates/printerStatus.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.printerStatusModal = modal;
                $scope.printerStatusModal.show();
                $scope.checkStatus();  
            });
        }else{
            alert('Please select a printer');
        }
    };  
 
    $scope.closePrinterStatusModal = function () {
            $scope.printerStatusModal.hide();
            $scope.printerStatusModal.remove();  
            //console.log($scope.selectedPrinter);           
    };

    $scope.checkStatus = function(){
       if (StarPRTN) {
            $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
            StarPRTN.checkStatus($scope.selectedPrinter.printer.portName, $scope.emulation.value, function (result) {
                console.log(result)
                $scope.printerStatus = result;
                $ionicLoading.hide();
            }, function(error){
                    $ionicLoading.hide();
                    alert(error);
          });
         } else {
            alert('Printer plugin not available');
            $ionicLoading.hide();
        }
    }
    
    // Print Sample 

    $scope.printRawText = function(){
        var printObj = {text: "         Star Clothing Boutique\n" +
        "                        123 Star Road\n" +
        "                      City, State 12345\n",
        cutReceipt: "true",
        openCashDrawer: "false",
        };

        if (StarPRTN) {
             $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
             StarPRTN.printRawText($scope.selectedPrinter.printer.portName, $scope.emulation, printObj, function (result) {
                 console.log(result)
                 //$scope.printerStatus = result;
                 $ionicLoading.hide();
             }, function(error){
                     $ionicLoading.hide();
                     alert(error);
           });
          } else {
             alert('Printer plugin not available');
             $ionicLoading.hide();
         }
     };
     $scope.printRasterReceipt = function(){

        var printObj = {
                
        text : "        Star Clothing Boutique\n" +
        "             123 Star Road\n" +
        "           City, State 12345\n" +
        "\n" +
        "Date:MM/DD/YYYY          Time:HH:MM PM\n" +
        "--------------------------------------\n" +
        "SALE\n" +
        "SKU            Description       Total\n" +
        "300678566      PLAIN T-SHIRT     10.99\n" +
        "300692003      BLACK DENIM       29.99\n" +
        "300651148      BLUE DENIM        29.99\n" +
        "300642980      STRIPED DRESS     49.99\n" +
        "30063847       BLACK BOOTS       35.99\n" +
        "\n" +
        "Subtotal                        156.95\n" +
        "Tax                               0.00\n" +
        "--------------------------------------\n" +
        "Total                          $156.95\n" +
        "--------------------------------------\n" +
        "\n" +
        "Charge\n" +
        "156.95\n" +
        "Visa XXXX-XXXX-XXXX-0123\n" +
        "Refunds and Exchanges\n" +
        "Within 30 days with receipt\n" +
        "And tags attached\n",
        fontSize: 25,
        paperWidth: 576
        };

    

        if (StarPRTN) {
             $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
             StarPRTN.printRasterReceipt($scope.selectedPrinter.printer.portName, $scope.emulation.value, printObj, function (result) {
                 console.log(result)
                 //$scope.printerStatus = result;
                 $ionicLoading.hide();
             }, function(error){
                     $ionicLoading.hide();
                     alert(error);
           });
          } else {
             alert('Printer plugin not available');
             $ionicLoading.hide();
         }
     }

     $scope.printFromCamera = function(){
        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            encodingType: Camera.EncodingType.JPEG
        }
         if(Camera){
             Camera.getPicture(function(uri){
                 console.log(uri);
                 printPicture(uri);

             }, function(error){
                 alert(error);
             }, options)
         }else{
             alert("camera plugin unavailable");
         }

     }
     $scope.printFromLibrary = function (){
        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true,
            encodingType: Camera.EncodingType.JPEG
        }
         if(Camera){
             Camera.getPicture(function(uri){
                 console.log(uri);
                 printPicture(uri);
             }, function(error){
                 alert(error);
             }, options)
         }else{
             alert("camera plugin unavailable");
         }
     }
     printPicture = function(uri){
         var printObj = {
             uri: uri,
             width: 576
         };
        if (StarPRTN) {
            $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
            StarPRTN.printImage($scope.selectedPrinter.printer.portName, $scope.emulation.value, printObj, function (result) {
                console.log(result)
                $ionicLoading.hide();
            }, function(error){
                    $ionicLoading.hide();
                    alert(error);
          });
         } else {
            alert('Printer plugin not available');
            $ionicLoading.hide();
        }
         

     }
  
});
