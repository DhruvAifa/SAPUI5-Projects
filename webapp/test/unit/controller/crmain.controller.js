/*global QUnit*/

sap.ui.define([
	"crud/controller/crmain.controller"
], function (Controller) {
	"use strict";

	QUnit.module("crmain Controller");

	QUnit.test("I should test the crmain controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
