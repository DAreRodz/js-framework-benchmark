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
    add({ context, setContext }) {
      context.rows.data = context.rows.data.concat(buildData(1000));
      setContext(context);
    },
    clear({ context, setContext }) {
      context.rows.data = [];
      context.rows.selected = undefined;
      setContext(context);
    },
    update({ context, setContext }) {
      for (let i = 0; i < context.rows.data.length; i += 10) {
        context.rows.data[i].label += " !!!";
      }
      setContext(context);
    },
    remove({ context, setContext }) {
      const idx = context.rows.data.findIndex((d) => d.id === context.item.id);
      context.rows.data.splice(idx, 1);
      setContext(context);
    },
    run({ context, setContext }) {
      context.rows.data = buildData(1000);
      context.rows.selected = undefined;
      setContext(context);
    },
    runLots({ context, setContext }) {
      context.rows.data = buildData(10000);
      context.rows.selected = undefined;
      setContext(context);
    },
    select({ context, setContext }) {
      context.rows.selected = context.item.id;
      setContext(context);
    },
    swapRows({ context, setContext }) {
      const d = context.rows.data;
      if (d.length > 998) {
        const tmp = d[998];
        d[998] = d[1];
        d[1] = tmp;
      }
      setContext(context);
    },
  },
});
