"use strict";
class Cell extends Entity {
        // Player, Enemy
    constructor(context, x, y, size, color, parent_uid) {
        super(context, x, y, size, color, parent_uid);
        // Combination
        this.time_spent_split = 0;
    }

    update(delta) {
        if (this.size > 10) {
            this.size_set (this.size - this.size * 0.002 * delta / 1000);
        }
        let x_before = this.x;
        let y_before = this.y;

        this.time_spent_split += delta;
        let angle = angleFromPoints(this.x, this.y, playerGroup.get(this.parent_uid).targetX, playerGroup.get(this.parent_uid).targetY)
        if (angle.theta) {
            this.velocity_x = Math.cos(angle.theta) * this.velocity_acceleration * angle.x_mult;
            this.velocity_y = Math.sin(angle.theta) * this.velocity_acceleration * angle.y_mult;
        }

        super.update(delta);
        if (this.time_spent_split < 15000) {
            let was_colliding = false;
            let is_colliding = false;
            for(let i = 0; i < playerGroup.get(this.parent_uid).cells.length; i++) {
                let c = playerGroup.get(this.parent_uid).cells[i];
                if (c.UID != this.UID && c.time_spent_split < 15000) {
                    let d = Math.sqrt(Math.pow(this.x - c.x, 2) + Math.pow(this.y - c.y, 2));
                    let db = Math.sqrt(Math.pow(x_before - c.x, 2) + Math.pow(y_before - c.y, 2));
                    if (d < c.radius + this.radius) {
                        is_colliding = true;
                    }
                    if (db < c.radius + this.radius) {
                        was_colliding = true;
                    }
                }
            }

            if (!was_colliding && is_colliding) {
                this.x = x_before;
                this.y = y_before;
            }
        }

        this.kdTreeKey_regenerate();
    }

    display() {
        super.display();
        this.context.strokeStyle = "rgba(255,255,255,0.85)";
        this.context.font = "9px Courier New"
        let text = this.context.measureText(Math.floor(this.size));
        this.context.strokeText(Math.floor(this.size), this.x - text.width/2, this.y + 2.5);
        if (isTargetsDrawn) {
            this.context.strokeStyle = "#FF0000";
            this.context.beginPath();
            this.context.moveTo(this.x, this.y);
            this.context.lineTo(playerGroup.get(this.parent_uid).targetX, playerGroup.get(this.parent_uid).targetY);
            this.context.stroke();
        }
    }

    onConsume(entity) {
        this.size_set(this.size + entity.size);
        if (entity.UID == playerGroup.get(this.parent_uid).targetUID) {
            playerGroup.get(this.parent_uid).targetUID = null;
        }
    }

    onConsumed(entity){
        for(let key in playerGroup._map) {
            if (playerGroup.get(key).targetUID == this.UID) {
                playerGroup.get(key).target_update()
            }
        }
    }

    toString() {
        let s = padLeft(" ", this.constructor.name, 7) + " " + padLeft("0",this.UID, 8) + " " + 
                padLeft("0", Math.floor(this.size), 4) + " " + padLeft("0", Math.floor(this.x), 3) + "," + padLeft("0", Math.floor(this.y), 3);
        s += ((this.velocity_x < 0) ? " " : " 0") + this.velocity_x.toFixed(2);
        s += ((this.velocity_y < 0) ? " " : " 0") + this.velocity_y.toFixed(2);
        return s;
    }
}