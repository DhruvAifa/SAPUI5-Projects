sap.ui.define([
    "sap/ui/core/mvc/Controller",
], function (Controller) {
    "use strict";

    return Controller.extend("com.aifa.sap.tilesdashboard.controller.OrdersSuppliers", {
        onInit: function () {
            console.log("Orders Page Loaded");
        },
        
        // Handle Order Selection
        onOrders: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            if (!oSelectedItem) {
                console.error("No item selected");
                return;
            }

            var oContext = oSelectedItem.getBindingContext();
            var oData = oContext.getObject();

            var oView = this.getView();

            // Populate Order Details
            oView.byId("OrderID").setText(oData.OrderID);
            oView.byId("CustomerID").setText(oData.CustomerID);
            oView.byId("EmployeeID").setText(oData.EmployeeID);
            oView.byId("OrderDate").setText(oData.OrderDate);
            oView.byId("RequiredDate").setText(oData.RequiredDate);
            oView.byId("ShippedDate").setText(oData.ShippedDate);
            oView.byId("ShipVia").setText(oData.ShipVia);
            oView.byId("Freight").setText(oData.Freight);
            oView.byId("ShipName").setText(oData.ShipName);
            oView.byId("ShipAddress").setText(oData.ShipAddress);
            oView.byId("ShipCity").setText(oData.ShipCity);
            oView.byId("ShipRegion").setText(oData.ShipRegion);
            oView.byId("ShipPostalCode").setText(oData.ShipPostalCode);
            oView.byId("ShipCountry").setText(oData.ShipCountry);

            // Show Order Details & Hide List
            oView.byId("OrdersListContainer").setVisible(false);
            oView.byId("orderDetailsSection").setVisible(true);
            // oView.byId("OrdersListContainer").setProperty("visible", false);
            // oView.byId("orderDetailsSection").setProperty("visible", true);
        },

        // Handle Back to Orders List
        onBackToOrders: function () {
            var oView = this.getView();
            oView.byId("OrdersListContainer").setVisible(true);
            oView.byId("orderDetailsSection").setVisible(false);
        },

        // Handle Search Button Press
        onSearchPress1: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            this._filterOrders(sQuery);
        },
        
        // Handle Live Search (Typing)
        onSearchLiveChange: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            this._filterOrders(sQuery);
        },
        
        // Filter Orders List by OrderID & CustomerID
        _filterOrders: function (sQuery) {
            var oList = this.byId("OrdersList");
            var oBinding = oList.getBinding("items");
        
            if (!oBinding) {
                console.warn("Orders List binding is null. Check model binding.");
                return;
            }
        
            var aFilters = [];
        
            if (sQuery) {
                var oCustomerIDFilter = new sap.ui.model.Filter("CustomerID", sap.ui.model.FilterOperator.Contains, sQuery);
                var oOrderIDFilter = null;
        
                if (!isNaN(sQuery) && sQuery.trim() !== "") {
                    oOrderIDFilter = new sap.ui.model.Filter("OrderID", sap.ui.model.FilterOperator.EQ, parseInt(sQuery, 10));
                }
        
                // Apply OR condition
                if (oOrderIDFilter) {
                    aFilters.push(new sap.ui.model.Filter([oCustomerIDFilter, oOrderIDFilter], false));
                } else {
                    aFilters.push(oCustomerIDFilter);
                }
            }
        
            oBinding.filter(aFilters.length > 0 ? aFilters : []);
        }
        ,


        // onSearchPress: function (oEvent) {
        //     var sQuery = oEvent.getParameter("query");
        //     this._filterOrders(sQuery);
        // },
        
        // onSearchLiveChange: function (oEvent) {
        //     var sQuery = oEvent.getParameter("newValue");
        //     this._filterOrders(sQuery);
        // },
        
        // _filterOrders: function (sQuery) {
        //     var oTable = this.byId("OrdersList");
        //     var oBinding = oTable.getBinding("items");
        
        //     var aFilters = [];
        
        //     if (sQuery) {
        //         // Ensure query is treated correctly for different data types
        //         var oCustomerIDFilter = new sap.ui.model.Filter("CustomerID", sap.ui.model.FilterOperator.Contains, sQuery);
        //         var oOrderIDFilter = new sap.ui.model.Filter("OrderID", sap.ui.model.FilterOperator.EQ, parseInt(sQuery, 10) || 0);
        //         // var oCategoryIDFilter = new sap.ui.model.Filter("CategoryID", sap.ui.model.FilterOperator.EQ, parseInt(sQuery, 10) || 0);
        
        //         aFilters.push(new sap.ui.model.Filter([oCustomerIDFilter,oOrderIDFilter ], false)); // false = OR condition
        //     }
        
        //     oBinding.filter(aFilters);
        // },

            //  Below code is  suppliers search functionality

        onSearchPress01: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            this._filterSuppliers(sQuery);
        },
        
        onSearchLiveChange01: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            this._filterSuppliers(sQuery);
        },
        
        _filterSuppliers: function (sQuery) {
            var oList = this.byId("SuppliersList");
            var oBinding = oList.getBinding("items");
        
            // Ensure binding exists before filtering
            if (!oBinding) {
                console.warn("Suppliers List binding is null. Check model binding.");
                return;
            }
        
            var aFilters = [];
        
            if (sQuery) {
                var oCompanyNameFilter = new sap.ui.model.Filter("CompanyName", sap.ui.model.FilterOperator.Contains, sQuery);
                
                // Ensure only valid numbers are used for SupplierID filter
                var oSupplierIDFilter = null;
                if (!isNaN(sQuery)) {
                    oSupplierIDFilter = new sap.ui.model.Filter("SupplierID", sap.ui.model.FilterOperator.EQ, parseInt(sQuery, 10));
                }
        
                // Apply OR condition for CompanyName or SupplierID match
                if (oSupplierIDFilter) {
                    aFilters.push(new sap.ui.model.Filter([oCompanyNameFilter, oSupplierIDFilter], false));
                } else {
                    aFilters.push(oCompanyNameFilter);
                }
            }
        
            // Apply filters or clear them
            oBinding.filter(aFilters.length > 0 ? aFilters : []);
        },
        
        // Handle Supplier Selection
        onSupplierSelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            if (!oSelectedItem) {
                console.error("No supplier selected");
                return;
            }
        
            var oContext = oSelectedItem.getBindingContext();
            var oData = oContext.getObject();
        
            var oView = this.getView();
        
            // Populate Supplier Details
            oView.byId("SupplierID").setText(oData.SupplierID);
            oView.byId("CompanyName").setText(oData.CompanyName);
            oView.byId("ContactName").setText(oData.ContactName);
            oView.byId("ContactTitle").setText(oData.ContactTitle);
            oView.byId("Address").setText(oData.Address);
            oView.byId("City").setText(oData.City);
            oView.byId("PostalCode").setText(oData.PostalCode);
            oView.byId("Country").setText(oData.Country);
            oView.byId("Phone").setText(oData.Phone);
        
            // Show Supplier Details & Hide List
            oView.byId("SupplierListContainer").setVisible(false);
            oView.byId("supplierDetailsSection").setVisible(true);
        },
        
        // Handle Back to Supplier List
        onBackToSuppliers: function () {
            var oView = this.getView();
            oView.byId("SupplierListContainer").setVisible(true);
            oView.byId("supplierDetailsSection").setVisible(false);
        }
        
        
    });
});
