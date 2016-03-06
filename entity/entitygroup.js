"use strict";
class EntityGroup {
    constructor(context, entityClassName, count_initial, count_max, spawn_size, spawn_ms_cooldown, treeDisallowed) {
        this.context = context;
            // Canvas link
        this.entityClassName = entityClassName;
            // Entity we are holding
        this._map = new Map();
            // {UID: Entity}
        this._tree = null;
            // kdTree for nearest
        this.treeDisallowed = treeDisallowed;
            // Regenerate on each Update?
        this.tree_dimensions = ['x', 'y'];
        this.count_initial = count_initial;
            // How many to spawn when created
        this.count_max = count_max;
            // Max to keep alive
        this.spawn_size = spawn_size;
            // Size
        this.spawn_ms_cooldown = spawn_ms_cooldown;
            // Delay between spawns
        this.spawn_ms_since = 0;
    }

    // Public
    createEntity(x, y, size, color, parent_uid) {
        let e = this._entityCreate (x, y, size, color, parent_uid);
        if (!this.treeDisallowed) {
            this._tree.insert(e.kdTreeKey);
        }

        return e;
    }

    insertEntity(e) {
        this._map.set(e.UID, e);
        if (!this.treeDisallowed) {
            this._tree.insert(e.kdTreeKey);
        }
    }

    deleteEntity(e) {
        if (!this.treeDisallowed) {
            this._tree.remove(e.kdTreeKey);
        }

        this._map.delete(e.UID);
    }

    has(entity_uid) {
        return this._map.has(entity_uid);
    }

    get(entity_uid) {
        return this._map.get(entity_uid);
    }

    length() {
        return this._map.size;
    }

    nearest(key, n) {
        if (!this.treeDisallowed) {
            return this._tree.nearest(key, n);
        }
    }

    // Game Loop: Init, Update, Display
    init() {
        let entityList = [];
        for(let i = 0; i < this.count_initial; i++) {
            let e = this._entityCreate(null, null, this.spawn_size);
            if (!this.treeDisallowed) {
                entityList.push(e.kdTreeKey);
            }
        }

        if (!this.treeDisallowed) {
            this._tree = new kdTree(entityList, distanceSortValue, this.tree_dimensions);
        }
    }

    update(delta) {
        this.spawn_ms_since += delta;
        if (this.length() < this.count_max && this.spawn_ms_since >= this.spawn_ms_cooldown) {
            this.spawn_ms_since = 0;
            let e = this._entityCreate(null, null, this.spawn_size);
            if (!this.treeDisallowed) {
                this._tree.insert(e.kdTreeKey);
            }
        }

        for(let entity of this._map) {
            entity[1].update(delta);
        }
    }

    display() {
        for(let entity of this._map) {
            entity[1].display();
        }
    }

    // Private
    _entityCreate (x, y, size, color, parent_uid) {
        if (x == null) {
            let x_y = randomXYbySize(size);
            x = x_y.x;
            y = x_y.y;
        }

        let e = new this.entityClassName(this.context, x, y, size, color, parent_uid);
        this._map.set(e.UID, e);
        return e;
    }
}