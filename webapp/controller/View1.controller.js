sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.aifa.sap.tilesdashboard.controller.View1", {
        onInit() {
        },    
        onTilePress: function (oEvent) {
            // Get the tile header to determine navigation
            var sTileHeader = oEvent.getSource().getHeader();

            // Get the router instance
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            // Navigate based on the tile clicked
            switch (sTileHeader) {
                case "Products":
                    oRouter.navTo("Products"); // Ensure you have a "Products" route in manifest.json
                    break;
                case "Orders and Suppliers":
                    oRouter.navTo("OrdersSuppliers");
                    break;
                case "Invoice":
                    oRouter.navTo("Invoice");
                    break;
                case "Category":
                    oRouter.navTo("Category");
                    break;
                case "Shippers":
                    oRouter.navTo("Shippers");
                    break;
                default:
                    sap.m.MessageToast.show("Navigation not configured for this tile.");
            }
        }
    });
});