sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/Dialog",
  "sap/m/DialogType",
  "sap/m/Label",
  "sap/m/Input",
  "sap/m/DatePicker",
  "sap/m/Button",
  "sap/m/MessageToast"
], function (
  Controller,
  JSONModel,
  Dialog,
  DialogType,
  Label,
  Input,
  DatePicker,
  Button,
  MessageToast
) {
  "use strict";

  return Controller.extend("globaltrades.controller.Orders", {

    isOrderDialogOpen: false,

    onInit: function () {
      const sPath = sap.ui.require.toUrl("globaltrades/model/dummyData.json");
      const oModel = new JSONModel();
      oModel.loadData(sPath, null, false);
      const oDummy = oModel.getData();

      const sLocal = localStorage.getItem("ordersData");
      let oCombined;

      if (sLocal) {
        // 3a. If stored data exists, merge arrays
        const oStored = JSON.parse(sLocal);
        // Ensure both have an "orders" array
        const aDummy = Array.isArray(oDummy.orders) ? oDummy.orders : [];
        const aStored = Array.isArray(oStored.orders) ? oStored.orders : [];
        // Merge, de‐duplicate by OrderID (stored entries override dummy on conflict)
        const mById = {};
        aDummy.concat(aStored).forEach(function(o) {
          mById[o.OrderID] = o;
        });
        oCombined = { orders: Object.values(mById) };
      } else {
        // 3b. No stored data: use dummy and seed localStorage
        oCombined = oDummy;
        localStorage.setItem("ordersData", JSON.stringify(oDummy));
      }

      // 4. Set merged data into model
      oModel.setData(oCombined);
      this.getView().setModel(oModel, "ordersModel");
    },

    onItemPress: function (oEvent) {
      const oSelectedOrder = oEvent.getSource()
        .getBindingContext("ordersModel")
        .getObject();
      const oModel = this.getView().getModel("ordersModel");
      oModel.setProperty("/selectedOrder", oSelectedOrder);
      this.byId("iconTabBar").setSelectedKey("orderDetails");
    },

    onBackToOrders: function () {
      this.byId("iconTabBar").setSelectedKey("orders");
    },

    _saveToLocalStorage: function () {
      const oData = this.getView().getModel("ordersModel").getData();
      localStorage.setItem("ordersData", JSON.stringify(oData));
    },

    onAdd: function () {
      if (this.isOrderDialogOpen) {
        MessageToast.show("Please complete the current order first.");
        return;
      }
      this._openOrderDialog("Add");
    },

    onEdit: function (oEvent) {
      if (this.isOrderDialogOpen) {
        MessageToast.show("Please complete the current order first.");
        return;
      }
      const oItem = oEvent.getSource()
        .getParent()
        .getBindingContext("ordersModel")
        .getObject();
      this._openOrderDialog("Edit", oItem);
    },

    onDelete: function (oEvent) {
      const oContext = oEvent.getSource()
        .getParent()
        .getBindingContext("ordersModel");
      const iIndex = parseInt(oContext.getPath().split("/")[2], 10);
      const oModel = this.getView().getModel("ordersModel");
      const aOrders = oModel.getProperty("/orders") || [];

      if (aOrders[iIndex]) {
        aOrders.splice(iIndex, 1);
        oModel.setProperty("/orders", aOrders);
        this._saveToLocalStorage();
        MessageToast.show("Order deleted.");
      } else {
        console.error("Invalid order index:", iIndex);
      }
    },

    _openOrderDialog: function (mode, orderData) {
      this.isOrderDialogOpen = true;
      const bIsAdd = mode === "Add";

      const oDialog = new Dialog({
        title: bIsAdd ? "Add Order" : "Edit Order",
        type: DialogType.Message,
        contentWidth: "300px",
        contentHeight: "auto",
        content: [
          new Label({ text: "Order ID" }),
          new Input("idOrderID", { value: orderData?.OrderID || "", enabled: bIsAdd }),
          new Label({ text: "Customer ID" }),
          new Input("idCustomerID", { value: orderData?.CustomerID || "" }),
          new Label({ text: "Order Date" }),
          new DatePicker("idOrderDate", {
            value: orderData?.OrderDate || "",
            displayFormat: "yyyy-MM-dd",
            minDate: new Date()
          }),
          new Label({ text: "Ship Country" }),
          new Input("idShipCountry", { value: orderData?.ShipCountry || "" })
        ],
        beginButton: new Button({
          text: "Save",
          press: () => {
            const oNew = {
              OrderID: sap.ui.getCore().byId("idOrderID").getValue(),
              CustomerID: sap.ui.getCore().byId("idCustomerID").getValue(),
              OrderDate: sap.ui.getCore().byId("idOrderDate").getValue(),
              ShipCountry: sap.ui.getCore().byId("idShipCountry").getValue()
            };
            const oModel = this.getView().getModel("ordersModel");
            let aOrders = oModel.getProperty("/orders") || [];

            if (bIsAdd) {
              if (aOrders.some(o => o.OrderID === oNew.OrderID)) {
                MessageToast.show("Order ID already exists.");
                return;
              }
              aOrders.push(oNew);
              MessageToast.show("Order added successfully.");
            } else {
              const iIdx = aOrders.findIndex(o => o.OrderID === orderData.OrderID);
              if (iIdx !== -1) {
                aOrders[iIdx] = oNew;
                MessageToast.show("Order updated successfully.");
              } else {
                MessageToast.show("Order not found.");
                return;
              }
            }

            oModel.setProperty("/orders", aOrders);
            this._saveToLocalStorage();
            oDialog.close();
            this.isOrderDialogOpen = false;
          }
        }),
        endButton: new Button({
          text: "Cancel",
          press: () => {
            oDialog.close();
            this.isOrderDialogOpen = false;
          }
        }),
        afterClose: () => {
          this.isOrderDialogOpen = false;
        }
      });

      oDialog.open();
    }

  });
});
