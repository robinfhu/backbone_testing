//tabs.js

MyApp.module("TabTest",function(HelloWorld,MyApp,Backbone,Marionette,$,_) {
	var TabModel = Backbone.Model.extend({
		defaults: {
			name: "none",
			tabView: null,
			selected: false
		}
	});

	var TabCollection = Backbone.Collection.extend({
		model: TabModel
	});

	var TestView = Marionette.ItemView.extend({
		template: _.template("<%= message %>"),
		serializeData: function() {
			return {
				"message": this.options.message
			}
		}
	});

	var TabItemView = Marionette.ItemView.extend({
		tagName: "li",
		className: function() {
			return this.model.get("selected") ? "selected": "";
		},
		template: _.template("<%= name %>")
	});

	var TabItemViewCollection = Marionette.CollectionView.extend({
		tagName: "ul",
		itemView: TabItemView,
		switchTab: function(e) {
			var tabName = $(e.target).text();
			_(this.collection.models).each(function(m) {
				m.set("selected", m.get("name") === tabName);
			});
			this.render();
			this.trigger("tabChanged", tabName);
			console.log("tabchanged",tabName);
		},
		onRender: function() {
			this.$("li").not(".selected").on("click", _.bind(this.switchTab,this));
		}
	});

	var TabLayout = Marionette.Layout.extend({
		template: "#multi-tab-template",
		initialize: function() {
			this.collection.models[0].set("selected",true);
			this.tabItemViewCollection = new TabItemViewCollection({collection:this.collection});
		},
		regions: {
			tabLinks: ".tabs",
			tabContent: ".tab-content"
		},
		getSelectedTab: function() {
			return _(this.collection.models).find(function(m) {return m.get("selected")}).get("name");
		},
		onRender: function() {
			this.tabLinks.show(this.tabItemViewCollection);
			this.tabChanged(this.getSelectedTab());
			this.listenTo(this.tabItemViewCollection, "tabChanged", this.tabChanged);
		},
		tabChanged: function(tabName) {
			var view = _(this.collection.models).find(function(m) { return m.get("name") === tabName});
			this.tabContent.show(
					view.get("tabView")
				);
		}
	});

	var tab3 = new TabLayout({
		collection: new TabCollection([
				{name: "Category Snapshot",	tabView:	new TestView({message: "This is the cat snapshot page"}) },
				{name: "Risk",	tabView:	new TestView({message: "This is the historicat cat page"})}
			])
	});

	var tab2 = new TabLayout({
		collection: new TabCollection([
				{name: "Novus Framework",	tabView:	tab3 },
				{name: "Historical Position",	tabView:	new TestView({message: "This is the historical pos page"})},
				{name: "Heatmap",tabView:	new TestView({message: "This is the heatmap page"})},
				{name: "Income",		tabView:	new TestView({message: "This is the income page"}) }
			])
	});

	var tab1 = new TabLayout({
		collection: new TabCollection([
				{name: "Overview",	tabView:	new TestView({message: "This is the overview page"}) },
				{name: "Positions",	tabView:	tab2},
				{name: "Attribution",tabView:	new TestView({message: "This is the attributions page"})},
				{name: "Risk",		tabView:	new TestView({message: "This is the risk page"}) }
			])
	});

	MyApp.mainTabRegion.show(tab1);
});