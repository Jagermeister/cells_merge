"use strict";
class Enemy extends Player {
    constructor(context) {
        super(context);
    }

    update(delta) {
        super.update(delta);
        if (this.targetUID == null) {
            let cell_to_eat = null;
            let x_y_s = this.x_y_size();
            let c = cellTree.nearest({x: x_y_s.x, y: x_y_s.y}, Math.min(Object.keys(cells).length, 10));
                // c = [[Object, distanceValue], ...]; Object = { x, y, key }
            let r = Math.sqrt(x_y_s.size / Math.PI);
            let rSqrd = 100 * r * r;
            for(let i = 0; i < c.length; i++) {
                if (cells[c[i][0].key].parent_uid != this.UID && c[i][1] > 0 && c[i][1] < rSqrd && cells[c[i][0].key].size * 1.50 < x_y_s.size) {
                    if (!cell_to_eat || c[i][1] < cell_to_eat[1]) {
                        cell_to_eat = c[i];
                    }
                }
            }

            if (cell_to_eat) {
                this.target_update(cell_to_eat[0].x, cell_to_eat[0].y, cell_to_eat[0].key);
            } else {
                let p = pelletGroup.nearest({x: x_y_s.x, y: x_y_s.y}, 1);
                    // p = [[Object, distanceValue], ...]; Object = { x, y, key }
                if (p.length) {
                    this.target_update(p[0][0].x, p[0][0].y, p[0][0].key);
                }
            }
        } else {
            let c = cells[this.targetUID];
            if (c) {
                let x_y_s = this.x_y_size();
                if (c.size * 1.50 < x_y_s.size) {
                    this.target_update(c.x, c.y, c.UID);
                } else {
                    this.target_update();
                }
            } else {
                if (!pelletGroup.has(this.targetUID)) {
                    this.target_update();
                }
            }
        }
    }
}