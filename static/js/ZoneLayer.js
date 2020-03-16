L.ZoneLayer = L.LayerGroup.extend({
	initialize(options) {
		this._context = null;
		this._cache = new WeakMap();

		L.LayerGroup.prototype.initialize.call(this, options);

        this._states = null;

        (async () => {
            let request = await fetch("/static/js/us_states.json");
            request = await request.json();

            this._states = request;
        })();
	},

	update(context) {
        if (!context) return;
		this._context = context;

        const SysParam = context.SysParam;
        if (!SysParam) return;
        const Bus = SysParam.Bus;

        let paramCache = this._cache.get(SysParam);
        if (!paramCache) {
            paramCache = {};
            this._cache.set(SysParam, paramCache);
        }

        //let { zoneCoords } = paramCache;
        if (this._states) {
            let { features } = this._states;

            this.clearLayers();

            for (let feature of features) {
                L.geoJSON(feature).addTo(this);
            }
        }
	}
});

L.zoneLayer = function(options) {
	return new L.ZoneLayer(options);
};