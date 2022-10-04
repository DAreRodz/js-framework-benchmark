import wpx from "./wpx";
import buildData from "./build-data";

wpx({
  state: {
    data({ context }) {
      return context.rows.data;
    },
    isSelected({ context }) {
      return context.rows.selected === context.item.id;
    },
    itemId({ context }) {
      return context.item.id;
    },
    itemLabel({ context }) {
      return context.item.label;
    },
  },
  actions: {
    add({ context }) {
      context.rows.data = context.rows.data.concat(buildData(1000));
    },
    clear({ context }) {
      context.rows.data = [];
      context.rows.selected = undefined;
    },
    update({ context }) {
      for (let i = 0; i < context.rows.data.length; i += 10) {
        context.rows.data[i].label += " !!!";
      }
    },
    remove({ context }) {
      const idx = context.rows.data.findIndex((d) => d.id === context.item.id);
      context.rows.data.splice(idx, 1);
    },
    run({ context }) {
      context.rows.data = buildData(1000);
      context.rows.selected = undefined;
    },
    runLots({ context }) {
      context.rows.data = buildData(10000);
      context.rows.selected = undefined;
    },
    select({ context }) {
      context.rows.selected = context.item.id;
    },
    swapRows({ context }) {
      const d = context.rows.data;
      if (d.length > 998) {
        const tmp = d[998];
        d[998] = d[1];
        d[1] = tmp;
      }
    },
  },
});
