sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/m/Dialog",
  "sap/m/Label",
  "sap/m/Input",
  "sap/m/Button"
], function(Controller, JSONModel, MessageToast, MessageBox, Dialog, Label, Input, Button) {
  "use strict";

  return Controller.extend("globaltrades.controller.Products", {
    onInit: function () {
      var oModel = new JSONModel();
      var sLocalData = localStorage.getItem("productsData");

      if (sLocalData) {
        oModel.setData({ products: JSON.parse(sLocalData) });
      } else {
        var sPath = sap.ui.require.toUrl("globaltrades/model/dummyData.json");
        oModel.loadData(sPath, null, false);
        oModel.attachRequestCompleted(function() {
          localStorage.setItem("productsData", JSON.stringify(oModel.getProperty("/products")));
        });
      }

      this.getView().setModel(oModel, "productsModel");
    },

    onAddProduct: function() {
      this._openProductDialog("Add");
    },

    _openProductDialog: function(sMode, oContext) {
      if (this._oDialog) {
        this._oDialog.destroy();
      }

      this._oDialog = new Dialog({
        title: sMode === "Edit" ? "Edit Product" : "Add New Product",
        contentWidth: "400px",
        content: [
          new Label({ text: "Product ID" }),
          new Input("idProductID", { editable: sMode === "Add" }),
          new Label({ text: "Product Name" }),
          new Input("idProductName"),
          new Label({ text: "Unit Price (Auto Generated)" }),
          new Input("idUnitPrice", { editable: false }),
          new Label({ text: "Quantity" }),
          new Input("idQuantity", { type: "Number", min: 1 })
        ],
        beginButton: new Button({
          text: "Generate Price",
          visible: sMode === "Add",
          press: function () {
            var iPrice = Math.floor(Math.random() * (500 - 10 + 1)) + 10;
            sap.ui.getCore().byId("idUnitPrice").setValue(iPrice);
          }
        }),
        endButton: new Button({
          text: "Save",
          press: function() {
            this._onSaveProduct(sMode, oContext);
          }.bind(this)
        }),
        afterClose: function() {
          this.destroy();
        }
      });

      if (sMode === "Edit" && oContext) {
        sap.ui.getCore().byId("idProductID").setValue(oContext.ProductID);
        sap.ui.getCore().byId("idProductName").setValue(oContext.ProductName);
        sap.ui.getCore().byId("idUnitPrice").setValue(oContext.UnitPrice);
        sap.ui.getCore().byId("idQuantity").setValue(oContext.Quantity);
      }

      this._oDialog.open();
    },

    _onSaveProduct: function(sMode, oContext) {
      var sProductID = sap.ui.getCore().byId("idProductID").getValue();
      var sProductName = sap.ui.getCore().byId("idProductName").getValue();
      var sUnitPrice = sap.ui.getCore().byId("idUnitPrice").getValue();
      var sQuantity = sap.ui.getCore().byId("idQuantity").getValue();

      if (!sProductID || !sProductName || !sUnitPrice || !sQuantity) {
        MessageBox.warning("Please fill all fields and generate Unit Price.");
        return;
      }

      var oModel = this.getView().getModel("productsModel");
      var aProducts = oModel.getProperty("/products") || [];

      if (sMode === "Add") {
        aProducts.push({
          ProductID: sProductID,
          ProductName: sProductName,
          UnitPrice: parseFloat(sUnitPrice),
          Quantity: parseInt(sQuantity, 10)
        });
      } else if (sMode === "Edit" && oContext) {
        var iIndex = aProducts.findIndex(item => item.ProductID === oContext.ProductID);
        if (iIndex !== -1) {
          aProducts[iIndex] = {
            ProductID: sProductID,
            ProductName: sProductName,
            UnitPrice: parseFloat(sUnitPrice),
            Quantity: parseInt(sQuantity, 10)
          };
        }
      }

      oModel.setProperty("/products", aProducts);
      localStorage.setItem("productsData", JSON.stringify(aProducts));
      MessageToast.show("Product " + (sMode === "Add" ? "added" : "updated") + " successfully!");

      this._oDialog.close();
    },

    onEditProduct: function(oEvent) {
      var oContext = oEvent.getSource().getBindingContext("productsModel").getObject();
      this._openProductDialog("Edit", oContext);
    },

    onDeleteProduct: function(oEvent) {
      var oContext = oEvent.getSource().getBindingContext("productsModel").getObject();
      var oModel = this.getView().getModel("productsModel");
      var aProducts = oModel.getProperty("/products") || [];

      MessageBox.confirm("Are you sure you want to delete this product?", {
        onClose: function(oAction) {
          if (oAction === "OK") {
            aProducts = aProducts.filter(function(item) {
              return item.ProductID !== oContext.ProductID;
            });

            oModel.setProperty("/products", aProducts);
            localStorage.setItem("productsData", JSON.stringify(aProducts));
            MessageToast.show("Product deleted successfully!");
          }
        }
      });
    }
  });
});
