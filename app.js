//app.js

var MyApp = new Backbone.Marionette.Application();
MyApp.addInitializer(function() {
	console.log("Welcome to my app.");
});

MyApp.addRegions({
	mainRegion: "#main",
	mainTabRegion: "#main-tabs"
});

MyApp.module("HelloWorld",function(HelloWorld,MyApp,Backbone,Marionette,$,_) {
	var HelloLayout = Marionette.Layout.extend({
		template: "#hello-layout",
		regions: {
			payload: "#payload"
		},
		ui: {
			nameBox: "input[type='text']"
		},
		events: {
			"keyup input[type='text']": _.debounce(function(e) {
				this.model.set("name", $(e.target).val());
			} ,500)
		},
		onShow: function() {
			this.ui.nameBox.focus();
		}
	});

	var HelloPayload = Marionette.ItemView.extend({
		template: _.template("Hello: <%= name %>!"),
		modelEvents: {
			"change:name": "render"
		}
	});

	var MyModel = Backbone.Model.extend({});
	var myModel = new MyModel({ name: "Robin"});
	var helloLayout = new HelloLayout({
		model: myModel
	});

	MyApp.mainRegion.show(helloLayout);

	helloLayout.payload.show(new HelloPayload({
		model: myModel
	}));


});

