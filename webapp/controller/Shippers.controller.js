sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("com.aifa.sap.tilesdashboard.controller.Shippers", {
        onInit: function() {
            console.log("Shippers Page Loaded");
        },

        onShipperSelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
          
            var oContext = oSelectedItem.getBindingContext();
            var oData = oContext.getObject();
        
            var oView = this.getView();
        
            // Populate Shipper Details
            oView.byId("shipperID").setText(oData.ShipperID);
            oView.byId("companyName").setText(oData.CompanyName);
            oView.byId("phone").setText(oData.Phone);
        
            // Switch to "Shipper Details" tab
            var oIconTabBar = oView.byId("iconTabBar2");
            oIconTabBar.setSelectedKey("ShipperDetails");
        },
        
        onShipperSelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oContext = oSelectedItem.getBindingContext();
            var oData = oContext.getObject();
            var oView = this.getView();
        
            // Populate Shipper Details
            oView.byId("shipperID").setText(oData.ShipperID);
            oView.byId("companyName").setText(oData.CompanyName);
            oView.byId("phone").setText(oData.Phone);
        
            // Switch to "Shipper Details" tab
            oView.byId("iconTabBar2").setSelectedKey("ShipperDetails");
        },
        
        onBackToShippers2: function () {
            this.getView().byId("iconTabBar2").setSelectedKey("Shippers");
        },
        
        onSearchPress2: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            this._filterShippers(sQuery);
        },
        
        onSearchLiveChange2: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            this._filterShippers(sQuery);
        },
        
        _filterShippers: function (sQuery) {
            var oList = this.byId("ShippersList");
            var oBinding = oList.getBinding("items");
        
            if (!oBinding) {
                console.warn("Shippers List binding is null. Check model binding.");
                return;
            }
        
            var aFilters = [];
        
            if (sQuery) {
                var oCompanyNameFilter = new sap.ui.model.Filter("CompanyName", sap.ui.model.FilterOperator.Contains, sQuery);
                var oShipperIDFilter = !isNaN(sQuery) && sQuery.trim() !== "" 
                    ? new sap.ui.model.Filter("ShipperID", sap.ui.model.FilterOperator.EQ, parseInt(sQuery, 10)) 
                    : null;
        
                aFilters.push(oShipperIDFilter ? new sap.ui.model.Filter([oCompanyNameFilter, oShipperIDFilter], false) : oCompanyNameFilter);
            }
        
            oBinding.filter(aFilters);
        }
        
    });
});
