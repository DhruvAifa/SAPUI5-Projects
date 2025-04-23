sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.aifa.sap.tilesdashboard.controller.Invoice", {
        onInit: function() {
            console.log("Invoice Page Loaded");
        },

        // Handle Invoice Selection and Navigate to Details
        onInvoiceSelect: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oContext = oSelectedItem.getBindingContext();
            var oData = oContext.getObject();
            var oView = this.getView();

            // Populate fields with selected invoice details
            oView.byId("orderID").setText(oData.OrderID);
            oView.byId("orderDate").setText(oData.OrderDate);
            oView.byId("requiredDate").setText(oData.RequiredDate);
            oView.byId("shippedDate").setText(oData.ShippedDate);
            oView.byId("customerID").setText(oData.CustomerID);
            oView.byId("customerName").setText(oData.CustomerName);
            oView.byId("shipName").setText(oData.ShipName);
            oView.byId("shipAddress").setText(oData.ShipAddress);
            oView.byId("shipCity").setText(oData.ShipCity);
            oView.byId("shipPostalCode").setText(oData.ShipPostalCode);
            oView.byId("shipCountry").setText(oData.ShipCountry);
            oView.byId("salesperson").setText(oData.Salesperson);
            oView.byId("shipperName").setText(oData.ShipperName);
            oView.byId("productID1").setText(oData.ProductID);
            oView.byId("productName1").setText(oData.ProductName);
            oView.byId("unitPrice1").setText(oData.UnitPrice);
            oView.byId("quantity").setText(oData.Quantity);
            oView.byId("discount").setText(oData.Discount);
            oView.byId("extendedPrice").setText(oData.ExtendedPrice);
            oView.byId("freight").setText(oData.Freight);

            // Switch to "Invoice Details" tab
            oView.byId("IconTabBar").setSelectedKey("InvoiceForm");
        },

        // Live search filter for Customer Name & Customer ID
        onInvoiceSearchLiveChange: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            this._filterInvoices(sQuery);
        },
        
        // Search button click event
        onInvoiceSearchPress: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            this._filterInvoices(sQuery);
        },
        
        // Filter Invoices based on Customer Name or Customer ID
        _filterInvoices: function (sQuery) {
            var oList = this.getView().byId("InvoicesList");
            var oBinding = oList.getBinding("items");
            var aFilters = [];
        
            if (sQuery) {
                var oCustomerNameFilter = new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sQuery);
                var oCustomerIDFilter = new sap.ui.model.Filter("CustomerID", sap.ui.model.FilterOperator.EQ, parseInt(sQuery, 10) || 0);
        
                aFilters.push(new sap.ui.model.Filter([oCustomerNameFilter, oCustomerIDFilter], false)); // OR condition
            }
        
            oBinding.filter(aFilters);
        },
        
        // Navigate back to Invoices List
        onBackToInvoices: function () {
            this.getView().byId("IconTabBar").setSelectedKey("Invoices");
        }
        
    });
});
