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
        openCashDrawer: "true",
        };

        if (StarPRTN) {
             $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
             StarPRTN.printRawText($scope.selectedPrinter.printer.portName, $scope.emulation.value, printObj, function (result) {
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
        paperWidth: 576,
        cutReceipt:"true",
        openCashDrawer:"true"
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
     };
     $scope.print = function(useHorizontalTab, printQRCode){
         var commands = [];
         if(useHorizontalTab){ //Horizonatal Tab command is not supported by TSP100, SM-S210i, SM-S220i, SM-S230i, SM-T300i/T300, SM-T400i
            commands.push({appendInternational: 'UK'});
             commands.push({appendCharacterSpace: 1});
             commands.push({appendLogo:1,      //Logo number configured using Star Print utility (only available on certain models)
                                  logoSize:"Normal"})
             commands.push({appendAlignment:"Center"});
             commands.push({append: "Star Clothing Boutique\n" +
             "123 Star Road\n" +
             "City, State 12345\n" +
             "\n"})
             commands.push({appendAlignment:"Left"});
             commands.push({ append: "Date:MM/DD/YYYY              Time:HH:MM PM\n" +
             "------------------------------------------\n" +
             "\n"});
             commands.push({appendEmphasis:"SALE \n"});
             /*Horizontal Tab example*/
             commands.push({appendHorizontalTabPosition:[15,35]});
             commands.push({append:"*Tab Position:15, 35*\n"});
             commands.push({append:"SKU\tDescription\tTotal\n"});
             commands.push({append:"300678566\tPLAIN T-SHIRT\t10.99\n"});
             commands.push({append:"300692003\tBLACK DENIM\t29.99\n"});
             commands.push({append:"300651148\tBLUE DENIM\t29.99\n"});
             commands.push({append:"300642980\tSTRIPED DRESS\t49.99\n"});
             commands.push({append:"300638471\tBLACK BOOTS\t35.99\n"});
             //commands.push({appendAlignment:"Right", data:"\t35.99\n"});
             commands.push({appendHorizontalTabPosition:[]}); //send an empty array or null to reset the horizontal tab position
             /**/
             commands.push({append:"\n" +
             "Subtotal                            156.95\n" +
             "Tax                                   0.00\n" +
             "------------------------------------------\n"
             });
             commands.push({append:"Total                 "});
             commands.push({appendMultiple:"   $156.95\n",
                            width:2,
                            height:2                                
            });
             commands.push({append:"------------------------------------------\n" +
             "\n" +
             "Charge\n" +
             "156.95\n" +
             "Visa XXXX-XXXX-XXXX-0123\n" +
             "\n"});
             commands.push({appendInvert: "Refunds and Exchanges\n"});
             commands.push({append:"Within "});
             commands.push({appendUnderline:"30 days"});
             commands.push({append:" with receipt\n"});
             commands.push({append:"And tags attached\n" +
             "\n"});
             commands.push({appendAlignment:"Center"});
             commands.push({appendBarcode:"{BStar",
                            BarcodeSymbology:"Code128",
                            BarcodeWidth:"Mode2",
                            height:40,
                            hri:"true"
            });
            commands.push({appendUnitFeed:64});
            commands.push({appendCutPaper:'PartialCutWithFeed'});
            //commands.push({openCashDrawer:1}); //open cash drawer no 1
            //commands.push({openCashDrawer:2}); //open cash drawer no 2
         }else{
             commands.push({appendInternational: 'UK'});
             commands.push({appendLogo:1,
                                  logoSize:"Normal"}) //Logo number configured using Star Print utility (only available on certain models)
             commands.push({appendCharacterSpace: 1});
             commands.push({appendAlignment:"Center"});
             commands.push({append: "Star Clothing Boutique\n" +
             "123 Star Road\n" +
             "City, State 12345\n" +
             "\n"})
             commands.push({appendAlignment:"Left"});
             commands.push({ append: "Date:MM/DD/YYYY              Time:HH:MM PM\n" +
             "------------------------------------------\n" +
             "\n"});
             commands.push({appendEmphasis:"SALE \n"});
             commands.push({append: "SKU             Description          Total\n" +
             "300678566       PLAIN T-SHIRT        10.99\n" +
             "300692003       BLACK DENIM          29.99\n" +
             "300651148       BLUE DENIM           29.99\n" +
             "300642980       STRIPED DRESS        49.99\n" +
             "300638471       BLACK BOOTS          35.99\n" +
             "\n" +
             "Subtotal                            156.95\n" +
             "Tax                                   0.00\n" +
             "------------------------------------------\n"             
             });
             commands.push({append:"Total                 "});
             commands.push({appendMultiple:"   $156.95\n",
                            width:2,
                            height:2                                
            });
             commands.push({append:"------------------------------------------\n" +
             "\n" +
             "Charge\n" +
             "156.95\n" +
             "Visa XXXX-XXXX-XXXX-0123\n" +
             "\n"});
             commands.push({appendInvert: "Refunds and Exchanges\n"});
             commands.push({append:"Within "});
             commands.push({appendUnderline:"30 days"});
             commands.push({append:" with receipt\n"});
             commands.push({append:"And tags attached\n" +
             "\n"});
             commands.push({appendAlignment:"Center"});
             if(printQRCode){ //QR Code example
                commands.push({appendQrCode:"{BStar",
                QrCodeModel:"No2",
                QrCodeLevel:"L",
                cell: 8,
                alignment:"Center"
            });
            }else{
             commands.push({appendBarcode:"{BStar",
                            BarcodeSymbology:"Code128",
                            BarcodeWidth:"Mode2",
                            height:40,
                            hri:"true",
                            alignment:"Center"
            });
            }   
            commands.push({appendUnitFeed:64});
            commands.push({appendCutPaper:'PartialCutWithFeed'});
            //commands.push({openCashDrawer:1}); //open cash drawer no 1
            //commands.push({openCashDrawer:2}); //open cash drawer no 2
            }
            if (StarPRTN) {
                $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
                StarPRTN.print($scope.selectedPrinter.printer.portName, $scope.emulation.value, commands, function (result) {
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

     $scope.appendBitmap = function(){
        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true,
            encodingType: Camera.EncodingType.JPEG
        }
        commands = [];
         if(Camera){
             Camera.getPicture(function(uri){
                //console.log(uri);
                commands.push({appendBitmap:uri,
                                diffusion: true,
                                width:576, 
                                bothScale: true});
                commands.push({appendUnitFeed:64});
                commands.push({appendCutPaper:'PartialCutWithFeed'});
                if (StarPRTN) {
                    $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
                    StarPRTN.print($scope.selectedPrinter.printer.portName, $scope.emulation.value, commands, function (result) {
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
                
             }, function(error){
                 alert(error);
             }, options)
         }else{
             alert("camera plugin unavailable");
         }

     }

     $scope.openCashDrawer = function(){
       if (StarPRTN) {
           $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
           StarPRTN.openCashDrawer($scope.selectedPrinter.printer.portName, $scope.emulation.value, function (result) {
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

})

.controller('StarIOCtrl', function ($scope, $state, $ionicPlatform, $ionicPopup, $ionicModal, $ionicLoading, $window) {
    /*This controller, connects to the printer and keeps the connection alive, 
    the functions send commands with the port set to null so it uses the active
    connection
    */

    var portName = $state.params.portName;
    var emulation = $state.params.emulation;
    var Camera;
    var StarPRTN;
    $scope.status = '';
    $scope.paperStatus = '';
    $scope.coverStatus = '';
    $scope.drawerStatus = '';
    $ionicPlatform.ready(function () {
        StarPRTN = starprnt;
        Camera = navigator.camera;
    });

    $scope.connect = function(){
        if (StarPRTN) {
            $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
            StarPRTN.connect(portName, emulation, function (error, result) {
                if(error){
                    alert(error);
                }else{
                    console.log(result);
                }
                $ionicLoading.hide();
            });
         } else {
            alert('Printer plugin not available');
            $ionicLoading.hide();
        }
    };
    $scope.$on('$ionicView.enter', function(){
        $scope.connect(); //connect when entering the view
      });

      $scope.$on('$ionicView.leave', function(){
        $scope.disconnect(); // disconnect when closing the view
      });

      $ionicPlatform.on('pause', function(){ //disconnect if app is in background
        if($scope.disconnect){
            $scope.disconnect();
        }
        
     })
     $ionicPlatform.on('resume', function(){ //reconnect when app active again
        if($scope.connect){
            $scope.connect();
        }
    })

    

    $window.addEventListener('starPrntData', function (e) {
        console.log(e);
        switch (e.dataType) {
            case 'printerOnline':
            $scope.status = 'Online'
            break;

            case 'printerOffline':
            $scope.status = 'Offline'
            break;

            case 'printerImpossible':
            $scope.status = 'Impossible'
            break;

            case 'printerPaperEmpty':
            $scope.paperStatus = 'Empty'
            break;

            case 'printerPaperNearEmpty':
            $scope.paperStatus = 'Near Empty'
            break;

            case 'printerPaperReady':
            $scope.paperStatus = 'Ready'
            break;

            case 'printerCoverOpen':
            $scope.coverStatus = 'Open'
            break;

            case 'printerCoverClose':
            $scope.coverStatus = 'Closed'
            break;

            case 'cashDrawerOpen':
            $scope.drawerStatus = 'Open'
            break;

            case 'cashDrawerClose':
            $scope.drawerStatus = 'Closed'
            break;

            default:
            break;
            }
            $scope.$apply();     
      });

    $scope.disconnect = function(){
        if (StarPRTN) {
            $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
            StarPRTN.disconnect(function (result) {
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

    $scope.printRawText = function(){
        var printObj = {text: "         Star Clothing Boutique\n" +
        "                        123 Star Road\n" +
        "                      City, State 12345\n",
        cutReceipt: "true",
        openCashDrawer: "true",
        };

        if (StarPRTN) {
             $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
             StarPRTN.printRawText(null, emulation, printObj, function (result) {
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
        paperWidth: 576,
        cutReceipt:"true",
        openCashDrawer:"true"
        };

    

        if (StarPRTN) {
             $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
             StarPRTN.printRasterReceipt(null, emulation, printObj, function (result) {
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
            StarPRTN.printImage(null,emulation, printObj, function (result) {
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
     };
     $scope.print = function(useHorizontalTab, printQRCode){
         var commands = [];
         if(useHorizontalTab){ //Horizonatal Tab command is not supported by TSP100, SM-S210i, SM-S220i, SM-S230i, SM-T300i/T300, SM-T400i
            commands.push({appendInternational: 'UK'});
             commands.push({appendCharacterSpace: 1});
             commands.push({appendLogo:1,      //Logo number configured using Star Print utility (only available on certain models)
                                  logoSize:"Normal"})
             commands.push({appendAlignment:"Center"});
             commands.push({append: "Star Clothing Boutique\n" +
             "123 Star Road\n" +
             "City, State 12345\n" +
             "\n"})
             commands.push({appendAlignment:"Left"});
             commands.push({ append: "Date:MM/DD/YYYY              Time:HH:MM PM\n" +
             "------------------------------------------\n" +
             "\n"});
             commands.push({appendEmphasis:"SALE \n"});
             /*Horizontal Tab example*/
             commands.push({appendHorizontalTabPosition:[15,35]});
             commands.push({append:"*Tab Position:15, 35*\n"});
             commands.push({append:"SKU\tDescription\tTotal\n"});
             commands.push({append:"300678566\tPLAIN T-SHIRT\t10.99\n"});
             commands.push({append:"300692003\tBLACK DENIM\t29.99\n"});
             commands.push({append:"300651148\tBLUE DENIM\t29.99\n"});
             commands.push({append:"300642980\tSTRIPED DRESS\t49.99\n"});
             commands.push({append:"300638471\tBLACK BOOTS\t35.99\n"});
             //commands.push({appendAlignment:"Right", data:"\t35.99\n"});
             commands.push({appendHorizontalTabPosition:[]}); //send an empty array or null to reset the horizontal tab position
             /**/
             commands.push({append:"\n" +
             "Subtotal                            156.95\n" +
             "Tax                                   0.00\n" +
             "------------------------------------------\n"
             });
             commands.push({append:"Total                 "});
             commands.push({appendMultiple:"   $156.95\n",
                            width:2,
                            height:2                                
            });
             commands.push({append:"------------------------------------------\n" +
             "\n" +
             "Charge\n" +
             "156.95\n" +
             "Visa XXXX-XXXX-XXXX-0123\n" +
             "\n"});
             commands.push({appendInvert: "Refunds and Exchanges\n"});
             commands.push({append:"Within "});
             commands.push({appendUnderline:"30 days"});
             commands.push({append:" with receipt\n"});
             commands.push({append:"And tags attached\n" +
             "\n"});
             commands.push({appendAlignment:"Center"});
             commands.push({appendBarcode:"{BStar",
                            BarcodeSymbology:"Code128",
                            BarcodeWidth:"Mode2",
                            height:40,
                            hri:"true"
            });
            commands.push({appendUnitFeed:64});
            commands.push({appendCutPaper:'PartialCutWithFeed'});
            //commands.push({openCashDrawer:1}); //open cash drawer no 1
            //commands.push({openCashDrawer:2}); //open cash drawer no 2
         }else{
             commands.push({appendInternational: 'UK'});
             commands.push({appendLogo:1,
                                  logoSize:"Normal"}) //Logo number configured using Star Print utility (only available on certain models)
             commands.push({appendCharacterSpace: 1});
             commands.push({appendAlignment:"Center"});
             commands.push({append: "Star Clothing Boutique\n" +
             "123 Star Road\n" +
             "City, State 12345\n" +
             "\n"})
             commands.push({appendAlignment:"Left"});
             commands.push({ append: "Date:MM/DD/YYYY              Time:HH:MM PM\n" +
             "------------------------------------------\n" +
             "\n"});
             commands.push({appendEmphasis:"SALE \n"});
             commands.push({append: "SKU             Description          Total\n" +
             "300678566       PLAIN T-SHIRT        10.99\n" +
             "300692003       BLACK DENIM          29.99\n" +
             "300651148       BLUE DENIM           29.99\n" +
             "300642980       STRIPED DRESS        49.99\n" +
             "300638471       BLACK BOOTS          35.99\n" +
             "\n" +
             "Subtotal                            156.95\n" +
             "Tax                                   0.00\n" +
             "------------------------------------------\n"             
             });
             commands.push({append:"Total                 "});
             commands.push({appendMultiple:"   $156.95\n",
                            width:2,
                            height:2                                
            });
             commands.push({append:"------------------------------------------\n" +
             "\n" +
             "Charge\n" +
             "156.95\n" +
             "Visa XXXX-XXXX-XXXX-0123\n" +
             "\n"});
             commands.push({appendInvert: "Refunds and Exchanges\n"});
             commands.push({append:"Within "});
             commands.push({appendUnderline:"30 days"});
             commands.push({append:" with receipt\n"});
             commands.push({append:"And tags attached\n" +
             "\n"});
             commands.push({appendAlignment:"Center"});
             if(printQRCode){ //QR Code example
                commands.push({appendQrCode:"{BStar",
                QrCodeModel:"No2",
                QrCodeLevel:"L",
                cell: 8,
                alignment:"Center"
            });
            }else{
             commands.push({appendBarcode:"{BStar",
                            BarcodeSymbology:"Code128",
                            BarcodeWidth:"Mode2",
                            height:40,
                            hri:"true",
                            alignment:"Center"
            });
            }   
            commands.push({appendUnitFeed:64});
            commands.push({appendCutPaper:'PartialCutWithFeed'});
            //commands.push({openCashDrawer:1}); //open cash drawer no 1
            //commands.push({openCashDrawer:2}); //open cash drawer no 2
            }
            if (StarPRTN) {
                $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
                StarPRTN.print(null, emulation, commands, function (result) {
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

     $scope.appendBitmap = function(){
        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true,
            encodingType: Camera.EncodingType.JPEG
        }
        commands = [];
         if(Camera){
             Camera.getPicture(function(uri){
                //console.log(uri);
                commands.push({appendBitmap:uri,
                                diffusion: true,
                                width:576, 
                                bothScale: true});
                commands.push({appendUnitFeed:64});
                commands.push({appendCutPaper:'PartialCutWithFeed'});
                if (StarPRTN) {
                    $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
                    StarPRTN.print(null, emulation, commands, function (result) {
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
                
             }, function(error){
                 alert(error);
             }, options)
         }else{
             alert("camera plugin unavailable");
         }

     }

     $scope.openCashDrawer = function(){
       if (StarPRTN) {
           $ionicLoading.show({template: '<ion-spinner></ion-spinner> Communicating...'});
           StarPRTN.openCashDrawer(null, emulation, function (result) {
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