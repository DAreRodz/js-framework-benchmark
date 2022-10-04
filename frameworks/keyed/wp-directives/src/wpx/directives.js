import { useContext, useMemo } from "preact/hooks";
import { useSignalEffect } from "@preact/signals";
import { directive } from "./hooks";
import { deepSignal } from "./deep-signal";
import { getCallback, deepMerge } from "./utils";

const raf = window.requestAnimationFrame;
// Until useSignalEffects is fixed: https://github.com/preactjs/signals/issues/228
const tick = () => new Promise((r) => raf(() => raf(r)));

export default () => {
  // wp-context
  directive(
    "context",
    ({
      directives: { context },
      props: { children },
      context: { Provider },
    }) => {
      const signals = useMemo(() => deepSignal(context.default), []);
      return <Provider value={signals}>{children}</Provider>;
    }
  );

  // wp-effect
  directive(
    "effect",
    ({ directives: { effect }, element, context: mainContext }) => {
      const context = useContext(mainContext);
      Object.values(effect).forEach((callback) => {
        useSignalEffect(() => {
          const cb = getCallback(callback);
          cb({ context, tick, ref: element.ref.current });
        });
      });
    }
  );

  // wp-on:[event]
  directive("on", ({ directives: { on }, element, context: mainContext }) => {
    const context = useContext(mainContext);
    Object.entries(on).forEach(([name, callback]) => {
      element.props[`on${name}`] = (event) => {
        const cb = getCallback(callback);
        cb({ context, event }, ...args);
      };
    });
  });

  // wp-class:[classname]
  directive(
    "class",
    ({ directives: { class: className }, element, context: mainContext }) => {
      const context = useContext(mainContext);
      Object.keys(className)
        .filter((n) => n !== "default")
        .forEach((name) => {
          const cb = getCallback(className[name]);
          const result = cb({ context });
          if (!result) element.props.class.replace(name, "");
          else if (!element.props.class.includes(name))
            element.props.class += ` ${name}`;
        });
    }
  );

  // wp-bind:[attribute]
  directive(
    "bind",
    ({ directives: { bind }, element, context: mainContext }) => {
      const context = useContext(mainContext);
      Object.entries(bind)
        .filter((n) => n !== "default")
        .forEach(([attribute, callback]) => {
          const cb = getCallback(callback);
          element.props[attribute] = cb({ context });
        });
    }
  );

  // wp-each
  directive(
    "each",
    ({ directives: { each, key }, element, context: mainContext }) => {
      const context = useContext(mainContext);
      const [name, callback] = Object.entries(each)
        .filter((n) => n !== "default")
        .find((n) => n);

      const list = getCallback(callback)({ context });

      const templateContent = element.children;

      element.children = list.map((item) => (
        <mainContext.Provider
          value={deepMerge(context, { [name]: item })}
          key={item[key]}
        >
          {cloneElement(templateContent)}
        </mainContext.Provider>
      ));
    }
  );
};
