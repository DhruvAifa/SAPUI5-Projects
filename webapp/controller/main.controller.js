sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.aifa.sap.northwindemployee.controller.main", {
        onInit() {
            
        },
        onSelectEmployee: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem"); // Get selected employee
            var oCtx = oSelectedItem.getBindingContext(); // Get binding context
           
            // Fetch Employee ID and bind it dynamically
            var sPath = oCtx.getPath(); // Example: "/Employees(1)"
            var oDetailsPanel = this.getView().byId("detailsPanel");
           
            oDetailsPanel.bindElement(sPath); // Bind the second panel to selected employee
           
            // Hide list panel, show details panel
            this.getView().byId("listPanel").setVisible(false);
            oDetailsPanel.setVisible(true);
        },
 
        onBack: function () {
            this.getView().byId("listPanel").setVisible(true);
            this.getView().byId("detailsPanel").setVisible(false);
        },

        
    });
});