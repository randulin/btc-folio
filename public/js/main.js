'use strict';




var BTC = function ($scope, $http, $timeout) {
	var addresses_raw, spendvalue, securities_raw;
	
	//init		
	$scope.market = {};
  $scope.market.loading = 0;

	$scope.spend = {};	
	$scope.spend.value = 0;
	
	$scope.save = {};
  $scope.save.loading = 0;

	$scope.invest = {};
  $scope.invest.loading = 0;
	$scope.settings = {
		show: true
		, text: "hide settings"
	};
	
	if (spendvalue = localStorage.getItem('btc-portfolio.spend.value')) {
		
		try {
			if (!isNaN(parseFloat(spendvalue))) $scope.spend.value = parseFloat(spendvalue);
		} catch (e) {
			console.warn(e);
		}
	}
	
	if (addresses_raw = localStorage.getItem('btc-portfolio.save.addresses')) {
		try {
			$scope.save.addresses = JSON.parse(addresses_raw)[0];
		} catch (e) {
			console.warn(e);
		}
	}

	
  if (securities_raw = localStorage.getItem('btc-portfolio.invest.securities')) {
    try {
      $scope.invest.Securities = JSON.parse(securities_raw)[0];
    } catch (e) {
      console.warn(e);
    }
  }
	
	if ($scope.spend.value || $scope.invest.Securities || $scope.save.addresses) {

		$scope.settings = {
			show: false
			, text: "show settings"
		};
		
		var s = {};
		s.BTC = $scope.spend.value;
		s.Addresses = $scope.save.addresses;
		s.Securities = $scope.invest.Securities;
		$scope.jsonimport = JSON.stringify(s, null, 4);
	}

	
	//blockchain api
	var updateBlockchain = function($scope) {
    $scope.market.error = false;

    var addresses = [];
    if ($scope.save.addresses) addresses = Object.keys($scope.save.addresses);

    $timeout(function() { $scope.market.loading++; }, 300);
		$http.get('./blockchain_address?a=' + addresses.join('|') )
        .success(function(data) {
          $scope.market.bitcoindata = data;
          $scope.market.bitcoindata.info.symbol_local.conversion_back = 1 / $scope.market.bitcoindata.info.symbol_local.conversion * 100000000;
          $scope.save.blockadr = data.addresses;
          $scope.save.wallet = data.wallet;
          $scope.lastRefresh = new Date();
          $scope.market.loading--;
        })
        .error(function(data, status, headers, config) {
          $scope.market.loading--;
          $scope.market.error = true;
          $scope.market.errorStatus = 'blockchain_address: ' + status + ' – ' + data;
        });
	};
	updateBlockchain($scope);
	
	
	var updateWeighted = function($scope) {
    $scope.market.error = false;
    $timeout(function() { $scope.market.loading++; }, 300);
		$http.get('./bitcoincharts_weighted')
        .success(function(data) {
          $scope.market.ticker = data;
          $scope.lastRefresh = new Date();
          $scope.market.loading--;
        })
        .error(function(data, status, headers, config) {
          $scope.market.loading--;
          $scope.market.error = true;
          $scope.market.errorStatus = 'bitcoincharts_weighted: ' + status + ' – ' + data;
        });
	};
	updateWeighted($scope);
	


	//havelock api
	var getSecurities = function($scope) {
    $scope.invest.error = false;

    $timeout(function() { $scope.invest.loading++; }, 300);
    $http.get('./havelock')
        .success(function(data) {
          $scope.invest.Tickers = data;
          $scope.invest.loading--;
        })
        .error(function(data, status, headers, config) {
          $scope.invest.loading--;
          $scope.invest.error = true;
          $scope.invest.errorStatus = status + ' – ' + data;
        });
	};

  getSecurities($scope);






	
	$scope.addSpendValue = function() {
		$scope.spend.value += parseFloat($scope.spend.ValueAdd);
		$scope.spend.ValueAdd = '';
    $scope.refreshInternal();
	};

	$scope.resetSpendValue = function() {
		$scope.spend.value = 0;
		$scope.spend.ValueAdd = '';
    $scope.refreshInternal();
	};

	$scope.addAddress = function() {
    $scope.save.addresses = $scope.save.addresses || {};

    var a = {};
    a.Address = $scope.save.BitCoinAddress;
    a.Desc = $scope.save.BitCoinAddressDesc;

    $scope.save.addresses[a.Address] = a;

    $scope.refreshInternal();

    $scope.save.BitCoinAddress = '';
    $scope.save.BitCoinAddressDesc = '';
	};
	
	$scope.removeAddress = function(adr) {
    delete $scope.save.addresses[adr];
    $scope.refreshInternal();
	};

	$scope.editAddress = function(adr) {
    $scope.save.BitCoinAddress = $scope.save.addresses[adr].Address;
    $scope.save.BitCoinAddressDesc = $scope.save.addresses[adr].Desc;
	};


	$scope.addSecurity = function() {
    $scope.invest.Securities = $scope.invest.Securities || {};

    var s = {};
    s.Ticker = $scope.invest.Ticker.symbol;
    s.Quantity = $scope.invest.Quantity;

		$scope.invest.Securities[s.Ticker] = s;

    $scope.invest.Ticker = "";
    $scope.invest.Quantity = "";
    $scope.refreshInternal();
	};

  $scope.editTicker = function(security) {
    $scope.invest.Ticker = security.Ticker;
    $scope.invest.Quantity = security.Quantity;
    $scope.refreshInternal();
  }

  $scope.removeTicker = function(security) {
    delete $scope.invest.Securities[security.Ticker];
    if (Object.keys($scope.invest.Securities).length == 0) delete $scope.invest.Securities;
    $scope.refreshInternal();
  }


	$scope.getUsd = function(value) {
		if (!$scope.market.bitcoindata) return undefined;
		return $scope.market.bitcoindata.info.symbol_local.conversion_back * value;
	};
	
	
	$scope.getTotal = function() {
		var tot = 0;
		tot += $scope.spend.value;
		
		if ($scope.save.wallet) tot += $scope.save.wallet.final_balance/100000000;
		if ($scope.invest.totalbtc) tot += $scope.invest.totalbtc;
    if ($scope.getSum($scope.invest.Securities)) tot += $scope.getSum($scope.invest.Securities);
		return tot;
	};
	
	$scope.refresh = function() {
    $scope.refreshInternal(true);
    if (ga) {
      ga('send', 'event', {
        'eventCategory': 'MainPage',
        'eventAction': 'Refresh'
      });
    }
	};

	$scope.refreshInternal = function(doNotWriteLocalStorage) {
		updateBlockchain($scope);

    getSecurities($scope);
		updateWeighted($scope);

    var s = {};
    s.BTC = $scope.spend.value;
    s.Addresses = $scope.save.addresses;
    s.Securities = $scope.invest.Securities;
    $scope.jsonimport = JSON.stringify(s, null, 3);

    if (doNotWriteLocalStorage) return;
    localStorage.setItem('btc-portfolio.invest.securities', JSON.stringify([$scope.invest.Securities]));
    localStorage.setItem('btc-portfolio.save.addresses', JSON.stringify([$scope.save.addresses]));
    localStorage.setItem('btc-portfolio.spend.value', $scope.spend.value);
	};


	
	$scope.toggleSettings = function() {
		$scope.settings.show = !$scope.settings.show;
		$scope.settings.text = $scope.settings.show ? "hide settings" : "show settings";
	};
	
	$scope.getMarketChange = function(key) {
		if (!$scope.market.bitcoindata) return null;
    if (!$scope.market.ticker) return null;
		return (($scope.market.bitcoindata.info.symbol_local.conversion_back - $scope.market.ticker.USD[key])/$scope.market.ticker.USD[key] * 100);	
	};


	$scope.getTickerChange = function(security, key) {
		if (!security || !security.last) return null;
		return  ((security.last - security[key].vwap)/security[key].vwap * 100);
	};



  $scope.getSum = function(securities, key) {
    var total = 0;
    for (key in securities) {
      var security = securities[key];
      if ($scope.invest.Tickers && $scope.invest.Tickers[security.Ticker]) {
        total += $scope.invest.Tickers[security.Ticker].last*security.Quantity;
      }
    }
    return total;
  }


	$scope.importSettings = function() {
		var data = JSON.parse($scope.jsonimport);
		
		if (!data) {
			alert('Error in import file');
			return;
		}

		if (data.BTC) {
      $scope.spend.value = parseFloat(data.BTC);
			localStorage.setItem('btc-portfolio.spend.value', $scope.spend.value);
		}
		
		if (data.Addresses) {
			$scope.save.addresses = data.Addresses;
			localStorage.setItem('btc-portfolio.save.addresses', JSON.stringify([$scope.save.addresses]));
			updateBlockchain($scope);
		}

		
		if (data.Securities) {
      $scope.invest.Securities = data.Securities;
			localStorage.setItem('btc-portfolio.invest.securities', JSON.stringify([$scope.invest.Securities]));

		}

    $scope.toggleSettings();
	};

  $scope.resetLocalStorage = function() {
    localStorage.clear();
    location.reload();
  }

  var countUp = function() {
    $scope.refresh();
    $timeout(countUp, 1000 * 60 * 5);
  };

  $timeout(countUp, 1000 * 60 * 5);

};

BTC.$inject = ['$scope', '$http', '$timeout'];

