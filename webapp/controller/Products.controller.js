sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("com.aifa.sap.tilesdashboard.controller.Products", {
        onInit: function() {
            console.log("Products Page Loaded");
        },
        onProducts: function (oEvent) {
            // Get selected product data
            var oSelectedItem = oEvent.getParameter("listItem");
            var oContext = oSelectedItem.getBindingContext();
            var oData = oContext.getObject();
        
            // Get view reference
            var oView = this.getView();
        
            // Populate fields with selected product details
            oView.byId("productID").setText(oData.ProductID);
            oView.byId("productName").setText(oData.ProductName);
            oView.byId("supplierID").setText(oData.SupplierID);
            oView.byId("categoryID").setText(oData.CategoryID);
            oView.byId("quantityPerUnit").setText(oData.QuantityPerUnit);
            oView.byId("unitPrice").setText(oData.UnitPrice);
            oView.byId("unitsInStock").setText(oData.UnitsInStock);
            oView.byId("unitsOnOrder").setText(oData.UnitsOnOrder);
            oView.byId("reorderLevel").setText(oData.ReorderLevel);
        
            // Switch to "Products Details" tab
            var oIconTabBar = oView.byId("iconTabBar");
            oIconTabBar.setSelectedKey("ProductsForm");

           
        },
        onBackToProducts: function () {
            // Get view reference
            var oView = this.getView();
        
            // Switch back to "Products" tab
            var oIconTabBar = oView.byId("iconTabBar");
            oIconTabBar.setSelectedKey("Products");
        },
        onSearchPress: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            this._filterProducts(sQuery);
        },
        
        onSearchLiveChange: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            this._filterProducts(sQuery);
        },
         
        _filterProducts: function (sQuery) {
            var oTable = this.byId("ProductsList");
            var oBinding = oTable.getBinding("items");
        
            var aFilters = [];
        
            if (sQuery) {
                // Ensure query is treated correctly for different data types
                var oProductNameFilter = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.Contains, sQuery);
                var oSupplierIDFilter = new sap.ui.model.Filter("SupplierID", sap.ui.model.FilterOperator.EQ, parseInt(sQuery, 10) || 0);
                var oCategoryIDFilter = new sap.ui.model.Filter("CategoryID", sap.ui.model.FilterOperator.EQ, parseInt(sQuery, 10) || 0);
        
                aFilters.push(new sap.ui.model.Filter([oProductNameFilter, oSupplierIDFilter, oCategoryIDFilter], false)); // false = OR condition
            }
        
            oBinding.filter(aFilters);
        }
        ,   
    });
});
