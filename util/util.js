'use strict';
var entity_consume_size_multiplier = 1.25;
    // You have to be 25% bigger to consume
function collison_consume_circle(entity1, entity2) {
    // Player, Pellet
    if(
        ((entity1.radius + entity2.radius) * (entity1.radius + entity2.radius)) >=
        ((entity1.x - entity2.x) * (entity1.x - entity2.x) + (entity1.y - entity2.y) * (entity1.y - entity2.y))
    ){
            return [entity1, entity2];
    }

    return [null, null];
}

function collision_consume_cell(e1, e2) {
    let d = Math.sqrt(Math.pow(e1.x - e2.x, 2) + Math.pow(e1.y - e2.y, 2));
    if (e1.parent_uid == null || e1.parent_uid != e2.parent_uid) {
        if (e1.size > e2.size * entity_consume_size_multiplier) {
            if (d <= (e1.radius - e2.radius * 0.15)) {
                return [e1, e2];
            }
        }
    } else if (e1.parent_uid == e2.parent_uid && e1.time_spent_split > 15000 && e2.time_spent_split > 15000 && d <= (e1.radius - e2.radius * 0.15)) {
        return [e1, e2];
    }

    return [null, null];
}

function distanceSortValue(a, b) {
    return Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2);
}

function padLeft (padValue, value, count) {
    return (Array(count).join(padValue) + value).slice(-1 * count);
}

function angleFromPoints(x1, y1, x2, y2) {
    let tv = x2 - x1;
    let uv = y2 - y1;
    let x_mult = tv > 0 ? 1 : -1;
    let y_mult = uv > 0 ? 1 : -1;
    uv = Math.abs(uv);
    tv = Math.abs(tv);
    let theta_r = Math.abs(Math.atan(uv/tv));
    return {theta: theta_r, x_mult: x_mult, y_mult: y_mult};
}

function randomXYbySize(size) {
    let r = Math.sqrt(size / Math.PI);
    let x = r + Math.random() * (canvas_width - r * 2);
    let y = r + Math.random() * (canvas_height - r * 2);
    return {x: x, y: y};
}