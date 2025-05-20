sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function(Controller, JSONModel, MessageToast, MessageBox, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("globaltrades.controller.Customers", {
      onInit: function() {
          this._initializeCustomerModel();
      },
      
      _initializeCustomerModel: function() {
          const sLocalData = localStorage.getItem("customersData");
          const oModel = new JSONModel();
      
          if (sLocalData) {
              oModel.setData({
                  customers: JSON.parse(sLocalData),
                  selectedCustomer: null
              });
              this.getView().setModel(oModel, "customerModel");
          } else {
              const sPath = sap.ui.require.toUrl("globaltrades/model/dummyData.json");
              oModel.loadData(sPath, null, false); 
      
              oModel.attachRequestCompleted(function() {
                  const customers = oModel.getProperty("/customers") || [];
                  localStorage.setItem("customersData", JSON.stringify(customers));
                  oModel.setData({
                      customers: customers,
                      selectedCustomer: null
                  });
                  this.getView().setModel(oModel, "customerModel");
              }.bind(this));
          }
      },

      onAddCustomer: function() {
          this._openCustomerDialog("Add");
      },

      onEditCustomer: function(oEvent) {
          const oContext = oEvent.getSource().getBindingContext("customerModel").getObject();
          this._openCustomerDialog("Edit", oContext);
      },

      _openCustomerDialog: function(sMode, oContext) {
          if (this._oDialog) {
              this._oDialog.destroy();
          }

          const bIsAdd = sMode === "Add";

          this._oDialog = new sap.m.Dialog({
              title: bIsAdd ? "Add New Customer" : "Edit Customer",
              type: sap.m.DialogType.Message,
              contentWidth: "400px",
              content: [
                  new sap.m.Label({ text: "Customer ID", required: true }),
                  new sap.m.Input({
                      id: this.getView().createId("idCustomerID"),
                      value: oContext?.customerId || "",
                      editable: bIsAdd
                  }),
                  new sap.m.Label({ text: "Name", required: true }),
                  new sap.m.Input({
                      id: this.getView().createId("idName"),
                      value: oContext?.name || ""
                  }),
                  new sap.m.Label({ text: "Email", required: true }),
                  new sap.m.Input({
                      id: this.getView().createId("idEmail"),
                      value: oContext?.email || "",
                      type: "Email"
                  }),
                  new sap.m.Label({ text: "Phone" }),
                  new sap.m.Input({
                      id: this.getView().createId("idPhone"),
                      value: oContext?.phone || "",
                      placeholder: "+1-555-1234"
                  }),
                  new sap.m.Label({ text: "Address" }),
                  new sap.m.TextArea({
                      id: this.getView().createId("idAddress"),
                      value: oContext?.address || "",
                      rows: 3,
                      placeholder: "123 Main St, New York, NY"
                  })
              ],
              beginButton: new sap.m.Button({
                  text: bIsAdd ? "Save" : "Update",
                  type: sap.m.ButtonType.Emphasized,
                  press: this._onSaveCustomer.bind(this, sMode, oContext)
              }),
              endButton: new sap.m.Button({
                  text: "Cancel",
                  press: function() {
                      this._oDialog.close();
                  }.bind(this)
              }),
              afterClose: function() {
                  this.destroy();
              }
          });

          this.getView().addDependent(this._oDialog);
          this._oDialog.open();
      },

      _onSaveCustomer: function(sMode, oContext) {
          const oView = this.getView();
          const oNewCustomer = {
              customerId: oView.byId("idCustomerID").getValue(),
              name: oView.byId("idName").getValue(),
              email: oView.byId("idEmail").getValue(),
              phone: oView.byId("idPhone").getValue(),
              address: oView.byId("idAddress").getValue()
          };

          // Validation
          if (!oNewCustomer.customerId || !oNewCustomer.name || !oNewCustomer.email) {
              MessageBox.error("Please fill in all required fields");
              return;
          }

          if (!this._validateEmail(oNewCustomer.email)) {
              MessageBox.error("Please enter a valid email address");
              return;
          }

          const oModel = this.getView().getModel("customerModel");
          let aCustomers = oModel.getProperty("/customers") || [];

          if (sMode === "Add") {
              // Check for duplicate customer ID
              if (aCustomers.some(c => c.customerId === oNewCustomer.customerId)) {
                  MessageBox.error("Customer ID already exists");
                  return;
              }
              aCustomers.push(oNewCustomer);
          } else {
              // Update existing customer
              const iIndex = aCustomers.findIndex(c => c.customerId === oContext.customerId);
              if (iIndex >= 0) {
                  aCustomers[iIndex] = oNewCustomer;
              }
          }

          // Update model and localStorage
          oModel.setProperty("/customers", aCustomers);
          localStorage.setItem("customersData", JSON.stringify(aCustomers));
          
          MessageToast.show(`Customer ${sMode === 'Add' ? 'added' : 'updated'} successfully`);
          this._oDialog.close();
      },

      _validateEmail: function(sEmail) {
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return re.test(sEmail);
      },

      onViewDetails: function(oEvent) {
        const oModel = this.getView().getModel("customerModel");
        const oItem = oEvent.getSource().getBindingContext("customerModel").getObject();
        
        // Set the selected customer in the model
        oModel.setProperty("/selectedCustomer", oItem);
        
        // Get the popover and open it - ID matches XML now
        const oPopover = this.byId("customerPopover");
        oPopover.openBy(oEvent.getSource());
    },

      onDeleteCustomer: function(oEvent) {
          const oItem = oEvent.getSource().getBindingContext("customerModel").getObject();
          
          MessageBox.confirm(`Are you sure you want to delete customer ${oItem.name}?`, {
              title: "Confirm Deletion",
              onClose: function(sAction) {
                  if (sAction === MessageBox.Action.OK) {
                      const oModel = this.getView().getModel("customerModel");
                      const customers = oModel.getProperty("/customers");
                      
                      const updatedCustomers = customers.filter(cust => cust.customerId !== oItem.customerId);
                      oModel.setProperty("/customers", updatedCustomers);
                      
                      localStorage.setItem("customersData", JSON.stringify(updatedCustomers));
                      
                      MessageToast.show("Customer deleted successfully");
                  }
              }.bind(this)
          });
      },

      onSearch: function(oEvent) {
          const sQuery = oEvent.getSource().getValue();
          const oTable = this.byId("customerTable");
          const oBinding = oTable.getBinding("items");
          
          if (sQuery) {
              const aFilters = [
                  new Filter("name", FilterOperator.Contains, sQuery),
                  new Filter("customerId", FilterOperator.Contains, sQuery),
                  new Filter("email", FilterOperator.Contains, sQuery)
              ];
              oBinding.filter(new Filter({
                  filters: aFilters,
                  and: false
              }));
          } else {
              oBinding.filter([]);
          }
      }
  });
});