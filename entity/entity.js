"use strict";
class Entity {
    // Common parent for all displayed entites
    constructor(context, x, y, size, color, parent_uid) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.UID = Math.floor(Math.random() * 16777215);//0x1000000
        this.parent_uid = parent_uid;
        if (color == null) {
            color =  "#" + this.UID.toString(16);
        }
        this.color = color;
        this.size_set(size);
        this.kdTreeKey = {x: this.x, y: this.y, key: this.UID};
        this.velocity_x = 0;
        this.velocity_y = 0;
    }

    kdTreeKey_regenerate() {
        this.kdTreeKey = {x: this.x, y: this.y, key: this.UID};
    }

    size_set (size) {
        if (size != this.size) {
            this.size = size;
            this.velocity_acceleration = 2.2 * Math.pow(this.size, -0.439);
            this.radius = Math.sqrt(this.size / Math.PI);
            if (this.x - this.radius < 0) {
                this.x = this.radius;
            } else if (this.x + this.radius > canvas_width) {
                this.x = canvas_width - this.radius;
            }
            
            if (this.y - this.radius < 0) {
                this.y = this.radius;
            } else if (this.y + this.radius > canvas_height) {
                this.y = canvas_height - this.radius;
            }
        }
    }

    update(delta) {
        let x_before = this.x;
        let y_before = this.y;
        this.x += this.velocity_x;
        this.y += this.velocity_y;
        if (this.x - this.radius < 0 || this.x + this.radius > canvas_width) {
            this.x = x_before;
            this.velocity_x = 0;
        }

        if (this.y - this.radius < 0 || this.y + this.radius > canvas_height) {
            this.y = y_before;
            this.velocity_y = 0;
        }
    }

    display() {
        this.context.beginPath();
        this.context.arc(
            this.x, this.y, this.radius,
            0, Math.PI*2, true);
        this.context.fillStyle = this.color;
        this.context.fill();
    }

    onConsume(entity) {
        throw new Error("Provide concrete implementation");
    }

    onConsumed(entity) {
        throw new Error("Provide concrete implementation");
    }
}