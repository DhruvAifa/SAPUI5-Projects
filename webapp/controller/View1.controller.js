sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("globaltrades.controller.View1", {
        onInit() {
            this.byId("loginButton").setVisible(true);
            this.byId("userAvatar").setVisible(false);
        },
        onTilePress: function (oEvent) {
            // Get the tile header to determine navigation
            var sTileHeader = oEvent.getSource().getHeader();

            // Get the router instance
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            // Navigate based on the tile clicked
            switch (sTileHeader) {
                case "Orders":
                    oRouter.navTo("Orders");  
                    break;
                case "Products":
                    oRouter.navTo("Products");
                    break;
                case "Customers":
                    oRouter.navTo("Customers");
                    break;
                default:
                    sap.m.MessageToast.show("Navigation not configured for this tile.");
            }
        },
        onLoginPress: function () {
            this.byId("loginButton").setVisible(false);  
            this.byId("userAvatar").setVisible(true);    
            this.byId("logoutButton").setVisible(true);
        },
        
        onLogoutPress: function () {
            this.byId("loginButton").setVisible(true);  
            this.byId("userAvatar").setVisible(false);   
            this.byId("logoutButton").setVisible(false); 
        },
        
        onHelpPress: function () {
            sap.m.MessageToast.show("Help is on the way!");
        },

    });
});