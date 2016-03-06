"use strict";
class Pellet extends Entity {
        // Consumables
    constructor(context, x, y, size, color, parent_uid) {
        super(context, x, y, size, color, parent_uid);
        this.growth_ms_delay = 15000;
        this.growth_ms_lapse = 0;
        this.size_max = size * 5;
    }

    update(delta) {
        this.growth_ms_lapse += delta;
        if(this.size < this.size_max && this.growth_ms_lapse >= this.growth_ms_delay) {
            this.growth_ms_lapse = 0;
            this.size_set(this.size + 1);
        }

        this.velocity_x *= .95;
        this.velocity_y *= .95;
            //TODO: fix deceleration
        super.update(delta);
    }

    display() {
        super.display();
        if (this.size >= this.size_max) {
            this.context.lineWidth = 0.1;
            this.context.strokeStyle = "#000000";
            this.context.stroke();
        }
    }
}