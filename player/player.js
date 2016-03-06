"use strict";
class Player {
        // Humans, Bots
    constructor(context, color) {
        this.context = context;
        this.UID = Math.floor(Math.random() * 16777215);//0x1000000
        if (color == null) {
            color =  "#" + this.UID.toString(16);
        }
        this.color = color;
        // Children
        this.cells = [];
        // Target
        this.targetX = this.x;
        this.targetY = this.y;
        this.targetUID = null;
        // Private cache
        this.__x_y_size = null;
        this.cell_create_by_size(250);
    }

    update(delta) {
        this.__x_y_size = null;
    }

    target_update(targetX, targetY, targetUID) {
            // Move towards target
        this.targetX = targetX === undefined ? null : targetX;
        this.targetY = targetY === undefined ? null : targetY;
        this.targetUID = targetUID === undefined ? null : targetUID;
            //TODO: settle target, no bouncing
    }

    x_y_size() {
        if (this.__x_y_size) {
            return this.__x_y_size;
        }

        let x = 0;
        let y = 0;
        let s = 0;
        for(let i = 0; i < this.cells.length; i++) {
            x += this.cells[i].x;
            y += this.cells[i].y;
            s += this.cells[i].size;
        }

        this.__x_y_size = {x: x / this.cells.length, y: y / this.cells.length, size: s};
        return this.__x_y_size;
    }

    cell_create(x, y, size) {
        let c = new Cell(this.context, x, y, size, this.color, this.UID);
        this.cells.push(c);
        cells[c.UID] = c;
        if(cellTree) {
            cellTree.insert(c.kdTreeKey);
        }
        return c;
    }

    cell_create_by_size(size) {
        let x_y = randomXYbySize(size);
        let c = this.cell_create(x_y.x, x_y.y, size);
        cells[c.UID] = c;
        if(cellTree) {
            cellTree.insert(c.kdTreeKey);
        }
    }

    cell_delete(cell) {
        for(let i = 0; i < this.cells.length; i++) {
            if (cell.UID == this.cells[i].UID) {
                delete cells[this.cells[i].UID];
                this.cells.splice(i, 1);
                break;
            }
        }
    }

    onEject() {
        for(let i = 0; i < this.cells.length; i++) {
            let c = this.cells[i];
            if (c.size > 35) {
                c.size_set(c.size - 18);
                let p = pelletGroup.createEntity(c.x, c.y, 14.4, this.color, c.UID);
                let angle = angleFromPoints(p.x, p.y, this.targetX, this.targetY);
                if (angle.theta) {
                    p.velocity_x = Math.cos(angle.theta) * p.velocity_acceleration * angle.x_mult;
                    p.velocity_y = Math.sin(angle.theta) * p.velocity_acceleration * angle.y_mult;
                    p.x += (1 + Math.cos(angle.theta) * (c.radius + p.radius)) * angle.x_mult
                    p.y += (1 + Math.sin(angle.theta) * (c.radius + p.radius)) * angle.y_mult;
                    // TODO: this breaks the kdtreekey
                }
            }
        }
    }

    onSplit() {
        for(let key in this.cells) {
            let c = this.cells[key];
            if (c.size > 35 && this.cells.length < 16) {
                let s = Math.floor(c.size / 2);
                c.size_set(s);
                let c2 = this.cell_create(c.x, c.y, s);
                cells[c2.UID] = c2;
                let angle = angleFromPoints(c2.x, c2.y, this.targetX, this.targetY);
                if (angle.theta) {
                    c2.velocity_x = Math.cos(angle.theta) * c2.velocity_acceleration * angle.x_mult;
                    c2.velocity_y = Math.sin(angle.theta) * c2.velocity_acceleration * angle.y_mult;
                    c2.x += (1 + Math.cos(angle.theta) * (c.radius + c2.radius)) * angle.x_mult
                    c2.y += (1 + Math.sin(angle.theta) * (c.radius + c2.radius)) * angle.y_mult;
                }
            }
        }
    }

    toString() {
        let x_y_s = this.x_y_size();
        return padLeft(" ", this.constructor.name, 7) + " " + padLeft("0",this.UID, 8) + " " + padLeft("0", Math.floor(x_y_s.size), 4) + " " + 
                    padLeft("0", Math.floor(x_y_s.x), 3) + "," + padLeft("0", Math.floor(x_y_s.y), 3) + "  " + padLeft("0", this.cells.length, 2);
    }
}