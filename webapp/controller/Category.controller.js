sap.ui.define([
    "sap/ui/core/mvc/Controller",
], function (Controller) {
    "use strict";

    return Controller.extend("com.aifa.sap.tilesdashboard.controller.Category", {
        onInit: function () {
            this.getView().byId("iconTabBar3").setSelectedKey("Categories");
        },
        
        onCategorySearchLiveChange: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            this._filterCategories(sQuery);
        },
        
        onCategorySearchPress: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            this._filterCategories(sQuery);
        },
        
        _filterCategories: function (sQuery) {
            var oList = this.getView().byId("CategoriesList");
            var oBinding = oList.getBinding("items");
        
            var aFilters = [];
        
            if (sQuery) {
                // Ensure query is treated correctly for both text and numeric searches
                var oCategoryNameFilter = new sap.ui.model.Filter("CategoryName", sap.ui.model.FilterOperator.Contains, sQuery);
                var oCategoryIDFilter = new sap.ui.model.Filter("CategoryID", sap.ui.model.FilterOperator.EQ, parseInt(sQuery, 10) || 0);
        
                aFilters.push(new sap.ui.model.Filter([oCategoryNameFilter, oCategoryIDFilter], false)); // OR condition
            }
        
            oBinding.filter(aFilters);
        }
        ,
        

        onCategorySelect: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            var oContext = oItem.getBindingContext();
            this._showCategoryDetails(oContext);
        },

        _showCategoryDetails: function (oContext) {
            var oView = this.getView();
            oView.byId("categoryID1").setText(oContext.getProperty("CategoryID"));
            oView.byId("categoryName").setText(oContext.getProperty("CategoryName"));
            oView.byId("categoryDescription").setText(oContext.getProperty("Description"));
            oView.byId("categoryImage").setSrc(oContext.getProperty("Picture"));

            oView.byId("iconTabBar3").setSelectedKey("CategoryDetails");
        },

        onBackToCategories: function () {
            this.getView().byId("iconTabBar3").setSelectedKey("Categories");
        }
    });
});
