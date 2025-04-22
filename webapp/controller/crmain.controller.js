sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("crud.controller.crmain", {
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel();
            this.isEditMode = false; // Flag to check if editing
            this.sEditPath = ""; // Store path of selected category for editing
        },

        onCategories: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oCtx = oSelectedItem.getBindingContext();
            var sPath = oCtx.getPath();

            var oDetailsPanel = this.getView().byId("detailsPanel");
            oDetailsPanel.bindElement(sPath);
            this.getView().byId("listPanel").setVisible(false);
            oDetailsPanel.setVisible(true);
        },

        onBack: function () {
            this.getView().byId("detailsPanel").setVisible(false);
            this.getView().byId("listPanel").setVisible(true);
        },

        onAddCategory: function () {
            this.isEditMode = false;
            this.getView().byId("categoryID").setValue("");
            this.getView().byId("categoryName").setValue("");

            this.getView().byId("listPanel").setVisible(false);
            this.getView().byId("categoryForm").setVisible(true);
        },

        onCancel: function () {
            this.getView().byId("categoryForm").setVisible(false);
            this.getView().byId("listPanel").setVisible(true);
        },

        onEditCategory: function () {
            var oDetailsPanel = this.getView().byId("detailsPanel");
            var oBindingContext = oDetailsPanel.getBindingContext();

            if (!oBindingContext) {
                MessageToast.show("No category selected.");
                return;
            }

            var oCategory = oBindingContext.getObject();
            this.isEditMode = true;
            this.sEditPath = oBindingContext.getPath(); // Store path for update

            // Populate form with selected category data
            this.getView().byId("categoryID").setValue(oCategory.ID);
            this.getView().byId("categoryName").setValue(oCategory.Name);

            this.getView().byId("detailsPanel").setVisible(false);
            this.getView().byId("categoryForm").setVisible(true);
        },

        onSaveCategory: function () {
            var oModel = this.getView().getModel();
            var sNewName = this.getView().byId("categoryName").getValue();
            var sNewID = this.getView().byId("categoryID").getValue();

            if (!sNewID || !sNewName) {
                MessageToast.show("Please enter both ID and Name.");
                return;
            }

            var oCategory = {
                ID: sNewID,
                Name: sNewName
            };
            oModel.setUseBatch(false);

            if (this.isEditMode) {
                // Perform an update operation
                oModel.update(this.sEditPath, oCategory, {
                    success: function () {
                        MessageToast.show("Category successfully updated!");
                        this.getView().byId("categoryForm").setVisible(false);
                        this.getView().byId("listPanel").setVisible(true);
                        oModel.refresh();
                    }.bind(this),
                    error: function () {
                        MessageToast.show("Error while updating category.");
                    }
                });
            } else {
                // Perform a create operation
                oModel.create("/Categories", oCategory, {
                    success: function () {
                        MessageToast.show("Category successfully created!");
                        this.getView().byId("categoryForm").setVisible(false);
                        this.getView().byId("listPanel").setVisible(true);
                        oModel.refresh();
                    }.bind(this),
                    error: function () {
                        MessageToast.show("Error while creating category.");
                    }
                });
            }
        }
        ,

        onDeleteCategory: function () {
            var oModel = this.getView().getModel();
            var oDetailsPanel = this.getView().byId("detailsPanel");
            var oBindingContext = oDetailsPanel.getBindingContext();

            if (!oBindingContext) {
                MessageToast.show("No category selected.");
                return;
            }

            var sPath = oBindingContext.getPath();
            oModel.setUseBatch(false);

            oModel.remove(sPath, {
                success: function () {
                    MessageToast.show("Category successfully deleted!");
                    oDetailsPanel.setVisible(false);
                    this.getView().byId("listPanel").setVisible(true);
                    oModel.refresh();
                }.bind(this),
                error: function () {
                    MessageToast.show("Error while deleting category.");
                }
            });
        }
    });
});
