angular.module('starter.controllers', [])

.controller('HomeCtrl', function ($scope, $ionicPlatform, $ionicPopup, $ionicModal, $ionicLoading) {
  $scope.printers = [];
  $scope.emulation = "EscPosMobile"
  $scope.printerStatus;
  var StarPRTN;
  var Camera;
  $ionicPlatform.ready(function () {
      StarPRTN = starprnt;
      Camera = navigator.camera;
  });


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
            $scope.portDiscoveryModal = modal;
            $scope.portDiscoveryModal.show();
            $scope.portDiscovery();  
        });
    };  
 
    $scope.closePortDiscoveryModal = function () {
            $scope.portDiscoveryModal.hide();
            $scope.portDiscoveryModal.remove();  
            console.log($scope.selectedPrinter);           
    };
    
    
    $scope.portDiscovery = function(){
        if (StarPRTN) {
            StarPRTN.portDiscovery($scope.selectedType.value, function (result) {
            console.log(result)
                $scope.printers = result;
                if($scope.printers[0] && $scope.printers[0].portName){
                  $scope.selectedPrinter =  $scope.printers[0];
                }
                $ionicLoading.hide();
          }, function(err){
            $ionicLoading.hide();
            alert(err);
          });
         } else {
            alert('Printer plugin not available');
        }
    };

    //Check Printer status

    $scope.showPrinterStatusModal = function () {
        if($scope.selectedPrinter){
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
            console.log($scope.selectedPrinter);           
    };

    $scope.checkStatus = function(){
       if (StarPRTN) {
            $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
            StarPRTN.checkStatus($scope.selectedPrinter.portName, $scope.emulation, function (result) {
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
             StarPRTN.printRawText($scope.selectedPrinter.portName, $scope.emulation, printObj, function (result) {
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
             StarPRTN.printRasterReceipt($scope.selectedPrinter.portName, $scope.emulation, printObj, function (result) {
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
            StarPRTN.printImage($scope.selectedPrinter.portName, $scope.emulation, printObj, function (result) {
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
