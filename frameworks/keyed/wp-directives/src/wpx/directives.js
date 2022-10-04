import { useContext, useState, useEffect } from "preact/hooks";
import { directive } from "./hooks";
import { getCallback } from "./utils";

export default () => {
  // wp-context
  directive(
    "context",
    ({
      directives: { context },
      props: { children },
      context: { Provider },
    }) => {
      const [contextValue, setContext] = useState(context.default);
      const setMergedContext = (newContext) => {
        setContext({ ...contextValue, ...newContext });
      };
      return (
        <Provider value={[contextValue, setMergedContext]}>{children}</Provider>
      );
    }
  );

  // wp-effect
  directive(
    "effect",
    ({ directives: { effect }, element, context: mainContext }) => {
      const [context, setContext] = useContext(mainContext);
      Object.values(effect).forEach((callback) => {
        useEffect(() => {
          const cb = getCallback(callback);
          cb({ context, setContext, tick, ref: element.ref.current });
        });
      });
    }
  );

  // wp-on:[event]
  directive("on", ({ directives: { on }, element, context: mainContext }) => {
    const [context, setContext] = useContext(mainContext);
    Object.entries(on).forEach(([name, callback]) => {
      element.props[`on${name}`] = (event) => {
        const cb = getCallback(callback);
        cb({ context, setContext, event });
      };
    });
  });

  // wp-class:[classname]
  directive(
    "class",
    ({ directives: { class: className }, element, context: mainContext }) => {
      const [context, setContext] = useContext(mainContext);
      Object.keys(className)
        .filter((n) => n !== "default")
        .forEach((name) => {
          const cb = getCallback(className[name]);
          const result = cb({ context, setContext });
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
      const [context, setContext] = useContext(mainContext);
      Object.entries(bind)
        .filter((n) => n !== "default")
        .forEach(([attribute, callback]) => {
          const cb = getCallback(callback);
          element.props[attribute] = cb({ context, setContext });
        });
    }
  );

  // wp-each
  directive(
    "each",
    ({ directives: { each, key }, context: mainContext, element }) => {
      const [context, setContext] = useContext(mainContext);
      const [name, callback] = Object.entries(each)
        .filter((n) => n !== "default")
        .find((n) => n);

      const list = getCallback(callback)({ context, setContext });

      if (!list.length) return null;

      return list.map((item) => (
        <mainContext.Provider
          value={[{ ...context, [name]: item }, setContext]}
          key={item[key]}
        >
          {element.props.children}
        </mainContext.Provider>
      ));
    }
  );
};
