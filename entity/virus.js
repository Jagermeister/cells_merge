"use strict";
class Virus extends Entity {
    constructor(context, x, y) {
        super(context, x, y, 100, "#00FF00");
        this.consumedCount = 0;
    }

    update(delta) {
        this.velocity_x *= .95;
        this.velocity_y *= .95;
            //TODO: fix deceleration
        super.update(delta);
    }

    onConsume(entity) {
        this.consumedCount++;
        this.size_set(this.size + entity.size);
        if (this.consumedCount >= 4) {
            this.consumedCount = 0;
            this.size_set(100);
            let v = new Virus(this.context, this.x, this.y);
            v.velocity_x = entity.velocity_x * 2;
            v.velocity_y = entity.velocity_y * 2;
            viruss[v.UID] = v;
        }
    }

    onConsumed(entity) {
        // Split entity into 16-sum(entity.count)
        let parent = playerGroup.get(entity.parent_uid);
        let pieces = Math.min(16 - parent.cells.length, Math.floor(entity.size / 9), 4);
        if (pieces > 0) {
            let size = Math.floor(entity.size / pieces);
            entity.size_set(size);
            entity.time_spent_split = 0;
            for (let i = 0; i < pieces - 1; i++) {
                let c = parent.cell_create(this.x, this.y, size);
                // Need to push them apart!
            }
        }
    }
}