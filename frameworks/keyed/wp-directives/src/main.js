import wpx from "./wpx";
import buildData from "./build-data";

wpx({
  state: {
    data({ context }) {
      return context.data;
    },
    isSelected({ context }, { id }) {
      return (context.selected = id);
    },
  },
  actions: {
    add({ context }) {
      context.data = context.data.concat(buildData(1000));
    },
    clear({ context }) {
      context.data = [];
      context.selected = undefined;
    },
    update({ context }) {
      for (let i = 0; i < context.data.length; i += 10) {
        context.data[i].label += " !!!";
      }
    },
    remove({ context }, { id }) {
      const idx = context.data.findIndex((d) => d.id === id);
      context.data.splice(idx, 1);
    },
    run({ context }) {
      context.data = buildData(1000);
      context.selected = undefined;
    },
    runLots({ context }) {
      context.data = buildData(10000);
      context.selected = undefined;
    },
    select({ context }, { id }) {
      context.selected = id;
    },
    swapRows({ context }) {
      const d = context.data;
      if (d.length > 998) {
        const tmp = d[998];
        d[998] = d[1];
        d[1] = tmp;
      }
    },
  },
});
