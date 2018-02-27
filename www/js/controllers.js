angular.module('starter.controllers', [])

.controller('HomeCtrl', function ($scope, $ionicPlatform, $ionicPopup, $ionicModal, $ionicLoading) {
  $scope.printers = [];
  $scope.printerStatus;
  var StarPRTN;
  $ionicPlatform.ready(function () {
      StarPRTN = starprnt;
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
        $ionicLoading.show({template: '<ion-spinner></ion-spinner> Loading...'});
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
            StarPRTN.checkStatus($scope.selectedPrinter.portName, function (result) {
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
  
});
